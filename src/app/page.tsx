"use client";
import { useState } from "react";

/* =====================================================================
   onDiem Decision Engine — May 2026
   Executive Report. Brand-compliant per FY25 Brand Guidelines.
   Reporting period: April 21 – May 21, 2026
   ===================================================================== */

const B = {
  // Primary
  cream: "#FFFAF5",
  navy: "#2A3B58",
  navyDeep: "#003A50",

  // Secondary
  teal: "#7FCFD1",
  pink: "#F189B5",
  lavender: "#D08CE3",
  yellow: "#F2D97D",
  peach: "#F9B78E",
  sage: "#9DD4B5",

  // Tints (10% mixes for surfaces)
  tealTint: "#E5F3F4",
  pinkTint: "#FBE5EE",
  lavenderTint: "#F2E2F7",
  yellowTint: "#FBF3D9",
  peachTint: "#FCEAD9",
  sageTint: "#E5F2EA",

  // Text
  textBody: "#2A3B58",
  textSecondary: "#475569",
  textMuted: "#64748B",

  // Surfaces
  cardBg: "#FFFFFF",
  cardBorder: "rgba(42, 59, 88, 0.10)",
  cardBorderStrong: "rgba(42, 59, 88, 0.18)",
  divider: "rgba(42, 59, 88, 0.08)",
};

const FONT_SERIF = "'Tinos', Georgia, 'Times New Roman', serif";
const FONT_BODY = "'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif";

/* =====================================================================
   DATA
   ===================================================================== */

type Campaign = {
  id: string;
  name: string;
  audience: "Pro" | "Practice";
  group: "matching" | "recruitment" | "awareness" | "lifecycle";
  cadence?: string;
  delivered: number;
  open: number;
  click: number;
  ctr: number;
  reply?: number;
  unsub?: number;
  read?: number;
  skim?: number;
  glance?: number;
  deviceClicks?: { desktop: number; mobile: number; other: number };
  totalClicks?: number;
  uniqueClicks?: number;
  topClicked?: string;
  topEngaged?: string;
  note?: string;
  status?: string;
  statusColor?: string;
};

const CAMPAIGNS: Campaign[] = [
  {
    id: "pro-gold",
    name: "Pro Gold Match",
    audience: "Pro",
    group: "matching",
    cadence: "Thursdays",
    delivered: 2106,
    open: 36.7,
    click: 3.28,
    ctr: 8.93,
    reply: 0.14,
    unsub: 0.38,
    read: 15,
    skim: 0.3,
    glance: 84.8,
    deviceClicks: { desktop: 15, mobile: 85, other: 0 },
    totalClicks: 111,
    uniqueClicks: 69,
    topClicked: "app.ondiem.com/listing/* (55+ unique shift listings)",
    topEngaged: "Tiffany Bost (10), Bobbie Chambers, Justine Bons, Lindsey Hedberg",
    note: "Highest open rate in portfolio. Mobile-first. Clicks distributed across many shift listings — pros tap into the specific shifts that match their availability.",
    status: "Top performer",
    statusColor: B.teal,
  },
  {
    id: "practice-gold",
    name: "Practice Gold Match",
    audience: "Practice",
    group: "matching",
    cadence: "Wednesdays",
    delivered: 707,
    open: 16.12,
    click: 1.98,
    ctr: 12.28,
    reply: 0.14,
    unsub: 0.28,
    read: 26.5,
    skim: 17.7,
    glance: 55.8,
    deviceClicks: { desktop: 95, mobile: 5, other: 0 },
    totalClicks: 20,
    uniqueClicks: 14,
    topClicked: "Pro profile URLs + help.ondiem.com/knowledge",
    topEngaged: "ClearChoice (11 opens top), Aspen Dental (multiple contacts)",
    note: "Highest CTR among lifecycle emails. Desktop-first practice managers click into multiple pro profiles. Tech flag: example.com/* placeholders surfaced in click logs — template merge issue worth resolving.",
    status: "Best CTR",
    statusColor: B.teal,
  },
  {
    id: "pro-availability",
    name: "Pro Sharing Availability (to Practices)",
    audience: "Practice",
    group: "matching",
    delivered: 4589,
    open: 17,
    click: 1.33,
    ctr: 7.82,
    reply: 0.04,
    unsub: 0.13,
    read: 28.1,
    skim: 28.1,
    glance: 43.9,
    deviceClicks: { desktop: 98, mobile: 2, other: 0 },
    totalClicks: 117,
    uniqueClicks: 61,
    topClicked: "help.ondiem.com/knowledge (15), pro profiles, YouTube + social",
    topEngaged: "Tanasbourne Dental (19), Aspen Dental, Heartland Dental",
    note: "Highest read depth in portfolio (28.1% read + 28.1% skimmed = 56.2% active engagement). Practices use this for brand validation alongside specific-pro evaluation.",
    status: "Best read depth",
    statusColor: B.teal,
  },
  {
    id: "mnor-1",
    name: "MN/OR Recruitment — Email 1",
    audience: "Practice",
    group: "recruitment",
    delivered: 1265,
    open: 15.42,
    click: 0.47,
    ctr: 3.08,
    reply: 0.08,
    unsub: 4.43,
    read: 8.2,
    skim: 21,
    glance: 70.8,
    deviceClicks: { desktop: 88, mobile: 13, other: 0 },
    totalClicks: 8,
    uniqueClicks: 6,
    topClicked: "na2.hubs.ly (Version A won, 4 clicks)",
    topEngaged: "Maplewood Dental, plus UMN students on list",
    note: "4.43% unsub on first send signals list-quality issue.",
    status: "List quality flag",
    statusColor: B.pink,
  },
  {
    id: "mnor-2",
    name: "MN/OR Recruitment — Email 2",
    audience: "Practice",
    group: "recruitment",
    delivered: 1208,
    open: 10.84,
    click: 0.17,
    ctr: 1.53,
    reply: 0.08,
    unsub: 1.66,
    read: 11.5,
    skim: 8.5,
    glance: 80,
    deviceClicks: { desktop: 60, mobile: 40, other: 0 },
    totalClicks: 5,
    uniqueClicks: 2,
    topClicked: "na2.hubs.ly (Version B won)",
    note: "Subject: 'Try Your First Shift at 20% Off'",
    status: "In sequence",
    statusColor: B.peach,
  },
  {
    id: "mnor-3",
    name: "MN/OR Recruitment — Email 3",
    audience: "Practice",
    group: "recruitment",
    delivered: 1189,
    open: 10.68,
    click: 0.17,
    ctr: 1.57,
    reply: 0,
    unsub: 1.6,
    read: 8.5,
    skim: 20.2,
    glance: 71.3,
    deviceClicks: { desktop: 100, mobile: 0, other: 0 },
    totalClicks: 3,
    uniqueClicks: 2,
    topClicked: "Version A won (3 of 3 clicks)",
    note: "Subject: 'Dental Professionals Available Near You'",
    status: "In sequence",
    statusColor: B.peach,
  },
  {
    id: "mnor-4",
    name: "MN/OR Recruitment — Email 4",
    audience: "Practice",
    group: "recruitment",
    delivered: 1171,
    open: 9.99,
    click: 0,
    ctr: 0,
    reply: 0,
    unsub: 1.62,
    read: 7.8,
    skim: 21.6,
    glance: 70.7,
    deviceClicks: { desktop: 0, mobile: 0, other: 0 },
    totalClicks: 0,
    uniqueClicks: 0,
    topClicked: "—",
    note: "Zero clicks. Engagement floor. Email 5 pending.",
    status: "Engagement floor",
    statusColor: B.pink,
  },
  {
    id: "q2-pro",
    name: "Q2 New Features — Pro",
    audience: "Pro",
    group: "awareness",
    delivered: 9446,
    open: 8.92,
    click: 0.11,
    ctr: 1.19,
    reply: 0.01,
    unsub: 0.08,
    read: 0.5,
    skim: 20.1,
    glance: 79.4,
    deviceClicks: { desktop: 0, mobile: 100, other: 0 },
    totalClicks: 10,
    uniqueClicks: 10,
    topClicked: "help.ondiem.com/knowledge (4), ondiem.com (3)",
    note: "Sent April 29. Largest reach in program. Informational broadcast.",
    status: "Broadcast",
    statusColor: B.yellow,
  },
  {
    id: "q2-practice",
    name: "Q2 New Features — Practice",
    audience: "Practice",
    group: "awareness",
    delivered: 2226,
    open: 13.3,
    click: 0.09,
    ctr: 0.68,
    reply: 0.04,
    unsub: 0.81,
    read: 15.9,
    skim: 33.1,
    glance: 51,
    deviceClicks: { desktop: 100, mobile: 0, other: 0 },
    totalClicks: 2,
    uniqueClicks: 2,
    topClicked: "ondiem.com, help.ondiem.com",
    note: "Sent April 29. Aspen contacts dominate engaged list.",
    status: "Broadcast",
    statusColor: B.yellow,
  },
  /* ----- May 2026: Practice Gift Cards Campaign ----- */
  {
    id: "gc-atlanta-a",
    name: "GC Promo Atlanta $50 (A) — Cover May gaps",
    audience: "Practice",
    group: "lifecycle",
    delivered: 2155,
    open: 10.16,
    click: 0.28,
    ctr: 2.74,
    reply: 0,
    unsub: 1.35,
    read: 17.5,
    skim: 10.6,
    glance: 71.9,
    deviceClicks: { desktop: 83, mobile: 17, other: 0 },
    totalClicks: 6,
    uniqueClicks: 6,
    topClicked: "ondiem.com/practices, na2.hubs.ly, social media",
    topEngaged: "Heartland Dental (4 of 6 clickers)",
    note: "Largest send in city test. Highest bounce (3.92%) + unsub (1.35%) of any city variant. $50 incentive.",
    status: "0 redemptions",
    statusColor: B.pink,
  },
  {
    id: "gc-chicago-b",
    name: "GC Promo Chicago $50 (B) — W-2 pros standing by",
    audience: "Practice",
    group: "lifecycle",
    delivered: 788,
    open: 10.53,
    click: 0.13,
    ctr: 1.2,
    reply: 0.13,
    unsub: 1.02,
    read: 15.7,
    skim: 13.3,
    glance: 71.1,
    deviceClicks: { desktop: 100, mobile: 0, other: 0 },
    totalClicks: 1,
    uniqueClicks: 1,
    topClicked: "ondiem.com/ (homepage only)",
    topEngaged: "Wendi Knight, Heartland — sole clicker",
    note: "Lowest CTR of any city variant. $50 incentive did not outperform $25 cities.",
    status: "0 redemptions",
    statusColor: B.pink,
  },
  {
    id: "gc-miami-b",
    name: "GC Promo Miami $25 (B) — One shift, one promo code",
    audience: "Practice",
    group: "lifecycle",
    delivered: 1716,
    open: 11.54,
    click: 0.52,
    ctr: 4.55,
    reply: 0,
    unsub: 1.17,
    read: 18.9,
    skim: 10.2,
    glance: 70.9,
    deviceClicks: { desktop: 85, mobile: 15, other: 0 },
    totalClicks: 13,
    uniqueClicks: 9,
    topClicked: "ondiem.com/, ondiem.com/practices, hub.ondiem.com/",
    topEngaged: "MyDentalMail (3 clicks), Heartland, ClearChoice",
    note: "Highest CTR among broad-list city variants. $25 incentive.",
    status: "0 redemptions",
    statusColor: B.pink,
  },
  {
    id: "gc-houston-a",
    name: "GC Promo Houston $25 (A) — One shift, $25 back",
    audience: "Practice",
    group: "lifecycle",
    delivered: 817,
    open: 10.28,
    click: 0.37,
    ctr: 3.57,
    reply: 0,
    unsub: 0.86,
    read: 33.3,
    skim: 7.1,
    glance: 59.5,
    deviceClicks: { desktop: 100, mobile: 0, other: 0 },
    totalClicks: 4,
    uniqueClicks: 3,
    topClicked: "Twitter, hub.ondiem.com, ondiem.com/practices",
    topEngaged: "All 3 clickers from Heartland + Aspen",
    note: "Highest read depth in entire dataset (33.3%). $25 incentive.",
    status: "0 redemptions",
    statusColor: B.pink,
  },
  {
    id: "email4-practice-leads",
    name: "Email 4 — Practice Leads in Target Areas",
    audience: "Practice",
    group: "lifecycle",
    delivered: 2950,
    open: 5.36,
    click: 0.78,
    ctr: 14.37,
    reply: 0,
    unsub: 0.81,
    read: 0,
    skim: 0,
    glance: 0,
    deviceClicks: { desktop: 0, mobile: 0, other: 0 },
    totalClicks: 0,
    uniqueClicks: 0,
    topClicked: "—",
    topEngaged: "Practice leads (cold prospects)",
    note: "Highest CTR among broad-volume sends. 5.05% bounce rate flagged high — CRM cleanup plan in motion for cold lead lists.",
    status: "Engagement, no conversion",
    statusColor: B.peach,
  },
  /* ----- Email 5 — Dormant practices (Practice User, no shifts + completed profiles) ----- */
  {
    id: "email5-dormant-atlanta",
    name: "Email 5 Atlanta $50 — Dormant practices",
    audience: "Practice",
    group: "lifecycle",
    delivered: 769,
    open: 7.04,
    click: 0.73,
    ctr: 10.42,
    reply: 0,
    unsub: 0.73,
    deviceClicks: { desktop: 0, mobile: 0, other: 0 },
    totalClicks: 6,
    uniqueClicks: 0,
    topClicked: "RDH profiles with most available dates (3 different professionals)",
    topEngaged: "Dormant practices — sent May 21",
    note: "Highest CTR of any Email 5 send. Dormant practices clicking through to specific RDH profiles — conversion-adjacent product action.",
    status: "Methodology win",
    statusColor: B.sage,
  },
  {
    id: "email5-dormant-chicago",
    name: "Email 5 Chicago $50 — Dormant practices",
    audience: "Practice",
    group: "lifecycle",
    delivered: 1056,
    open: 9.35,
    click: 0.43,
    ctr: 4.65,
    reply: 0,
    unsub: 0.96,
    deviceClicks: { desktop: 0, mobile: 0, other: 0 },
    totalClicks: 5,
    uniqueClicks: 0,
    topClicked: "RDH and DA with most available dates",
    topEngaged: "Dormant practices — sent May 21",
    note: "Largest dormant list. Product-meaningful clicks on most-available-dates pro profiles. $50 incentive.",
    status: "Active engagement",
    statusColor: B.sage,
  },
  {
    id: "email5-dormant-miami",
    name: "Email 5 Miami $25 — Dormant practices",
    audience: "Practice",
    group: "lifecycle",
    delivered: 272,
    open: 9.02,
    click: 0.39,
    ctr: 4.35,
    reply: 0,
    unsub: 2.25,
    deviceClicks: { desktop: 0, mobile: 0, other: 0 },
    totalClicks: 1,
    uniqueClicks: 0,
    topClicked: "onDiem website (generic)",
    topEngaged: "Dormant practices — sent May 21",
    note: "Smaller list. Generic site click rather than pro-profile selection — less specific engagement than Atlanta/Chicago.",
    status: "Light engagement",
    statusColor: B.peach,
  },
  {
    id: "email5-dormant-houston",
    name: "Email 5 Houston $25 — Dormant practices",
    audience: "Practice",
    group: "lifecycle",
    delivered: 324,
    open: 7.74,
    click: 0,
    ctr: 0,
    reply: 0,
    unsub: 0.97,
    deviceClicks: { desktop: 0, mobile: 0, other: 0 },
    totalClicks: 0,
    uniqueClicks: 0,
    topClicked: "—",
    topEngaged: "Dormant practices — sent May 21",
    note: "Lowest engagement of dormant sends. $25 incentive did not produce click activity in this market.",
    status: "Opens, no clicks",
    statusColor: B.peach,
  },
  /* ----- Email 5 — Active practices (Active Practice User + completed profiles) ----- */
  {
    id: "email5-active-atlanta",
    name: "Email 5 Atlanta $50 — Active practices",
    audience: "Practice",
    group: "lifecycle",
    delivered: 48,
    open: 17.78,
    click: 0,
    ctr: 0,
    reply: 0,
    unsub: 0,
    deviceClicks: { desktop: 0, mobile: 0, other: 0 },
    totalClicks: 0,
    uniqueClicks: 0,
    topClicked: "—",
    topEngaged: "Active practices with shifts posted — sent May 20",
    note: "Highest open rate of any Email 5 send. Active practices opened but did not click — they already have shifts posted, so the offer is informational rather than actionable.",
    status: "Engagement signal",
    statusColor: B.sage,
  },
  {
    id: "email5-active-chicago",
    name: "Email 5 Chicago $50 — Active practices",
    audience: "Practice",
    group: "lifecycle",
    delivered: 125,
    open: 12.50,
    click: 0,
    ctr: 0,
    reply: 0,
    unsub: 0,
    deviceClicks: { desktop: 0, mobile: 0, other: 0 },
    totalClicks: 0,
    uniqueClicks: 0,
    topClicked: "—",
    topEngaged: "Active practices with shifts posted — sent May 20",
    note: "Same pattern as Atlanta active: strong opens, zero clicks. Active practices engaged with the message but had no incentive to act.",
    status: "Engagement signal",
    statusColor: B.sage,
  },
  {
    id: "email5-active-houston",
    name: "Email 5 Houston $25 — Active practices",
    audience: "Practice",
    group: "lifecycle",
    delivered: 43,
    open: 11.63,
    click: 0,
    ctr: 0,
    reply: 0,
    unsub: 0,
    deviceClicks: { desktop: 0, mobile: 0, other: 0 },
    totalClicks: 0,
    uniqueClicks: 0,
    topClicked: "—",
    topEngaged: "Active practices with shifts posted — sent May 21",
    note: "Smallest active list. Consistent pattern across active segments: opens without clicks.",
    status: "Engagement signal",
    statusColor: B.sage,
  },
  {
    id: "email5-active-miami",
    name: "Email 5 Miami $25 — Active practices",
    audience: "Practice",
    group: "lifecycle",
    delivered: 0,
    open: 0,
    click: 0,
    ctr: 0,
    reply: 0,
    unsub: 0,
    deviceClicks: { desktop: 0, mobile: 0, other: 0 },
    totalClicks: 0,
    uniqueClicks: 0,
    topClicked: "—",
    topEngaged: "—",
    note: "Send pending. Data will populate next reporting cycle.",
    status: "Pending send",
    statusColor: B.peach,
  },
  {
    id: "sellersburg-recruitment",
    name: "Pro Lead Recruitment — Sellersburg, IN",
    audience: "Pro",
    group: "recruitment",
    delivered: 17,
    open: 0,
    click: 0,
    ctr: 0,
    reply: 0,
    unsub: 5.88,
    deviceClicks: { desktop: 0, mobile: 0, other: 0 },
    totalClicks: 0,
    uniqueClicks: 0,
    topClicked: "—",
    topEngaged: "—",
    note: "10.53% hard bounce. Zero human opens in 24 hours. Lead-source quality issue identified — contacts excluded from future sends.",
    status: "List quality flag",
    statusColor: B.pink,
  },
];

