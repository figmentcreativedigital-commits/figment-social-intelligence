"use client";
import { useState, useEffect } from "react";

// Fallback data — used while loading or if Sheets API fails
const FALLBACK_DATA = {
  client: { name: "EEC", fullName: "Edgard El Chaar, DDS, PC", period: "Apr 13 – Apr 27, 2026" },
  kpi: {
    followers: { value: 3138, change: 0, label: "Followers" },
    reach: { value: 1578, label: "Reach" },
    views: { value: 5573, label: "Total Views" },
    engagementRate: { value: 9.8, label: "Engagement Rate", suffix: "%" },
    engagements: { value: 155, label: "Engagements" },
    watchTime: { value: "—", label: "Watch Time" },
  },
  posts: [
    { id: 1, title: "More Than a Job – New Podcast Episode", type: "Reel", views: 1876, reach: 990, likes: 44, comments: 0, saves: 2, shares: 7, isTop: true, igPostUrl: "https://www.instagram.com/reel/DXaDxPWgRlN/" },
    { id: 2, title: "Not Every Treatment Is Right", type: "Reel", views: 1727, reach: 1026, likes: 64, comments: 2, saves: 4, shares: 8, isTop: false, igPostUrl: "https://www.instagram.com/reel/DXRzK8uSR1S/" },
    { id: 3, title: "Building Patient Trust – Dr. Bender", type: "Reel", views: 1955, reach: 909, likes: 59, comments: 4, saves: 1, shares: 1, isTop: false, igPostUrl: "https://www.instagram.com/reel/DXe8R0VBhuA/" },
    { id: 4, title: "The Difference You Can Feel", type: "Reel", views: 583, reach: 383, likes: 12, comments: 0, saves: 0, shares: 1, isTop: false, igPostUrl: "https://www.instagram.com/reel/DXP1MbWAcJ7/" },
  ] as any[],
  contentMix: { posts: 8, reels: 68, stories: 23 },
  audience: {
    gender: { male: 53, female: 47 },
    age: [
      { range: "18–24", pct: 2 }, { range: "25–34", pct: 22 }, { range: "35–44", pct: 37 },
      { range: "45–54", pct: 21 }, { range: "55–64", pct: 13 }, { range: "65+", pct: 6 },
    ],
  },
  viewerSplit: { followers: 39, nonFollowers: 61 },
};

type ReportData = typeof FALLBACK_DATA;

function generateInsights(data: ReportData) {
  const insights: { title: string; body: string; severity: string }[] = [];
  const opportunities: typeof insights = [];
  const recommendations: { text: string; priority: string }[] = [];
  const alerts: typeof insights = [];

  const er = data.kpi.engagementRate.value;
  if (er < 5) {
    insights.push({ title: "Engagement Below Benchmark", body: `At ${er}%, engagement rate sits below the 5%+ benchmark for healthcare accounts under 10K followers. With ${data.kpi.reach.value.toLocaleString()} reach, discovery is working — content hooks need strengthening to convert viewers into engagers.`, severity: "warning" });
  }
  insights.push({ title: "Content Format Distribution", body: `Reels lead at ${data.contentMix.reels}% of views, followed by Posts (${data.contentMix.posts}%) and Stories (${data.contentMix.stories}%). A balanced mix, but Reels generate disproportionately higher per-piece engagement — lean into this format.`, severity: "info" });
  const totalSaves = data.posts.reduce((s, p) => s + p.saves, 0);
  if (totalSaves < 3) {
    alerts.push({ title: "Zero Saves Across All Posts", body: "No saves this week. Saves are the #1 signal to the algorithm that content has lasting value. This is the single biggest lever to improve.", severity: "danger" });
  }
  insights.push({ title: "Watch Time & Retention", body: "Average view duration of 6 seconds across 2h 36m total watch time. Viewers are sampling but not completing videos. The first 3 seconds must hook attention — especially for dental education content.", severity: "warning" });
  if (data.viewerSplit.nonFollowers > 50) {
    opportunities.push({ title: "Strong Discovery Signal", body: `${data.viewerSplit.nonFollowers}% of viewers are non-followers — the algorithm is distributing your content to new audiences. Optimize CTAs to convert these discoverers into followers and patients.`, severity: "success" });
  }
  insights.push({ title: "Audience Alignment", body: `Primary audience is 35–44 (36%), predominantly male (${data.audience.gender.male}%). The 35–54 range represents ${data.audience.age[2].pct + data.audience.age[3].pct}% of your audience — the highest-value patient demographic for elective and cosmetic dental procedures.`, severity: "success" });
  if (data.kpi.followers.change && data.kpi.followers.change < 15) {
    opportunities.push({ title: "Follower Velocity", body: `+${data.kpi.followers.change} followers this week from ${data.kpi.reach.value} reach = ${((data.kpi.followers.change / data.kpi.reach.value) * 100).toFixed(1)}% conversion. Strengthen profile CTAs and pin high-value content to convert visitors.`, severity: "warning" });
  }
  recommendations.push(
    { text: "Open Reels with a provocative question or surprising dental stat in the first 2 seconds", priority: "high" },
    { text: "Create save-worthy carousels: '5 Signs You Need Implants' or 'Periodontal Myths Debunked'", priority: "high" },
    { text: "Add CTAs in every caption: 'Save this for your next visit' / 'Share with someone who needs this'", priority: "medium" },
    { text: "Post Reels between 7–9 AM and 6–8 PM when the 35–44 demographic is most active", priority: "medium" },
    { text: "Introduce patient testimonial content to build trust and drive appointment conversions", priority: "low" },
  );
  return { insights, opportunities, recommendations, alerts };
}

function AnimatedNumber({ value, suffix = "" }: { value: number | string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (typeof value !== "number") return;
    let start = 0;
    const duration = 1400;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.floor(eased * value));
      if (p < 1) requestAnimationFrame(step);
      else setDisplay(value);
    };
    requestAnimationFrame(step);
  }, [value]);
  if (typeof value !== "number") return <span>{value}{suffix}</span>;
  return <span>{display.toLocaleString()}{suffix}</span>;
}

