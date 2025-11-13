"use client";

import { useEditorStore } from "@/store/editorStore";
import { AlertCircle, Zap } from "lucide-react";

export function UsageLimitBanner() {
  const { 
    dailyWordUsage, 
    dailyWordLimit, 
    dailyAcceptsUsage, 
    dailyAcceptsLimit,
    userTier 
  } = useEditorStore();

  // Don't show for pro users
  if (userTier === 'pro') return null;

  const wordPercentage = (dailyWordUsage / dailyWordLimit) * 100;
  const acceptPercentage = (dailyAcceptsUsage / dailyAcceptsLimit) * 100;
  
  const isWordLimitClose = wordPercentage >= 80;
  const isAcceptLimitClose = acceptPercentage >= 80;
  const isWordLimitReached = dailyWordUsage >= dailyWordLimit;
  const isAcceptLimitReached = dailyAcceptsUsage >= dailyAcceptsLimit;

  // Only show if close to limit or limit reached
  if (!isWordLimitClose && !isAcceptLimitClose) return null;

  return (
    <div className={`border-l-4 p-4 mb-4 ${
      isWordLimitReached || isAcceptLimitReached
        ? 'bg-red-50 border-red-500'
        : 'bg-yellow-50 border-yellow-500'
    }`}>
      <div className="flex items-start">
        <AlertCircle className={`mr-3 mt-0.5 ${
          isWordLimitReached || isAcceptLimitReached ? 'text-red-600' : 'text-yellow-600'
        }`} size={20} />
        <div className="flex-1">
          <h3 className={`font-semibold mb-2 ${
            isWordLimitReached || isAcceptLimitReached ? 'text-red-900' : 'text-yellow-900'
          }`}>
            {isWordLimitReached || isAcceptLimitReached ? 'Daily Limit Reached' : 'Approaching Daily Limit'}
          </h3>
          
          <div className="space-y-2 text-sm">
            {/* Word Usage */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">Words written today:</span>
                <span className={`font-semibold ${isWordLimitReached ? 'text-red-600' : 'text-gray-900'}`}>
                  {dailyWordUsage} / {dailyWordLimit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    isWordLimitReached ? 'bg-red-600' : wordPercentage >= 90 ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.min(wordPercentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Accept Usage */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">AI suggestions accepted:</span>
                <span className={`font-semibold ${isAcceptLimitReached ? 'text-red-600' : 'text-gray-900'}`}>
                  {dailyAcceptsUsage} / {dailyAcceptsLimit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    isAcceptLimitReached ? 'bg-red-600' : acceptPercentage >= 90 ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.min(acceptPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {(isWordLimitReached || isAcceptLimitReached) && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                ⏰ Limits reset at midnight. Come back tomorrow, or upgrade now!
              </p>
              <button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm">
                <Zap size={16} />
                Upgrade to Pro - Unlimited Access
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