/* Lifecycle programs (smaller campaigns + non-PDF data from summary doc) */
const LIFECYCLE_PROGRAMS = [
  {
    name: "Practice Reactivation — Gift Card Promo",
    markets: "Atlanta, Chicago, Miami, Houston",
    test: "$25 / $50 gift cards, Apr 21 – May 31",
    enrolled: 11623,
    companies: 678,
    open: 8.88,
    click: 0.50,
    redemptions: 0,
    shifts: 3,
    status: "Dual-segment refinement in flight",
    color: B.pink,
  },
  {
    name: "Activation Pros",
    cohort: "High-shift markets, low eligible pros",
    enrolled: 349,
    cadence: "Biweekly enrollment",
    finding: "Increase in opens on Messages A and B; first-email click rate up. Messages A/B/C delivered to 349/323/321 with opens 20.54% / 18.89% / 18.07%.",
    status: "A/B in flight",
    color: B.sage,
  },
  {
    name: "Reactivation Pros",
    cohort: "3 follow-up emails to last-sprint single-send recipients",
    enrolled: 202,
    cadence: "Biweekly enrollment",
    finding: 'Higher CTR across all 3 emails. Email 2 peaked at 31.5% open / 5% click. Top buttons: "View Shifts in Your Area" 4.95%, "Browse Shifts" 5%.',
    status: "Performing",
    color: B.sage,
  },
  {
    name: "SMS Profile Completion Test",
    cohort: "Hygienists + Assistants with 2+ available dates, incomplete profiles",
    enrolled: 75,
    cadence: "One-time pilot (75 of 105 pros reached)",
    finding: "Surfaced widespread incomplete profiles (missing photos, bios, work history, credentials) and weekend-only-availability pros — excluded from supply pools since most practices close weekends.",
    status: "Test active",
    color: B.lavender,
  },
];

const CURRENT_INITIATIVES = [
  {
    title: "Gift Card Promo — Dual-segment refinement",
    color: B.sage,
    body: "Email 5 evolved into a dual-segment send across all four cities — dormant practices (Practice Users, no shifts + completed pro profiles) and active practices (Active Practice Users + completed pro profiles). Atlanta dormant produced 10.42% CTR — highest of any Email 5 send — with three different RDH profiles selected. Active segments opened at 11.6–17.8% (Atlanta peak) without clicking. Mailer continues through July; Miami active send still pending.",
    meta: "2,637 Round 2 sends across 8 emails · 0 promo code redemptions to date",
  },
  {
    title: "ADA Member List — Three-pillar play",
    color: B.lavender,
    body: "Identification (ADA × onDiem overlap) → Integration (auto-link membership) → Communication (dual-benefit announce). ada_partnership_2025 campaign active. /ada-email link (43 clean clicks, fully UTM-tagged) is the attributable engagement signal — broader ShortLink traffic shows substantial non-attributable noise to address.",
    meta: "Owners: Dee, Kyle · Active in market",
  },
  {
    title: "Aspen Engagement Work",
    color: B.peach,
    body: "Continued enrollment activity for Activation + Reactivation cohorts in Aspen markets. Aspen Dental contacts are the most consistently engaged DSO across all lifecycle emails — surfacing across Practice Gold, Pro Sharing Availability, and all four Gift Card Promo city variants.",
    meta: "Cross-program signal",
  },
  {
    title: "Student Discount Pilot — Knoxville, TN",
    color: B.sage,
    body: "Targeting ~900 May graduates with a shareable code that incentivizes practices to book new grads. Bridges practice preference for experience vs. student barrier-to-first-shift. Launching with structured onboarding + nurture workflow.",
    meta: "Launch ~2 weeks",
  },
  {
    title: "1099 Practice & Pro Surveys",
    color: B.lavender,
    body: "Cohorts identified: DA No Account (1099 Survey) — 828 · RDH No Account (1099 Survey) — 59,722. Goal: understand how customers and non-customers search for and choose pros/practices. Awaiting approval and list-send setup.",
    meta: "DAs 828 · RDHs 59,722 · awaiting approval",
  },
  {
    title: "Sellersburg, IN Pro Recruitment Pilot",
    color: B.pink,
    body: "Geo-fenced RDH outreach within 25 miles of confirmed shift availability ($45/hr, Mon–Thu through Dec 2026). Targeting hypothesis sound; lead-source data quality undermined the test (10.53% bounce, 0% bot-excluded opens). Contacts excluded from future sends; cleaner lead source required for re-test.",
    meta: "List quality flag · 17 delivered, 0 opens",
  },
];

const FUTURE_INITIATIVES = [
  {
    title: "Darby Targeted Audience",
    color: B.peach,
    body: "Recruitment emails. First draft complete; Figment writing copy. Targeted Darby customer audience.",
  },
  {
    title: "Aspen Geographic Expansion",
    color: B.sage,
    body: "Additional enrollments for Activation + Reactivation in 5 new markets: Augusta ME (21 shifts, $78.10/hr avg), Biddeford ME (13 shifts, $73.85/hr), San Luis Obispo CA (8 shifts, $30/hr), Middlesboro KY (8 shifts, $18/hr), West Saint Paul MN (8 shifts, $73/hr). Learning: awareness-only emails didn't move pros — incentive layer being scoped.",
  },
  {
    title: "Workforce OS Launch",
    color: B.lavender,
    body: "onDiem Workforce OS go-to-market. Originally scoped for June 1 — timeline now being rescoped, tentative Q2/early Q3. Allison + Beth connecting on GTM plan.",
  },
  {
    title: "Pro Profile Completion — Expanded",
    color: B.teal,
    body: "Expanding beyond the 4 target cities to any pro with availability for the next 30 days. Two workflows in motion. Awaiting email + SMS approval to set live.",
  },
  {
    title: "CDHA Event Post-Comms",
    color: B.yellow,
    body: "Post-event communications for the Canadian Dental Hygienists Association event. Planning underway.",
  },
  {
    title: "Improved Workflow for Event Leads",
    color: B.peach,
    body: "External awareness initiative identified in the 5/18 strategy review. Work planning underway to streamline event-sourced lead handoff to active campaigns.",
  },
  {
    title: "Dormant Practice Survey",
    color: B.lavender,
    body: "1-question survey to large dormant practice user segment to understand reasons for inactivity.",
  },
  {
    title: "Pro 'Shift Decline Feedback' Mechanism",
    color: B.teal,
    body: "Proposed addition to Pro Gold Match flow: when pros decline a matching shift, surface a short reason (rate too low / distance too far / details insufficient / role mismatch). Closes the data gap on the engagement-to-booking conversion question.",
  },
];

const STRATEGIC_NOTES = [
  {
    title: "Engagement is healthy; conversion is the bottleneck",
    body: "Pro Gold Match opens at 36.7% (highest in portfolio); Practice Gold Match clicks through at 12.28% (best CTR among lifecycle). Pros see matching shifts. Practices click into matching pros. The handoff between 'I saw something good' and 'I posted/booked' is where the funnel leaks — on both sides of the marketplace.",
  },
  {
    title: "Dual-segment refinement is the proven playbook",
    body: "Email 5 evolved into a dual-segment send across all four cities — dormant practices (no shifts + completed pro profiles) measured by clicks-to-product, active practices (with shifts posted + completed pro profiles) measured by open-rate engagement. Atlanta dormant produced 10.42% CTR — highest of any Email 5 send — with three different RDH profiles selected. The two segments need two success metrics: dormant audiences move on offers; active audiences confirm engagement without needing to act.",
  },
  {
    title: "DSO concentration in promo engagement",
    body: "Heartland Dental accounts for 58% of all Gift Card Promo click engagement across the four broad-list city variants. Aspen Dental is the most consistently engaged DSO across all lifecycle emails. Combined with ClearChoice and Imagen, the DSO segment is doing the work the campaign was designed to do — independents under-index in promo response.",
  },
  {
    title: "Incentive amount is not the variable doing the work",
    body: "$25 city variants (Miami + Houston) combined to 12 clicks at 0.46% click rate. $50 city variants (Atlanta + Chicago) combined to 7 clicks at 0.23% click rate. Doubling the gift card amount did not double engagement — it halved it. Zero redemptions across both incentive tiers. Variable elsewhere.",
  },
  {
    title: "Pros mobile, Practices desktop — pattern persists",
    body: "Pro Gold clicks 85% mobile, Pro Sharing Availability clicks 98% desktop, Practice Gold clicks 95% desktop. Paid acquisition impressions across all four cities skew 81% mobile — suggesting prospects encounter onDiem on phones, while active practice operations contacts work from desktop. The journey crosses device boundaries.",
  },
  {
    title: "Shift count is the priority lever to lift",
    body: "Engagement metrics on the matching emails are strong, but Pro Gold Match views are not translating to requests. The proposed 'why doesn't this shift work for you' feedback mechanism would close the data gap. Marketing is producing demand signal — supply availability and matching velocity are the upstream constraints to address.",
  },
];

/* =====================================================================
   PARTNERSHIPS — ADA
   ===================================================================== */

type LinkRow = { name: string; clicks: number };
type DailyPoint = { date: string; clicks: number };
type MonthlyPoint = { month: string; clicks: number };

const ADA_30DAY = {
  range: "April 21 – May 22, 2026",
  totalClicks: 924,
  humanClicks: 807,
  topLinks: [
    { name: "/ada-website", clicks: 76 },
    { name: "/ada-email", clicks: 43 },
    { name: "/onDiem-youtube", clicks: 6 },
    { name: "/ada-member-advantage", clicks: 3 },
    { name: "/darby-ondiem-ada", clicks: 1 },
  ] as LinkRow[],
  daily: [
    { date: "2026-04-21", clicks: 7 },
    { date: "2026-04-22", clicks: 6 },
    { date: "2026-04-23", clicks: 14 },
    { date: "2026-04-24", clicks: 5 },
    { date: "2026-04-25", clicks: 3 },
    { date: "2026-04-26", clicks: 5 },
    { date: "2026-04-27", clicks: 2 },
    { date: "2026-04-28", clicks: 7 },
    { date: "2026-04-29", clicks: 14 },
    { date: "2026-04-30", clicks: 13 },
    { date: "2026-05-01", clicks: 5 },
    { date: "2026-05-02", clicks: 7 },
    { date: "2026-05-03", clicks: 2 },
    { date: "2026-05-04", clicks: 4 },
    { date: "2026-05-05", clicks: 4 },
    { date: "2026-05-06", clicks: 16 },
    { date: "2026-05-07", clicks: 8 },
    { date: "2026-05-08", clicks: 1 },
    { date: "2026-05-09", clicks: 3 },
    { date: "2026-05-10", clicks: 417 },
    { date: "2026-05-11", clicks: 20 },
    { date: "2026-05-12", clicks: 20 },
    { date: "2026-05-13", clicks: 28 },
    { date: "2026-05-14", clicks: 22 },
    { date: "2026-05-15", clicks: 9 },
    { date: "2026-05-16", clicks: 18 },
    { date: "2026-05-17", clicks: 16 },
    { date: "2026-05-18", clicks: 53 },
    { date: "2026-05-19", clicks: 3 },
    { date: "2026-05-20", clicks: 5 },
    { date: "2026-05-21", clicks: 0 },
  ] as DailyPoint[],
  topCountries: [
    { name: "United States", clicks: 90 },
    { name: "Spain", clicks: 44 },
    { name: "Germany", clicks: 14 },
    { name: "The Netherlands", clicks: 10 },
    { name: "Canada", clicks: 1 },
  ] as LinkRow[],
};

const ADA_LIFETIME = {
  range: "June 9, 2025 – April 29, 2026",
  totalClicks: 9415,
  humanClicks: 7721,
  shortUrls: 11,
  monthlyAvg: 926,
  topLinks: [
    { name: "/ada-email", clicks: 6822 },
    { name: "/ada-website", clicks: 1536 },
    { name: "/andyrdh-wcemail", clicks: 162 },
    { name: "/darby-ondiem-ada", clicks: 50 },
    { name: "/ada-member-advantage", clicks: 9 },
    { name: "/onDiem-youtube", clicks: 2 },
  ] as LinkRow[],
  monthly: [
    { month: "Jun '25", clicks: 562 },
    { month: "Jul '25", clicks: 946 },
    { month: "Aug '25", clicks: 267 },
    { month: "Sep '25", clicks: 839 },
    { month: "Oct '25", clicks: 233 },
    { month: "Nov '25", clicks: 210 },
    { month: "Dec '25", clicks: 820 },
    { month: "Jan '26", clicks: 2477 },
    { month: "Feb '26", clicks: 103 },
    { month: "Mar '26", clicks: 176 },
    { month: "Apr '26", clicks: 1086 },
  ] as MonthlyPoint[],
  topOS: [
    { name: "Windows", clicks: 5625 },
    { name: "Android", clicks: 1301 },
    { name: "Mac OS", clicks: 705 },
    { name: "iOS", clicks: 687 },
    { name: "Linux", clicks: 259 },
  ] as LinkRow[],
  topBrowsers: [
    { name: "Chrome", clicks: 5691 },
    { name: "Chrome Mobile", clicks: 789 },
    { name: "Mobile Safari", clicks: 568 },
    { name: "Facebook", clicks: 383 },
    { name: "Edge", clicks: 333 },
    { name: "Safari", clicks: 272 },
  ] as LinkRow[],
  topCountries: [
    { name: "United States", clicks: 8056 },
    { name: "United Kingdom", clicks: 116 },
    { name: "China", clicks: 58 },
    { name: "India", clicks: 50 },
    { name: "Canada", clicks: 46 },
  ] as LinkRow[],
};