function Donut({ data, size = 130, stroke = 18, colors }: { data: { value: number }[]; size?: number; stroke?: number; colors: string[] }) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      {data.map((d, i) => {
        const dash = (d.value / 100) * C;
        const gap = C - dash;
        const o = off;
        off += dash;
        return <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={colors[i]} strokeWidth={stroke} strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-o} strokeLinecap="round" style={{ transition: "all 1.2s cubic-bezier(.4,0,.2,1)" }} />;
      })}
    </svg>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const d = FALLBACK_DATA;
  const [mediaUrls, setMediaUrls] = useState<Record<number, string>>(() => {
    const urls: Record<number, string> = {};
    FALLBACK_DATA.posts.forEach((p: any) => { if (p.igPostUrl) urls[p.id] = p.igPostUrl; });
    return urls;
  });
  const [editingMedia, setEditingMedia] = useState<number | null>(null);
  const [mediaInput, setMediaInput] = useState("");
  const engine = generateInsights(d);

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  const handleMediaSave = (postId: number) => {
    if (mediaInput.trim()) setMediaUrls((prev) => ({ ...prev, [postId]: mediaInput.trim() }));
    setEditingMedia(null);
    setMediaInput("");
  };
  const handleMediaRemove = (postId: number) => {
    setMediaUrls((prev) => { const n = { ...prev }; delete n[postId]; return n; });
  };
  const isVideo = (url: string) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
  const isIgEmbed = (url: string) => /instagram\.com\/(p|reel)\//i.test(url);

  const linkData = {
    period: "Apr 13 – Apr 27, 2026",
    totalClicks: 66,
    topLinks: [
      { path: "Homepage", clicks: 46 },
      { path: "DDS-PC Midtown", clicks: 11 },
      { path: "DDS-PC UES", clicks: 9 },
    ],
    trafficSources: [
      { source: "Direct / Unknown", clicks: 55 },
      { source: "Social", clicks: 11 },
    ],
    topCountries: [
      { country: "United States", clicks: 33 },
      { country: "Bulgaria", clicks: 4 },
      { country: "The Netherlands", clicks: 4 },
      { country: "United Kingdom", clicks: 3 },
      { country: "Singapore", clicks: 2 },
    ],
    topCities: [
      { city: "New York City", clicks: 22 },
      { city: "Manchester", clicks: 13 },
      { city: "Canfield", clicks: 10 },
      { city: "Amsterdam", clicks: 9 },
      { city: "Brooklyn", clicks: 7 },
    ],
    devices: [
      { os: "Mac OS X", clicks: 28 },
      { os: "Windows", clicks: 18 },
      { os: "iOS", clicks: 6 },
      { os: "Android", clicks: 5 },
    ],
  };

  const websiteData = {
    period: "Apr 13 – Apr 27, 2026",
    sessions: 923,
    topPages: [
      { page: "/", label: "Home", views: 485 },
      { page: "/signs-of-failed-gum-graft", label: "Signs of Failed Gum Graft", views: 169 },
      { page: "/dry-socket-with-bone-graft", label: "Dry Socket with Bone Graft", views: 122 },
      { page: "/doctors-and-periodontists", label: "Doctors & Periodontists", views: 79 },
      { page: "/how-painful-is-a-sinus-lift", label: "How Painful Is a Sinus Lift", views: 56 },
      { page: "/accidentally-blew-nose", label: "Accidentally Blew Nose After Sinus Lift", views: 54 },
      { page: "/dental-office-upper-east", label: "Dental Office Upper East Side", views: 42 },
      { page: "/sinus-lift-long-term-side", label: "Sinus Lift Long-Term Side Effects", views: 23 },
      { page: "/contactus", label: "Contact Us", views: 20 },
    ],
    trafficSources: [
      { source: "Google", medium: "organic", sessions: 589, pct: 63.8 },
      { source: "Direct", medium: "(none)", sessions: 261, pct: 28.3 },
      { source: "Bing", medium: "organic", sessions: 26, pct: 2.8 },
      { source: "Yahoo", medium: "organic", sessions: 15, pct: 1.6 },
      { source: "Other", medium: "mixed", sessions: 32, pct: 3.5 },
    ],
    devices: [
      { device: "Desktop", pct: 52.5 },
      { device: "Mobile", pct: 46.1 },
      { device: "Tablet", pct: 1.4 },
    ],
    dailyVisitors: [
      { date: "Apr 13", visitors: 50 },{ date: "Apr 14", visitors: 55 },
      { date: "Apr 15", visitors: 65 },{ date: "Apr 16", visitors: 55 },
      { date: "Apr 17", visitors: 60 },{ date: "Apr 18", visitors: 70 },
      { date: "Apr 19", visitors: 45 },{ date: "Apr 20", visitors: 35 },
      { date: "Apr 21", visitors: 42 },{ date: "Apr 22", visitors: 50 },
      { date: "Apr 23", visitors: 50 },{ date: "Apr 24", visitors: 55 },
      { date: "Apr 25", visitors: 48 },{ date: "Apr 26", visitors: 50 },
      { date: "Apr 27", visitors: 42 },
    ],
    search: {
      totalClicks: 419,
      totalImpressions: 26737,
      avgCTR: 1.6,
      avgPosition: 18.0,
      topQueries: [
        { query: "edgard el chaar", clicks: 11, impressions: 50, ctr: 22.0, position: 4.2 },
        { query: "dr el chaar", clicks: 10, impressions: 70, ctr: 14.3, position: 5.4 },
        { query: "i blew my nose after sinus lift", clicks: 9, impressions: 88, ctr: 10.2, position: 2.0 },
        { query: "can you get dry socket with bone graft", clicks: 5, impressions: 125, ctr: 4.0, position: 2.0 },
        { query: "pictures of failed gum grafts", clicks: 4, impressions: 268, ctr: 1.5, position: 1.5 },
      ],
      topPages: [
        { page: "Dry Socket with Bone Graft", clicks: 120, impressions: 3572, ctr: 3.4 },
        { page: "Homepage", clicks: 77, impressions: 905, ctr: 8.5 },
        { page: "Signs of Failed Gum Graft", clicks: 56, impressions: 4598, ctr: 1.2 },
        { page: "Accidentally Blew Nose", clicks: 46, impressions: 2804, ctr: 1.6 },
        { page: "How Painful Is a Sinus Lift", clicks: 29, impressions: 970, ctr: 3.0 },
      ],
      searchDevices: [
        { device: "Mobile", clicks: 278, pct: 66 },
        { device: "Desktop", clicks: 137, pct: 33 },
        { device: "Tablet", clicks: 4, pct: 1 },
      ],
    },
  };

  const podcastData = {
    period: "Apr 13 – Apr 27, 2026",
    totalEpisodes: 46,
    totalDownloads: 4596,
    periodDownloads: 80,
    last7Days: 11,
    last30Days: 221,
    last90Days: 601,
    topEpisodes: [
      { title: "Allograft & Its Evolution – Dr. Brad McAllister", downloads: 300 },
      { title: "Future of Dental Industry – Aurelio Sahagun, Straumann", downloads: 194 },
      { title: "Periodontal Diagnosis – Gingivitis", downloads: 193 },
      { title: "Periodontal Diagnosis – Periodontitis", downloads: 183 },
      { title: "Oral and Systemic Health", downloads: 170 },
      { title: "Periodontal Treatment", downloads: 161 },
      { title: "Aspiration to Reality – Youngest Exec in Implant Tech", downloads: 139 },
      { title: "Root Resorption and Treatment", downloads: 138 },
      { title: "Soft Tissue Around Natural Teeth", downloads: 136 },
      { title: "Coaching Millennials in the Professional World", downloads: 130 },
    ],
    platforms: [
      { name: "Web Browser", downloads: 100, pct: 47 },
      { name: "Apple Podcasts", downloads: 63, pct: 29 },
      { name: "Spotify", downloads: 32, pct: 15 },
      { name: "Unknown", downloads: 5, pct: 2 },
      { name: "iVoox", downloads: 5, pct: 2 },
    ],
    topCountries: [
      { country: "United States", downloads: 125 },
      { country: "Germany", downloads: 23 },
      { country: "Vietnam", downloads: 10 },
      { country: "Sweden", downloads: 8 },
      { country: "United Kingdom", downloads: 5 },
    ],
    topCities: [
      { city: "New York", downloads: 29 },
      { city: "Frankfurt", downloads: 18 },
      { city: "Brooklyn", downloads: 14 },
      { city: "Stockholm", downloads: 8 },
      { city: "Boston", downloads: 5 },
    ],
  };

  const socialData = {
    period: "Apr 13 – Apr 27, 2026",
    followers: 3138,
    followerGrowth: 0,
    follows: 0,
    unfollows: 0,
    totalViews: 5573,
    totalReach: 1578,
    reachChange: 13.7,
    totalInteractions: 155,
    interactionSplit: { followers: 50.6, nonFollowers: 49.4 },
    viewSplit: { followers: 39.1, nonFollowers: 60.9 },
    viewsByType: { reels: 68.1, posts: 8.4, stories: 23.4 },
    interactionsByType: { reels: 84.4, posts: 1.9, stories: 13.8 },
    totalLikes: 174,
    totalComments: 5,
    totalSaves: 7,
    totalShares: 17,
    peakHours: "9 AM – 2 PM EST",
    storyViews: 1137,
    storyReach: 872,
    storyCompletion: 90,
    storyCount: 10,
    dailyViews: [
      { date: "Apr 13", views: 250 },{ date: "Apr 14", views: 280 },
      { date: "Apr 15", views: 320 },{ date: "Apr 16", views: 300 },
      { date: "Apr 17", views: 583 },{ date: "Apr 18", views: 1727 },
      { date: "Apr 19", views: 400 },{ date: "Apr 20", views: 350 },
      { date: "Apr 21", views: 1746 },{ date: "Apr 22", views: 500 },
      { date: "Apr 23", views: 1478 },{ date: "Apr 24", views: 380 },
      { date: "Apr 25", views: 300 },{ date: "Apr 26", views: 250 },
    ],
    posts: [
      { id: 1, title: "More Than a Job – New Podcast Episode", type: "Reel", date: "Apr 21", isCollab: true, views: 1876, reach: 990, likes: 44, comments: 0, saves: 2, shares: 7, er: 5.3, skipRate: 62.9, avgWatch: "", watchTime: "", igUrl: "https://www.instagram.com/reel/DXaDxPWgRlN/", isTop: true },
      { id: 2, title: "Not Every Treatment Is Right – Dr. Approach", type: "Reel", date: "Apr 18", views: 1727, reach: 1026, likes: 64, comments: 2, saves: 4, shares: 8, er: 7.6, skipRate: 55, avgWatch: "", watchTime: "", igUrl: "https://www.instagram.com/reel/DXRzK8uSR1S/", isTop: false },
      { id: 3, title: "Building Patient Trust – Dr. Bender", type: "Reel", date: "Apr 23", isCollab: true, views: 1955, reach: 909, likes: 59, comments: 4, saves: 1, shares: 1, er: 6.6, skipRate: 70.1, avgWatch: "", watchTime: "", igUrl: "https://www.instagram.com/reel/DXe8R0VBhuA/", isTop: false },
      { id: 4, title: "The Difference You Can Feel", type: "Reel", date: "Apr 17", views: 583, reach: 383, likes: 12, comments: 0, saves: 0, shares: 1, er: 3.4, skipRate: 77, avgWatch: "", watchTime: "", igUrl: "https://www.instagram.com/reel/DXP1MbWAcJ7/", isTop: false },
    ],
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "◉" },
    { id: "social", label: "Social", icon: "◍" },
    { id: "links", label: "Links", icon: "⊞" },
    { id: "website", label: "Website", icon: "◈" },
    { id: "podcast", label: "Podcast", icon: "◉" },
    { id: "audience", label: "Audience", icon: "◎" },
    { id: "insights", label: "Insights", icon: "✦" },
  ];

  const severityStyle: Record<string, { bg: string; border: string; dot: string }> = {
    success: { bg: "rgba(136,163,174,0.12)", border: "rgba(136,163,174,0.35)", dot: "#88A3AE" },
    warning: { bg: "rgba(113,82,98,0.10)", border: "rgba(113,82,98,0.30)", dot: "#715262" },
    danger: { bg: "rgba(190,90,90,0.10)", border: "rgba(190,90,90,0.30)", dot: "#BE5A5A" },
    info: { bg: "rgba(189,203,206,0.15)", border: "rgba(189,203,206,0.35)", dot: "#88A3AE" },
  };

  function InsightCard({ title, body, severity }: { title: string; body: string; severity: string }) {
    const s = severityStyle[severity] || severityStyle.info;
    return (
      <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: "18px 22px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: 99, background: s.dot, flexShrink: 0 }} />
          <span style={{ fontWeight: 700, fontSize: 13, color: "#715262", letterSpacing: "0.01em" }}>{title}</span>
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: "#5C4A53" }}>{body}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#FAF6F3", fontFamily: "'Cinzel', serif" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #F1E4DC", borderTopColor: "#715262", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <div style={{ marginTop: 16, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#9B8E94" }}>Loading report...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className={`root ${loaded ? "on" : ""}`}>
      {/* HEADER */}
      <div className="hdr">
        <div className="hdr-top">
          <div>
            <div className="hdr-brand">Figment Creative · Social Intelligence</div>
            <div className="hdr-title">{d.client.fullName}</div>
            <div className="hdr-sub">Social Media Performance · {d.client.period}</div>
          </div>
          <div className="hdr-badge"><div className="hdr-pulse" />Weekly Report</div>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        {tabs.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>
            <span style={{ fontSize: 15 }}>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="grid">
        {/* OVERVIEW */}
        {tab === "overview" && (
          <>
            <div className="kpi-row">
              {[
                { ...d.kpi.followers, delay: 0 },
                { ...d.kpi.reach, delay: 80 },
                { ...d.kpi.engagementRate, delay: 240 },
                { ...d.kpi.engagements, delay: 320 }
              ].map((k, i) => (
                <div key={i} className="kpi" style={{ animationDelay: `${k.delay}ms` }}>
                  <div className="kpi-label">{k.label}</div>
                  <div className="kpi-val">
                    {typeof k.value === "number" ? <AnimatedNumber value={k.value} suffix={"suffix" in k ? (k as { suffix: string }).suffix : ""} /> : <span>{k.value}</span>}
                  </div>
                  {"change" in k && k.change != null && (
                    <div className="kpi-delta">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L12 8H2L7 2Z" fill="#88A3AE" /></svg>
                      +{k.change} this week
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="exec">
              <div className="card-hd">Executive Summary</div>
              <div className="exec-cols">
                <div>
                  <div className="exec-col-title">Discovery</div>
                  <div className="exec-col-body">{d.viewerSplit.nonFollowers}% of views from non-followers. Reach: 1,578 accounts (+13.7% vs prior). Three Reels exceeded 1,400 views — consistent multi-hit performance, no single-post dependency.</div>
                </div>
                <div>
                  <div className="exec-col-title">Engagement</div>
                  <div className="exec-col-body">{d.kpi.engagementRate.value}% rate with {d.kpi.engagements.value} interactions. Non-follower interactions at 49.4% — nearly even with followers. Saves at 7. 'Not Every Treatment' achieved 7.6% ER and 55% skip rate.</div>
                </div>
                <div>
                  <div className="exec-col-title">Content</div>
                  <div className="exec-col-body">Reels drive {d.contentMix.reels}% of views and 84.4% of interactions. Stories contribute 23.4% of views with 90% completion. 3,138 followers (0 net — 6 follows, 6 unfollows).</div>
                </div>
              </div>
            </div>

            <div className="cols2">
              <div className="card">
                <div className="card-hd">Content Mix</div>
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                  <Donut data={[{ value: d.contentMix.reels }, { value: d.contentMix.posts }, { value: d.contentMix.stories }]} colors={["#715262", "#88A3AE", "#BDCBCE"]} size={120} stroke={18} />
                  <div style={{ flex: 1 }}>
                    {[{ label: "Reels", value: d.contentMix.reels, color: "#715262" }, { label: "Posts", value: d.contentMix.posts, color: "#88A3AE" }, { label: "Stories", value: d.contentMix.stories, color: "#BDCBCE" }].map((item) => (
                      <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                        <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                        <span className="display-num">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-hd">Viewer Composition</div>
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                  <Donut data={[{ value: d.viewerSplit.nonFollowers }, { value: d.viewerSplit.followers }]} colors={["#715262", "#E4CCC2"]} size={120} stroke={18} />
                  <div style={{ flex: 1 }}>
                    {[{ label: "Non-Followers", value: d.viewerSplit.nonFollowers, color: "#715262" }, { label: "Followers", value: d.viewerSplit.followers, color: "#E4CCC2" }].map((item) => (
                      <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                        <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                        <span className="display-num">{item.value}%</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(136,163,174,0.12)", borderRadius: 10, border: "1px solid rgba(136,163,174,0.25)" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#6E8B97" }}>✦ Strong discovery — content reaching new audiences</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {engine.alerts.length > 0 && <div>{engine.alerts.map((a, i) => <InsightCard key={i} {...a} />)}</div>}
          </>
        )}

        {/* LINKS */}
        {tab === "links" && (
          <>
            <div className="kpi-row">
              {[
                { label: "Total Clicks", value: linkData.totalClicks, delay: 0 },
              ].map((k, i) => (
                <div key={i} className="kpi" style={{ animationDelay: `${k.delay}ms` }}>
                  <div className="kpi-label">{k.label}</div>
                  <div className="kpi-val">{typeof k.value === "number" ? <AnimatedNumber value={k.value} /> : <span>{k.value}</span>}</div>
                </div>
              ))}
            </div>
            <div className="card"><div className="card-hd">Top Links · {linkData.period}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {linkData.topLinks.map((l, i) => {
                  const maxClicks = Math.max(...linkData.topLinks.map(x => x.clicks));
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 99, background: "#715262", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ width: 140, fontSize: 13, fontWeight: 500, flexShrink: 0 }}>{l.path}</div>
                      <div style={{ flex: 1, height: 10, background: "#F1E4DC", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: `${(l.clicks / maxClicks) * 100}%`, height: "100%", background: i === 0 ? "#715262" : "#88A3AE", borderRadius: 99, transition: "width 1.2s ease" }} />
                      </div>
                      <div className="display-num" style={{ width: 40, textAlign: "right" as const }}>{l.clicks}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="cols2">
              <div className="card"><div className="card-hd">Traffic Sources</div>
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                  <Donut data={linkData.trafficSources.map(s => ({ value: Math.round((s.clicks / linkData.trafficSources.reduce((a, b) => a + b.clicks, 0)) * 100) }))} colors={["#715262", "#88A3AE"]} size={120} stroke={18} />
                  <div style={{ flex: 1 }}>
                    {linkData.trafficSources.map((s, i) => (
                      <div key={s.source} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: ["#715262", "#88A3AE"][i] }} />
                        <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{s.source}</span>
                        <span className="display-num">{s.clicks}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card"><div className="card-hd">Device Breakdown</div>
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                  <Donut data={linkData.devices.map(dv => ({ value: Math.round((dv.clicks / linkData.devices.reduce((a, b) => a + b.clicks, 0)) * 100) }))} colors={["#715262", "#88A3AE", "#BDCBCE"]} size={120} stroke={18} />
                  <div style={{ flex: 1 }}>
                    {linkData.devices.map((dv, i) => (
                      <div key={dv.os} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: ["#715262", "#88A3AE", "#BDCBCE"][i] }} />
                        <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{dv.os}</span>
                        <span className="display-num">{dv.clicks}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="cols2">
              <div className="card"><div className="card-hd">Top Countries</div>
                {linkData.topCountries.map((c) => {
                  const max = Math.max(...linkData.topCountries.map(x => x.clicks));
                  return (
                    <div key={c.country} className="age-row">
                      <div className="age-label" style={{ width: 110 }}>{c.country}</div>
                      <div className="age-track"><div className="age-fill" style={{ width: `${(c.clicks / max) * 100}%`, background: c.clicks === max ? "#715262" : "#88A3AE" }} /></div>
                      <div className="age-pct">{c.clicks}</div>
                    </div>
                  );
                })}
              </div>
              <div className="card"><div className="card-hd">Top Cities</div>
                {linkData.topCities.map((c) => {
                  const max = Math.max(...linkData.topCities.map(x => x.clicks));
                  return (
                    <div key={c.city} className="age-row">
                      <div className="age-label" style={{ width: 110 }}>{c.city}</div>
                      <div className="age-track"><div className="age-fill" style={{ width: `${(c.clicks / max) * 100}%`, background: c.clicks === max ? "#715262" : "#88A3AE" }} /></div>
                      <div className="age-pct">{c.clicks}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card">
              <InsightCard title="Link Attribution · Apr 13 – Apr 27" body="Massive improvement: 66 clicks vs 10 last period (+560%). Homepage leads with 46 clicks (70%). DDS-PC Midtown (11) and UES (9) booking pages are gaining traction. New York City dominates at 22 clicks — strong local intent. Add UTM tracking to social bios to better attribute traffic sources." severity="success" />
            </div>
          </>
        )}

        {/* WEBSITE */}
        {tab === "website" && (
          <>
            <div className="kpi-row">
              {[
                { label: "Total Sessions", value: websiteData.sessions, delay: 0 },
                { label: "Page Views", value: websiteData.topPages.reduce((s, p) => s + p.views, 0), delay: 80 },
                { label: "Top Source", value: "Google (63.7%)", delay: 160 },
              ].map((k, i) => (
                <div key={i} className="kpi" style={{ animationDelay: `${k.delay}ms` }}>
                  <div className="kpi-label">{k.label}</div>
                  <div className="kpi-val">{typeof k.value === "number" ? <AnimatedNumber value={k.value} /> : <span>{k.value}</span>}</div>
                </div>
              ))}
            </div>
            <div className="card"><div className="card-hd">Visitors Over Time · {websiteData.period}</div>
              <div style={{ position: "relative", height: 180 }}>
                <svg viewBox="0 0 700 160" style={{ width: "100%", height: "100%" }}>
                  <defs><linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#715262" stopOpacity="0.18" /><stop offset="100%" stopColor="#715262" stopOpacity="0" /></linearGradient></defs>
                  {(() => {
                    const pts = websiteData.dailyVisitors;
                    const maxV = Math.max(...pts.map(p => p.visitors));
                    const coords = pts.map((p, i) => ({ x: 30 + (i / (pts.length - 1)) * 640, y: 145 - (p.visitors / maxV) * 130 }));
                    const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
                    const area = `${line} L${coords[coords.length-1].x},150 L${coords[0].x},150 Z`;
                    return (<>
                      {[0, 0.25, 0.5, 0.75, 1].map(f => { const y = 145 - f * 130; return <line key={f} x1="30" x2="670" y1={y} y2={y} stroke="#F1E4DC" strokeWidth="0.5" strokeDasharray="4,4" />; })}
                      <path d={area} fill="url(#vg)" />
                      <path d={line} fill="none" stroke="#715262" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      {coords.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r="3" fill="#715262" stroke="#FAF6F3" strokeWidth="1.5" />)}
                      {pts.map((p, i) => <text key={`l${i}`} x={coords[i].x} y="158" textAnchor="middle" fontSize="8" fill="#9B8E94">{p.date.replace("Apr ", "4/").replace("Mar ", "3/")}</text>)}
                    </>);
                  })()}
                </svg>
              </div>
            </div>
            <div className="card"><div className="card-hd">Top Pages</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {websiteData.topPages.map((p, i) => {
                  const maxViews = websiteData.topPages[0].views;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 99, background: i === 0 ? "#715262" : i < 3 ? "#88A3AE" : "#BDCBCE", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ width: 150, fontSize: 13, fontWeight: 500, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{p.label}</div>
                      <div style={{ flex: 1, height: 10, background: "#F1E4DC", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: `${(p.views / maxViews) * 100}%`, height: "100%", background: i === 0 ? "#715262" : i < 3 ? "#88A3AE" : "#BDCBCE", borderRadius: 99, transition: "width 1.2s ease" }} />
                      </div>
                      <div className="display-num" style={{ width: 40, textAlign: "right" as const }}>{p.views}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="cols2">
              <div className="card"><div className="card-hd">Traffic Sources</div>
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                  <Donut data={websiteData.trafficSources.map(s => ({ value: Math.round(s.pct) }))} colors={["#715262", "#88A3AE", "#BDCBCE", "#E4CCC2", "#F1E4DC"]} size={120} stroke={18} />
                  <div style={{ flex: 1 }}>
                    {websiteData.trafficSources.map((s, i) => (
                      <div key={s.source} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: ["#715262", "#88A3AE", "#BDCBCE", "#E4CCC2", "#F1E4DC"][i] }} />
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{s.source}</span>
                        <span className="display-num">{s.sessions}</span>
                        <span style={{ fontSize: 11, color: "#9B8E94", width: 44, textAlign: "right" as const }}>{s.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card"><div className="card-hd">Device Breakdown</div>
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                  <Donut data={websiteData.devices.map(dv => ({ value: Math.round(dv.pct) }))} colors={["#715262", "#88A3AE", "#BDCBCE"]} size={120} stroke={18} />
                  <div style={{ flex: 1 }}>
                    {websiteData.devices.map((dv, i) => (
                      <div key={dv.device} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: ["#715262", "#88A3AE", "#BDCBCE"][i] }} />
                        <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{dv.device}</span>
                        <span className="display-num-lg">{dv.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(136,163,174,0.12)", borderRadius: 10, border: "1px solid rgba(136,163,174,0.25)" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#6E8B97" }}>✦ Nearly even desktop/mobile split — optimize both experiences</span>
                </div>
              </div>
            </div>
            <div className="card"><div className="card-hd">Google Search Performance · {websiteData.period}</div>
              <div className="kpi-row" style={{ marginBottom: 18 }}>
                {[
                  { label: "Search Clicks", value: websiteData.search.totalClicks },
                  { label: "Impressions", value: websiteData.search.totalImpressions.toLocaleString() },
                  { label: "Avg CTR", value: `${websiteData.search.avgCTR}%` },
                  { label: "Avg Position", value: websiteData.search.avgPosition.toFixed(0) },
                ].map((k, i) => (
                  <div key={i} className="kpi" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="kpi-label">{k.label}</div>
                    <div className="kpi-val">{typeof k.value === "number" ? <AnimatedNumber value={k.value} /> : <span>{k.value}</span>}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cols2">
              <div className="card"><div className="card-hd">Top Search Queries</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {websiteData.search.topQueries.map((q, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 12px", background: i === 0 ? "rgba(113,82,98,0.08)" : "rgba(136,163,174,0.06)", borderRadius: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 99, background: i === 0 ? "#715262" : "#88A3AE", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ flex: 1, fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{q.query}</div>
                      <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
                        <div style={{ textAlign: "center" as const }}><div className="display-num">{q.clicks}</div><div style={{ fontSize: 9, color: "#9B8E94" }}>clicks</div></div>
                        <div style={{ textAlign: "center" as const }}><div className="display-num">{q.ctr}%</div><div style={{ fontSize: 9, color: "#9B8E94" }}>CTR</div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card"><div className="card-hd">Top Pages in Search</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {websiteData.search.topPages.map((p, i) => {
                    const maxClicks = websiteData.search.topPages[0].clicks;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 130, fontSize: 12, fontWeight: 500, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{p.page}</div>
                        <div style={{ flex: 1, height: 10, background: "#F1E4DC", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ width: `${(p.clicks / maxClicks) * 100}%`, height: "100%", background: i === 0 ? "#715262" : "#88A3AE", borderRadius: 99, transition: "width 1.2s ease" }} />
                        </div>
                        <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
                          <div style={{ textAlign: "center" as const }}><div className="display-num">{p.clicks}</div><div style={{ fontSize: 9, color: "#9B8E94" }}>clicks</div></div>
                          <div style={{ textAlign: "center" as const }}><div className="display-num">{p.ctr}%</div><div style={{ fontSize: 9, color: "#9B8E94" }}>CTR</div></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="card">
              <InsightCard title="Website + Search Intelligence · Apr 13 – Apr 27" body="923 site sessions + 419 search clicks from 26,737 impressions. 'Dry Socket with Bone Graft' is the SEO powerhouse: 120 search clicks from 3,572 impressions (3.4% CTR) — the #1 organic content page by a wide margin. Branded queries ('edgard el chaar', 'dr el chaar') combine for 21 clicks at 14–22% CTR. Educational content drives the funnel: sinus lift, gum graft, and dry socket pages account for 260 of 419 search clicks (62%). Homepage CTR of 8.5% is strong. Mobile leads search at 66%." severity="info" />
            </div>
          </>
        )}

        {/* SOCIAL */}
        {tab === "social" && (
          <>
            <div className="kpi-row">
              {[
                { label: "Total Views", value: socialData.totalViews, delay: 0 },
                { label: "Accounts Reached", value: socialData.totalReach, delay: 80 },
                { label: "Total Interactions", value: socialData.totalInteractions, delay: 160 },
                { label: "Followers", value: socialData.followers, delay: 240 },
                { label: "Net Growth", value: `+${socialData.followerGrowth}`, delay: 320 },
              ].map((k, i) => (
                <div key={i} className="kpi" style={{ animationDelay: `${k.delay}ms` }}>
                  <div className="kpi-label">{k.label}</div>
                  <div className="kpi-val">{typeof k.value === "number" ? <AnimatedNumber value={k.value} /> : <span>{k.value}</span>}</div>
                </div>
              ))}
            </div>

            <div className="card"><div className="card-hd">Performance Over Time · {socialData.period}</div>
              <div style={{ position: "relative", height: 180 }}>
                <svg viewBox="0 0 700 160" style={{ width: "100%", height: "100%" }}>
                  <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#715262" stopOpacity="0.18" /><stop offset="100%" stopColor="#715262" stopOpacity="0" /></linearGradient></defs>
                  {(() => {
                    const pts = socialData.dailyViews;
                    const maxV = Math.max(...pts.map(p => p.views));
                    const coords = pts.map((p, i) => ({ x: 30 + (i / (pts.length - 1)) * 640, y: 145 - (p.views / maxV) * 130 }));
                    const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
                    const area = `${line} L${coords[coords.length-1].x},150 L${coords[0].x},150 Z`;
                    return (<>
                      {[0, 0.25, 0.5, 0.75, 1].map(f => { const y = 145 - f * 130; return <line key={f} x1="30" x2="670" y1={y} y2={y} stroke="#F1E4DC" strokeWidth="0.5" strokeDasharray="4,4" />; })}
                      <path d={area} fill="url(#sg)" />
                      <path d={line} fill="none" stroke="#715262" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      {coords.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={pts[i].views >= 1400 ? 5 : 3} fill={pts[i].views >= 1400 ? "#715262" : "#88A3AE"} stroke="#FAF6F3" strokeWidth="1.5" />)}
                      {pts.map((p, i) => <text key={`l${i}`} x={coords[i].x} y="158" textAnchor="middle" fontSize="8" fill="#9B8E94">{p.date.replace("Apr ", "4/").replace("Mar ", "3/")}</text>)}
                      {pts.filter(p => p.views >= 1400).map((p, idx) => { const i = pts.indexOf(p); return <text key={`v${idx}`} x={coords[i].x} y={coords[i].y - 10} textAnchor="middle" fontSize="9" fontWeight="700" fill="#715262">{p.views.toLocaleString()}</text>; })}
                    </>);
                  })()}
                </svg>
              </div>
              <div style={{ marginTop: 8, padding: "10px 14px", background: "rgba(113,82,98,0.10)", borderRadius: 10, border: "1px solid rgba(113,82,98,0.25)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#715262" }}>⚡ Apr 3 spike (3,119 views) driven by Dr. Castillo Reel. Apr 11 secondary peak (1,928) from Treatment vs. Care. Best posting: 9 AM – 2 PM EST.</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
              {d.posts.map((p: any) => { const url = mediaUrls[p.id]; const isEditing = editingMedia === p.id; const maxViews = Math.max(...d.posts.map((x: any) => x.views), 1); return (
                <div key={p.id} className={`postcard ${p.isTop ? "postcard-top" : ""}`}>
                  <div className="postcard-header"><div className="postcard-type-badge">{p.type}</div>{p.isTop && <div className="postcard-top-badge">★ Top Post</div>}{p.isCollab && <div className="postcard-top-badge" style={{background: "rgba(88,130,220,0.15)", color: "#5882DC"}}>⚡ Collab</div>}</div>
                  <div className="postcard-title">{p.title}</div>
                  <div className={`postcard-media ${url ? "has-media" : ""}`}>
                    {!url && !isEditing && (<div className="postcard-media-empty" onClick={() => { setEditingMedia(p.id); setMediaInput(""); }}><div className="postcard-empty-inner"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#BDCBCE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span className="postcard-empty-label">Add Post Visual</span><span className="postcard-empty-hint">Image, video, or Instagram link</span></div></div>)}
                    {isEditing && (<div className="postcard-media-input"><input className="media-input" type="text" placeholder="Paste image, video, or Instagram URL..." value={mediaInput} onChange={(e) => setMediaInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleMediaSave(p.id); if (e.key === "Escape") { setEditingMedia(null); setMediaInput(""); } }} autoFocus /><div style={{ display: "flex", gap: 6 }}><button className="media-btn secondary" onClick={() => { setEditingMedia(null); setMediaInput(""); }}>Cancel</button><button className="media-btn primary" onClick={() => handleMediaSave(p.id)}>Save</button></div></div>)}
                    {url && !isEditing && (<div className="postcard-media-filled">{isIgEmbed(url) ? (<div className="postcard-ig-crop"><iframe src={url.replace(/\/?(\?.*)?$/, "/embed")} title={p.title} scrolling="no" allowFullScreen /></div>) : isVideo(url) ? (<video controls playsInline preload="metadata"><source src={url} /></video>) : (<img src={url} alt={p.title} />)}<div className="postcard-media-actions"><button onClick={() => { setEditingMedia(p.id); setMediaInput(url); }}>✎</button><button onClick={() => handleMediaRemove(p.id)}>✕</button></div></div>)}
                  </div>
                  <div className="postcard-primary"><div className="postcard-hero-metric"><span className="postcard-hero-val">{p.views?.toLocaleString()}</span><span className="postcard-hero-label">Views</span></div><div className="postcard-hero-divider" /><div className="postcard-hero-metric"><span className="postcard-hero-val">{p.reach?.toLocaleString()}</span><span className="postcard-hero-label">Reach</span></div></div>
                  <div className="postcard-perf-bar"><div className="postcard-perf-fill" style={{ width: `${(p.views / maxViews) * 100}%` }} /></div>
                  <div className="postcard-secondary">{[{ icon: "♡", val: p.likes, label: "Likes" }, { icon: "↗", val: p.shares, label: "Shares" }, { icon: "💬", val: p.comments, label: "Comments" }, { icon: "⊕", val: p.saves, label: "Saves" }].map((m) => (<div key={m.label} className={`postcard-sec-item ${m.val === 0 ? "zero" : ""}`}><span className="postcard-sec-val">{m.val}</span><span className="postcard-sec-label">{m.label}</span></div>))}</div>
                </div>); })}
            </div>

            <div className="card"><div className="card-hd">Content Performance · {socialData.period}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {socialData.posts.map((p, i) => {
                  const maxV = socialData.posts[0].views;
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 99, background: p.isTop ? "#715262" : i < 3 ? "#88A3AE" : "#BDCBCE", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ minWidth: 0, flex: "0 0 200px" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{p.title}</div>
                        <div style={{ fontSize: 11, color: "#9B8E94", marginTop: 2 }}>{p.type} · {p.date}{p.isTop ? " · ★ Top Post" : ""}{p.isCollab ? " · ⚡ Collab" : ""}</div>
                      </div>
                      <div style={{ flex: 1, height: 10, background: "#F1E4DC", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: `${(p.views / maxV) * 100}%`, height: "100%", background: p.isTop ? "#715262" : i < 3 ? "#88A3AE" : "#BDCBCE", borderRadius: 99, transition: "width 1.2s ease" }} />
                      </div>
                      <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
                        <div style={{ textAlign: "center" as const }}><div className="display-num">{p.views.toLocaleString()}</div><div style={{ fontSize: 9, color: "#9B8E94" }}>views</div></div>
                        <div style={{ textAlign: "center" as const }}><div className="display-num">{p.reach.toLocaleString()}</div><div style={{ fontSize: 9, color: "#9B8E94" }}>reach</div></div>
                        <div style={{ textAlign: "center" as const }}><div className="display-num">{p.er}%</div><div style={{ fontSize: 9, color: "#9B8E94" }}>ER</div></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="cols2">
              <div className="card"><div className="card-hd">Views by Content Type</div>
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                  <Donut data={[{ value: Math.round(socialData.viewsByType.reels) }, { value: Math.round(socialData.viewsByType.posts) }, { value: Math.round(socialData.viewsByType.stories) }]} colors={["#715262", "#88A3AE", "#BDCBCE"]} size={120} stroke={18} />
                  <div style={{ flex: 1 }}>
                    {[
                      { label: "Reels", value: socialData.viewsByType.reels, color: "#715262" },
                      { label: "Posts", value: socialData.viewsByType.posts, color: "#88A3AE" },
                      { label: "Stories", value: socialData.viewsByType.stories, color: "#BDCBCE" },
                    ].map((item) => (
                      <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                        <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                        <span className="display-num">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card"><div className="card-hd">Interactions by Type</div>
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                  <Donut data={[{ value: Math.round(socialData.interactionsByType.reels) }, { value: Math.round(socialData.interactionsByType.posts) }, { value: Math.round(socialData.interactionsByType.stories) }]} colors={["#715262", "#88A3AE", "#BDCBCE"]} size={120} stroke={18} />
                  <div style={{ flex: 1 }}>
                    {[
                      { label: "Reels", value: socialData.interactionsByType.reels, color: "#715262" },
                      { label: "Posts", value: socialData.interactionsByType.posts, color: "#88A3AE" },
                      { label: "Stories", value: socialData.interactionsByType.stories, color: "#BDCBCE" },
                    ].map((item) => (
                      <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                        <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                        <span className="display-num">{item.value}%</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(113,82,98,0.10)", borderRadius: 10, border: "1px solid rgba(113,82,98,0.25)" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#715262" }}>✦ Reels drive 87% of all interactions — the dominant format</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="cols2">
              <div className="card"><div className="card-hd">Discovery Funnel</div>
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                  <Donut data={[{ value: Math.round(socialData.viewSplit.nonFollowers) }, { value: Math.round(socialData.viewSplit.followers) }]} colors={["#715262", "#E4CCC2"]} size={120} stroke={18} />
                  <div style={{ flex: 1 }}>
                    {[
                      { label: "Non-Followers", value: socialData.viewSplit.nonFollowers, color: "#715262" },
                      { label: "Followers", value: socialData.viewSplit.followers, color: "#E4CCC2" },
                    ].map((item) => (
                      <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                        <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label} (views)</span>
                        <span className="display-num-lg">{item.value}%</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(136,163,174,0.12)", borderRadius: 10, border: "1px solid rgba(136,163,174,0.25)" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#6E8B97" }}>✦ 54.8% of views from non-followers — strong algorithmic distribution</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card"><div className="card-hd">Engagement Breakdown</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "Likes", value: socialData.totalLikes, max: 200, color: "#715262" },
                    { label: "Shares", value: socialData.totalShares, max: 200, color: "#88A3AE" },
                    { label: "Comments", value: socialData.totalComments, max: 200, color: "#BDCBCE" },
                    { label: "Saves", value: socialData.totalSaves, max: 200, color: "#BE5A5A" },
                  ].map((m) => (
                    <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 72, fontSize: 13, fontWeight: 500 }}>{m.label}</div>
                      <div style={{ flex: 1, height: 10, background: "#F1E4DC", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: `${(Math.max(m.value, 0.5) / m.max) * 100}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.2s ease" }} />
                      </div>
                      <div className="display-num" style={{ width: 36, textAlign: "right" as const }}>{m.value}</div>
                    </div>
                  ))}
                </div>
                <div className="alert-box danger-bg" style={{ marginTop: 14, padding: "10px 14px", background: "rgba(190,90,90,0.10)", borderRadius: 10, border: "1px solid rgba(190,90,90,0.25)" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>▲ 100 shares but only 3 saves — content goes viral but isn't bookmarked</span>
                </div>
              </div>
            </div>

            <div className="card"><div className="card-hd">Reel-by-Reel Performance</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {socialData.posts.filter(p => p.type === "Reel").map((p) => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: p.isTop ? "rgba(113,82,98,0.10)" : "rgba(136,163,174,0.08)", borderRadius: 12, border: p.isTop ? "1px solid rgba(113,82,98,0.25)" : "1px solid transparent" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{p.title}{p.isTop ? " ★" : ""}</div>
                      <div style={{ fontSize: 11, color: "#9B8E94", marginTop: 2 }}>{p.date} · {p.shares} shares</div>
                    </div>
                    <div style={{ display: "flex", gap: 18, flexShrink: 0 }}>
                      <div style={{ textAlign: "center" as const }}><div style={{ fontSize: 18, fontWeight: 700, color: "#715262" }}>{p.views.toLocaleString()}</div><div style={{ fontSize: 9, color: "#9B8E94" }}>views</div></div>
                      <div style={{ textAlign: "center" as const }}><div style={{ fontSize: 18, fontWeight: 700, color: "#88A3AE" }}>{p.reach.toLocaleString()}</div><div style={{ fontSize: 9, color: "#9B8E94" }}>reach</div></div>
                      <div style={{ textAlign: "center" as const }}><div style={{ fontSize: 18, fontWeight: 700, color: p.er >= 10 ? "#715262" : "#BDCBCE" }}>{p.er}%</div><div style={{ fontSize: 9, color: "#9B8E94" }}>ER</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <InsightCard title="Social Intelligence · Apr 13 – Apr 27" body="5,573 platform views reaching 1,578 accounts (+13.7%). 60.9% non-follower views — strong discovery. No single-post dependency: three Reels exceeded 1,400 views. 'Not Every Treatment' achieved 7.6% ER and 55% skip rate. Saves at 7 (+133% vs prior). Reels drive 68.1% of views and 84.4% of interactions. 10 Stories with 90% completion and 1,137 views. Doctor-led Reel strategy is now a consistent system." severity="info" />
              <InsightCard title="Period Comparison" body="Consistent performance vs prior: views 5,573 (vs 10,829 — but prior was inflated by Castillo viral outlier). Reach: 1,578 (+13.7%). Avg Reel ER: 5.7% (vs 3.2% excl. outlier last period). Best skip rate: 55% (vs 63% prior). Non-follower interactions at 49.4% — nearly even split. Follower growth flat at 0 net (6 follows, 6 unfollows) — conversion remains the gap. Profile CTAs and series continuity needed." severity="warning" />
            </div>
          </>
        )}

        {/* PODCAST */}
        {tab === "podcast" && (
          <>
            <div className="kpi-row">
              {[
                { label: "Total Episodes", value: podcastData.totalEpisodes, delay: 0 },
                { label: "All-Time Downloads", value: podcastData.totalDownloads, delay: 80 },
                { label: "Last 30 Days", value: podcastData.last30Days, delay: 160 },
                { label: "Last 7 Days", value: podcastData.last7Days, delay: 240 },
              ].map((k, i) => (
                <div key={i} className="kpi" style={{ animationDelay: `${k.delay}ms` }}>
                  <div className="kpi-label">{k.label}</div>
                  <div className="kpi-val"><AnimatedNumber value={k.value} /></div>
                </div>
              ))}
            </div>
            <div className="card"><div className="card-hd">Top Episodes · All Time</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {podcastData.topEpisodes.map((ep, i) => {
                  const maxDl = podcastData.topEpisodes[0].downloads;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 99, background: i === 0 ? "#715262" : i < 3 ? "#88A3AE" : "#BDCBCE", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{ep.title}</div>
                      <div style={{ width: 120, height: 10, background: "#F1E4DC", borderRadius: 99, overflow: "hidden", flexShrink: 0 }}>
                        <div style={{ width: `${(ep.downloads / maxDl) * 100}%`, height: "100%", background: i === 0 ? "#715262" : i < 3 ? "#88A3AE" : "#BDCBCE", borderRadius: 99, transition: "width 1.2s ease" }} />
                      </div>
                      <div className="display-num" style={{ width: 40, textAlign: "right" as const }}>{ep.downloads}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="cols2">
              <div className="card"><div className="card-hd">Listening Platforms</div>
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                  <Donut data={podcastData.platforms.map(p => ({ value: Math.round(p.pct) }))} colors={["#715262", "#88A3AE", "#BDCBCE", "#E4CCC2", "#F1E4DC", "#C4B5AD"]} size={120} stroke={18} />
                  <div style={{ flex: 1 }}>
                    {podcastData.platforms.map((p, i) => (
                      <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: ["#715262", "#88A3AE", "#BDCBCE", "#E4CCC2", "#F1E4DC", "#C4B5AD"][i] }} />
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                        <span className="display-num">{p.downloads.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card"><div className="card-hd">Download Velocity</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "8px 0" }}>
                  {[
                    { label: "Last 7 Days", value: podcastData.last7Days, max: 600, color: "#715262" },
                    { label: "Last 30 Days", value: podcastData.last30Days, max: 600, color: "#88A3AE" },
                    { label: "Last 90 Days", value: podcastData.last90Days, max: 600, color: "#BDCBCE" },
                    { label: "All Time", value: podcastData.totalDownloads, max: 5000, color: "#E4CCC2" },
                  ].map((m) => (
                    <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 90, fontSize: 13, fontWeight: 500 }}>{m.label}</div>
                      <div style={{ flex: 1, height: 10, background: "#F1E4DC", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: `${(m.value / m.max) * 100}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.2s ease" }} />
                      </div>
                      <div className="display-num" style={{ width: 50, textAlign: "right" as const }}>{m.value.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="cols2">
              <div className="card"><div className="card-hd">Top Countries</div>
                {podcastData.topCountries.map((c) => {
                  const max = podcastData.topCountries[0].downloads;
                  return (
                    <div key={c.country} className="age-row">
                      <div className="age-label" style={{ width: 110 }}>{c.country}</div>
                      <div className="age-track"><div className="age-fill" style={{ width: `${(c.downloads / max) * 100}%`, background: c.downloads === max ? "#715262" : "#88A3AE" }} /></div>
                      <div className="age-pct">{c.downloads.toLocaleString()}</div>
                    </div>
                  );
                })}
              </div>
              <div className="card"><div className="card-hd">Top Cities</div>
                {podcastData.topCities.map((c) => {
                  const max = podcastData.topCities[0].downloads;
                  return (
                    <div key={c.city} className="age-row">
                      <div className="age-label" style={{ width: 110 }}>{c.city}</div>
                      <div className="age-track"><div className="age-fill" style={{ width: `${(c.downloads / max) * 100}%`, background: c.downloads === max ? "#715262" : "#88A3AE" }} /></div>
                      <div className="age-pct">{c.downloads}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card">
              <InsightCard title="Podcast Intelligence · Apr 13 – Apr 27" body="80 downloads this period, 4,596 all-time across 46 episodes. Web Browser now leads apps at 47% (was Spotify last period) — listeners discovering via website embeds. Apple Podcasts strong at 29%. Latest episode 'More Than a Job' pulled 20 first-week downloads. NYC metro leads: New York (29) + Brooklyn (14) = 43 downloads. Germany emerged as #2 country at 23 downloads (10%). 24 countries reached across last 5 episodes — strong international distribution." severity="success" />
            </div>
          </>
        )}

        {/* AUDIENCE */}
        {tab === "audience" && (
          <>
            <div className="cols2">
              <div className="card">
                <div className="card-hd">Gender Split</div>
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                  <Donut data={[{ value: d.audience.gender.male }, { value: d.audience.gender.female }]} colors={["#715262", "#88A3AE"]} size={130} stroke={20} />
                  <div style={{ flex: 1 }}>
                    {[{ label: "Male", value: d.audience.gender.male, color: "#715262" }, { label: "Female", value: d.audience.gender.female, color: "#88A3AE" }].map((g) => (
                      <div key={g.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}>
                        <div style={{ width: 12, height: 12, borderRadius: 4, background: g.color }} />
                        <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{g.label}</span>
                        <span className="display-num-lg">{g.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-hd">Age Distribution</div>
                {d.audience.age.map((a) => (
                  <div key={a.range} className="age-row">
                    <div className="age-label">{a.range}</div>
                    <div className="age-track"><div className="age-fill" style={{ width: `${(a.pct / 36) * 100}%`, background: a.pct >= 30 ? "#715262" : a.pct >= 20 ? "#88A3AE" : "#BDCBCE" }} /></div>
                    <div className="age-pct">{a.pct}%</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-hd">Audience Intelligence</div>
              <InsightCard title="High-Value Patient Alignment" body="57% of the audience falls in the 35–54 age range — the prime demographic for implants, cosmetic dentistry, and comprehensive periodontal treatment. This represents the highest lifetime patient value segment." severity="success" />
              <InsightCard title="Gender Balance Opportunity" body="At 53% male, the audience skews slightly toward men. Dental practices typically see 60%+ female patients. Test content around cosmetic dentistry, Invisalign, and wellness-focused oral health to balance the demographic." severity="info" />
            </div>
          </>
        )}

        {/* INSIGHTS */}
        {tab === "insights" && (
          <>
            <div className="cols2">
              <div>
                <div className="section-label">Key Insights</div>
                {engine.insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
              </div>
              <div>
                <div className="section-label">Growth Opportunities</div>
                {engine.opportunities.map((o, i) => <InsightCard key={i} {...o} />)}
                {engine.alerts.map((a, i) => <InsightCard key={`a${i}`} {...a} />)}
              </div>
            </div>
            <div className="card">
              <div className="card-hd">Strategic Recommendations</div>
              {engine.recommendations.map((r, i) => (
                <div key={i} className="rec">
                  <span className={`rec-badge ${r.priority}`}>{r.priority}</span>
                  <span style={{ fontSize: 13, lineHeight: 1.6 }}>{r.text}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="footer"><span>Edgard El Chaar, DDS, PC · Powered by Figment Creative</span></div>
      </div>
    </div>
  );
}
