import React, { useState, useEffect } from "react";
import { bioAPI } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import TemplateSelector from "./TemplateSelector";

export default function BioEditor() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [page, setPage] = useState({
    title: "",
    slug: "",
    description: "",
    links: [],
    settings: {},
  });
  const [loading, setLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      bioAPI
        .getBySlug(slug)
        .then((r) => setPage(r.data.page))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [slug]);

  function handleChange(e) {
    const { name, value } = e.target;
    setPage((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (page._id) {
        await bioAPI.update(page._id, page);
      } else {
        const res = await bioAPI.create(page);
        navigate(`/bio/${res.data.page.slug}`);
        return;
      }
      navigate(`/bio/${page.slug || page._id}`);
    } catch (err) {
      console.error(err);
      alert("Error saving bio page");
    } finally {
      setLoading(false);
    }
  }

  function handleTemplateApplied(templateSlug) {
    setPage((prev) => ({
      ...prev,
      settings: { ...prev.settings, template: templateSlug },
    }));
    setShowTemplates(false);
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        {slug ? "Edit" : "Create"} Bio Page
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            name="title"
            value={page.title || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Slug (optional)
          </label>
          <input
            name="slug"
            value={page.slug || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={page.description || ""}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Template Section - only show for existing pages */}
        {page._id && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Template
              </span>
              <button
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {showTemplates ? "Hide" : "Change Template"}
              </button>
            </div>
            {page.settings?.template && (
              <p className="text-xs text-gray-500 mb-2">
                Current:{" "}
                <span className="font-medium">{page.settings.template}</span>
              </p>
            )}
            {showTemplates && (
              <TemplateSelector
                bioPageId={page._id}
                currentTemplate={page.settings?.template}
                onApply={handleTemplateApplied}
              />
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/bio")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
