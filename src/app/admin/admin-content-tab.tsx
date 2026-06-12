"use client";

import React, { useEffect, useState } from "react";
import { FileJson, Upload, RotateCcw, Save, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CONTENT_ASSET_ACCEPT,
  CONTENT_ASSET_MAX_BYTES,
  formatAssetTypeLabel,
} from "@/lib/content/asset-files";

interface ModuleRow {
  slug: string;
  title: string;
  description: string | null;
  requiredTier: string;
  published: boolean;
  version: number;
  updatedAt: string;
  payloadSize: number;
}

interface AssetRow {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  moduleSlug: string | null;
  assetKey: string | null;
  requiredTier: string;
  label: string | null;
}

const TIER_PACKS = [
  { tier: "STARTER", label: "Starter Pack", hint: "Free tier content" },
  { tier: "PRO", label: "Pro Pack", hint: "Playbook, templates, career tools" },
  { tier: "ELITE", label: "Elite Pack", hint: "Case studies, desk channel, jobs" },
] as const;

export function AdminContentTab() {
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [editor, setEditor] = useState("");
  const [tier, setTier] = useState("PRO");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  async function loadModules() {
    setLoading(true);
    try {
      const [modRes, assetRes] = await Promise.all([
        fetch("/api/admin/content"),
        fetch("/api/admin/content/assets"),
      ]);
      if (modRes.ok) {
        const data = await modRes.json();
        setModules(data.modules);
      }
      if (assetRes.ok) {
        const data = await assetRes.json();
        setAssets(data.assets);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadModules();
  }, []);

  async function selectModule(slug: string) {
    setSelectedSlug(slug);
    setMessage("");
    const res = await fetch(`/api/admin/content/${slug}`);
    if (!res.ok) return;
    const data = await res.json();
    setEditor(JSON.stringify(data.payload, null, 2));
    setTier(data.requiredTier);
    setPublished(data.published);
  }

  async function saveModule() {
    if (!selectedSlug) return;
    let payload: unknown;
    try {
      payload = JSON.parse(editor);
    } catch {
      setMessage("Invalid JSON — fix syntax before saving.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/content/${selectedSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, requiredTier: tier, published }),
      });
      if (!res.ok) {
        const err = await res.json();
        setMessage(err.error || "Save failed");
        return;
      }
      setMessage("Saved — live on web and mobile after refresh (all devices).");
      await loadModules();
    } finally {
      setSaving(false);
    }
  }

  async function resetModule() {
    if (!selectedSlug || !confirm("Reset this module to bundled defaults?")) return;
    setSaving(true);
    await fetch(`/api/admin/content/${selectedSlug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reset: true }),
    });
    await selectModule(selectedSlug);
    await loadModules();
    setSaving(false);
    setMessage("Reset to defaults.");
  }

  async function uploadAsset(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("moduleSlug", selectedSlug || "resume-templates");
    form.append("requiredTier", tier);
    form.append("assetKey", file.name);
    try {
      const res = await fetch("/api/admin/content/assets", { method: "POST", body: form });
      if (res.ok) {
        setMessage(`Uploaded ${file.name}`);
        await loadModules();
      } else {
        const err = await res.json();
        setMessage(err.error || "Upload failed");
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function deleteAsset(id: string) {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/admin/content/assets/${id}`, { method: "DELETE" });
    await loadModules();
  }

  const moduleAssets = selectedSlug
    ? assets.filter((a) => a.moduleSlug === selectedSlug)
    : assets;

  if (loading) {
    return <div className="text-center py-12 text-muted-fg">Loading content modules...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-secondary">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-fg">Content Modules</p>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {TIER_PACKS.map((pack) => {
              const packModules = modules.filter((m) => m.requiredTier === pack.tier);
              if (packModules.length === 0) return null;
              return (
                <div key={pack.tier} className="border-b border-border last:border-b-0">
                  <div className="px-4 py-2 bg-secondary/80">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-fg">{pack.label}</p>
                    <p className="text-[11px] text-muted-fg">{pack.hint}</p>
                  </div>
                  <div className="divide-y divide-border">
                    {packModules.map((m) => (
                      <button
                        key={m.slug}
                        type="button"
                        onClick={() => selectModule(m.slug)}
                        className={`w-full text-left px-4 py-3 hover:bg-secondary/60 transition-colors ${
                          selectedSlug === m.slug ? "bg-primary-soft" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-semibold text-sm text-gray-900">{m.title}</p>
                          <Badge size="sm" variant={m.published ? "success" : "secondary"}>
                            {m.published ? "Live" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-fg mb-1">{m.slug}</p>
                        <span className="text-xs text-muted-fg">v{m.version}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-fg mb-3">File Uploads</p>
          <p className="text-xs text-muted-fg mb-3">
            {selectedSlug
              ? `Uploads attach to "${selectedSlug}". PDF, Word (.doc/.docx), Excel, PowerPoint, text, and images (PNG, JPG, GIF, WebP, SVG, etc.) up to ${CONTENT_ASSET_MAX_BYTES / (1024 * 1024)}MB.`
              : "Select a module first. Uploads are tier-gated and live immediately for members."}
          </p>
          <label className="flex items-center justify-center gap-2 border border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary-400 transition-colors">
            <Upload className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium">{uploading ? "Uploading..." : "Choose file"}</span>
            <input
              type="file"
              className="hidden"
              accept={CONTENT_ASSET_ACCEPT}
              onChange={uploadAsset}
              disabled={uploading || !selectedSlug}
            />
          </label>
          <ul className="mt-3 space-y-2 max-h-40 overflow-y-auto">
            {moduleAssets.length === 0 && (
              <li className="text-xs text-muted-fg text-center py-2">No files for this module yet.</li>
            )}
            {moduleAssets.map((a) => (
              <li key={a.id} className="flex items-center gap-2 text-xs border border-border rounded-lg p-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{a.fileName}</p>
                  <p className="text-muted-fg">
                    {formatAssetTypeLabel(a.mimeType, a.fileName)} · {a.requiredTier} · {(a.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <a href={`/api/content/assets/${a.id}`} className="text-primary-400 p-1" title="Download">
                  <Download className="w-3.5 h-3.5" />
                </a>
                <button type="button" onClick={() => deleteAsset(a.id)} className="text-red-500 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="lg:col-span-2">
        {!selectedSlug ? (
          <div className="bg-white rounded-xl border border-border p-12 text-center text-muted-fg">
            <FileJson className="w-10 h-10 mx-auto mb-3 opacity-40" />
            Select a module to edit JSON content
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex flex-wrap items-center gap-3 justify-between">
              <div>
                <p className="font-semibold text-gray-900">{selectedSlug}</p>
                <p className="text-xs text-muted-fg">Edits sync to web and mobile APIs immediately</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="text-xs border border-border rounded-lg px-2 py-1.5"
                >
                  <option value="STARTER">Starter</option>
                  <option value="PRO">Pro</option>
                  <option value="ELITE">Elite</option>
                </select>
                <label className="flex items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                  />
                  Published
                </label>
                <Button variant="outline" size="sm" onClick={resetModule} disabled={saving}>
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </Button>
                <Button size="sm" onClick={saveModule} loading={saving}>
                  <Save className="w-3.5 h-3.5" />
                  Save
                </Button>
              </div>
            </div>
            {message && (
              <div className={`mx-4 mt-3 text-sm px-3 py-2 rounded-lg ${
                message.includes("Invalid") || message.includes("failed")
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-800"
              }`}>
                {message}
              </div>
            )}
            <textarea
              value={editor}
              onChange={(e) => setEditor(e.target.value)}
              className="w-full min-h-[520px] p-4 font-mono text-xs leading-relaxed border-0 focus:outline-none focus:ring-0 resize-y"
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
