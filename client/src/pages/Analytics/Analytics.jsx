import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { analyticsAPI } from "../../services/api";

function Bar({ label, value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center space-x-3">
      <div className="w-24 text-sm text-gray-700">{label}</div>
      <div className="flex-1 bg-gray-100 h-6 rounded overflow-hidden">
        <div className="h-6 bg-blue-600" style={{ width: `${pct}%` }} />
      </div>
      <div className="w-20 text-right text-sm text-gray-700">{value}</div>
    </div>
  );
}

export default function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics", "aggregate"],
    queryFn: async () => {
      const r = await analyticsAPI.aggregate();
      return r.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const totals = data?.totals || [];
  const topPosts = data?.topPosts || [];

  const maxMetric = useMemo(() => {
    let max = 0;
    for (const t of totals) {
      max = Math.max(
        max,
        t.likes || 0,
        t.shares || 0,
        t.comments || 0,
        t.reach || 0
      );
    }
    return max;
  }, [totals]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>

      {isLoading ? (
        <div>Loading analytics…</div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Totals by Platform</h2>
            <div className="space-y-3">
              {totals.length === 0 && (
                <div className="text-gray-600">No analytics available.</div>
              )}
              {totals.map((t) => (
                <div key={t.platform} className="p-3 border rounded bg-white">
                  <div className="mb-2 font-medium">{t.platform}</div>
                  <Bar label="Likes" value={t.likes || 0} max={maxMetric} />
                  <div className="h-2" />
                  <Bar label="Shares" value={t.shares || 0} max={maxMetric} />
                  <div className="h-2" />
                  <Bar
                    label="Comments"
                    value={t.comments || 0}
                    max={maxMetric}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Top Posts</h2>
            <div className="space-y-3">
              {topPosts.length === 0 && (
                <div className="text-gray-600">No top posts available.</div>
              )}
              {topPosts.map((p) => (
                <div
                  key={p.postId || Math.random()}
                  className="p-3 border rounded bg-white"
                >
                  <div className="text-sm text-gray-800 mb-1">
                    Post: {String(p.postId).slice(0, 8)}
                  </div>
                  <div className="text-xs text-gray-600">
                    Engagement score: {p.score || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
