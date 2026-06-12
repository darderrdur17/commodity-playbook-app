"use client";

import React, { useEffect, useRef, useState } from "react";
import { FileJson, Upload, RotateCcw, Save, Trash2, Download, RefreshCw, Copy } from "lucide-react";
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
  const [loadError, setLoadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceAssetId, setReplaceAssetId] = useState<string | null>(null);

  async function loadModules() {
    setLoading(true);
    setLoadError("");
    try {
      const [modRes, assetRes] = await Promise.all([
        fetch("/api/admin/content", { cache: "no-store" }),
        fetch("/api/admin/content/assets", { cache: "no-store" }),
      ]);
      if (!modRes.ok) {
        const err = await modRes.json().catch(() => ({}));
        setLoadError(err.error || `Could not load modules (HTTP ${modRes.status}). Sign in as admin@demo.com.`);
        return;
      }
      const modData = await modRes.json();
      setModules(modData.modules || []);
      if (assetRes.ok) {
        const assetData = await assetRes.json();
        setAssets(assetData.assets || []);
      }
    } catch {
      setLoadError("Network error loading content. Check database connection and run npm run db:seed.");
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
    const res = await fetch(`/api/admin/content/${slug}`, { cache: "no-store" });
    if (!res.ok) {
      setMessage("Could not load module content.");
      return;
    }
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
      const data = await res.json();
      setMessage(`Saved v${data.version} — live for all members after they refresh.`);
      await loadModules();
    } finally {
      setSaving(false);
    }
  }

  async function resetModule() {
    if (!selectedSlug || !confirm("Reset this module to bundled defaults?")) return;
    setSaving(true);
    const res = await fetch(`/api/admin/content/${selectedSlug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reset: true }),
    });
    if (res.ok) {
      await selectModule(selectedSlug);
      await loadModules();
      setMessage("Reset to defaults.");
    } else {
      setMessage("Reset failed.");
    }
    setSaving(false);
  }

  async function uploadAsset(file: File, replaceId?: string) {
    if (!selectedSlug && !replaceId) {
      setMessage("Select a content module first.");
      return;
    }
    setUploading(true);
    setMessage("");
    try {
      const form = new FormData();
      form.append("file", file);
      if (selectedSlug) form.append("moduleSlug", selectedSlug);
      form.append("requiredTier", tier);
      form.append("assetKey", file.name);

      const url = replaceId
        ? `/api/admin/content/assets/${replaceId}`
        : "/api/admin/content/assets";
      const res = await fetch(url, {
        method: replaceId ? "PATCH" : "POST",
        body: form,
      });
      if (!res.ok) {
        const err = await res.json();
        setMessage(err.error || "Upload failed");
        return;
      }
      const data = await res.json();
      setMessage(
        replaceId
          ? `Updated file: ${data.fileName}`
          : `Uploaded ${data.fileName}${data.replaced ? " (replaced existing)" : ""}`
      );
      await loadModules();
      if (selectedSlug) await selectModule(selectedSlug);
    } finally {
      setUploading(false);
    }
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadAsset(file);
    e.target.value = "";
  }

  function onReplaceUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && replaceAssetId) uploadAsset(file, replaceAssetId);
    setReplaceAssetId(null);
    e.target.value = "";
  }

  async function deleteAsset(id: string) {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/admin/content/assets/${id}`, { method: "DELETE" });
    await loadModules();
    if (selectedSlug) await selectModule(selectedSlug);
    setMessage("File deleted.");
  }

  function copyMemberUrl(id: string) {
    const url = `${window.location.origin}/api/content/assets/${id}`;
    navigator.clipboard.writeText(url);
    setMessage("Member download URL copied.");
  }

  const moduleAssets = selectedSlug
    ? assets.filter((a) => a.moduleSlug === selectedSlug)
    : assets;

  if (loading) {
    return <div className="text-center py-12 text-muted-fg">Loading content modules...</div>;
  }

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 text-sm mb-4">{loadError}</p>
        <p className="text-xs text-muted-fg mb-4">
          Demo admin: <strong>admin@demo.com</strong> / Demo1234! — then open Content CMS tab.
        </p>
        <Button size="sm" onClick={loadModules}>
          <RefreshCw className="w-4 h-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <input
        ref={replaceInputRef}
        type="file"
        className="hidden"
        accept={CONTENT_ASSET_ACCEPT}
        onChange={onReplaceUpload}
      />

      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-secondary flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-fg">Content Modules</p>
            <button type="button" onClick={loadModules} className="text-muted-fg hover:text-primary-400">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {modules.length === 0 ? (
              <p className="p-4 text-xs text-muted-fg">No modules yet. Run npm run db:seed or save from admin.</p>
            ) : (
              TIER_PACKS.map((pack) => {
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
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-fg mb-3">Upload New File</p>
          <p className="text-xs text-muted-fg mb-3">
            {selectedSlug
              ? `New uploads attach to "${selectedSlug}". PDF, Word, images, etc. (max ${CONTENT_ASSET_MAX_BYTES / (1024 * 1024)}MB). Same filename replaces an existing file.`
              : "Select a module on the left, then upload."}
          </p>
          <label
            className={`flex items-center justify-center gap-2 border border-dashed rounded-lg p-4 transition-colors ${
              selectedSlug
                ? "border-border cursor-pointer hover:border-primary-400"
                : "border-border/50 cursor-not-allowed opacity-60"
            }`}
          >
            <Upload className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium">{uploading ? "Uploading..." : "Upload new file"}</span>
            <input
              type="file"
              className="hidden"
              accept={CONTENT_ASSET_ACCEPT}
              onChange={onUpload}
              disabled={uploading || !selectedSlug}
            />
          </label>
          <ul className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {moduleAssets.length === 0 && (
              <li className="text-xs text-muted-fg text-center py-2">No files for this module yet.</li>
            )}
            {moduleAssets.map((a) => (
              <li key={a.id} className="flex items-center gap-1 text-xs border border-border rounded-lg p-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{a.fileName}</p>
                  <p className="text-muted-fg">
                    {formatAssetTypeLabel(a.mimeType, a.fileName)} · {(a.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <button type="button" onClick={() => copyMemberUrl(a.id)} className="text-muted-fg p-1" title="Copy URL">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <a href={`/api/content/assets/${a.id}`} className="text-primary-400 p-1" title="Download">
                  <Download className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setReplaceAssetId(a.id);
                    replaceInputRef.current?.click();
                  }}
                  className="text-primary-400 p-1 text-[10px] font-bold"
                  title="Replace file"
                >
                  Upd
                </button>
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
            <p className="mb-2">Select a module to edit or upload content</p>
            <p className="text-xs">Edit JSON below, upload files on the left, then Save. Members see changes on refresh.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex flex-wrap items-center gap-3 justify-between">
              <div>
                <p className="font-semibold text-gray-900">{selectedSlug}</p>
                <p className="text-xs text-muted-fg">Update JSON content and click Save — or upload files to attach</p>
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
              <div
                className={`mx-4 mt-3 text-sm px-3 py-2 rounded-lg ${
                  message.includes("Invalid") || message.includes("failed") || message.includes("Could not")
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-800"
                }`}
              >
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