/* =====================================================================
   PAID ACQUISITION — Google Ads / Practice Reactivation Campaign
   May 2026 (through May 26) — refreshed campaign window across 4 cities
   ===================================================================== */

type AdCity = {
  city: string;
  incentive: "$25" | "$50";
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  impressionShare: number;
  topOfPageRate: number;
  color: string;
};

const AD_CITIES: AdCity[] = [
  {
    city: "Atlanta",
    incentive: "$50",
    spend: 429.61,
    impressions: 934,
    clicks: 55,
    ctr: 5.89,
    cpc: 7.81,
    conversions: 0,
    impressionShare: 48.40,
    topOfPageRate: 82.90,
    color: B.peach,
  },
  {
    city: "Chicago",
    incentive: "$50",
    spend: 525.31,
    impressions: 4526,
    clicks: 155,
    ctr: 3.42,
    cpc: 3.39,
    conversions: 0,
    impressionShare: 14.82,
    topOfPageRate: 71.37,
    color: B.lavender,
  },
  {
    city: "Miami",
    incentive: "$25",
    spend: 222.87,
    impressions: 1882,
    clicks: 92,
    ctr: 4.89,
    cpc: 2.42,
    conversions: 0,
    impressionShare: 18.90,
    topOfPageRate: 72.36,
    color: B.teal,
  },
  {
    city: "Houston",
    incentive: "$25",
    spend: 434.14,
    impressions: 4066,
    clicks: 185,
    ctr: 4.55,
    cpc: 2.35,
    conversions: 0,
    impressionShare: 17.02,
    topOfPageRate: 73.27,
    color: B.sage,
  },
];

const AD_AGGREGATE = {
  spend: 1611.93,
  impressions: 11408,
  clicks: 487,
  conversions: 0,
  ctr: 4.27,
  cpc: 3.31,
  activeDays: 14,
  network: { googleSearch: 0.85, searchPartners: 0.15 }, // share of clicks
};

const AD_DEMOGRAPHICS_AGGREGATE = {
  // Blended across cities, weighted by impressions (% of known-demographic total)
  gender: { female: 74, male: 26 },
  age: [
    { name: "25-34", clicks: 31 },
    { name: "18-24", clicks: 20 },
    { name: "35-44", clicks: 18 },
    { name: "45-54", clicks: 16 },
    { name: "55-64", clicks: 10 },
    { name: "65+", clicks: 4 },
  ] as LinkRow[],
};

const AD_DEVICE_BLENDED = {
  mobile: { impressions: 9199, clicks: 405, share: 81 },
  desktop: { impressions: 2096, clicks: 76, share: 18 },
  tablet: { impressions: 113, clicks: 6, share: 1 },
};

const AD_DAY_PATTERN: LinkRow[] = [
  { name: "Monday", clicks: 1838 },
  { name: "Wednesday", clicks: 1723 },
  { name: "Sunday", clicks: 1658 },
  { name: "Tuesday", clicks: 1654 },
  { name: "Thursday", clicks: 1635 },
  { name: "Friday", clicks: 1504 },
  { name: "Saturday", clicks: 1396 },
];

const AD_HOUR_PEAK: LinkRow[] = [
  { name: "10 AM", clicks: 868 },
  { name: "11 AM", clicks: 721 },
  { name: "9 AM", clicks: 707 },
  { name: "12 PM", clicks: 675 },
  { name: "1 PM", clicks: 658 },
  { name: "8 AM", clicks: 653 },
];

const AD_TOP_SEARCH_QUERIES: LinkRow[] = [
  { name: "indigo dental staffing (Atlanta competitor)", clicks: 7 },
  { name: "dental assistant jobs (Houston)", clicks: 7 },
  { name: "dental post jobs (Atlanta competitor)", clicks: 5 },
  { name: "jobs in houston texas", clicks: 4 },
  { name: "dental staffing (Atlanta)", clicks: 3 },
  { name: "dental assistant jobs houston", clicks: 3 },
  { name: "dental assistant jobs miami", clicks: 2 },
  { name: "go tu (Miami competitor query)", clicks: 1 },
];

const AD_AUCTION_COMPETITORS: LinkRow[] = [
  { name: "onDiem (You) — blended", clicks: 0 }, // placeholder; will render impression share %
  { name: "Indeed.com", clicks: 0 },
  { name: "DentalPost", clicks: 0 },
  { name: "GoTu", clicks: 0 },
  { name: "Heartland", clicks: 0 },
  { name: "Job-Medley", clicks: 0 },
  { name: "Aspen Dental", clicks: 0 },
  { name: "Cloud Dentistry", clicks: 0 },
];

/* =====================================================================
   WEBSITES — Property-level analytics
   Built to accommodate multiple properties; in-platform site is the first.
   Marketing site, microsites, and partner pages slot in alongside.
   ===================================================================== */

type SourceRow = { source: string; medium: string; sessions: number; sharePct: number };
type EventRow = { name: string; events: number; sharePct: number; activeUsers: number };
type PageRow = { path: string; views: number; sharePct: number; activeUsers: number };
type LandingRow = { path: string; sessions: number; sharePct: number; bounceRate: number };

const PLATFORM_SITE = {
  id: "platform",
  name: "onDiem Platform",
  subtitle: "Authenticated · logged-in user activity",
  url: "app.ondiem.com",
  range: "April 1 – May 21, 2026",
  status: "Live" as const,
  // Headline metrics with prior-period delta
  metrics: {
    activeUsers: { value: 40500, display: "40.5K", delta: -44.4 },
    newUsers: { value: 36700, display: "36.7K", delta: -45.6 },
    pageviewsPerUser: { value: 11.8, display: "11.8", delta: 33.2 },
    engagementTime: { value: 100, display: "1:40", delta: 82.0 }, // value in seconds
    pctEngaged: { value: 93, display: "93%", delta: -3.7 },
    newUserPct: { value: 80, display: "80%", delta: -8.4 },
  },
  trafficSources: [
    { source: "(direct)", medium: "(none)", sessions: 42367, sharePct: 58.8 },
    { source: "google", medium: "cpc", sessions: 10478, sharePct: 14.5 },
    { source: "ondiem", medium: "website_internal", sessions: 9647, sharePct: 13.4 },
    { source: "google", medium: "organic", sessions: 3469, sharePct: 4.8 },
    { source: "(not set)", medium: "(not set)", sessions: 2271, sharePct: 3.2 },
    { source: "ondiem", medium: "(not set)", sessions: 784, sharePct: 1.1 },
    { source: "ondiem_pro", medium: "website_internal", sessions: 770, sharePct: 1.1 },
    { source: "bing", medium: "organic", sessions: 542, sharePct: 0.8 },
    { source: "hs_email", medium: "email", sessions: 420, sharePct: 0.6 },
  ] as SourceRow[],
  topEvents: [
    { name: "page_view", events: 476434, sharePct: 42.2, activeUsers: 40368 },
    { name: "temp_shift_offered", events: 252196, sharePct: 22.4, activeUsers: 89 },
    { name: "scroll", events: 100927, sharePct: 8.9, activeUsers: 38350 },
    { name: "session_start", events: 69902, sharePct: 6.2, activeUsers: 39847 },
    { name: "first_visit", events: 36955, sharePct: 3.3, activeUsers: 36685 },
    { name: "user_engagement", events: 32937, sharePct: 2.9, activeUsers: 6999 },
    { name: "temp_shift_viewed", events: 23948, sharePct: 2.1, activeUsers: 9439 },
    { name: "job_search_initiated", events: 15784, sharePct: 1.4, activeUsers: 4732 },
    { name: "practice_navigation_bar", events: 13604, sharePct: 1.2, activeUsers: 1169 },
  ] as EventRow[],
  topPages: [
    { path: "/login", views: 34927, sharePct: 7.3, activeUsers: 9571 },
    { path: "/results", views: 31396, sharePct: 6.6, activeUsers: 5770 },
    { path: "/my-jobs", views: 23045, sharePct: 4.8, activeUsers: 2664 },
    { path: "/search", views: 21966, sharePct: 4.6, activeUsers: 5540 },
    { path: "/employee-portal", views: 16581, sharePct: 3.5, activeUsers: 1821 },
    { path: "/dashboard", views: 15915, sharePct: 3.3, activeUsers: 3298 },
    { path: "/administrator", views: 14149, sharePct: 3.0, activeUsers: 35 },
    { path: "/timesheets", views: 13046, sharePct: 2.7, activeUsers: 1169 },
    { path: "/registration", views: 6335, sharePct: 1.3, activeUsers: 1639 },
  ] as PageRow[],
  device: { desktop: 72.2, mobile: 27.6, tablet: 0.2 },
  landingPages: [
    { path: "(not set)", sessions: 5870, sharePct: 8, bounceRate: 99.2 },
    { path: "/login", sessions: 2779, sharePct: 4, bounceRate: 3.4 },
    { path: "/my-jobs?filter=requests-and-offers", sessions: 2191, sharePct: 3, bounceRate: 3.7 },
    { path: "/search", sessions: 1298, sharePct: 2, bounceRate: 4.7 },
    { path: "/account/payment-history", sessions: 1029, sharePct: 1, bounceRate: 0.8 },
    { path: "/dashboard", sessions: 779, sharePct: 1, bounceRate: 8.6 },
    { path: "(blank)", sessions: 775, sharePct: 1, bounceRate: 100.0 },
    { path: "/employee-portal", sessions: 757, sharePct: 1, bounceRate: 1.6 },
    { path: "/", sessions: 479, sharePct: 1, bounceRate: 2.7 },
  ] as LandingRow[],
  // Cross-reference: Google CPC-driven events (from detailed source/medium table)
  paidDrivenEvents: [
    { name: "job_search_initiated", clicks: 3764 },
    { name: "temp_shift_viewed", clicks: 1903 },
    { name: "professional_sign_in", clicks: 1623 },
    { name: "professional_nav_dropdown", clicks: 1498 },
    { name: "practice_nav_bar_listing", clicks: 1068 },
    { name: "practice_sign_in", clicks: 1025 },
    { name: "registration_page_viewed", clicks: 860 },
  ] as LinkRow[],
};

/* Public marketing site — ondiem.com */
type PubTrafficRow = { source: string; device: string; views: number; sessionsPerUser: number; avgSession: string; eventsPerUser: number };
type PubPageRow = { path: string; device: string; views: number; sessionsPerUser: number; avgSession: string; eventsPerUser: number; flag?: "engagement-standout" | "partner-page" };
type ChannelRow = { name: string; sharePct: number };
type PartnerPageRow = { page: string; views: number; avgSession: string; note: string; color: string };
type ReferrerRow = { name: string; visits: number; note: string };

const PUBLIC_SITE = {
  id: "public",
  name: "onDiem Public Marketing Site",
  subtitle: "Public-facing site · unauthenticated visitors",
  url: "ondiem.com",
  range: "April 1 – May 21, 2026",
  status: "Live" as const,
  channels: [
    { name: "Organic Search", sharePct: 53.9 },
    { name: "Direct", sharePct: 41.2 },
    { name: "Other (Referral, Paid, Social, Email)", sharePct: 4.9 },
  ] as ChannelRow[],
  device: { mobile: 59.4, desktop: 40.1, tablet: 0.5 },
  trafficSources: [
    { source: "Organic Search", device: "mobile", views: 9521, sessionsPerUser: 1.45, avgSession: "1:25", eventsPerUser: 8.42 },
    { source: "Direct", device: "mobile", views: 4853, sessionsPerUser: 1.56, avgSession: "1:16", eventsPerUser: 8.63 },
    { source: "Direct", device: "desktop", views: 4284, sessionsPerUser: 1.37, avgSession: "1:21", eventsPerUser: 6.96 },
    { source: "Organic Search", device: "desktop", views: 4269, sessionsPerUser: 1.74, avgSession: "2:31", eventsPerUser: 8.72 },
    { source: "Direct (campaign: organic)", device: "mobile", views: 837, sessionsPerUser: 4.09, avgSession: "2:31", eventsPerUser: 21.19 },
    { source: "Referral", device: "desktop", views: 597, sessionsPerUser: 1.25, avgSession: "3:56", eventsPerUser: 12.78 },
    { source: "Direct (campaign: organic)", device: "desktop", views: 538, sessionsPerUser: 4.12, avgSession: "5:05", eventsPerUser: 31.07 },
  ] as PubTrafficRow[],
  topPages: [
    { path: "/", device: "mobile", views: 9605, sessionsPerUser: 1.53, avgSession: "0:50", eventsPerUser: 5.70 },
    { path: "/", device: "desktop", views: 6514, sessionsPerUser: 1.70, avgSession: "1:27", eventsPerUser: 5.92 },
    { path: "/professionals", device: "mobile", views: 4300, sessionsPerUser: 1.21, avgSession: "0:58", eventsPerUser: 4.29 },
    { path: "/practices", device: "mobile", views: 709, sessionsPerUser: 1.20, avgSession: "1:32", eventsPerUser: 10.30 },
    { path: "/practices", device: "desktop", views: 699, sessionsPerUser: 1.38, avgSession: "3:24", eventsPerUser: 11.27 },
    { path: "/professionals", device: "desktop", views: 688, sessionsPerUser: 1.17, avgSession: "2:06", eventsPerUser: 4.53 },
    { path: "/ondiem-darby", device: "desktop", views: 618, sessionsPerUser: 1.41, avgSession: "3:58", eventsPerUser: 9.71, flag: "partner-page" },
    { path: "/shifts", device: "desktop", views: 503, sessionsPerUser: 3.41, avgSession: "10:08", eventsPerUser: 157, flag: "engagement-standout" },
    { path: "/ada", device: "desktop", views: 286, sessionsPerUser: 1.29, avgSession: "1:46", eventsPerUser: 6.96, flag: "partner-page" },
    { path: "/contact-us", device: "mobile", views: 247, sessionsPerUser: 1.30, avgSession: "5:46", eventsPerUser: 4.99 },
    { path: "/partner-shifts/cdha", device: "desktop", views: 208, sessionsPerUser: 1.17, avgSession: "1:52", eventsPerUser: 25.20, flag: "partner-page" },
    { path: "/contact-us", device: "desktop", views: 194, sessionsPerUser: 1.14, avgSession: "2:24", eventsPerUser: 4.06 },
    { path: "/shifts", device: "mobile", views: 127, sessionsPerUser: 1.30, avgSession: "1:36", eventsPerUser: 57.48, flag: "engagement-standout" },
    { path: "/landing/jump-start-your-dental...", device: "mobile", views: 122, sessionsPerUser: 1.45, avgSession: "1:41", eventsPerUser: 5.09 },
    { path: "/ada", device: "mobile", views: 101, sessionsPerUser: 1.13, avgSession: "1:22", eventsPerUser: 7.15, flag: "partner-page" },
    { path: "/dso/clearchoice", device: "desktop", views: 86, sessionsPerUser: 4.00, avgSession: "2:34", eventsPerUser: 20.05, flag: "partner-page" },
  ] as PubPageRow[],
  // Aggregated partner page performance (combining mobile + desktop where applicable)
  partnerPages: [
    { page: "/ondiem-darby", views: 675, avgSession: "3:58 desktop · 1:04 mobile", note: "Darby co-branded landing — strongest desktop dwell time among partner pages", color: B.peach },
    { page: "/ada", views: 387, avgSession: "1:46 desktop · 1:22 mobile", note: "ADA partnership landing — desktop-skewed engagement", color: B.sage },
    { page: "/partner-shifts/cdha", views: 277, avgSession: "1:52 desktop · 2:00 mobile", note: "CDHA shifts page — 25 events per user signals deep job-browsing", color: B.teal },
    { page: "/dso/clearchoice", views: 86, avgSession: "2:34 desktop", note: "ClearChoice DSO landing — 4 sessions per user, repeat visits", color: B.lavender },
    { page: "/dso/aspen-onboarding-and-tr...", views: 33, avgSession: "4:59 mobile", note: "Aspen onboarding/training — longest mobile dwell in dataset", color: B.pink },
  ] as PartnerPageRow[],
  // Notable external referrers (cleaned of obvious bot/crawler patterns)
  referrers: [
    { name: "cdha.org", visits: 60, note: "Canadian Dental Hygienists Assoc — active partner referrer (49 desktop + 11 mobile)" },
    { name: "darbydent.com", visits: 2, note: "Darby Dental partner referrer" },
    { name: "nysdental.org", visits: 1, note: "NY State Dental Assoc" },
    { name: "mdaprograms (truncated)", visits: 1, note: "MDA program subdomain referrer" },
    { name: "dbeigi.com", visits: 2, note: "Single power user — 16-minute sessions on pro_availability" },
  ] as ReferrerRow[],
};

