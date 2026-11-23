import { useMemo, useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  HelpCircle,
  Mail,
  Search,
  ShieldCheck,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "How does organization onboarding and invitation work?",
    answer:
      "When a superadmin creates an organization from the Organizations page, WorkSync generates the organization record and dispatches a Supabase Auth invitation to the provided administrator email. Once the administrator accepts and sets their password, they gain access to configure departments, locations, and invite recruiters.",
  },
  {
    question: "What are the differences between Admin and Recruiter roles?",
    answer:
      "Administrators possess organizational management authority—they configure departments, office locations, team members, and hold approval authority over pending requisitions. Recruiters focus on execution: drafting requisitions, submitting them for approval, and maintaining the candidate talent pool with Google Drive resume attachments.",
  },
  {
    question: "How does the Requisition Approval Lifecycle work?",
    answer:
      "1. Draft: A recruiter creates a requisition.\n2. Pending Approval: The recruiter submits the requisition.\n3. Decision: An administrator reviews the requisition on the Requisitions page and either approves it (making it active/open) or rejects it with feedback.\n4. Revision: If rejected, the recruiter edits the draft and re-submits.",
  },
  {
    question: "How is tenant data isolated across organizations?",
    answer:
      "WorkSync uses multi-tenant Row Level Security (RLS) in Supabase. Every requisition, candidate profile, department, and location is strictly keyed by organization_id. Recruiters and administrators can only view and manage records matching their assigned organization membership.",
  },
  {
    question: "Why are Google Drive resume URLs enforced?",
    answer:
      "To ensure corporate compliance, security, and low platform storage overhead, resumes are maintained in Google Drive / Google Docs. Recruiters paste the shareable Drive link, ensuring document access policies remain managed within the organization's Google Workspace.",
  },
  {
    question: "Where are security audit logs stored?",
    answer:
      "All critical state transitions (such as requisition reviews, organization suspensions, and member status toggles) are written to the audit_events table. Superadmins can inspect the timeline or export CSV audit records from the Audit Logs section.",
  },
];

export default function SuperadminHelp() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const filteredFaqs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return FAQ_ITEMS;
    return FAQ_ITEMS.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-textSecondary mb-1">
            <span>WorkSync Platform</span>
            <span>/</span>
            <span className="font-semibold text-primary">Help & Documentation</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary">
            Knowledge Base & Guidance
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            System architecture, administration guides, security practices, and troubleshooting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="mailto:support@worksync.io?subject=WorkSync Platform Support Request"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-primary/90 transition-all"
          >
            <Mail className="h-4 w-4" />
            <span>Contact Support</span>
          </a>
        </div>
      </div>

      {/* Quick Search */}
      <section className="relative rounded-2xl border border-border bg-gradient-to-r from-surface via-background to-surface p-6 shadow-xs">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-lg font-bold text-textPrimary">How can we help you today?</h2>
          <p className="text-xs text-textSecondary">
            Search documentation, troubleshooting guides, and role capability answers.
          </p>
          <div className="relative pt-2">
            <Search className="absolute left-3 top-4.5 h-4 w-4 text-textSecondary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search knowledge base (e.g. invitations, requisitions, roles, drive links)…"
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-xs text-textPrimary placeholder:text-textSecondary focus:border-primary focus:outline-none shadow-xs"
            />
          </div>
        </div>
      </section>

      {/* Role Capabilities Matrix */}
      <section className="rounded-2xl border border-border bg-background p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-base font-bold text-textPrimary">Role & Access Matrix</h2>
            <p className="text-xs text-textSecondary">
              Privileges across Platform Superadmin, Org Admin, Recruiter, and Employee.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Enforced via RLS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface text-textSecondary font-semibold">
              <tr>
                <th className="p-3">Capability / Area</th>
                <th className="p-3 text-center">Superadmin</th>
                <th className="p-3 text-center">Org Admin</th>
                <th className="p-3 text-center">Recruiter</th>
                <th className="p-3 text-center">Employee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-surface/50">
                <td className="p-3 font-medium">Create Customer Organizations</td>
                <td className="p-3 text-center font-bold text-emerald-600">✓ Full</td>
                <td className="p-3 text-center text-textSecondary">—</td>
                <td className="p-3 text-center text-textSecondary">—</td>
                <td className="p-3 text-center text-textSecondary">—</td>
              </tr>
              <tr className="hover:bg-surface/50">
                <td className="p-3 font-medium">Manage Workspace Departments & Locations</td>
                <td className="p-3 text-center font-bold text-emerald-600">✓ Read</td>
                <td className="p-3 text-center font-bold text-emerald-600">✓ Full</td>
                <td className="p-3 text-center text-textSecondary">—</td>
                <td className="p-3 text-center text-textSecondary">—</td>
              </tr>
              <tr className="hover:bg-surface/50">
                <td className="p-3 font-medium">Create Requisitions & Job Openings</td>
                <td className="p-3 text-center text-textSecondary">—</td>
                <td className="p-3 text-center font-bold text-emerald-600">✓ Full</td>
                <td className="p-3 text-center font-bold text-emerald-600">✓ Full</td>
                <td className="p-3 text-center text-textSecondary">—</td>
              </tr>
              <tr className="hover:bg-surface/50">
                <td className="p-3 font-medium">Approve / Reject Requisitions</td>
                <td className="p-3 text-center text-textSecondary">—</td>
                <td className="p-3 text-center font-bold text-emerald-600">✓ Exclusive</td>
                <td className="p-3 text-center text-textSecondary">Submit Only</td>
                <td className="p-3 text-center text-textSecondary">—</td>
              </tr>
              <tr className="hover:bg-surface/50">
                <td className="p-3 font-medium">Resume Pool & Candidate Capture</td>
                <td className="p-3 text-center text-textSecondary">—</td>
                <td className="p-3 text-center font-bold text-emerald-600">✓ Full</td>
                <td className="p-3 text-center font-bold text-emerald-600">✓ Full</td>
                <td className="p-3 text-center text-textSecondary">—</td>
              </tr>
              <tr className="hover:bg-surface/50">
                <td className="p-3 font-medium">Platform Audit Logs & Global Settings</td>
                <td className="p-3 text-center font-bold text-emerald-600">✓ Exclusive</td>
                <td className="p-3 text-center text-textSecondary">—</td>
                <td className="p-3 text-center text-textSecondary">—</td>
                <td className="p-3 text-center text-textSecondary">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Knowledge Base FAQs */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-bold text-textPrimary">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-border bg-background shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between p-4 text-left font-semibold text-textPrimary hover:bg-surface/50 text-xs sm:text-sm"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-textSecondary transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-border bg-surface/30 p-4 text-xs text-textSecondary leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Support Card */}
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-textPrimary">Need specialized assistance?</h3>
          <p className="text-xs text-textSecondary">
            Our platform engineering and operations team can assist with tenant configuration or Supabase setup.
          </p>
        </div>
        <a
          href="mailto:support@worksync.io"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-textPrimary hover:bg-surface shadow-xs transition-colors shrink-0"
        >
          <span>support@worksync.io</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </section>
    </div>
  );
}
