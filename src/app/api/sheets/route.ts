import { NextResponse } from "next/server";
import { google } from "googleapis";

async function getSheets() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
  let key = process.env.GOOGLE_PRIVATE_KEY || "";
  if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1);
  key = key.replace(/\\n/g, "\n");

  const { JWT } = google.auth;
  const client = new JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return google.sheets({ version: "v4", auth: client });
}

async function fetchRange(sheets: any, range: string) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
  });
  return res.data.values || [];
}

export async function GET() {
  try {
    const sheets = await getSheets();
    const [overviewRows, postRows, audienceRows] = await Promise.all([
      fetchRange(sheets, "'Overview Metrics'!A3:P100"),
      fetchRange(sheets, "'Post Performance'!A3:N100"),
      fetchRange(sheets, "'Audience Data'!A3:P100"),
    ]);

    // First row is the latest week (newest-first order)
    const latest = overviewRows[0];
    if (!latest) return NextResponse.json({ error: "No data found in Overview Metrics" }, { status: 404 });

    /*
     * Column mapping:
     *  A(0): Week Start       B(1): Week End        C(2): Client Slug
     *  D(3): Followers        E(4): New Followers    F(5): Reach
     *  G(6): Total Views      H(7): Engagements     I(8): Engagement Rate %
     *  J(9): Views % Posts    K(10): Views % Reels   L(11): Views % Stories
     *  M(12): Watch Time (sec) N(13): Avg View Dur
     *  O(14): Follower Split: Followers %
     *  P(15): Follower Split: Non-Followers %
     */

    const watchSec = Number(latest[12]) || 0;
    const watchH = Math.floor(watchSec / 3600);
    const watchM = Math.floor((watchSec % 3600) / 60);
    const watchS = watchSec % 60;
    const watchTimeStr = watchSec > 0
      ? (watchH > 0 ? `${watchH}h ${watchM}m ${watchS}s` : `${watchM}m ${watchS}s`)
      : "";

    let periodStr = `${latest[0]} – ${latest[1]}`;
    try {
      const s = new Date(latest[0]), e = new Date(latest[1]);
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      periodStr = `${months[s.getMonth()]} ${s.getDate()} – ${months[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
    } catch {}

    const weekPosts = postRows.filter((r: string[]) => r[0] === latest[0]).map((r: string[], i: number) => ({
      id: i + 1, title: r[2] || `Post ${i + 1}`, type: r[3] || "Post",
      views: Number(r[4]) || 0, reach: Number(r[5]) || 0, likes: Number(r[6]) || 0,
      comments: Number(r[7]) || 0, saves: Number(r[8]) || 0, shares: Number(r[9]) || 0,
      isTop: (r[10] || "").toUpperCase() === "TRUE", mediaUrl: r[11] || "", igPostUrl: r[12] || "",
    }));

    // Content mix from sheet columns J/K/L (indices 9/10/11)
    const contentMix = {
      posts: Number(latest[9]) || 0,
      reels: Number(latest[10]) || 0,
      stories: Number(latest[11]) || 0,
      carousels: 0,
    };

    // Match audience row by week start date, or fall back to first row
    const latestAudience = audienceRows.find((r: string[]) => r[0] === latest[0]) || audienceRows[0];
    const audience = latestAudience ? {
      gender: { male: Number(latestAudience[2]) || 50, female: Number(latestAudience[3]) || 50 },
      age: [
        { range: "18–24", pct: Number(latestAudience[4]) || 0 },
        { range: "25–34", pct: Number(latestAudience[5]) || 0 },
        { range: "35–44", pct: Number(latestAudience[6]) || 0 },
        { range: "45–54", pct: Number(latestAudience[7]) || 0 },
        { range: "55–64", pct: Number(latestAudience[8]) || 0 },
        { range: "65+", pct: Number(latestAudience[9]) || 0 },
      ],
    } : { gender: { male: 50, female: 50 }, age: [
      { range: "18–24", pct: 0 },{ range: "25–34", pct: 0 },{ range: "35–44", pct: 0 },
      { range: "45–54", pct: 0 },{ range: "55–64", pct: 0 },{ range: "65+", pct: 0 },
    ]};

    return NextResponse.json({
      client: { name: "EEC", fullName: "Edgard El Chaar, DDS, PC", period: periodStr },
      kpi: {
        followers: { value: Number(latest[3]) || 0, change: Number(latest[4]) || 0, label: "Followers" },
        reach: { value: Number(latest[5]) || 0, label: "Reach" },
        views: { value: Number(latest[6]) || 0, label: "Total Views" },
        engagementRate: { value: Number(latest[8]) || 0, label: "Engagement Rate", suffix: "%" },
        engagements: { value: Number(latest[7]) || 0, label: "Engagements" },
        watchTime: { value: watchTimeStr || "–", label: "Watch Time" },
      },
      posts: weekPosts,
      contentMix,
      audience,
      viewerSplit: {
        followers: Number(latest[14]) || 50,
        nonFollowers: Number(latest[15]) || 50,
      },
    });
  } catch (err: any) {
    console.error("Sheets API error:", err?.message || err);
    return NextResponse.json({ error: "Failed to fetch sheet data", details: err?.message }, { status: 500 });
  }
}