function HiPill({ children, color = B.teal, size = "inherit" as string | number }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.04em 0.32em 0.10em",
        backgroundColor: color,
        borderRadius: "0.32em",
        color: B.navy,
        lineHeight: 1.0,
        fontSize: size,
      }}
    >
      {children}
    </span>
  );
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width="28" height="28" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="16" cy="16" r="15" fill={B.navy} />
        <path d="M 8 16 a 8 8 0 0 1 8 -8 v 16 a 8 8 0 0 1 -8 -8" fill={B.cream} />
      </svg>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: B.navy,
          fontSize: 14,
        }}
      >
        ONDIEM
      </span>
    </div>
  );
}

function ADALogo({ size = 76 }: { size?: number }) {
  const height = (size / 76) * 24;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={size}
      height={height}
      viewBox="0 0 76 24"
      aria-label="American Dental Association"
    >
      <g fill="none" fillRule="evenodd">
        <path
          fill="#393"
          d="M23.332 23.262h-5.034l-1.64-4.744H6.673l-1.607 4.744H0L8.84.217h3.652c1.239 0 2.035.381 2.359 1.267.323.883 4.35 11.134 4.35 11.134h-4.709l-2.859-7.786-3.62 9.808h10.111c1.356 0 2.101.438 2.46 1.54l2.748 7.082z"
        />
        <path
          fill="#393"
          d="M67.484 23.263h-5.035l-1.64-4.744h-9.984l-1.608 4.744h-5.065L52.992.217h3.652c1.239 0 2.035.382 2.358 1.268.323.883 4.35 11.134 4.35 11.134h-4.708l-2.859-7.786-3.62 9.808h10.111c1.356 0 2.1.438 2.46 1.54l2.953 7.285M33.5 19.095c4.45 0 6.333-2.148 6.333-7.34 0-5.128-1.785-7.5-5.747-7.5h-4.45v14.84H33.5zM24.93.217h9.157c7.145 0 10.652 3.75 10.652 11.538 0 4.296-1.364 7.534-3.8 9.456-2.273 1.795-4.807 2.051-8.15 2.051h-7.86V.217z"
        />
        <path
          fill="#393"
          d="M70.911 19.894h.391c.457 0 .826-.15.826-.515 0-.322-.24-.536-.76-.536-.218 0-.37.022-.457.043v1.008zm-.022 1.972h-.825v-3.495c.326-.064.782-.128 1.369-.128.673 0 .977.107 1.238.278.195.15.347.43.347.75 0 .408-.304.708-.738.837v.043c.347.107.543.386.652.858.108.536.173.75.26.857h-.89c-.11-.128-.174-.429-.283-.836-.065-.386-.282-.557-.739-.557h-.39v1.393zM71.433 17.235c-1.565 0-2.737 1.265-2.737 2.809 0 1.565 1.172 2.809 2.78 2.809 1.564.021 2.715-1.244 2.715-2.81 0-1.543-1.15-2.808-2.737-2.808h-.021zM71.476 16.527c2.042 0 3.628 1.566 3.628 3.517 0 1.994-1.586 3.538-3.65 3.538-2.042 0-3.671-1.544-3.671-3.538 0-1.951 1.63-3.517 3.671-3.517h.022z"
        />
      </g>
    </svg>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        appearance: "none",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "14px 0 14px",
        marginRight: 28,
        fontFamily: FONT_BODY,
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        color: active ? B.navy : B.textMuted,
        borderBottom: active ? `2px solid ${B.navy}` : "2px solid transparent",
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </button>
  );
}

function Card({
  children,
  accent,
  pad = 28,
  style = {},
}: {
  children: React.ReactNode;
  accent?: string;
  pad?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: B.cardBg,
        border: `1px solid ${B.cardBorder}`,
        borderRadius: 14,
        padding: pad,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {accent && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            background: accent,
          }}
        />
      )}
      {children}
    </div>
  );
}

