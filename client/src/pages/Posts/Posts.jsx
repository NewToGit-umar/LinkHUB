import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postsAPI } from "../../services/api";
import PostComposer from "../../components/PostComposer";

export default function Posts() {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const r = await postsAPI.list();
      return r.data.posts;
    },
    staleTime: 0,
  });

  const posts = data || [];
  const qc = useQueryClient();

  const publishMutation = useMutation({
    mutationFn: (id) => postsAPI.publish(id),
    onSuccess: () => qc.invalidateQueries(["posts"]),
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <button onClick={() => setOpen(true)} className="btn-primary">
          New Post
        </button>
      </div>

      {isLoading ? (
        <div>Loading posts…</div>
      ) : (
        <div className="space-y-4">
          {posts.length === 0 && (
            <div className="text-gray-600">No posts yet.</div>
          )}
          {posts.map((p) => (
            <div key={p._id} className="p-4 border rounded bg-white">
              <div className="text-sm text-gray-700 mb-2">{p.content}</div>
              <div className="text-xs text-gray-500">
                Platforms: {p.platforms.join(", ")}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-gray-400">Status: {p.status}</div>
                <div className="space-x-2">
                  {p.status !== "queued" &&
                    p.status !== "publishing" &&
                    p.status !== "published" && (
                      <button
                        onClick={() => publishMutation.mutate(p._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                      >
                        Queue
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PostComposer open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
