"use client";

import { useState, useEffect } from "react";

type Feed = { url: string; name: string };

export type RssFeedManagerDict = {
  rssFeeds: string;
  addFeed: string;
  feedUrl: string;
  feedName: string;
  fetchNow: string;
  lastFetched: string;
  noFeeds: string;
  feedAdded: string;
  feedRemoved: string;
  fetchSuccess: string;
  fetchError: string;
  articlesImported: string;
  existingSkipped: string;
};

export default function RssFeedManager({ dict }: { dict: RssFeedManagerDict }) {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [fetchResult, setFetchResult] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && json.settings) {
          const row = json.settings.find((s: { key: string }) => s.key === "rss_feeds");
          if (row) {
            try {
              const parsed = JSON.parse(row.value);
              if (Array.isArray(parsed)) setFeeds(parsed);
            } catch {}
          }
        }
      })
      .catch(() => {});
  }, []);

  const save = async (updated: Feed[]) => {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: "rss_feeds",
        value: JSON.stringify(updated),
        group: "rss",
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (json.ok) {
      setFeeds(updated);
      setMsg(dict.feedAdded);
    }
  };

  const addFeed = async () => {
    if (!newUrl.trim()) return;
    const feed: Feed = { url: newUrl.trim(), name: newName.trim() || newUrl.trim() };
    await save([...feeds, feed]);
    setNewUrl("");
    setNewName("");
  };

  const removeFeed = async (idx: number) => {
    const updated = feeds.filter((_, i) => i !== idx);
    await save(updated);
  };

  const fetchNow = async () => {
    setBusy(true);
    setFetchResult(null);
    try {
      const res = await fetch("/api/cron/blog-rss");
      const json = await res.json();
      setBusy(false);
      if (json.ok) {
        setFetchResult(
          `${dict.fetchSuccess}: ${json.totalImported} ${dict.articlesImported}, ${json.totalSkipped} ${dict.existingSkipped}`
        );
      } else {
        setFetchResult(`${dict.fetchError}: ${json.error ?? "unknown"}`);
      }
    } catch {
      setBusy(false);
      setFetchResult(dict.fetchError);
    }
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[18px] p-5">
      <h3 className="text-[15px] font-[1000] text-[var(--text)]">{dict.rssFeeds}</h3>

      {feeds.length === 0 ? (
        <p className="mt-3 text-[13px] font-[800] text-[var(--muted)]">{dict.noFeeds}</p>
      ) : (
        <div className="mt-3 space-y-2">
          {feeds.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-[var(--surface-2)] border border-[var(--soft-line)] rounded-[12px] px-4 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-[900] text-[var(--text)] truncate">{f.name}</p>
                <p className="text-[11px] font-[800] text-[var(--muted-3)] truncate">{f.url}</p>
              </div>
              <button
                onClick={() => removeFeed(i)}
                disabled={busy}
                className="text-[12px] font-[900] text-[var(--danger)] hover:underline shrink-0"
              >
                {dict.feedRemoved}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-2.5">
        <input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder={dict.feedUrl}
          className="w-full border border-[var(--line-2)] rounded-[12px] px-3 py-2.5 text-[13px] font-[850] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
        />
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={dict.feedName}
          className="w-full border border-[var(--line-2)] rounded-[12px] px-3 py-2.5 text-[13px] font-[850] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
        />
        <button
          onClick={addFeed}
          disabled={busy || !newUrl.trim()}
          className="rounded-[12px] text-white font-[900] px-5 py-2.5 text-[13px] disabled:opacity-50 hover:-translate-y-0.5 transition-all shrink-0"
          style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
        >
          {dict.addFeed}
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={fetchNow}
          disabled={busy || feeds.length === 0}
          className="rounded-[12px] border border-[var(--line-2)] bg-[var(--surface)] font-[900] px-5 py-2.5 text-[13px] text-[var(--primary)] hover:bg-[var(--soft)] disabled:opacity-50 transition-all"
        >
          {busy ? "..." : dict.fetchNow}
        </button>
      </div>

      {msg && <p className="mt-2 text-[12px] font-[850] text-[var(--success)]">{msg}</p>}
      {fetchResult && <p className="mt-2 text-[12px] font-[850] text-[var(--primary)]">{fetchResult}</p>}
    </div>
  );
}