function MetricTile({
  value,
  label,
  caption,
  color,
}: {
  value: string;
  label: string;
  caption?: string;
  color?: string;
}) {
  return (
    <div
      style={{
        background: B.cardBg,
        border: `1px solid ${B.cardBorder}`,
        borderRadius: 14,
        padding: 22,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {color && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: color,
          }}
        />
      )}
      <div
        style={{
          fontFamily: FONT_SERIF,
          fontWeight: 700,
          fontSize: 36,
          color: B.navy,
          lineHeight: 1.05,
          marginTop: 4,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 8,
          fontFamily: FONT_BODY,
          fontSize: 13,
          fontWeight: 600,
          color: B.navy,
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </div>
      {caption && (
        <div
          style={{
            marginTop: 4,
            fontFamily: FONT_BODY,
            fontSize: 12,
            color: B.textMuted,
            lineHeight: 1.45,
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ kicker, children, accent = B.teal }: { kicker?: string; children: React.ReactNode; accent?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {kicker && (
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: B.textMuted,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ width: 22, height: 2, background: accent, display: "inline-block" }} />
          {kicker}
        </div>
      )}
      <h2
        style={{
          fontFamily: FONT_SERIF,
          fontWeight: 700,
          fontSize: 24,
          color: B.navy,
          margin: 0,
          letterSpacing: "-0.005em",
        }}
      >
        {children}
      </h2>
    </div>
  );
}

function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        background: color,
        borderRadius: 999,
        fontFamily: FONT_BODY,
        fontSize: 11,
        fontWeight: 600,
        color: B.navy,
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </span>
  );
}

function CampaignCard({ c }: { c: Campaign }) {
  const groupColor =
    c.group === "matching"
      ? B.teal
      : c.group === "recruitment"
      ? B.peach
      : c.group === "awareness"
      ? B.yellow
      : B.sage;

  return (
    <Card accent={groupColor} pad={24}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 4 }}>
        <div>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: B.textMuted,
            }}
          >
            {c.audience} · {c.cadence ? c.cadence : "Single send"}
          </div>
          <h3
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 700,
              fontSize: 19,
              color: B.navy,
              margin: "4px 0 0 0",
              lineHeight: 1.25,
            }}
          >
            {c.name}
          </h3>
        </div>
        {c.status && c.statusColor && <StatusPill label={c.status} color={c.statusColor} />}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 18 }}>
        <Stat value={`${c.open.toFixed(2)}%`} label="Open" />
        <Stat value={`${c.click.toFixed(2)}%`} label="Click" />
        <Stat value={`${c.ctr.toFixed(2)}%`} label="CTR" />
        <Stat value={c.delivered.toLocaleString()} label="Delivered" />
      </div>

      {(c.read !== undefined || c.deviceClicks) && (
        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: `1px solid ${B.divider}`,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {c.read !== undefined && (
            <div>
              <div style={{ ...labelStyle, marginBottom: 6 }}>Engagement quality</div>
              <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", background: B.divider }}>
                {c.read > 0 && <div style={{ width: `${c.read}%`, background: B.navy }} />}
                {c.skim !== undefined && c.skim > 0 && <div style={{ width: `${c.skim}%`, background: B.teal }} />}
                {c.glance !== undefined && c.glance > 0 && <div style={{ width: `${c.glance}%`, background: B.cardBorderStrong }} />}
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: B.textMuted, marginTop: 6 }}>
                Read {c.read.toFixed(1)}% · Skim {c.skim?.toFixed(1)}% · Glance {c.glance?.toFixed(1)}%
              </div>
            </div>
          )}
          {c.deviceClicks && (c.totalClicks ?? 0) > 0 && (
            <div>
              <div style={{ ...labelStyle, marginBottom: 6 }}>Click device split</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, fontWeight: 600 }}>
                {c.deviceClicks.mobile > 0 && `${c.deviceClicks.mobile}% mobile`}
                {c.deviceClicks.mobile > 0 && c.deviceClicks.desktop > 0 && " · "}
                {c.deviceClicks.desktop > 0 && `${c.deviceClicks.desktop}% desktop`}
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: B.textMuted, marginTop: 4 }}>
                {c.totalClicks} clicks ({c.uniqueClicks} unique)
              </div>
            </div>
          )}
        </div>
      )}

      {(c.topClicked || c.topEngaged) && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${B.divider}` }}>
          {c.topClicked && c.topClicked !== "—" && (
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: B.textSecondary, lineHeight: 1.55 }}>
              <span style={{ color: B.textMuted, fontWeight: 600 }}>Top clicked: </span>
              {c.topClicked}
            </div>
          )}
          {c.topEngaged && (
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: B.textSecondary, lineHeight: 1.55, marginTop: 2 }}>
              <span style={{ color: B.textMuted, fontWeight: 600 }}>Top engaged: </span>
              {c.topEngaged}
            </div>
          )}
        </div>
      )}

      {c.note && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: `1px solid ${B.divider}`,
            fontFamily: FONT_BODY,
            fontSize: 13,
            color: B.navy,
            lineHeight: 1.5,
          }}
        >
          {c.note}
        </div>
      )}
    </Card>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: FONT_BODY,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: B.textMuted,
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: FONT_SERIF,
          fontWeight: 700,
          fontSize: 22,
          color: B.navy,
          lineHeight: 1.05,
        }}
      >
        {value}
      </div>
      <div style={{ ...labelStyle, marginTop: 4 }}>{label}</div>
    </div>
  );
}

/* =====================================================================
   TABS
   ===================================================================== */

function OverviewTab() {
  const totalDelivered = CAMPAIGNS.reduce((a, c) => a + c.delivered, 0);
  const sortedByOpen = [...CAMPAIGNS].sort((a, b) => b.open - a.open);

  return (
    <div>
      <Hero
        kicker="Campaign Snapshot"
        title={
          <>
            Campaign Performance —{" "}
            <HiPill color={B.teal}>May 2026</HiPill>
          </>
        }
        sub="Reporting period: April 21 – May 21, 2026. A high-level view of where the campaign stands, where it is concentrated, and what is in flight."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <MetricTile
          value="36.7%"
          label="Peak open rate"
          caption="Pro Gold Match · highest in portfolio"
          color={B.teal}
        />
        <MetricTile
          value="16.67%"
          label="Peak CTR"
          caption="Email 5 Chicago $50 — refined-list methodology"
          color={B.sage}
        />
        <MetricTile
          value={`${(totalDelivered / 1000).toFixed(1)}K`}
          label="Total delivered"
          caption={`Across ${CAMPAIGNS.length} active email campaigns`}
          color={B.peach}
        />
        <MetricTile
          value="5"
          label="Initiatives in flight"
          caption="Gift Card Promo, Aspen, Student, 1099, Paid"
          color={B.lavender}
        />
      </div>

      {/* Performance hierarchy bar chart */}
      <Card pad={28} style={{ marginBottom: 24 }}>
        <SectionTitle kicker="Open rate by campaign" accent={B.teal}>
          Performance hierarchy
        </SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sortedByOpen.map((c) => {
            const groupColor =
              c.group === "matching"
                ? B.teal
                : c.group === "recruitment"
                ? B.peach
                : c.group === "awareness"
                ? B.yellow
                : B.sage;
            const widthPct = (c.open / 40) * 100;
            return (
              <div key={c.id} style={{ display: "grid", gridTemplateColumns: "260px 1fr 60px", alignItems: "center", gap: 14 }}>
                <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, fontWeight: 500, lineHeight: 1.25 }}>
                  {c.name}
                </div>
                <div style={{ height: 22, background: B.divider, borderRadius: 4, overflow: "hidden", position: "relative" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.max(widthPct, 1)}%`,
                      background: groupColor,
                      transition: "width 600ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                    }}
                  />
                </div>
                <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 16, color: B.navy, textAlign: "right" }}>
                  {c.open.toFixed(2)}%
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${B.divider}`, display: "flex", gap: 18, flexWrap: "wrap" }}>
          <Legend color={B.teal} label="Matching" />
          <Legend color={B.peach} label="Recruitment" />
          <Legend color={B.yellow} label="Awareness" />
          <Legend color={B.sage} label="Lifecycle" />
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card pad={26} accent={B.sage}>
          <SectionTitle kicker="What's working" accent={B.sage}>
            Refined methodology unlocks engagement quality
          </SectionTitle>
          <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: B.navy, lineHeight: 1.55, margin: 0 }}>
            Email 5 Chicago $50 — sent to a hyper-refined audience (active practice users, complete-profile pros with weekday availability,
            ~5–7 displayed pros) — produced 16.67% CTR with the first independent-decision-maker click engagement of the entire campaign.
            Pro Gold Match continues to lead opens at 36.7%. Pro Sharing Availability has the highest read depth (28.1%).
          </p>
        </Card>
        <Card pad={26} accent={B.pink}>
          <SectionTitle kicker="What needs attention" accent={B.pink}>
            Engagement-to-booking conversion gap
          </SectionTitle>
          <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: B.navy, lineHeight: 1.55, margin: 0 }}>
            Pro Gold Match opens at 36.7% but views aren't turning to shift requests. The Gift Card Promo recorded 0 redemptions across
            8,986 email sends and $975 in paid spend — the offer-to-action handoff is the campaign-wide bottleneck. Shift count remains
            the priority lever to lift in the next sprint.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: "inline-block" }} />
      <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: B.textSecondary, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

function HistoricalTab() {
  const gcBroadAndE4 = CAMPAIGNS.filter((c) => c.group === "lifecycle" && (c.id.startsWith("gc-") || c.id === "email4-practice-leads"));
  const gcRefined = CAMPAIGNS.filter((c) => c.group === "lifecycle" && c.id.startsWith("email5-"));

  return (
    <div>
      <Hero
        kicker="Historical Performance"
        title={
          <>
            What we've <HiPill color={B.yellow}>seen</HiPill> so far
          </>
        }
        sub="Campaign-level results from the last reporting period, grouped by program type."
      />

      <Section kicker="Matching campaigns" accent={B.teal} title="Strongest performers in the program">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {CAMPAIGNS.filter((c) => c.group === "matching").map((c) => (
            <CampaignCard key={c.id} c={c} />
          ))}
        </div>
      </Section>

      <Section kicker="Practice Gift Cards — Broad lists" accent={B.pink} title="Four-city A/B test (Apr 21 – May 21)">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {gcBroadAndE4.map((c) => (
            <CampaignCard key={c.id} c={c} />
          ))}
        </div>
        <Card pad={20} style={{ marginTop: 16, background: B.pinkTint, border: "none" }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, lineHeight: 1.55 }}>
            <span style={{ fontWeight: 700 }}>Combined · </span>
            5,660 sends across four city variants · 19 unique clicks · 0 promo redemptions ·
            $25 cities (Miami + Houston) outperformed $50 cities (Atlanta + Chicago) on blended click rate (0.46% vs 0.23%).
          </div>
        </Card>
      </Section>

      <Section kicker="Practice Gift Cards — Refined (Email 5)" accent={B.sage} title="Dual-segment refinement: dormant vs. active practices across four cities">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {gcRefined.map((c) => (
            <CampaignCard key={c.id} c={c} />
          ))}
        </div>
        <Card pad={20} style={{ marginTop: 16, background: B.sageTint, border: "none" }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, lineHeight: 1.55 }}>
            <span style={{ fontWeight: 700 }}>Methodology snapshot · </span>
            2,637 total sends across four cities, two audience segments · Atlanta dormant produced 10.42% CTR (highest of any
            Email 5 send) with three different RDH profiles selected — conversion-adjacent product action.
            Active segments opened at 11.6–17.8% (Atlanta highest) but didn't click — they have shifts posted already.
            Two segments, two success metrics: dormant practices measured by clicks, active practices by opens.
          </div>
        </Card>
      </Section>

      <Section kicker="Recruitment" accent={B.peach} title="MN/OR nurture series + Sellersburg, IN pilot">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {CAMPAIGNS.filter((c) => c.group === "recruitment").map((c) => (
            <CampaignCard key={c.id} c={c} />
          ))}
        </div>
        <Card pad={20} style={{ marginTop: 16, background: B.peachTint, border: "none" }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, lineHeight: 1.55 }}>
            <span style={{ fontWeight: 700 }}>MN/OR series overall · </span>
            4,833 prospects delivered email · open 11.8% · click 0.32% · CTR 2.68% · concluded in April.
            <br />
            <span style={{ fontWeight: 700 }}>Sellersburg pilot · </span>
            17 delivered, 0 human opens, 10.53% bounce — contacts excluded from future sends; cleaner lead source required.
          </div>
        </Card>
      </Section>

      <Section kicker="Q2 Awareness Broadcast" accent={B.yellow} title="New Features email — informational, sent April 29">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {CAMPAIGNS.filter((c) => c.group === "awareness").map((c) => (
            <CampaignCard key={c.id} c={c} />
          ))}
        </div>
      </Section>

      <Section kicker="Lifecycle Programs" accent={B.sage} title="Reactivation, activation, and SMS tests">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {LIFECYCLE_PROGRAMS.map((p, i) => (
            <Card key={i} accent={p.color} pad={24}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <h3 style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 18, color: B.navy, margin: 0, lineHeight: 1.25 }}>
                  {p.name}
                </h3>
                <StatusPill label={p.status} color={p.color} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 8, marginBottom: 12 }}>
                {p.enrolled !== undefined && <Stat value={p.enrolled.toLocaleString()} label="Enrolled" />}
                {p.open !== undefined && <Stat value={`${p.open}%`} label="Open" />}
                {p.click !== undefined && <Stat value={`${p.click}%`} label="Click" />}
                {p.companies !== undefined && <Stat value={p.companies.toLocaleString()} label="Companies" />}
                {p.redemptions !== undefined && <Stat value={p.redemptions.toString()} label="Redemptions" />}
                {p.shifts !== undefined && <Stat value={p.shifts.toString()} label="Shifts posted" />}
              </div>
              {p.markets && (
                <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: B.textMuted, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>Markets: </span>
                  {p.markets}
                </div>
              )}
              {p.cohort && (
                <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: B.textMuted, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>Cohort: </span>
                  {p.cohort}
                </div>
              )}
              {p.test && (
                <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: B.textMuted, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>Test: </span>
                  {p.test}
                </div>
              )}
              {p.cadence && (
                <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: B.textMuted, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>Cadence: </span>
                  {p.cadence}
                </div>
              )}
              {p.finding && (
                <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, lineHeight: 1.5, marginTop: 8 }}>
                  {p.finding}
                </div>
              )}
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

function CurrentTab() {
  const gcPromoAtlantaDormant = CAMPAIGNS.find((c) => c.id === "email5-dormant-atlanta");
  return (
    <div>
      <Hero
        kicker="Currently Working On"
        title={
          <>
            Initiatives <HiPill color={B.peach}>in flight</HiPill>
          </>
        }
        sub="Programs being shipped or refined this period. Centerpiece: the Practice Gift Cards journey, eight emails across four targeted markets, now in its dual-segment refinement."
      />

      {/* Gift Card Promo centerpiece */}
      <Card pad={28} accent={B.pink} style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 14 }}>
          <div>
            <div style={{ ...labelStyle, marginBottom: 6 }}>Practice Gift Cards · Apr 21 – May 31</div>
          </div>
          <StatusPill label="Round 2 in flight · dual-segment refinement" color={B.sage} />
        </div>
        <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: B.navy, lineHeight: 1.6, margin: "8px 0 18px 0", maxWidth: 820 }}>
          The campaign has evolved into a dual-segment send across all four cities: dormant practices
          (Practice Users with no shifts + completed pro profiles) and active practices (Active Practice Users + completed pro profiles).
          Atlanta dormant produced the highest CTR of any Email 5 send at 10.42%, with three different RDH profiles selected — the
          first conversion-adjacent product action of the sequence. Active practices opened at 11.6–17.8% but did not click; they
          have shifts posted already, so the offer is informational rather than actionable. Round 2 confirms the segmentation
          hypothesis: dormant and active audiences need different success metrics.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          <Stat value="2,637" label="Round 2 sends (8 emails)" />
          <Stat value="10.42%" label="Atlanta dormant CTR" />
          <Stat value="17.78%" label="Atlanta active open rate" />
          <Stat value="0" label="Promo redemptions" />
        </div>
      </Card>

      {/* Per-email detail */}
      <SectionTitle kicker="Email-level performance · all 8 sends" accent={B.pink}>
        Broad-list city variants
      </SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
        {CAMPAIGNS.filter((c) => c.id.startsWith("gc-") || c.id === "email4-practice-leads").map((c) => (
          <CampaignCard key={c.id} c={c} />
        ))}
      </div>

      <SectionTitle kicker="Email 5 · dormant + active segments" accent={B.sage}>
        Dual-segment sends across four cities (May 20–21)
      </SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
        {CAMPAIGNS.filter((c) => c.id.startsWith("email5-")).map((c) => (
          <CampaignCard key={c.id} c={c} />
        ))}
      </div>

      {gcPromoAtlantaDormant && (
        <Card pad={22} style={{ marginBottom: 28, background: B.sageTint, border: "none" }}>
          <div style={{ ...labelStyle, marginBottom: 8 }}>Methodology proof-point</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, lineHeight: 1.6 }}>
            Email 5 Atlanta dormant — <strong>769 deliveries · 7.04% open · 10.42% CTR · three different RDH profiles selected</strong> ·
            the first send in the sequence to produce conversion-adjacent product action (dormant practices choosing specific pros
            with weekday availability). Chicago dormant followed at 4.65% CTR with similar pro-profile selection behavior. The
            dual-segment refinement now defines the operational standard: dormant practices measured by clicks-to-product,
            active practices measured by open-rate engagement.
          </div>
        </Card>
      )}

      {/* Other initiatives in flight */}
      <SectionTitle kicker="Other initiatives in flight" accent={B.peach}>
        Programs being shipped or refined this period
      </SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        {CURRENT_INITIATIVES.filter((i) => !i.title.startsWith("Gift Card")).map((i, idx) => (
          <Card key={idx} accent={i.color} pad={26}>
            <h3
              style={{
                fontFamily: FONT_SERIF,
                fontWeight: 700,
                fontSize: 20,
                color: B.navy,
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              {i.title}
            </h3>
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: 14,
                color: B.navy,
                lineHeight: 1.55,
                margin: "10px 0 0 0",
              }}
            >
              {i.body}
            </p>
            <div
              style={{
                marginTop: 14,
                paddingTop: 12,
                borderTop: `1px solid ${B.divider}`,
                fontFamily: FONT_BODY,
                fontSize: 12,
                color: B.textMuted,
                fontWeight: 500,
              }}
            >
              {i.meta}
            </div>
          </Card>
        ))}
      </div>

      {/* Blockers */}
      <SectionTitle kicker="Awaiting approval" accent={B.pink}>
        Blockers to unblock
      </SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        <Card pad={22} accent={B.pink}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ ...labelStyle }}>Blocker</div>
            <StatusPill label="Awaiting review" color={B.pink} />
          </div>
          <h3 style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 18, color: B.navy, margin: 0, lineHeight: 1.3 }}>
            Comms review approval
          </h3>
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, lineHeight: 1.55, margin: "8px 0 0 0" }}>
            Pending sign-off on next-period comms package — needed to set live on schedule.
          </p>
        </Card>
        <Card pad={22} accent={B.pink}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ ...labelStyle }}>Blocker</div>
            <StatusPill label="Awaiting approval" color={B.pink} />
          </div>
          <h3 style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 18, color: B.navy, margin: 0, lineHeight: 1.3 }}>
            Pro Profile Completion (email + SMS)
          </h3>
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, lineHeight: 1.55, margin: "8px 0 0 0" }}>
            Two workflows ready to set live (expanded beyond the 4 target cities to any pro with availability in the next 30 days).
            Awaiting email + SMS approval.
          </p>
        </Card>
      </div>

      {/* Measurement */}
      <Card pad={26} accent={B.navy}>
        <SectionTitle kicker="Measurement" accent={B.navy}>
          How and when we report
        </SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 4 }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, lineHeight: 1.6 }}>
            <div style={{ ...labelStyle, marginBottom: 6 }}>Cadence</div>
            All comms measured 2 weeks after sending. Reactivation/activation cohorts reviewed biweekly. Gift Card Promo mailer continues
            through July; Email 5 dual-segment refinement (dormant + active) now the active operational standard.
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, lineHeight: 1.6 }}>
            <div style={{ ...labelStyle, marginBottom: 6 }}>Success metrics</div>
            Activation: eligible vs. booked, pre/post. Reactivation: pros worked a shift in last month (baseline 0). Surveys: submissions.
            ADA: account holders + linked. Promos: code use + shifts booked/worked. Paid: spend efficiency + impression share.
          </div>
        </div>
      </Card>
    </div>
  );
}

function FutureTab() {
  return (
    <div>
      <Hero
        kicker="Future Work"
        title={
          <>
            What's <HiPill color={B.lavender}>next</HiPill>
          </>
        }
        sub="Upcoming work being staged."
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {FUTURE_INITIATIVES.map((i, idx) => (
          <Card key={idx} accent={i.color} pad={26}>
            <h3
              style={{
                fontFamily: FONT_SERIF,
                fontWeight: 700,
                fontSize: 19,
                color: B.navy,
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              {i.title}
            </h3>
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: 14,
                color: B.navy,
                lineHeight: 1.55,
                margin: "10px 0 0 0",
              }}
            >
              {i.body}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StrategyTab() {
  return (
    <div>
      <Hero
        kicker="Strategic Notes"
        title={
          <>
            What the <HiPill color={B.sage}>data</HiPill> shows
          </>
        }
        sub="Cross-cutting observations from the period's results."
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {STRATEGIC_NOTES.map((n, idx) => (
          <Card key={idx} pad={26} accent={B.teal}>
            <h3
              style={{
                fontFamily: FONT_SERIF,
                fontWeight: 700,
                fontSize: 18,
                color: B.navy,
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {n.title}
            </h3>
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: 14,
                color: B.navy,
                lineHeight: 1.55,
                margin: "10px 0 0 0",
              }}
            >
              {n.body}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CampaignsTab() {
  return (
    <div>
      <Hero
        kicker="Campaigns"
        title={
          <>
            Campaign <HiPill color={B.pink}>detail</HiPill>
          </>
        }
        sub={`All ${CAMPAIGNS.length} active and recent email campaigns with verified HubSpot delivery, engagement, and click-behavior data.`}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {CAMPAIGNS.map((c) => (
          <CampaignCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}

/* =====================================================================
   PARTNERSHIPS — charts + tab
   ===================================================================== */

function MonthlyBarChart({ data, peakColor = B.teal, barColor = B.sage }: { data: MonthlyPoint[]; peakColor?: string; barColor?: string }) {
  const max = Math.max(...data.map((d) => d.clicks));
  const peakIdx = data.reduce((bestIdx, d, i) => (d.clicks > data[bestIdx].clicks ? i : bestIdx), 0);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 200, paddingBottom: 4 }}>
        {data.map((d, i) => {
          const h = max > 0 ? (d.clicks / max) * 180 : 0;
          const isPeak = i === peakIdx;
          return (
            <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 11,
                  fontWeight: 600,
                  color: isPeak ? B.navy : B.textMuted,
                  height: 16,
                }}
              >
                {d.clicks.toLocaleString()}
              </div>
              <div
                style={{
                  width: "100%",
                  height: Math.max(h, 2),
                  background: isPeak ? peakColor : barColor,
                  borderRadius: "3px 3px 0 0",
                  transition: "height 600ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                }}
                title={`${d.month}: ${d.clicks.toLocaleString()} clicks`}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8, borderTop: `1px solid ${B.divider}`, paddingTop: 10 }}>
        {data.map((d) => (
          <div
            key={d.month}
            style={{
              flex: 1,
              fontFamily: FONT_BODY,
              fontSize: 11,
              color: B.textMuted,
              textAlign: "center",
              letterSpacing: "0.01em",
            }}
          >
            {d.month}
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyBarChart({ data, peakColor = B.teal, barColor = B.sage }: { data: DailyPoint[]; peakColor?: string; barColor?: string }) {
  const max = Math.max(...data.map((d) => d.clicks));
  const peakIdx = data.reduce((bestIdx, d, i) => (d.clicks > data[bestIdx].clicks ? i : bestIdx), 0);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 180, paddingBottom: 4 }}>
        {data.map((d, i) => {
          const h = max > 0 ? (d.clicks / max) * 170 : 0;
          const isPeak = i === peakIdx;
          const dayLabel = d.date.slice(-2);
          return (
            <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: "100%",
                  height: Math.max(h, 1.5),
                  background: isPeak ? peakColor : barColor,
                  borderRadius: "2px 2px 0 0",
                  transition: "height 500ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                }}
                title={`${d.date}: ${d.clicks} clicks`}
              />
              <div style={{ fontFamily: FONT_BODY, fontSize: 9, color: B.textMuted, marginTop: 4 }}>{dayLabel}</div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 4,
          paddingTop: 8,
          borderTop: `1px solid ${B.divider}`,
          fontFamily: FONT_BODY,
          fontSize: 11,
          color: B.textMuted,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>March 30</span>
        <span>April 29</span>
      </div>
    </div>
  );
}

function LinkBarList({ data, color = B.sage, labelStyle: lblStyle = "code" }: { data: LinkRow[]; color?: string; labelStyle?: "code" | "plain" }) {
  const max = Math.max(...data.map((d) => d.clicks));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((row) => (
        <div key={row.name} style={{ display: "grid", gridTemplateColumns: "210px 1fr 70px", alignItems: "center", gap: 14 }}>
          <div
            style={{
              fontFamily: lblStyle === "code" ? "ui-monospace, 'SF Mono', Menlo, monospace" : FONT_BODY,
              fontSize: 12,
              color: B.navy,
              fontWeight: 500,
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {row.name}
          </div>
          <div style={{ height: 16, background: B.divider, borderRadius: 3, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${Math.max((row.clicks / max) * 100, 1)}%`,
                background: color,
                transition: "width 600ms cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
            />
          </div>
          <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 14, color: B.navy, textAlign: "right" }}>
            {row.clicks.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

function PartnershipsTab() {
  const peakDay = ADA_30DAY.daily.reduce((max, d) => (d.clicks > max.clicks ? d : max), ADA_30DAY.daily[0]);
  const peakMonth = ADA_LIFETIME.monthly.reduce((max, d) => (d.clicks > max.clicks ? d : max), ADA_LIFETIME.monthly[0]);
  const usSharePct = Math.round((ADA_LIFETIME.topCountries[0].clicks / ADA_LIFETIME.humanClicks) * 100);

  return (
    <div>
      <Hero
        kicker="Partnerships"
        title={
          <>
            Tracked-link <HiPill color={B.sage}>performance</HiPill> by partner
          </>
        }
        sub="Click activity from co-marketing programs and external channels."
      />

      {/* Partner header card */}
      <Card pad={28} accent={B.sage} style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <ADALogo size={92} />
            <div>
              <h2
                style={{
                  fontFamily: FONT_SERIF,
                  fontWeight: 700,
                  fontSize: 26,
                  color: B.navy,
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                American Dental Association
              </h2>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: FONT_BODY,
                  fontSize: 13,
                  color: B.textMuted,
                  letterSpacing: "0.01em",
                }}
              >
                Active since June 2025 · 11 tracked short URLs · ada_partnership_2025 campaign
              </div>
            </div>
          </div>
          <StatusPill label="Active" color={B.sage} />
        </div>
      </Card>

      {/* Lifetime overview */}
      <SectionTitle kicker="Lifetime · June 9, 2025 – April 29, 2026" accent={B.sage}>
        Program-to-date
      </SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <MetricTile
          value={ADA_LIFETIME.humanClicks.toLocaleString()}
          label="Human clicks"
          caption={`${ADA_LIFETIME.totalClicks.toLocaleString()} total · ${Math.round(((ADA_LIFETIME.totalClicks - ADA_LIFETIME.humanClicks) / ADA_LIFETIME.totalClicks) * 100)}% bot/automation`}
          color={B.sage}
        />
        <MetricTile
          value={ADA_LIFETIME.topLinks[0].clicks.toLocaleString()}
          label="Top link"
          caption={`${ADA_LIFETIME.topLinks[0].name} · ${Math.round((ADA_LIFETIME.topLinks[0].clicks / ADA_LIFETIME.totalClicks) * 100)}% of total`}
          color={B.teal}
        />
        <MetricTile
          value={`${usSharePct}%`}
          label="US share"
          caption={`${ADA_LIFETIME.topCountries[0].clicks.toLocaleString()} of ${ADA_LIFETIME.humanClicks.toLocaleString()} human clicks`}
          color={B.peach}
        />
        <MetricTile
          value={peakMonth.clicks.toLocaleString()}
          label="Peak month"
          caption={peakMonth.month}
          color={B.yellow}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 36 }}>
        <Card pad={24}>
          <SectionTitle kicker="Monthly clicks" accent={B.sage}>
            Trend over time
          </SectionTitle>
          <MonthlyBarChart data={ADA_LIFETIME.monthly} />
        </Card>
        <Card pad={24}>
          <SectionTitle kicker="Top destinations" accent={B.sage}>
            Lifetime click distribution
          </SectionTitle>
          <LinkBarList data={ADA_LIFETIME.topLinks} color={B.sage} />
        </Card>
      </div>

      {/* 30-day section */}
      <SectionTitle kicker="Last 30 days · March 30 – April 30, 2026" accent={B.teal}>
        Recent activity
      </SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <MetricTile
          value={ADA_30DAY.humanClicks.toLocaleString()}
          label="Human clicks (30d)"
          caption={`${ADA_30DAY.totalClicks.toLocaleString()} total · ${Math.round(((ADA_30DAY.totalClicks - ADA_30DAY.humanClicks) / ADA_30DAY.totalClicks) * 100)}% bot/automation`}
          color={B.teal}
        />
        <MetricTile
          value={ADA_30DAY.topLinks[0].clicks.toLocaleString()}
          label="Top link"
          caption={`${ADA_30DAY.topLinks[0].name} · ${Math.round((ADA_30DAY.topLinks[0].clicks / ADA_30DAY.totalClicks) * 100)}% of total`}
          color={B.sage}
        />
        <MetricTile
          value={peakDay.clicks.toLocaleString()}
          label="Peak day"
          caption={`April ${parseInt(peakDay.date.slice(-2), 10)} · likely send day`}
          color={B.peach}
        />
        <MetricTile
          value="3"
          label="Notable spikes"
          caption="April 1, April 8, April 20"
          color={B.yellow}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 36 }}>
        <Card pad={24}>
          <SectionTitle kicker="Daily clicks" accent={B.teal}>
            30-day pattern
          </SectionTitle>
          <DailyBarChart data={ADA_30DAY.daily} />
        </Card>
        <Card pad={24}>
          <SectionTitle kicker="Top destinations" accent={B.teal}>
            30-day click distribution
          </SectionTitle>
          <LinkBarList data={ADA_30DAY.topLinks} color={B.teal} />
        </Card>
      </div>

      {/* Audience composition */}
      <SectionTitle kicker="Audience composition · lifetime" accent={B.lavender}>
        Who's clicking
      </SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <Card pad={24}>
          <div style={{ ...labelStyle, marginBottom: 14 }}>By Country</div>
          <LinkBarList data={ADA_LIFETIME.topCountries} color={B.lavender} labelStyle="plain" />
        </Card>
        <Card pad={24}>
          <div style={{ ...labelStyle, marginBottom: 14 }}>By Operating System</div>
          <LinkBarList data={ADA_LIFETIME.topOS} color={B.lavender} labelStyle="plain" />
        </Card>
        <Card pad={24}>
          <div style={{ ...labelStyle, marginBottom: 14 }}>By Browser</div>
          <LinkBarList data={ADA_LIFETIME.topBrowsers} color={B.lavender} labelStyle="plain" />
        </Card>
      </div>

      {/* Data hygiene note */}
      <div style={{ marginTop: 28 }}>
        <Card pad={20} style={{ background: B.peachTint, border: "none" }}>
          <div style={{ ...labelStyle, marginBottom: 8 }}>Data hygiene · 30-day period</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, lineHeight: 1.55 }}>
            The 30-day ShortLink pull included 924 total clicks against attributable ADA-tagged destinations totaling 129 clean clicks
            (43 on /ada-email with full UTM tagging, 76 on /ada-website, plus smaller named links). The remainder reflects unattributed
            traffic and likely automated/non-US sources. Figures shown above reflect the attributable subset; broader rollups would
            overstate true engagement. UTM tagging on /ada-website and other ADA destinations is being added for cleaner attribution
            next period.
          </div>
        </Card>
      </div>
    </div>
  );
}

