import { NextResponse } from "next/server";
import { google } from "googleapis";

async function getSheets() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
  
  // Handle private key — Vercel may store it with literal \n or real newlines
  let key = process.env.GOOGLE_PRIVATE_KEY || "";
  // Remove surrounding quotes if present
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }
  // Replace literal \n with real newlines
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

    // Fetch all three data tabs (skip row 1 = headers, row 2 = types, start at row 3)
    const [overviewRows, postRows, audienceRows] = await Promise.all([
      fetchRange(sheets, "'Overview Metrics'!A3:M100"),
      fetchRange(sheets, "'Post Performance'!A3:N100"),
      fetchRange(sheets, "'Audience Data'!A3:P100"),
    ]);

    // Get the most recent week from Overview Metrics
    const latest = overviewRows[0];
    if (!latest) {
      return NextResponse.json({ error: "No data found in Overview Metrics" }, { status: 404 });
    }

    // Parse Overview Metrics columns:
    // 0: Week Start, 1: Week End, 2: Client Slug, 3: Followers, 4: New Followers,
    // 5: Reach, 6: Total Views, 7: Engagements, 8: Engagement Rate %,
    // 9: Watch Time (sec), 10: Avg View Duration (sec),
    // 11: Follower Split: Followers %, 12: Follower Split: Non-Followers %
    const watchSec = Number(latest[9]) || 0;
    const watchH = Math.floor(watchSec / 3600);
    const watchM = Math.floor((watchSec % 3600) / 60);
    const watchS = watchSec % 60;
    const watchTimeStr = watchH > 0
      ? `${watchH}h ${watchM}m ${watchS}s`
      : `${watchM}m ${watchS}s`;

    // Format period string from dates
    const startDate = latest[0] || "";
    const endDate = latest[1] || "";
    let periodStr = `${startDate} – ${endDate}`;
    try {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      periodStr = `${months[s.getMonth()]} ${s.getDate()} – ${months[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
    } catch {}

    // Parse Post Performance for this week
    // 0: Week Start, 1: Client Slug, 2: Post Title, 3: Content Type,
    // 4: Views, 5: Reach, 6: Likes, 7: Comments, 8: Saves, 9: Shares,
    // 10: Is Top Post?, 11: Media URL, 12: Instagram Post URL, 13: Caption Excerpt
    const weekPosts = postRows
      .filter((r: string[]) => r[0] === latest[0])
      .map((r: string[], i: number) => ({
        id: i + 1,
        title: r[2] || `Post ${i + 1}`,
        type: r[3] || "Post",
        views: Number(r[4]) || 0,
        reach: Number(r[5]) || 0,
        likes: Number(r[6]) || 0,
        comments: Number(r[7]) || 0,
        saves: Number(r[8]) || 0,
        shares: Number(r[9]) || 0,
        isTop: (r[10] || "").toUpperCase() === "TRUE",
        mediaUrl: r[11] || "",
        igPostUrl: r[12] || "",
      }));

    // Calculate content mix from posts
    const typeCount: Record<string, number> = {};
    weekPosts.forEach((p: any) => {
      const t = p.type.toLowerCase();
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    const totalPosts = weekPosts.length || 1;
    const contentMix = {
      reels: Math.round(((typeCount["reel"] || 0) / totalPosts) * 100),
      posts: Math.round(((typeCount["post"] || 0) / totalPosts) * 100),
      stories: Math.round(((typeCount["story"] || 0) / totalPosts) * 100),
      carousels: Math.round(((typeCount["carousel"] || 0) / totalPosts) * 100),
    };
    // If all zeros from rounding, distribute evenly based on what exists
    if (contentMix.reels + contentMix.posts + contentMix.stories + contentMix.carousels === 0 && weekPosts.length > 0) {
      contentMix.reels = 100;
    }

    // Parse Audience Data for this week
    // 0: Week Start, 1: Client Slug, 2: Male %, 3: Female %,
    // 4: Age 18-24, 5: Age 25-34, 6: Age 35-44, 7: Age 45-54, 8: Age 55-64, 9: Age 65+,
    // 10: Top City 1, 11: Top City 1 %, 12: Top City 2, 13: Top City 2 %, 14: Top City 3, 15: Top City 3 %
    const latestAudience = audienceRows.find((r: string[]) => r[0] === latest[0]) || audienceRows[0];

    const audience = latestAudience
      ? {
          gender: {
            male: Number(latestAudience[2]) || 50,
            female: Number(latestAudience[3]) || 50,
          },
          age: [
            { range: "18–24", pct: Number(latestAudience[4]) || 0 },
            { range: "25–34", pct: Number(latestAudience[5]) || 0 },
            { range: "35–44", pct: Number(latestAudience[6]) || 0 },
            { range: "45–54", pct: Number(latestAudience[7]) || 0 },
            { range: "55–64", pct: Number(latestAudience[8]) || 0 },
            { range: "65+", pct: Number(latestAudience[9]) || 0 },
          ],
        }
      : {
          gender: { male: 50, female: 50 },
          age: [
            { range: "18–24", pct: 0 }, { range: "25–34", pct: 0 },
            { range: "35–44", pct: 0 }, { range: "45–54", pct: 0 },
            { range: "55–64", pct: 0 }, { range: "65+", pct: 0 },
          ],
        };

    const data = {
      client: {
        name: "EEC",
        fullName: "Edgard El Chaar, DDS, PC",
        period: periodStr,
      },
      kpi: {
        followers: { value: Number(latest[3]) || 0, change: Number(latest[4]) || 0, label: "Followers" },
        reach: { value: Number(latest[5]) || 0, label: "Reach" },
        views: { value: Number(latest[6]) || 0, label: "Total Views" },
        engagementRate: { value: Number(latest[8]) || 0, label: "Engagement Rate", suffix: "%" },
        engagements: { value: Number(latest[7]) || 0, label: "Engagements" },
        watchTime: { value: watchTimeStr, label: "Watch Time" },
      },
      posts: weekPosts,
      contentMix,
      audience,
      viewerSplit: {
        followers: Number(latest[11]) || 50,
        nonFollowers: Number(latest[12]) || 50,
      },
    };

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Sheets API error:", err?.message || err);
    return NextResponse.json(
      { error: "Failed to fetch sheet data", details: err?.message },
      { status: 500 }
    );
  }
}
