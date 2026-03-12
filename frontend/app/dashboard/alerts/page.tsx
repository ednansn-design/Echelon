import { Clock, Lightbulb, TrendingUp, CheckCircle2, Zap, Target, ArrowUpRight } from "lucide-react";

export default function AlertsPage() {
  const notifications = [
    {
      id: 1,
      type: "insight" as const,
      title: "You're 82% qualified for UNCF Scholarship",
      description: "Your GPA, major, and NSBE membership strongly match. Adding a reference letter could push your match to 94%.",
      action: "View scholarship →",
      time: "1 hour ago",
      icon: Lightbulb,
      color: "text-amber-600 bg-amber-50",
      unread: true,
    },
    {
      id: 2,
      type: "urgency" as const,
      title: "$25,000 closes in 7 days",
      description: "The UNCF Scholarship matched your profile at 82%. Estimated effort: ~3 hours to complete the application.",
      action: "Start application →",
      time: "3 hours ago",
      icon: Clock,
      color: "text-rose-500 bg-rose-50",
      unread: true,
    },
    {
      id: 3,
      type: "unlock" as const,
      title: "5 new scholarships unlocked",
      description: "Your NSBE membership and CS major matched you with 5 scholarships specifically for Black engineers worth $84,500.",
      time: "6 hours ago",
      icon: Zap,
      color: "text-emerald-600 bg-emerald-50",
      unread: true,
    },
    {
      id: 4,
      type: "insight" as const,
      title: "Blacks at Microsoft — strong match",
      description: "Your profile matches 72% of past winners. Students with hackathon experience like yours win 2.3x more often.",
      action: "View scholarship →",
      time: "1 day ago",
      icon: Lightbulb,
      color: "text-amber-600 bg-amber-50",
      unread: true,
    },
    {
      id: 5,
      type: "progress" as const,
      title: "Application in review",
      description: "The Thurgood Marshall College Fund committee has started reviewing your submission. Average review time: 2 weeks.",
      time: "2 days ago",
      icon: CheckCircle2,
      color: "text-indigo-500 bg-indigo-50",
      unread: false,
    },
    {
      id: 6,
      type: "urgency" as const,
      title: "$10,000 BHM Scholarship — 3 days left",
      description: "The Black History Month Scholarship only needs a 500-word essay. Your profile is a 74% match.",
      action: "Start application →",
      time: "3 days ago",
      icon: Clock,
      color: "text-rose-500 bg-rose-50",
      unread: false,
    },
    {
      id: 7,
      type: "insight" as const,
      title: "Upload a resume to unlock more",
      description: "Adding a resume would unlock 8 more scholarships worth $47,000. Most take under 5 minutes to apply.",
      action: "Complete profile →",
      time: "5 days ago",
      icon: Target,
      color: "text-violet-500 bg-violet-50",
      unread: false,
    },
    {
      id: 8,
      type: "progress" as const,
      title: "Taco Bell Live Más — under review",
      description: "Your video submission is being reviewed. Average review time: 2 weeks. You'll be notified of the result.",
      time: "1 week ago",
      icon: CheckCircle2,
      color: "text-indigo-500 bg-indigo-50",
      unread: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-full pb-8 max-w-3xl mx-auto w-full">
      <header className="pb-5 mb-2 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Alerts</h1>
          <p className="text-slate-400 text-xs font-medium mt-0.5">Insights, deadlines, and opportunities</p>
        </div>
        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
          Mark all read
        </button>
      </header>

      <div className="space-y-2">
        {notifications.map((note) => {
          const Icon = note.icon;
          const isInsight = note.type === "insight" || note.type === "unlock";
          return (
            <div
              key={note.id}
              className={`p-3.5 rounded-xl flex gap-3.5 transition-all ${note.unread ? "bg-white border border-slate-200/80 shadow-sm" : "bg-transparent border border-transparent opacity-70"
                }`}
            >
              <div className={`mt-0.5 p-2 rounded-lg h-9 w-9 flex items-center justify-center shrink-0 ${note.color}`}>
                <Icon size={18} />
              </div>

              <div className="flex-1 min-w-0">
                {isInsight && (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 mb-0.5 block">Insight</span>
                )}
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className={`text-[13px] font-semibold leading-tight ${note.unread ? "text-slate-900" : "text-slate-600"}`}>
                    {note.title}
                  </h3>
                  {note.unread && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0 ml-2"></span>}
                </div>
                <p className="text-[12px] text-slate-500 leading-snug mb-1.5 line-clamp-2">
                  {note.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-300">
                    {note.time}
                  </span>
                  {note.action && (
                    <span className="text-[11px] font-semibold text-indigo-600 flex items-center gap-0.5">
                      {note.action}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