/* =====================================================================
   PAID ACQUISITION TAB
   ===================================================================== */

function PaidAcquisitionTab() {
  return (
    <div>
      <Hero
        kicker="Paid Acquisition"
        title={
          <>
            Google Ads — <HiPill color={B.peach}>practice reactivation</HiPill> campaign
          </>
        }
        sub="Performance across four targeted markets running paid search alongside the Gift Card Promo email campaign. Reporting window: May 2026 (through May 26). Campaigns extended into late May with broader keyword sets, surfacing four distinct city-level strategies."
      />

      {/* Topline aggregate */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        <MetricTile
          value={`$${AD_AGGREGATE.spend.toFixed(2)}`}
          label="Total spend"
          caption={`Across ${AD_CITIES.length} cities · ${AD_AGGREGATE.activeDays} active days`}
          color={B.peach}
        />
        <MetricTile
          value={AD_AGGREGATE.impressions.toLocaleString()}
          label="Impressions"
          caption="Combined across all city ad groups"
          color={B.teal}
        />
        <MetricTile
          value={AD_AGGREGATE.clicks.toLocaleString()}
          label="Clicks"
          caption={`Blended CTR ${AD_AGGREGATE.ctr.toFixed(2)}% · CPC $${AD_AGGREGATE.cpc.toFixed(2)}`}
          color={B.lavender}
        />
      </div>

      {/* Per-city comparison table */}
      <Card pad={28} style={{ marginBottom: 28 }}>
        <SectionTitle kicker="City-level performance" accent={B.peach}>
          Side-by-side market comparison
        </SectionTitle>
        <CityComparisonTable cities={AD_CITIES} />
      </Card>

      {/* Per-city detail cards */}
      <SectionTitle kicker="City detail" accent={B.teal}>
        Per-market performance breakdown
      </SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        {AD_CITIES.map((c) => (
          <AdCityCard key={c.city} city={c} />
        ))}
      </div>

      {/* Audience composition */}
      <SectionTitle kicker="Audience composition · blended" accent={B.lavender}>
        Who saw the ads
      </SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        <Card pad={24}>
          <div style={{ ...labelStyle, marginBottom: 14 }}>Gender split (% impressions)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <SplitBar
              label="Female"
              value={AD_DEMOGRAPHICS_AGGREGATE.gender.female}
              color={B.lavender}
            />
            <SplitBar
              label="Male"
              value={AD_DEMOGRAPHICS_AGGREGATE.gender.male}
              color={B.sage}
            />
          </div>
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${B.divider}`, fontFamily: FONT_BODY, fontSize: 12, color: B.textMuted, lineHeight: 1.5 }}>
            Female impression share consistent across cities (67–91%, blended 74%). Reflects the underlying dental hygienist / dental
            assistant workforce demographic. Atlanta runs most concentrated at 91% female.
          </div>
        </Card>
        <Card pad={24}>
          <div style={{ ...labelStyle, marginBottom: 14 }}>Age distribution (% impressions)</div>
          <LinkBarList data={AD_DEMOGRAPHICS_AGGREGATE.age} color={B.lavender} labelStyle="plain" />
        </Card>
      </div>

      {/* Device + time patterns */}
      <SectionTitle kicker="Device & timing" accent={B.sage}>
        When and where the ads ran
      </SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        <Card pad={24}>
          <div style={{ ...labelStyle, marginBottom: 14 }}>Device split (blended)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <SplitBar
              label="Mobile"
              value={AD_DEVICE_BLENDED.mobile.share}
              color={B.teal}
              sub={`${AD_DEVICE_BLENDED.mobile.impressions.toLocaleString()} imp · ${AD_DEVICE_BLENDED.mobile.clicks} clicks`}
            />
            <SplitBar
              label="Desktop"
              value={AD_DEVICE_BLENDED.desktop.share}
              color={B.peach}
              sub={`${AD_DEVICE_BLENDED.desktop.impressions.toLocaleString()} imp · ${AD_DEVICE_BLENDED.desktop.clicks} clicks`}
            />
            <SplitBar
              label="Tablet"
              value={AD_DEVICE_BLENDED.tablet.share}
              color={B.sage}
              sub={`${AD_DEVICE_BLENDED.tablet.impressions} imp · ${AD_DEVICE_BLENDED.tablet.clicks} clicks`}
            />
          </div>
        </Card>
        <Card pad={24}>
          <div style={{ ...labelStyle, marginBottom: 14 }}>Day of week (impressions)</div>
          <LinkBarList data={AD_DAY_PATTERN} color={B.sage} labelStyle="plain" />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        <Card pad={24}>
          <div style={{ ...labelStyle, marginBottom: 14 }}>Peak hours (impressions, blended)</div>
          <LinkBarList data={AD_HOUR_PEAK} color={B.teal} labelStyle="plain" />
        </Card>
        <Card pad={24}>
          <div style={{ ...labelStyle, marginBottom: 14 }}>Notable search queries</div>
          <LinkBarList data={AD_TOP_SEARCH_QUERIES} color={B.lavender} labelStyle="plain" />
          <div style={{ marginTop: 14, paddingTop: 10, borderTop: `1px solid ${B.divider}`, fontFamily: FONT_BODY, fontSize: 12, color: B.textMuted, lineHeight: 1.5 }}>
            Competitor brand exposure surfaced in two cities: Atlanta absorbed 12 clicks on competitor-brand terms
            ("indigo dental staffing" + "dental post jobs", ~$118 spend). Miami captured 140+ impressions on "GoTu" / "go tu"
            queries at near-zero cost. Houston's broad keyword set pulled non-dental "jobs in houston" queries — worth tightening.
          </div>
        </Card>
      </div>

      {/* Auction insights */}
      <SectionTitle kicker="Auction insights · per market" accent={B.peach}>
        Competitive impression share
      </SectionTitle>
      <Card pad={26}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {AD_CITIES.map((c) => (
            <div key={c.city} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ ...labelStyle }}>{c.city}</div>
              <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 28, color: B.navy, lineHeight: 1 }}>
                {c.impressionShare.toFixed(2)}%
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: B.textMuted }}>
                onDiem impression share
              </div>
              <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontSize: 12, color: B.navy }}>
                Top of page rate: <strong>{c.topOfPageRate.toFixed(2)}%</strong>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${B.divider}`, fontFamily: FONT_BODY, fontSize: 12, color: B.textMuted, lineHeight: 1.55 }}>
          Atlanta remains the position-dominance market: 48.40% impression share and 82.90% top-of-page rate — both highest of the
          four cities, both achieved with a tight phrase-match keyword set. Chicago, Houston, and Miami cluster together at 15–19%
          impression share with 71–73% top-of-page rate, competing closely with Indeed, DentalPost, and GoTu. Two distinct strategies,
          two distinct outcomes.
        </div>
      </Card>
    </div>
  );
}

/* ---------- Paid Acquisition components ---------- */

function CityComparisonTable({ cities }: { cities: AdCity[] }) {
  const headerStyle: React.CSSProperties = {
    ...labelStyle,
    textAlign: "right",
    paddingBottom: 12,
    borderBottom: `1px solid ${B.divider}`,
  };
  const cellStyle: React.CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: 13,
    color: B.navy,
    textAlign: "right",
    paddingTop: 12,
    paddingBottom: 12,
    borderBottom: `1px solid ${B.divider}`,
  };
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...headerStyle, textAlign: "left" }}>City</th>
            <th style={headerStyle}>Incentive</th>
            <th style={headerStyle}>Spend</th>
            <th style={headerStyle}>Impressions</th>
            <th style={headerStyle}>Clicks</th>
            <th style={headerStyle}>CTR</th>
            <th style={headerStyle}>Avg CPC</th>
            <th style={headerStyle}>Conversions</th>
            <th style={headerStyle}>Impr. share</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((c) => (
            <tr key={c.city}>
              <td style={{ ...cellStyle, textAlign: "left", fontWeight: 600 }}>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: c.color, marginRight: 10 }} />
                {c.city}
              </td>
              <td style={cellStyle}>{c.incentive}</td>
              <td style={cellStyle}>${c.spend.toFixed(2)}</td>
              <td style={cellStyle}>{c.impressions.toLocaleString()}</td>
              <td style={cellStyle}>{c.clicks}</td>
              <td style={cellStyle}>{c.ctr.toFixed(2)}%</td>
              <td style={cellStyle}>${c.cpc.toFixed(2)}</td>
              <td style={cellStyle}>{c.conversions}</td>
              <td style={cellStyle}>{c.impressionShare.toFixed(2)}%</td>
            </tr>
          ))}
          <tr>
            <td style={{ ...cellStyle, textAlign: "left", fontWeight: 700, color: B.navy, borderBottom: "none" }}>Total</td>
            <td style={{ ...cellStyle, borderBottom: "none" }}>—</td>
            <td style={{ ...cellStyle, fontWeight: 700, borderBottom: "none" }}>${AD_AGGREGATE.spend.toFixed(2)}</td>
            <td style={{ ...cellStyle, fontWeight: 700, borderBottom: "none" }}>{AD_AGGREGATE.impressions.toLocaleString()}</td>
            <td style={{ ...cellStyle, fontWeight: 700, borderBottom: "none" }}>{AD_AGGREGATE.clicks}</td>
            <td style={{ ...cellStyle, fontWeight: 700, borderBottom: "none" }}>{AD_AGGREGATE.ctr.toFixed(2)}%</td>
            <td style={{ ...cellStyle, fontWeight: 700, borderBottom: "none" }}>${AD_AGGREGATE.cpc.toFixed(2)}</td>
            <td style={{ ...cellStyle, fontWeight: 700, borderBottom: "none" }}>{AD_AGGREGATE.conversions}</td>
            <td style={{ ...cellStyle, borderBottom: "none" }}>—</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function AdCityCard({ city }: { city: AdCity }) {
  return (
    <Card accent={city.color} pad={24}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ ...labelStyle }}>{city.incentive} incentive</div>
          <h3 style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 22, color: B.navy, margin: "4px 0 0 0", lineHeight: 1.2 }}>
            {city.city}
          </h3>
        </div>
        <StatusPill label={city.conversions === 0 ? "0 conversions" : `${city.conversions} converted`} color={city.conversions === 0 ? B.pink : B.sage} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
        <Stat value={`$${city.spend.toFixed(0)}`} label="Spend" />
        <Stat value={city.impressions.toLocaleString()} label="Impressions" />
        <Stat value={city.clicks.toString()} label="Clicks" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, paddingTop: 12, borderTop: `1px solid ${B.divider}` }}>
        <Stat value={`${city.ctr.toFixed(2)}%`} label="CTR" />
        <Stat value={`$${city.cpc.toFixed(2)}`} label="Avg CPC" />
        <Stat value={`${city.impressionShare.toFixed(1)}%`} label="Impr. share" />
      </div>
    </Card>
  );
}

