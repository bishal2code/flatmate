"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function PostFlatmateRequirement() {
  const router = useRouter();
  const [form, setForm] = useState({
    occupation_type: "",
    smoking_allowed: false,
    drinking_allowed: false,
    max_occupants: "",
    budget_npr: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    description: "",
    title: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { error: supabaseError } = await supabase.from("flatmate_requirements").insert([
        {
          ...form,
          max_occupants: Number(form.max_occupants),
          budget_npr: Number(form.budget_npr),
        },
      ]);
      if (supabaseError) throw supabaseError;
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit requirement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Post a Flatmate Requirement</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success ? (
        <p className="text-green-600">Requirement posted! Redirecting…</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title (e.g., Friendly roommate needed)"
            className="w-full rounded border px-3 py-2"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Brief description"
            className="w-full rounded border px-3 py-2 h-24"
            required
          />
          <select
            name="occupation_type"
            value={form.occupation_type}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            required
          >
            <option value="" disabled>Select occupation type</option>
            <option value="student">Student</option>
            <option value="working_professional">Working Professional</option>
          </select>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="smoking_allowed"
                checked={form.smoking_allowed}
                onChange={handleChange}
                className="mr-2"
              />
              Smoking allowed
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="drinking_allowed"
                checked={form.drinking_allowed}
                onChange={handleChange}
                className="mr-2"
              />
              Drinking allowed
            </label>
          </div>
          <input
            name="max_occupants"
            type="number"
            min={1}
            value={form.max_occupants}
            onChange={handleChange}
            placeholder="Maximum occupants"
            className="w-full rounded border px-3 py-2"
            required
          />
          <input
            name="budget_npr"
            type="number"
            min={0}
            value={form.budget_npr}
            onChange={handleChange}
            placeholder="Budget (NPR)"
            className="w-full rounded border px-3 py-2"
            required
          />
          <input
            name="contact_name"
            value={form.contact_name}
            onChange={handleChange}
            placeholder="Contact name"
            className="w-full rounded border px-3 py-2"
            required
          />
          <input
            name="contact_phone"
            value={form.contact_phone}
            onChange={handleChange}
            placeholder="Contact phone"
            className="w-full rounded border px-3 py-2"
          />
          <input
            name="contact_email"
            type="email"
            value={form.contact_email}
            onChange={handleChange}
            placeholder="Contact email"
            className="w-full rounded border px-3 py-2"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#0d7369] text-white rounded px-4 py-2 hover:bg-[#0a5c54]"
          >
            {submitting ? "Submitting…" : "Post Requirement"}
          </button>
        </form>
      )}
    </div>
  );
}
