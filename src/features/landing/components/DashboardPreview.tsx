import { memo } from "react";
import {
  BarChart3,
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  Users,
  Wallet,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { candidateCards, analyticsData, calendarEvents } from "./data";

type PreviewVariant =
  | "overview"
  | "ai-recruitment"
  | "employee"
  | "payroll"
  | "attendance"
  | "leave"
  | "performance"
  | "reporting";

interface DashboardPreviewProps {
  variant?: PreviewVariant;
  className?: string;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Users, label: "Recruitment" },
  { icon: CreditCard, label: "Payroll" },
  { icon: CalendarCheck, label: "Attendance" },
  { icon: BarChart3, label: "Reports" },
];

/** Mini sparkline shown in stat widgets. */
function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const max = Math.max(...data);
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={cn("h-8 w-full", className)}>
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Small tabular widget reused across the dashboard preview. */
function StatWidget({
  label,
  value,
  trend,
  icon: Icon,
  data,
}: {
  label: string;
  value: string;
  trend: string;
  icon: typeof TrendingUp;
  data: number[];
}) {
  return (
    <div className="rounded-xl border border-[var(--ws-colors-border)] bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[var(--ws-colors-muted)]">{label}</span>
        <Icon className="h-3.5 w-3.5 text-[var(--ws-colors-primary-blue)]" />
      </div>
      <p className="mt-1 text-lg font-bold text-[var(--ws-colors-text-primary)]">{value}</p>
      <div className="mt-1 flex items-center gap-1">
        <span className="text-[10px] font-semibold text-[var(--ws-colors-success)]">{trend}</span>
        <Sparkline data={data} className="h-6 w-16 text-[var(--ws-colors-primary-blue)]" />
      </div>
    </div>
  );
}

const CandidateCard = memo(function CandidateCard() {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-[var(--ws-colors-text-primary)]">
        Top Candidates
      </p>
      {candidateCards.map((c) => (
        <div
          key={c.name}
          className="flex items-center justify-between rounded-lg border border-[var(--ws-colors-border)] bg-[var(--ws-colors-surface)] p-2"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--ws-colors-primary-blue)]/10 text-[10px] font-semibold text-[var(--ws-colors-primary-blue)]">
              {c.initials}
            </span>
            <div>
              <p className="text-[11px] font-medium text-[var(--ws-colors-text-primary)]">
                {c.name}
              </p>
              <p className="text-[10px] text-[var(--ws-colors-muted)]">{c.role}</p>
            </div>
          </div>
          <span className="rounded-md bg-[var(--ws-colors-success)]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--ws-colors-success)]">
            {c.score}
          </span>
        </div>
      ))}
    </div>
  );
});

const CalendarCard = memo(function CalendarCard() {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-[var(--ws-colors-text-primary)]">Schedule</p>
      <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-[var(--ws-colors-muted)]">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="font-medium">
            {d}
          </span>
        ))}
        {Array.from({ length: 30 }).map((_, i) => {
          const ev = calendarEvents.find((e) => e.day === i + 1);
          return (
            <span
              key={i}
              className={cn(
                "flex h-5 items-center justify-center rounded text-[9px]",
                ev
                  ? "bg-[var(--ws-colors-primary-blue)] text-white"
                  : i % 7 === 0
                    ? "bg-[var(--ws-colors-primary-blue)]/10 font-semibold text-[var(--ws-colors-primary-blue)]"
                    : "text-[var(--ws-colors-text-primary)]/70",
              )}
            >
              {i + 1}
            </span>
          );
        })}
      </div>
    </div>
  );
});

const PayrollWidget = memo(function PayrollWidget() {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-[var(--ws-colors-text-primary)]">Payroll</p>
      <div className="flex items-center justify-between rounded-lg border border-[var(--ws-colors-border)] bg-[var(--ws-colors-surface)] p-2">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-[var(--ws-colors-success)]" />
          <div>
            <p className="text-[11px] font-medium text-[var(--ws-colors-text-primary)]">
              March Cycle
            </p>
            <p className="text-[10px] text-[var(--ws-colors-muted)]">1,248 employees</p>
          </div>
        </div>
        <p className="text-xs font-bold text-[var(--ws-colors-primary-blue)]">$482K</p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--ws-colors-surface)]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[var(--ws-colors-primary-blue)] to-[var(--ws-colors-success)]"
          initial={{ width: 0 }}
          animate={{ width: "87%" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
});

const AttendanceWidget = memo(function AttendanceWidget() {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-[var(--ws-colors-text-primary)]">
        Attendance
      </p>
      <div className="flex items-center justify-between rounded-lg border border-[var(--ws-colors-border)] bg-[var(--ws-colors-surface)] p-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[var(--ws-colors-warning)]" />
          <div>
            <p className="text-[11px] font-medium text-[var(--ws-colors-text-primary)]">
              On time today
            </p>
            <p className="text-[10px] text-[var(--ws-colors-muted)]">94% of workforce</p>
          </div>
        </div>
        <p className="text-xs font-bold text-[var(--ws-colors-success)]">96%</p>
      </div>
    </div>
  );
});

