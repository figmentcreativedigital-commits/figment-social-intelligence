"use client";
import { useState, useEffect } from "react";

// Fallback data — used while loading or if Sheets API fails
const FALLBACK_DATA = {
  client: { name: "EEC", fullName: "Edgard El Chaar, DDS, PC", period: "Loading..." },
  kpi: {
    followers: { value: 0, change: 0, label: "Followers" },
    reach: { value: 0, label: "Reach" },
    views: { value: 0, label: "Total Views" },
    engagementRate: { value: 0, label: "Engagement Rate", suffix: "%" },
    engagements: { value: 0, label: "Engagements" },
    watchTime: { value: "–", label: "Watch Time" },
  },
  posts: [] as any[],
  contentMix: { posts: 0, reels: 0, stories: 0 },
  audience: {
    gender: { male: 50, female: 50 },
    age: [
      { range: "18–24", pct: 0 }, { range: "25–34", pct: 0 }, { range: "35–44", pct: 0 },
      { range: "45–54", pct: 0 }, { range: "55–64", pct: 0 }, { range: "65+", pct: 0 },
    ],
  },
  viewerSplit: { followers: 50, nonFollowers: 50 },
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
  const [loading, setLoading] = useState(true);
  const [d, setD] = useState<ReportData>(FALLBACK_DATA);
  const [mediaUrls, setMediaUrls] = useState<Record<number, string>>({});
  const [editingMedia, setEditingMedia] = useState<number | null>(null);
  const [mediaInput, setMediaInput] = useState("");
  const engine = generateInsights(d);

  useEffect(() => {
    fetch("/api/sheets")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setD(data);
          // Pre-populate media URLs from sheet data
          const urls: Record<number, string> = {};
          (data.posts || []).forEach((p: any) => {
            if (p.igPostUrl) urls[p.id] = p.igPostUrl;
            else if (p.mediaUrl) urls[p.id] = p.mediaUrl;
          });
          setMediaUrls(urls);
        }
        setLoading(false);
        setTimeout(() => setLoaded(true), 80);
      })
      .catch(() => {
        setLoading(false);
        setTimeout(() => setLoaded(true), 80);
      });
  }, []);

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

  const tabs = [
    { id: "overview", label: "Overview", icon: "◉" },
    { id: "content", label: "Content", icon: "◫" },
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
                { ...d.kpi.views, delay: 160 },
                { ...d.kpi.engagementRate, delay: 240 },
                { ...d.kpi.engagements, delay: 320 },
                { ...d.kpi.watchTime, delay: 400 },
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
                  <div className="exec-col-body">{d.viewerSplit.nonFollowers}% of views come from non-followers. The algorithm is actively distributing content to new audiences — a strong signal of organic discovery potential.</div>
                </div>
                <div>
                  <div className="exec-col-title">Engagement</div>
                  <div className="exec-col-body">{d.kpi.engagementRate.value}% rate with {d.kpi.engagements.value} total interactions. Zero saves across all posts is the critical gap — this metric drives algorithmic amplification.</div>
                </div>
                <div>
                  <div className="exec-col-title">Content</div>
                  <div className="exec-col-body">Office tour content outperformed clinical topics by 35%+ in views. Personality-driven, behind-the-scenes content resonates with this audience.</div>
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

        {/* CONTENT */}
        {tab === "content" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
              {d.posts.map((p) => {
                const url = mediaUrls[p.id];
                const isEditing = editingMedia === p.id;
                const maxViews = 938;
                return (
                  <div key={p.id} className={`postcard ${p.isTop ? "postcard-top" : ""}`}>
                    {/* Header row */}
                    <div className="postcard-header">
                      <div className="postcard-type-badge">{p.type}</div>
                      {p.isTop && <div className="postcard-top-badge">★ Top Post</div>}
                    </div>
                    <div className="postcard-title">{p.title}</div>

                    {/* Media zone — 4:5 ratio (1080×1350), IG embeds cropped clean */}
                    <div className={`postcard-media ${url ? "has-media" : ""}`}>
                      {!url && !isEditing && (
                        <div className="postcard-media-empty" onClick={() => { setEditingMedia(p.id); setMediaInput(""); }}>
                          <div className="postcard-empty-inner">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#BDCBCE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                            <span className="postcard-empty-label">Add Post Visual</span>
                            <span className="postcard-empty-hint">Image URL, video URL, or Instagram link</span>
                          </div>
                        </div>
                      )}
                      {isEditing && (
                        <div className="postcard-media-input">
                          <input className="media-input" type="text" placeholder="Paste image, video, or Instagram URL..." value={mediaInput} onChange={(e) => setMediaInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleMediaSave(p.id); if (e.key === "Escape") { setEditingMedia(null); setMediaInput(""); } }} autoFocus />
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="media-btn secondary" onClick={() => { setEditingMedia(null); setMediaInput(""); }}>Cancel</button>
                            <button className="media-btn primary" onClick={() => handleMediaSave(p.id)}>Save</button>
                          </div>
                        </div>
                      )}
                      {url && !isEditing && (
                        <div className="postcard-media-filled">
                          {isIgEmbed(url) ? (
                            <div className="postcard-ig-crop">
                              <iframe
                                src={url.replace(/\/?(\?.*)?$/, "/embed")}
                                title={p.title}
                                scrolling="no"
                                allowFullScreen
                              />
                            </div>
                          ) : isVideo(url) ? (
                            <video controls playsInline preload="metadata" poster=""><source src={url} /></video>
                          ) : (
                            <img src={url} alt={p.title} />
                          )}
                          <div className="postcard-media-actions">
                            <button onClick={() => { setEditingMedia(p.id); setMediaInput(url); }}>✎</button>
                            <button onClick={() => handleMediaRemove(p.id)}>✕</button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Primary metrics — Views & Reach, large and scannable */}
                    <div className="postcard-primary">
                      <div className="postcard-hero-metric">
                        <span className="postcard-hero-val">{p.views.toLocaleString()}</span>
                        <span className="postcard-hero-label">Views</span>
                      </div>
                      <div className="postcard-hero-divider" />
                      <div className="postcard-hero-metric">
                        <span className="postcard-hero-val">{p.reach.toLocaleString()}</span>
                        <span className="postcard-hero-label">Reach</span>
                      </div>
                    </div>

                    {/* Performance bar — subtle relative indicator */}
                    <div className="postcard-perf-bar">
                      <div className="postcard-perf-fill" style={{ width: `${(p.views / maxViews) * 100}%` }} />
                    </div>

                    {/* Secondary metrics — inline, compact */}
                    <div className="postcard-secondary">
                      {[
                        { icon: "♡", val: p.likes, label: "Likes" },
                        { icon: "↗", val: p.shares, label: "Shares" },
                        { icon: "💬", val: p.comments, label: "Comments" },
                        { icon: "⊕", val: p.saves, label: "Saves" },
                      ].map((m) => (
                        <div key={m.label} className={`postcard-sec-item ${m.val === 0 ? "zero" : ""}`}>
                          <span className="postcard-sec-val">{m.val}</span>
                          <span className="postcard-sec-label">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cols2">
              <div className="card">
                <div className="card-hd">Watch Time Analytics</div>
                <div style={{ textAlign: "center", padding: "8px 0 22px" }}>
                  <div className="big-num">2h 36m</div>
                  <div style={{ fontSize: 12, color: "#9B8E94", marginTop: 2, fontWeight: 500 }}>Total Watch Time</div>
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  <div className="stat-box"><div className="big-num-sm plum">6s</div><div className="stat-label">Avg Duration</div></div>
                  <div className="stat-box"><div className="big-num-sm steel">9,464</div><div className="stat-label">Total Views</div></div>
                </div>
                <div className="alert-box plum-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#715262" }}>⚡ 6s avg signals weak retention — strengthen opening hooks</span></div>
              </div>
              <div className="card">
                <div className="card-hd">Engagement Breakdown</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[{ label: "Likes", value: d.posts.reduce((s, p) => s + p.likes, 0), max: 50, color: "#715262" }, { label: "Comments", value: d.posts.reduce((s, p) => s + p.comments, 0), max: 50, color: "#88A3AE" }, { label: "Shares", value: d.posts.reduce((s, p) => s + p.shares, 0), max: 50, color: "#BDCBCE" }, { label: "Saves", value: d.posts.reduce((s, p) => s + p.saves, 0), max: 50, color: "#BE5A5A" }].map((m) => (
                    <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 72, fontSize: 13, fontWeight: 500 }}>{m.label}</div>
                      <div style={{ flex: 1, height: 10, background: "#F1E4DC", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: `${(Math.max(m.value, 0.5) / m.max) * 100}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.2s ease" }} />
                      </div>
                      <div className="display-num" style={{ width: 30, textAlign: "right" as const }}>{m.value}</div>
                    </div>
                  ))}
                </div>
                <div className="alert-box danger-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>▲ Zero saves is the #1 gap — create bookmark-worthy content</span></div>
              </div>
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
