import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsAPI } from "../services/api";

export default function PostComposer({ open, onClose }) {
  const qc = useQueryClient();
  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [scheduledAt, setScheduledAt] = useState("");

  const mutation = useMutation({
    mutationFn: (payload) => postsAPI.create(payload),
    onSuccess: () => {
      qc.invalidateQueries(["posts"]);
      qc.invalidateQueries(["dashboard"]);
      setContent("");
      setPlatforms([]);
      setScheduledAt("");
      onClose();
    },
  });

  const providerOptions = [
    "twitter",
    "instagram",
    "facebook",
    "linkedin",
    "tiktok",
    "youtube",
  ];

  const togglePlatform = (p) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const submit = (e) => {
    e.preventDefault();
    mutation.mutate({
      content,
      platforms,
      scheduledAt: scheduledAt || undefined,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={submit}
        className="w-full max-w-2xl bg-white rounded-lg p-6 shadow-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">New Post</h2>
          <button type="button" onClick={onClose} className="text-gray-500">
            Close
          </button>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post..."
          className="w-full p-3 border rounded mb-4 min-h-[120px]"
        />

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Platforms</div>
          <div className="flex flex-wrap gap-2">
            {providerOptions.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={`px-3 py-1 rounded border ${
                  platforms.includes(p)
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm block mb-1">Schedule (optional)</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isLoading || platforms.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {mutation.isLoading ? "Posting…" : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
