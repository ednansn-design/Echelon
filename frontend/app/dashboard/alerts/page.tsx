import { Clock, Lightbulb, TrendingUp, CheckCircle2, Zap, Target, ArrowUpRight } from "lucide-react";

export default function AlertsPage() {
  const notifications = [
    {
      id: 1,
      type: "insight" as const,
      title: "You're 80% qualified for this scholarship",
      description: "Your GPA and major match the Microsoft SWE Scholarship. Adding leadership experience could increase your match to 95%.",
      action: "View scholarship →",
      time: "2 hours ago",
      icon: Lightbulb,
      color: "text-amber-600 bg-amber-50",
      unread: true,
    },
    {
      id: 2,
      type: "urgency" as const,
      title: "$18,000 closes in 3 days",
      description: "The Women Techmakers Scholarship matched your profile at 87%. Estimated effort: ~2 hours to complete.",
      action: "Start application →",
      time: "5 hours ago",
      icon: Clock,
      color: "text-rose-500 bg-rose-50",
      unread: true,
    },
    {
      id: 3,
      type: "unlock" as const,
      title: "New opportunity unlocked",
      description: "Adding \"Computer Science\" as your major matched you with 4 new scholarships worth $23,500.",
      time: "1 day ago",
      icon: Zap,
      color: "text-emerald-600 bg-emerald-50",
      unread: true,
    },
    {
      id: 4,
      type: "progress" as const,
      title: "Application in review",
      description: "The Taco Bell Live Más Scholarship committee has started reviewing your submission. Average review time: 2 weeks.",
      time: "3 days ago",
      icon: CheckCircle2,
      color: "text-indigo-500 bg-indigo-50",
      unread: false,
    },
    {
      id: 5,
      type: "insight" as const,
      title: "You're one step away",
      description: "Upload a resume to unlock 6 more scholarships worth $31,000. Most take under 5 minutes to apply.",
      action: "Complete profile →",
      time: "5 days ago",
      icon: Target,
      color: "text-violet-500 bg-violet-50",
      unread: false,
    }
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