const AIHiringWidget = memo(function AIHiringWidget() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-[var(--ws-colors-text-primary)]">
          AI Hiring Score
        </p>
        <Sparkles className="h-3.5 w-3.5 text-[var(--ws-colors-primary-blue)]" />
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="var(--ws-colors-surface-secondary)"
              strokeWidth="6"
            />
            <motion.circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="var(--ws-colors-primary-blue)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 24}
              initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - 0.92) }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
          </svg>
          <span className="absolute text-xs font-bold text-[var(--ws-colors-text-primary)]">92</span>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-[var(--ws-colors-text-primary)]">
            Strong match
          </p>
          <p className="text-[10px] text-[var(--ws-colors-muted)]">Top 5% of applicants</p>
        </div>
      </div>
    </div>
  );
});

/** Main analytics chart built with divs + motion. */
function AnalyticsChart() {
  const max = Math.max(...analyticsData.map((d) => d.hires));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-[var(--ws-colors-text-primary)]">
          Hiring Velocity
        </p>
        <span className="rounded-md bg-[var(--ws-colors-success)]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--ws-colors-success)]">
          +18%
        </span>
      </div>
      <div className="flex h-24 items-end gap-1.5">
        {analyticsData.map((d, i) => (
          <div key={d.name} className="flex flex-1 flex-col items-center gap-1">
            <motion.div
              className="w-full rounded-t-md bg-gradient-to-t from-[var(--ws-colors-primary-blue)] to-[var(--ws-colors-secondary-blue)]"
              initial={{ height: 0 }}
              animate={{ height: `${(d.hires / max) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
            />
            <span className="text-[8px] text-[var(--ws-colors-muted)]">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Composable, animated dashboard preview built entirely with React. */
function DashboardPreview({ variant = "overview", className }: DashboardPreviewProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[var(--ws-colors-border)] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.12)]",
        className,
      )}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-[var(--ws-colors-border)] bg-[var(--ws-colors-surface)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--ws-colors-error)]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--ws-colors-warning)]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--ws-colors-success)]/70" />
        <div className="ml-3 flex-1 rounded-md bg-white px-3 py-1 text-[10px] text-[var(--ws-colors-muted)]">
          app.worksync.com/dashboard
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-40 shrink-0 flex-col gap-1 border-r border-[var(--ws-colors-border)] bg-[var(--ws-colors-surface)] p-3 sm:flex">
          {sidebarItems.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px]",
                item.active
                  ? "bg-[var(--ws-colors-primary-blue)] font-medium text-white"
                  : "text-[var(--ws-colors-muted)]",
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </div>
          ))}
          <div className="mt-auto rounded-lg bg-[var(--ws-colors-primary-blue)]/10 p-2">
            <p className="text-[10px] font-medium text-[var(--ws-colors-primary-blue)]">
              Workforce Pro
            </p>
            <p className="text-[9px] text-[var(--ws-colors-muted)]">2,400 employees</p>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 space-y-4 p-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatWidget
              label="Total Staff"
              value="2,431"
              trend="+12%"
              icon={Users}
              data={[40, 55, 50, 70, 65, 85]}
            />
            <StatWidget
              label="Open Roles"
              value="48"
              trend="+8%"
              icon={TrendingUp}
              data={[30, 45, 40, 60, 55, 75]}
            />
            <StatWidget
              label="Payroll Run"
              value="$482K"
              trend="+5%"
              icon={Wallet}
              data={[20, 35, 30, 45, 50, 60]}
            />
            <StatWidget
              label="Attendance"
              value="96%"
              trend="+2%"
              icon={CalendarCheck}
              data={[70, 75, 80, 78, 88, 92]}
            />
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <div className="rounded-xl border border-[var(--ws-colors-border)] bg-white p-3 shadow-sm lg:col-span-2">
              <AnalyticsChart />
            </div>
            <div className="relative rounded-xl border border-[var(--ws-colors-border)] bg-white p-3 shadow-sm">
              <AIHiringWidget />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[var(--ws-colors-border)] bg-white p-3 shadow-sm">
              <CandidateCard />
            </div>
            <div className="rounded-xl border border-[var(--ws-colors-border)] bg-white p-3 shadow-sm">
              <CalendarCard />
            </div>
            <div className="rounded-xl border border-[var(--ws-colors-border)] bg-white p-3 shadow-sm">
              <PayrollWidget />
            </div>
            <div className="rounded-xl border border-[var(--ws-colors-border)] bg-white p-3 shadow-sm">
              <AttendanceWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(DashboardPreview);
export type { PreviewVariant };
