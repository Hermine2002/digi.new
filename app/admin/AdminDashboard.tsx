"use client";

import { useEffect, useState, useCallback } from "react";

type SubmissionStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "SPAM";

interface Submission {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: SubmissionStatus;
  createdAt: string;
  emailSentAt: string | null;
  smsSentAt: string | null;
}

const TOKEN_STORAGE_KEY = "digibase_admin_token";
const STATUS_OPTIONS: SubmissionStatus[] = ["NEW", "IN_PROGRESS", "RESOLVED", "SPAM"];

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  NEW: "bg-[#00c050]/10 text-[#00a042]",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  RESOLVED: "bg-zinc-200 text-zinc-600",
  SPAM: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "ALL">("ALL");

  useEffect(() => {
    const stored = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) setToken(stored);
  }, []);

  const loadSubmissions = useCallback(
    async (authToken: string, status: SubmissionStatus | "ALL") => {
      setLoading(true);
      setError(null);
      try {
        const query = status === "ALL" ? "" : `?status=${status}`;
        const res = await fetch(`/api/admin/submissions${query}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (res.status === 401) {
          window.localStorage.removeItem(TOKEN_STORAGE_KEY);
          setToken(null);
          setError("That token was rejected. Please try again.");
          return;
        }
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setError(data.message || "Failed to load submissions.");
          return;
        }
        setSubmissions(data.submissions);
      } catch {
        setError("Network error while loading submissions.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (token) loadSubmissions(token, statusFilter);
  }, [token, statusFilter, loadSubmissions]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    window.localStorage.setItem(TOKEN_STORAGE_KEY, tokenInput.trim());
    setToken(tokenInput.trim());
  }

  function handleLogout() {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setSubmissions([]);
  }

  async function updateStatus(id: string, status: SubmissionStatus) {
    if (!token) return;
    const previous = submissions;
    setSubmissions((subs) => subs.map((s) => (s.id === id ? { ...s, status } : s)));
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
    } catch {
      setSubmissions(previous);
      setError("Couldn't update status. Please try again.");
    }
  }

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-[24px] border border-zinc-200 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,.08)]"
        >
          <h1 className="text-xl font-bold text-zinc-900">Admin access</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Enter the admin token to view contact form submissions.
          </p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Admin token"
            className="mt-6 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-[#00c050]"
            autoFocus
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-[#00c050] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#00a042]"
          >
            Continue
          </button>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Contact submissions</h1>
            <p className="mt-1 text-sm text-zinc-600">
              {submissions.length} submission{submissions.length === 1 ? "" : "s"} shown
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SubmissionStatus | "ALL")}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#00c050]"
            >
              <option value="ALL">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              Log out
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,.05)]">
          {loading ? (
            <div className="p-10 text-center text-sm text-zinc-500">Loading…</div>
          ) : submissions.length === 0 ? (
            <div className="p-10 text-center text-sm text-zinc-500">No submissions yet.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email / Phone</th>
                  <th className="px-5 py-3">Message</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id} className="border-b border-zinc-100 align-top last:border-0">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-zinc-900">{s.name}</div>
                      <div className="text-xs text-zinc-500">{s.company}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-zinc-700">{s.email}</div>
                      {s.phone && <div className="text-xs text-zinc-500">{s.phone}</div>}
                    </td>
                    <td className="max-w-sm px-5 py-4">
                      {s.subject && (
                        <div className="mb-1 font-medium text-zinc-900">{s.subject}</div>
                      )}
                      <div className="line-clamp-3 text-zinc-600">{s.message}</div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-zinc-600">
                      {new Date(s.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={s.status}
                        onChange={(e) => updateStatus(s.id, e.target.value as SubmissionStatus)}
                        className={`rounded-lg border-0 px-2.5 py-1.5 text-xs font-semibold outline-none ${STATUS_STYLES[s.status]}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
