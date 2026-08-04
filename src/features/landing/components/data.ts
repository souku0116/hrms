import {
  Activity,
  BarChart3,
  Briefcase,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  GraduationCap,
  HeartPulse,
  LineChart,
  TrendingUp,
  Users,
  Wallet,
  Building2,
  Factory,
  ShoppingBag,
  Truck,
  GraduationCap as EducationIcon,
  Cpu,
  Landmark,
  ShoppingCart,
  FileSearch,
  Bot,
  GitCompareArrows,
  Video,
  FileCheck2,
  Sparkles,
} from "lucide-react";

/** Trusted companies marquee — placeholder logotypes (no copyrighted logos). */
export const trustedCompanies = [
  { name: "Nimbus", initials: "NB" },
  { name: "Vertex", initials: "VX" },
  { name: "Orbit", initials: "OB" },
  { name: "Pioneer", initials: "PN" },
  { name: "Lumen", initials: "LM" },
  { name: "Atlas", initials: "AT" },
  { name: "Cobalt", initials: "CB" },
  { name: "Summit", initials: "SM" },
];

/** Solutions section cards. */
export const solutions = [
  {
    icon: FileSearch,
    title: "Recruitment",
    description:
      "AI-assisted sourcing, screening and candidate matching that accelerates time-to-hire.",
  },
  {
    icon: Briefcase,
    title: "Staffing",
    description:
      "Flexible workforce planning and staffing automation for changing business demand.",
  },
  {
    icon: Wallet,
    title: "Payroll",
    description:
      "Automated payroll cycles compliant with local regulations, taxes and benefits.",
  },
  {
    icon: CalendarCheck,
    title: "Attendance",
    description:
      "Real-time attendance tracking with smart scheduling and leave management.",
  },
  {
    icon: TrendingUp,
    title: "Performance",
    description:
      "Continuous performance reviews, goal tracking and feedback loops in one place.",
  },
  {
    icon: GraduationCap,
    title: "Learning",
    description:
      "Skill development and onboarding programs that keep your workforce future-ready.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Executive dashboards and workforce intelligence that surface actionable insights.",
  },
];

/** Platform features tabs. */
export const platformFeatures = [
  {
    id: "ai-recruitment",
    label: "AI Recruitment",
    headline: "Source and match talent with AI precision",
    description:
      "Automate resume screening, rank candidates by fit and surface the strongest matches instantly.",
    icon: Bot,
  },
  {
    id: "employee-db",
    label: "Employee Database",
    headline: "A single source of truth for your people",
    description:
      "Centralize employee records, documents, roles and history in a secure, searchable database.",
    icon: Users,
  },
  {
    id: "payroll",
    label: "Payroll Automation",
    headline: "Run payroll without the spreadsheet chaos",
    description:
      "Automate salary computation, tax deductions and disbursements with full compliance.",
    icon: CreditCard,
  },
  {
    id: "attendance",
    label: "Attendance",
    headline: "Track attendance in real time",
    description:
      "Captures clock-ins, shifts and overtime automatically with a live attendance view.",
    icon: CalendarCheck,
  },
  {
    id: "leave",
    label: "Leave",
    headline: "Leave management that just works",
    description:
      "Request, approve and track leave balances with policy-based rules and smart workflows.",
    icon: ClipboardList,
  },
  {
    id: "performance",
    label: "Performance",
    headline: "Drive performance with clarity",
    description:
      "Set goals, run reviews and track feedback so every employee knows how they are doing.",
    icon: Activity,
  },
  {
    id: "reporting",
    label: "Reporting",
    headline: "Insights that guide better decisions",
    description:
      "Generate workforce, payroll and hiring reports with beautiful, shareable dashboards.",
    icon: LineChart,
  },
];

/** Industries grid. */
export const industries = [
  { icon: HeartPulse, title: "Healthcare", description: "Compliant staffing and credential tracking." },
  { icon: Cpu, title: "IT", description: "Hire specialized talent at scale with speed." },
  { icon: ShoppingBag, title: "Retail", description: "Flexible staffing for seasonal demand." },
  { icon: Factory, title: "Manufacturing", description: "Shift planning and workforce compliance." },
  { icon: EducationIcon, title: "Education", description: "Credentialed hiring and faculty records." },
  { icon: Truck, title: "Logistics", description: "Real-time dispatch and attendance tracking." },
  { icon: Landmark, title: "Finance", description: "Audit-ready payroll and compliance controls." },
  { icon: ShoppingCart, title: "E-commerce", description: "Scale customer support teams efficiently." },
];