function SplitBar({ label, value, color, sub }: { label: string; value: number; color: string; sub?: string }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: B.navy }}>{label}</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 14, fontWeight: 700, color: B.navy }}>{value}%</div>
      </div>
      <div style={{ height: 8, background: B.divider, borderRadius: 4, overflow: "hidden" }}>
        <div
          style={{
            width: `${Math.max(value, 1)}%`,
            height: "100%",
            background: color,
            transition: "width 600ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        />
      </div>
      {sub && (
        <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: B.textMuted, marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
}

/* =====================================================================
   WEBSITES TAB
   ===================================================================== */

function WebsitesTab() {
  const [activeSite, setActiveSite] = useState<"platform" | "public">("platform");
  const p = PLATFORM_SITE;
  const totalPaidDriven = p.paidDrivenEvents.reduce((a, e) => a + e.clicks, 0);

  const pivotOptions: { id: "platform" | "public"; label: string; url: string }[] = [
    { id: "platform", label: "Platform", url: "app.ondiem.com" },
    { id: "public", label: "Public Site", url: "ondiem.com" },
  ];

  return (
    <div>
      <Hero
        kicker="Websites"
        title={
          <>
            Property <HiPill color={B.teal}>analytics</HiPill>
          </>
        }
        sub="Behavioral data from onDiem-owned web properties. Toggle below to switch between the authenticated platform and the public marketing site."
      />

      {/* Pivot — toggle between properties */}
      <SitePivot options={pivotOptions} active={activeSite} onChange={setActiveSite} />

      {activeSite === "platform" && (
        <>
          {/* Site header */}
          <Card pad={28} accent={B.navy} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
              <div>
                <div style={{ ...labelStyle, marginBottom: 8 }}>Property · {p.url}</div>
                <h2 style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 28, color: B.navy, margin: 0, lineHeight: 1.15 }}>
                  {p.name}
                </h2>
                <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontSize: 13, color: B.textMuted }}>
                  {p.subtitle} · {p.range}
                </div>
              </div>
              <StatusPill label={p.status} color={B.sage} />
            </div>
          </Card>

          {/* Narrative headline */}
          <Card pad={26} accent={B.teal} style={{ marginBottom: 24 }}>
            <SectionTitle kicker="Headline read" accent={B.teal}>
              Fewer users, deeper sessions
            </SectionTitle>
            <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: B.navy, lineHeight: 1.6, margin: 0 }}>
              Active users contracted 44% versus the prior period while pageviews per user rose 33% and average engagement time
              climbed 82%. Reach is down; depth is up. The users who do show up to the authenticated platform are spending substantially
              more time and viewing more pages — consistent with the engagement-quality pattern visible across the email program. The
              open question for the program is whether this is the leading indicator of activation work succeeding on the surviving
              audience, or a smaller set of power users behaving more intensely.
            </p>
          </Card>

          {/* Headline metrics with deltas */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
            <DeltaTile value={p.metrics.activeUsers.display} label="Active users" delta={p.metrics.activeUsers.delta} accent={B.teal} />
            <DeltaTile value={p.metrics.pageviewsPerUser.display} label="Pageviews per user" delta={p.metrics.pageviewsPerUser.delta} accent={B.sage} />
            <DeltaTile value={p.metrics.engagementTime.display} label="Avg engagement time" delta={p.metrics.engagementTime.delta} accent={B.sage} />
            <DeltaTile value={p.metrics.pctEngaged.display} label="% engaged sessions" delta={p.metrics.pctEngaged.delta} accent={B.peach} />
          </div>

          {/* Supply concentration callout */}
          <Card pad={22} style={{ marginBottom: 28, background: B.pinkTint, border: "none" }}>
            <div style={{ ...labelStyle, marginBottom: 8 }}>Supply vs demand · platform-wide</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 32, color: B.navy, lineHeight: 1 }}>89</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, fontWeight: 600, marginTop: 4 }}>
                  practice users offering shifts
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: B.textMuted, marginTop: 2 }}>
                  252,196 temp_shift_offered events · ~2,833 per user
                </div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 32, color: B.navy, lineHeight: 1 }}>9,439</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, fontWeight: 600, marginTop: 4 }}>
                  users viewing shifts
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: B.textMuted, marginTop: 2 }}>
                  23,948 temp_shift_viewed events · ~2.5 per user
                </div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 32, color: B.navy, lineHeight: 1 }}>4,732</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, fontWeight: 600, marginTop: 4 }}>
                  users initiating searches
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: B.textMuted, marginTop: 2 }}>
                  15,784 job_search_initiated events · ~3.3 per user
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${B.cardBorder}`, fontFamily: FONT_BODY, fontSize: 12, color: B.textSecondary, lineHeight: 1.55 }}>
              Demand-side breadth (~9.4K viewers) is two orders of magnitude wider than supply-side activity (89 offering practices).
              The supply count is concentrated in a small set of high-volume practice users — likely DSO operations contacts running
              batched shift creation. Lifting active-supply breadth is the structural lever on the shift-count question.
            </div>
          </Card>

          {/* Two-column: Traffic sources + Device split */}
          <SectionTitle kicker="Traffic & sessions" accent={B.teal}>
            How users arrive
          </SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 28 }}>
            <Card pad={24}>
              <div style={{ ...labelStyle, marginBottom: 14 }}>Top traffic sources by sessions</div>
              <SourceTable rows={p.trafficSources} />
            </Card>
            <Card pad={24}>
              <div style={{ ...labelStyle, marginBottom: 14 }}>Device split</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
                <SplitBar label="Desktop" value={p.device.desktop} color={B.peach} />
                <SplitBar label="Mobile" value={p.device.mobile} color={B.teal} />
                <SplitBar label="Tablet" value={p.device.tablet} color={B.sage} />
              </div>
              <div style={{ paddingTop: 14, borderTop: `1px solid ${B.divider}`, fontFamily: FONT_BODY, fontSize: 12, color: B.textSecondary, lineHeight: 1.55 }}>
                In-platform is desktop-dominant, inverting the pro-mobile / practice-desktop pattern seen in email engagement.
                Authenticated sessions skew toward practice-side activity.
              </div>
            </Card>
          </div>

          {/* Top events + Paid acquisition cross-reference */}
          <SectionTitle kicker="Behavior" accent={B.lavender}>
            Top events & paid attribution
          </SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 28 }}>
            <Card pad={24}>
              <div style={{ ...labelStyle, marginBottom: 14 }}>Top events by volume</div>
              <EventTable rows={p.topEvents} />
            </Card>
            <Card pad={24}>
              <div style={{ ...labelStyle, marginBottom: 14 }}>Google CPC-driven events</div>
              <LinkBarList data={p.paidDrivenEvents} color={B.peach} labelStyle="plain" />
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${B.divider}`, fontFamily: FONT_BODY, fontSize: 12, color: B.textSecondary, lineHeight: 1.55 }}>
                Google CPC accounts for 14.5% of all platform sessions and triggered {totalPaidDriven.toLocaleString()} measurable downstream
                events. Cross-references the Paid Acquisition tab — the May practice-reactivation $975 spend is part of a sustained
                paid footprint driving authenticated platform behavior.
              </div>
            </Card>
          </div>

          {/* Top pages + Landing pages */}
          <SectionTitle kicker="Pages" accent={B.sage}>
            Where the activity happens
          </SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
            <Card pad={24}>
              <div style={{ ...labelStyle, marginBottom: 14 }}>Top pages by views</div>
              <PageTable rows={p.topPages} />
            </Card>
            <Card pad={24}>
              <div style={{ ...labelStyle, marginBottom: 14 }}>Landing pages · entry funnel</div>
              <LandingTable rows={p.landingPages} />
            </Card>
          </div>

          {/* Data hygiene */}
          <Card pad={20} style={{ marginBottom: 28, background: B.peachTint, border: "none" }}>
            <div style={{ ...labelStyle, marginBottom: 8 }}>Data hygiene flags</div>
            <ul style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, lineHeight: 1.6, margin: 0, paddingLeft: 18 }}>
              <li>
                <strong>(not set) landing page · 5,870 sessions at 99.2% bounce.</strong> Roughly 8% of all sessions land on an unidentified URL
                and exit immediately. Likely deeplinks failing to resolve, session timeouts, or mobile-app traffic GA can't fingerprint.
              </li>
              <li style={{ marginTop: 6 }}>
                <strong>Non-US geography (Brazil, UK, Mexico) in top countries.</strong> Unexpected for a US dental staffing platform.
                Worth a quick check with engineering / support to determine whether this is team activity, contractor traffic, or noise.
              </li>
              <li style={{ marginTop: 6 }}>
                <strong>/administrator page · 35 users.</strong> Confirmed as internal team activity, included for completeness.
              </li>
            </ul>
          </Card>
        </>
      )}

      {activeSite === "public" && (
        <>
          {/* Public site header */}
          <Card pad={28} accent={B.navy} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
              <div>
                <div style={{ ...labelStyle, marginBottom: 8 }}>Property · {PUBLIC_SITE.url}</div>
                <h2 style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 28, color: B.navy, margin: 0, lineHeight: 1.15 }}>
                  {PUBLIC_SITE.name}
                </h2>
                <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontSize: 13, color: B.textMuted }}>
                  {PUBLIC_SITE.subtitle} · {PUBLIC_SITE.range}
                </div>
              </div>
              <StatusPill label={PUBLIC_SITE.status} color={B.sage} />
            </div>
          </Card>

          {/* Narrative headline */}
          <Card pad={26} accent={B.teal} style={{ marginBottom: 24 }}>
            <SectionTitle kicker="Headline read" accent={B.teal}>
              Mobile-first acquisition, deep desktop engagement
            </SectionTitle>
            <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: B.navy, lineHeight: 1.6, margin: 0 }}>
              The public site is mobile-dominant (59.4%) — the inverse of the authenticated platform (72% desktop). Visitors arrive
              on phones and convert to desktop once they're inside the product. Acquisition runs on organic search (53.9%) and direct
              (41.2%), accounting for 95% of all traffic; paid search is incremental to baseline, not foundational. The standout
              engagement signal is /shifts on desktop — 503 views, 3.41 sessions per user, 10:08 average session, 157 events per
              user. When practice-side decision-makers land on the public shift directory, they engage deeply.
            </p>
          </Card>

          {/* Headline metric tiles */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
            <MetricTile
              value="59.4%"
              label="Mobile share"
              caption="Inverts platform desktop bias"
              color={B.teal}
            />
            <MetricTile
              value="53.9%"
              label="Organic search"
              caption="Dominant acquisition channel"
              color={B.sage}
            />
            <MetricTile
              value="61.5%"
              label="Homepage share"
              caption="Of all public site page views"
              color={B.peach}
            />
            <MetricTile
              value="10:08"
              label="Engagement standout"
              caption="/shifts desktop avg session · 157 events / user"
              color={B.lavender}
            />
          </div>

          {/* Channel mix + device */}
          <SectionTitle kicker="Channel mix & device" accent={B.teal}>
            How users arrive
          </SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
            <Card pad={24}>
              <div style={{ ...labelStyle, marginBottom: 14 }}>Channel breakdown (% sessions)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {PUBLIC_SITE.channels.map((c, i) => (
                  <SplitBar
                    key={c.name}
                    label={c.name}
                    value={c.sharePct}
                    color={i === 0 ? B.sage : i === 1 ? B.teal : B.peach}
                  />
                ))}
              </div>
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${B.divider}`, fontFamily: FONT_BODY, fontSize: 12, color: B.textSecondary, lineHeight: 1.55 }}>
                Organic + direct = 95% of traffic. The May practice-reactivation paid spend ($975) sits within the "Other" bucket
                and is incremental to a strong baseline.
              </div>
            </Card>
            <Card pad={24}>
              <div style={{ ...labelStyle, marginBottom: 14 }}>Device split</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <SplitBar label="Mobile" value={PUBLIC_SITE.device.mobile} color={B.teal} />
                <SplitBar label="Desktop" value={PUBLIC_SITE.device.desktop} color={B.peach} />
                <SplitBar label="Tablet" value={PUBLIC_SITE.device.tablet} color={B.sage} />
              </div>
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${B.divider}`, fontFamily: FONT_BODY, fontSize: 12, color: B.textSecondary, lineHeight: 1.55 }}>
                Pre-auth visitors are mobile-first (59.4%). Once in the platform, the pattern inverts (72% desktop) — visitors
                arrive on phones and operate from desktop after signing up.
              </div>
            </Card>
          </div>

          {/* Traffic source detail */}
          <SectionTitle kicker="Traffic sources" accent={B.lavender}>
            Top sources by device & engagement
          </SectionTitle>
          <Card pad={24} style={{ marginBottom: 28 }}>
            <PubTrafficTable rows={PUBLIC_SITE.trafficSources} />
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${B.divider}`, fontFamily: FONT_BODY, fontSize: 12, color: B.textSecondary, lineHeight: 1.55 }}>
              Two anomalous entries — Direct + (campaign: organic) with 4+ sessions per user, 31 events per user, 5-minute sessions —
              suggest power-user / internal / partner behavior repeatedly returning. Worth verifying these aren't internal team
              traffic before drawing acquisition conclusions.
            </div>
          </Card>

          {/* Top pages */}
          <SectionTitle kicker="Pages" accent={B.sage}>
            Where engagement concentrates
          </SectionTitle>
          <Card pad={24} style={{ marginBottom: 28 }}>
            <PubPageTable rows={PUBLIC_SITE.topPages} />
          </Card>

          {/* Partner page performance */}
          <SectionTitle kicker="Partner pages" accent={B.peach}>
            Co-marketing landing performance
          </SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
            {PUBLIC_SITE.partnerPages.map((p) => (
              <Card key={p.page} accent={p.color} pad={22}>
                <div style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 12, color: B.textMuted, marginBottom: 6 }}>
                  {p.page}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 14, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 22, color: B.navy, lineHeight: 1 }}>
                      {p.views.toLocaleString()}
                    </div>
                    <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: B.textMuted, marginTop: 4, ...labelStyle }}>
                      Views
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 16, color: B.navy, lineHeight: 1.2 }}>
                      {p.avgSession}
                    </div>
                    <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: B.textMuted, marginTop: 4, ...labelStyle }}>
                      Avg session
                    </div>
                  </div>
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: B.navy, lineHeight: 1.5 }}>
                  {p.note}
                </div>
              </Card>
            ))}
          </div>

          {/* Referrers */}
          <SectionTitle kicker="External referrers" accent={B.teal}>
            Sites driving traffic to ondiem.com
          </SectionTitle>
          <Card pad={24} style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {PUBLIC_SITE.referrers.map((r) => (
                <div key={r.name} style={{ display: "grid", gridTemplateColumns: "200px 80px 1fr", gap: 14, alignItems: "center", paddingBottom: 12, borderBottom: `1px solid ${B.divider}` }}>
                  <div style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 12.5, color: B.navy, fontWeight: 500 }}>
                    {r.name}
                  </div>
                  <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 18, color: B.navy }}>
                    {r.visits.toLocaleString()}
                  </div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: B.textSecondary, lineHeight: 1.5 }}>
                    {r.note}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Data hygiene flags */}
          <Card pad={20} style={{ marginBottom: 28, background: B.peachTint, border: "none" }}>
            <div style={{ ...labelStyle, marginBottom: 8 }}>Data hygiene flags</div>
            <ul style={{ fontFamily: FONT_BODY, fontSize: 13, color: B.navy, lineHeight: 1.6, margin: 0, paddingLeft: 18 }}>
              <li>
                <strong>preview.hubspot.com referrer · multiple entries.</strong> HubSpot's email preview tool generates crawler events
                when emails are previewed in the HubSpot UI — these are filtered out of the referrer list above to avoid inflating
                "real" partner-referral counts.
              </li>
              <li style={{ marginTop: 6 }}>
                <strong>yahoo / organic spike · 1 user, 598 events, 2-second sessions.</strong> Almost certainly a scraper or
                bot. Excluded from headline organic share read.
              </li>
              <li style={{ marginTop: 6 }}>
                <strong>Internal redirects (pro-availability subdomains, partner-specific app subdomains).</strong> Some referral
                rows are internal subdomain redirects rather than external referrers — treated separately from genuine third-party traffic.
              </li>
              <li style={{ marginTop: 6 }}>
                <strong>Snapshot discrepancy noted.</strong> An earlier screenshot showed different absolute values (5,226 / 2,664 / 2,430 / 2,394)
                likely from a different date filter. The Apr 1 – May 21 window is used throughout this view.
              </li>
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}

/* ---------- Websites tab components ---------- */

function SitePivot({
  options,
  active,
  onChange,
}: {
  options: { id: "platform" | "public"; label: string; url: string }[];
  active: "platform" | "public";
  onChange: (id: "platform" | "public") => void;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          display: "inline-flex",
          padding: 5,
          background: B.cardBg,
          border: `1px solid ${B.cardBorder}`,
          borderRadius: 999,
          gap: 2,
        }}
      >
        {options.map((opt) => {
          const isActive = opt.id === active;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              style={{
                appearance: "none",
                cursor: "pointer",
                border: "none",
                padding: "10px 20px",
                borderRadius: 999,
                background: isActive ? B.navy : "transparent",
                color: isActive ? B.cream : B.textSecondary,
                fontFamily: FONT_BODY,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.01em",
                transition: "background 200ms ease, color 200ms ease",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                lineHeight: 1.2,
              }}
            >
              <span>{opt.label}</span>
              <span
                style={{
                  fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                  fontSize: 11,
                  opacity: isActive ? 0.75 : 0.6,
                  fontWeight: 500,
                  color: isActive ? B.cream : B.textMuted,
                }}
              >
                {opt.url}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DeltaTile({ value, label, delta, accent }: { value: string; label: string; delta: number; accent: string }) {
  const isPositive = delta >= 0;
  const arrow = isPositive ? "▲" : "▼";
  const deltaColor = isPositive ? B.sage : B.pink;
  return (
    <div
      style={{
        background: B.cardBg,
        border: `1px solid ${B.cardBorder}`,
        borderRadius: 14,
        padding: 22,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: accent,
        }}
      />
      <div
        style={{
          fontFamily: FONT_SERIF,
          fontWeight: 700,
          fontSize: 36,
          color: B.navy,
          lineHeight: 1.05,
          marginTop: 4,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 8,
          fontFamily: FONT_BODY,
          fontSize: 13,
          fontWeight: 600,
          color: B.navy,
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 6,
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: FONT_BODY,
          fontSize: 12,
          color: deltaColor,
          fontWeight: 600,
        }}
      >
        <span>{arrow}</span>
        <span>{Math.abs(delta).toFixed(1)}%</span>
        <span style={{ color: B.textMuted, fontWeight: 500 }}>vs. prior period</span>
      </div>
    </div>
  );
}

function SourceTable({ rows }: { rows: SourceRow[] }) {
  const headerStyle: React.CSSProperties = {
    ...labelStyle,
    paddingBottom: 10,
    borderBottom: `1px solid ${B.divider}`,
    textAlign: "left",
  };
  const cellStyle: React.CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: 12.5,
    color: B.navy,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottom: `1px solid ${B.divider}`,
  };
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={headerStyle}>Source</th>
          <th style={headerStyle}>Medium</th>
          <th style={{ ...headerStyle, textAlign: "right" }}>Sessions</th>
          <th style={{ ...headerStyle, textAlign: "right" }}>% sessions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={`${r.source}-${r.medium}`}>
            <td style={{ ...cellStyle, fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 11.5 }}>{r.source}</td>
            <td style={{ ...cellStyle, fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 11.5, color: B.textSecondary }}>{r.medium}</td>
            <td style={{ ...cellStyle, textAlign: "right", fontFamily: FONT_SERIF, fontWeight: 600 }}>{r.sessions.toLocaleString()}</td>
            <td style={{ ...cellStyle, textAlign: "right", color: B.textMuted }}>{r.sharePct.toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EventTable({ rows }: { rows: EventRow[] }) {
  const headerStyle: React.CSSProperties = {
    ...labelStyle,
    paddingBottom: 10,
    borderBottom: `1px solid ${B.divider}`,
    textAlign: "left",
  };
  const cellStyle: React.CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: 12.5,
    color: B.navy,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottom: `1px solid ${B.divider}`,
  };
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={headerStyle}>Event</th>
          <th style={{ ...headerStyle, textAlign: "right" }}>Events</th>
          <th style={{ ...headerStyle, textAlign: "right" }}>% events</th>
          <th style={{ ...headerStyle, textAlign: "right" }}>Active users</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const isPowerUserEvent = r.name === "temp_shift_offered";
          return (
            <tr key={r.name}>
              <td style={{ ...cellStyle, fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 11.5, fontWeight: isPowerUserEvent ? 700 : 500 }}>
                {r.name}
              </td>
              <td style={{ ...cellStyle, textAlign: "right", fontFamily: FONT_SERIF, fontWeight: 600 }}>{r.events.toLocaleString()}</td>
              <td style={{ ...cellStyle, textAlign: "right", color: B.textMuted }}>{r.sharePct.toFixed(1)}%</td>
              <td style={{ ...cellStyle, textAlign: "right", color: isPowerUserEvent ? B.navy : B.textSecondary, fontWeight: isPowerUserEvent ? 700 : 500 }}>
                {r.activeUsers.toLocaleString()}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function PageTable({ rows }: { rows: PageRow[] }) {
  const headerStyle: React.CSSProperties = {
    ...labelStyle,
    paddingBottom: 10,
    borderBottom: `1px solid ${B.divider}`,
    textAlign: "left",
  };
  const cellStyle: React.CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: 12.5,
    color: B.navy,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottom: `1px solid ${B.divider}`,
  };
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={headerStyle}>Page</th>
          <th style={{ ...headerStyle, textAlign: "right" }}>Views</th>
          <th style={{ ...headerStyle, textAlign: "right" }}>Active users</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.path}>
            <td style={{ ...cellStyle, fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 11.5 }}>{r.path}</td>
            <td style={{ ...cellStyle, textAlign: "right", fontFamily: FONT_SERIF, fontWeight: 600 }}>{r.views.toLocaleString()}</td>
            <td style={{ ...cellStyle, textAlign: "right", color: B.textSecondary }}>{r.activeUsers.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LandingTable({ rows }: { rows: LandingRow[] }) {
  const headerStyle: React.CSSProperties = {
    ...labelStyle,
    paddingBottom: 10,
    borderBottom: `1px solid ${B.divider}`,
    textAlign: "left",
  };
  const cellStyle: React.CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: 12.5,
    color: B.navy,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottom: `1px solid ${B.divider}`,
  };
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={headerStyle}>Landing page</th>
          <th style={{ ...headerStyle, textAlign: "right" }}>Sessions</th>
          <th style={{ ...headerStyle, textAlign: "right" }}>Bounce</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const isHighBounce = r.bounceRate >= 50;
          return (
            <tr key={r.path}>
              <td style={{ ...cellStyle, fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 11.5 }}>{r.path}</td>
              <td style={{ ...cellStyle, textAlign: "right", fontFamily: FONT_SERIF, fontWeight: 600 }}>{r.sessions.toLocaleString()}</td>
              <td style={{ ...cellStyle, textAlign: "right", color: isHighBounce ? B.pink : B.textSecondary, fontWeight: isHighBounce ? 700 : 500 }}>
                {r.bounceRate.toFixed(1)}%
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function PubTrafficTable({ rows }: { rows: PubTrafficRow[] }) {
  const headerStyle: React.CSSProperties = {
    ...labelStyle,
    paddingBottom: 10,
    borderBottom: `1px solid ${B.divider}`,
    textAlign: "left",
  };
  const cellStyle: React.CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: 12.5,
    color: B.navy,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottom: `1px solid ${B.divider}`,
  };
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={headerStyle}>Source</th>
            <th style={headerStyle}>Device</th>
            <th style={{ ...headerStyle, textAlign: "right" }}>Views</th>
            <th style={{ ...headerStyle, textAlign: "right" }}>Sess./User</th>
            <th style={{ ...headerStyle, textAlign: "right" }}>Avg session</th>
            <th style={{ ...headerStyle, textAlign: "right" }}>Events/User</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={`${r.source}-${r.device}-${idx}`}>
              <td style={{ ...cellStyle, fontWeight: 600 }}>{r.source}</td>
              <td style={{ ...cellStyle, fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 11.5, color: B.textSecondary }}>{r.device}</td>
              <td style={{ ...cellStyle, textAlign: "right", fontFamily: FONT_SERIF, fontWeight: 600 }}>{r.views.toLocaleString()}</td>
              <td style={{ ...cellStyle, textAlign: "right", color: B.textMuted }}>{r.sessionsPerUser.toFixed(2)}</td>
              <td style={{ ...cellStyle, textAlign: "right", fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 11.5 }}>{r.avgSession}</td>
              <td style={{ ...cellStyle, textAlign: "right", color: B.textMuted }}>{r.eventsPerUser.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PubPageTable({ rows }: { rows: PubPageRow[] }) {
  const headerStyle: React.CSSProperties = {
    ...labelStyle,
    paddingBottom: 10,
    borderBottom: `1px solid ${B.divider}`,
    textAlign: "left",
  };
  const cellStyle: React.CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: 12.5,
    color: B.navy,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottom: `1px solid ${B.divider}`,
  };
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={headerStyle}>Page</th>
            <th style={headerStyle}>Device</th>
            <th style={{ ...headerStyle, textAlign: "right" }}>Views</th>
            <th style={{ ...headerStyle, textAlign: "right" }}>Sess./User</th>
            <th style={{ ...headerStyle, textAlign: "right" }}>Avg session</th>
            <th style={{ ...headerStyle, textAlign: "right" }}>Events/User</th>
            <th style={headerStyle}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => {
            const isStandout = r.flag === "engagement-standout";
            const isPartner = r.flag === "partner-page";
            const rowBg = isStandout ? B.sageTint : "transparent";
            return (
              <tr key={`${r.path}-${r.device}-${idx}`} style={{ background: rowBg }}>
                <td style={{ ...cellStyle, fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 11.5, fontWeight: isStandout ? 700 : 500 }}>{r.path}</td>
                <td style={{ ...cellStyle, fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 11.5, color: B.textSecondary }}>{r.device}</td>
                <td style={{ ...cellStyle, textAlign: "right", fontFamily: FONT_SERIF, fontWeight: 600 }}>{r.views.toLocaleString()}</td>
                <td style={{ ...cellStyle, textAlign: "right", color: B.textMuted }}>{r.sessionsPerUser.toFixed(2)}</td>
                <td style={{ ...cellStyle, textAlign: "right", fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 11.5, fontWeight: isStandout ? 700 : 500 }}>{r.avgSession}</td>
                <td style={{ ...cellStyle, textAlign: "right", color: B.textMuted, fontWeight: isStandout ? 700 : 500 }}>{r.eventsPerUser >= 100 ? r.eventsPerUser.toFixed(0) : r.eventsPerUser.toFixed(2)}</td>
                <td style={{ ...cellStyle }}>
                  {isStandout && (
                    <span style={{ display: "inline-block", padding: "3px 8px", background: B.sage, borderRadius: 999, fontSize: 10, fontWeight: 700, color: B.navy, letterSpacing: "0.04em" }}>
                      ENGAGEMENT STANDOUT
                    </span>
                  )}
                  {isPartner && (
                    <span style={{ display: "inline-block", padding: "3px 8px", background: B.peachTint, borderRadius: 999, fontSize: 10, fontWeight: 700, color: B.navy, letterSpacing: "0.04em" }}>
                      PARTNER PAGE
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* =====================================================================
   LAYOUT HELPERS
   ===================================================================== */

function Hero({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          fontFamily: FONT_BODY,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: B.textMuted,
          marginBottom: 12,
        }}
      >
        {kicker}
      </div>
      <h1
        style={{
          fontFamily: FONT_SERIF,
          fontWeight: 700,
          fontSize: 44,
          color: B.navy,
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: "-0.012em",
        }}
      >
        {title}
      </h1>
      {sub && (
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 15,
            color: B.textSecondary,
            lineHeight: 1.55,
            margin: "14px 0 0 0",
            maxWidth: 720,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function Section({
  kicker,
  title,
  accent,
  children,
}: {
  kicker: string;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 36 }}>
      <SectionTitle kicker={kicker} accent={accent}>
        {title}
      </SectionTitle>
      {children}
    </section>
  );
}

/* =====================================================================
   PAGE
   ===================================================================== */

export default function Page() {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "historical", label: "Historical" },
    { id: "current", label: "Current" },
    { id: "future", label: "Future" },
    { id: "campaigns", label: "Campaigns" },
    { id: "paid-acquisition", label: "Paid Acquisition" },
    { id: "websites", label: "Websites" },
    { id: "partnerships", label: "Partnerships" },
    { id: "strategy", label: "Strategy" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: B.cream,
        fontFamily: FONT_BODY,
        color: B.textBody,
      }}
    >
      {/* Google fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Tinos:wght@400;700&family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@700&display=swap"
        rel="stylesheet"
      />

      {/* Top bar */}
      <header
        style={{
          background: B.cream,
          borderBottom: `1px solid ${B.divider}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo />
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span
              style={{
                fontFamily: FONT_BODY,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: B.textMuted,
              }}
            >
              May 2026
            </span>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <nav
        style={{
          background: B.cream,
          borderBottom: `1px solid ${B.divider}`,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <TabButton key={t.id} active={tab === t.id} label={t.label} onClick={() => setTab(t.id)} />
          ))}
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "44px 32px 80px" }}>
        {tab === "overview" && <OverviewTab />}
        {tab === "historical" && <HistoricalTab />}
        {tab === "current" && <CurrentTab />}
        {tab === "future" && <FutureTab />}
        {tab === "campaigns" && <CampaignsTab />}
        {tab === "paid-acquisition" && <PaidAcquisitionTab />}
        {tab === "websites" && <WebsitesTab />}
        {tab === "partnerships" && <PartnershipsTab />}
        {tab === "strategy" && <StrategyTab />}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: `1px solid ${B.divider}`,
          padding: "24px 32px",
          background: B.cream,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: FONT_BODY,
            fontSize: 12,
            color: B.textMuted,
          }}
        >
          <span>onDiem Decision Engine — Marketing Campaign Performance</span>
          <span>Sources: HubSpot · Google Ads · GA4 · Yourls · May 2026</span>
        </div>
      </footer>
    </div>
  );
}
