"use client";

import { useState, useEffect } from "react";
import { Deck } from "@/components/discover/Deck";
import { Filter, Clock } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import { Scholarship } from "@/components/discover/SwipeCard";

export default function DiscoverPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetchWithAuth("/swipe/feed");
        if (res.ok) {
          const data = await res.json();
          setScholarships(data);
        }
      } catch (e) {
        console.error("Failed to load feed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const currentScholarship = scholarships[0];
  const upcomingScholarships = scholarships.slice(1, 4);
  const totalValue = scholarships.reduce((sum, s) => sum + s.amount, 0);

  // Calculate closing-soon value (scholarships with <= 14 days left)
  const closingSoonValue = scholarships
    .filter(s => s.deadline_days <= 14)
    .reduce((sum, s) => sum + s.amount, 0);
  const closingSoonCount = scholarships.filter(s => s.deadline_days <= 14).length;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between pb-3 md:pb-6 md:pt-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs md:hidden">
            E
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Discover</h1>
            <p className="hidden md:block text-xs text-slate-400 mt-0.5">
              {scholarships.length} scholarships • ${(totalValue / 1000).toFixed(0)}K total value
            </p>
          </div>
        </div>

        <button
          aria-label="Filter scholarships"
          className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Filter className="w-6 h-6" />
        </button>
      </header>

      {/* Closing Soon Banner */}
      {!loading && closingSoonCount > 0 && (
        <div className="flex items-center gap-2.5 bg-amber-50/80 border border-amber-200/60 rounded-lg px-3.5 py-2 mb-2 shrink-0">
          <Clock size={14} className="text-amber-500 shrink-0" />
          <p className="text-[12px] text-amber-700 font-medium leading-tight">
            <span className="font-bold">${(closingSoonValue / 1000).toFixed(0)}K</span> in {closingSoonCount} scholarship{closingSoonCount !== 1 ? "s" : ""} closing this month
          </p>
        </div>
      )}

      {/* Main Content — single column for mobile frame */}
      <div className="flex-1 relative flex flex-col justify-start pt-6 md:pt-12 min-w-0">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <Deck scholarships={scholarships} />
        )}
      </div>
    </div>
  );
}
