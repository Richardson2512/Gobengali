"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";

interface UsageData {
  plan: string;
  words_used: number;
  words_limit: number;
  ai_used: number;
  ai_limit: number;
}

export function UsageMeter() {
  const [usage, setUsage] = useState<UsageData | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) return;
    api.get("/auth/usage").then((res) => setUsage(res.data)).catch(() => {});
  }, []);

  if (!usage || usage.plan === "pro") return null;

  const wordsPct = Math.min(100, (usage.words_used / usage.words_limit) * 100);
  const aiPct = Math.min(100, (usage.ai_used / usage.ai_limit) * 100);

  function barColor(pct: number) {
    if (pct >= 90) return "bg-red-500";
    if (pct >= 70) return "bg-yellow-500";
    return "bg-green-500";
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Daily Usage</span>
        <span className="text-xs text-gray-500">Free Plan</span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Words</span>
          <span>{usage.words_used}/{usage.words_limit}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${barColor(wordsPct)}`} style={{ width: `${wordsPct}%` }} />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>AI Suggestions</span>
          <span>{usage.ai_used}/{usage.ai_limit}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${barColor(aiPct)}`} style={{ width: `${aiPct}%` }} />
        </div>
      </div>

      {(wordsPct >= 80 || aiPct >= 80) && (
        <Link href="/pricing" className="block text-center text-sm text-green-600 font-medium hover:underline">
          Upgrade to Pro for unlimited access
        </Link>
      )}
    </div>
  );
}