/** AI recruitment workflow steps. */
export const aiWorkflow = [
  { icon: FileSearch, title: "Resume", description: "Upload candidate resumes" },
  { icon: Bot, title: "AI Scan", description: "Automated parsing & screening" },
  { icon: GitCompareArrows, title: "Matching", description: "Role-fit scoring" },
  { icon: Video, title: "Interview", description: "Scheduling & feedback" },
  { icon: FileCheck2, title: "Offer", description: "Offer & onboarding" },
];

/** Growth timeline. */
export const growthTimeline = [
  {
    period: "Phase 1",
    title: "Automation",
    description:
      "Automate repetitive HR tasks so your team focuses on people, not paperwork.",
  },
  {
    period: "Phase 2",
    title: "Hiring",
    description:
      "Scale hiring with AI-assisted sourcing and a rich candidate pipeline.",
  },
  {
    period: "Phase 3",
    title: "Payroll",
    description:
      "Streamline payroll with automated, compliant, error-free cycles.",
  },
  {
    period: "Phase 4",
    title: "Scaling",
    description:
      "Grow with confidence using workforce analytics that guide every decision.",
  },
];

/** Stats for animated counters. */
export const stats = [
  { value: 250, suffix: "K+", label: "Employees managed" },
  { value: 1500, suffix: "+", label: "Companies onboard" },
  { value: 99.9, suffix: "%", label: "Uptime guarantee", decimals: 1 },
  { value: 95, suffix: "%", label: "Hiring accuracy" },
];

/** Testimonials. */
export const testimonials = [
  {
    name: "Sarah Chen",
    role: "VP of People · Northwind",
    quote:
      "WorkSync cut our time-to-hire by 40%. The AI matching is uncannily accurate and the dashboard is a dream to use.",
    initials: "SC",
    rating: 5,
  },
  {
    name: "Marcus Reid",
    role: "Head of Talent · Summit",
    quote:
      "We finally have one source of truth for payroll, attendance and hiring. Onboarding took an afternoon, not a quarter.",
    initials: "MR",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "HR Director · Orbit",
    quote:
      "The automation freed our team from spreadsheet hell. WorkSync feels like a product built for how modern HR actually works.",
    initials: "PS",
    rating: 5,
  },
];

/** Navbar links. */
export const navLinks = [
  { href: "#solutions", label: "Solutions" },
  { href: "#platform", label: "Platform" },
  { href: "#industries", label: "Industries" },
  { href: "#ai-recruitment", label: "AI Recruiting" },
  { href: "#growth", label: "Growth" },
  { href: "#testimonials", label: "Customers" },
];

/** Footer link groups. */
export const footerLinkGroups = [
  {
    title: "Product",
    links: [
      { href: "#platform", label: "Platform" },
      { href: "#solutions", label: "Solutions" },
      { href: "#ai-recruitment", label: "AI Recruiting" },
      { href: "#industries", label: "Industries" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#growth", label: "Our Story" },
      { href: "#testimonials", label: "Customers" },
      { href: "#stats", label: "Impact" },
      { href: "#contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "#platform", label: "Documentation" },
      { href: "#platform", label: "Security" },
      { href: "#platform", label: "API Reference" },
      { href: "#platform", label: "Status" },
    ],
  },
];

/** Dashboard preview widgets. */
export const candidateCards = [
  { name: "Ava Thompson", role: "Senior Frontend", score: 94, initials: "AT" },
  { name: "Liam Carter", role: "Product Manager", score: 88, initials: "LC" },
  { name: "Mia Patel", role: "Data Analyst", score: 91, initials: "MP" },
];

export const analyticsData = [
  { name: "Mon", hires: 8 },
  { name: "Tue", hires: 12 },
  { name: "Wed", hires: 9 },
  { name: "Thu", hires: 16 },
  { name: "Fri", hires: 14 },
  { name: "Sat", hires: 11 },
  { name: "Sun", hires: 18 },
];

export const calendarEvents = [
  { day: 8, label: "Interview" },
  { day: 12, label: "Review" },
  { day: 19, label: "Onboard" },
  { day: 24, label: "Payroll" },
];

/** Sparkle icon alias for hero decorative elements. */
export { Sparkles };
