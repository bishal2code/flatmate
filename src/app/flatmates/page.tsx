"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import HeroBanner from "@/components/ui/HeroBanner";

interface Requirement {
  id: number;
  title: string;
  description: string;
  occupation_type: string;
  smoking_allowed: boolean;
  drinking_allowed: boolean;
  max_occupants: number;
  budget_npr: number;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
}

export default function FlatmatesHome() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequirements = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("flatmate_requirements")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setRequirements(data as Requirement[]);
      }
      setLoading(false);
    };
    fetchRequirements();
  }, []);

  return (
    <>
      {/* Hero banner */}
      <HeroBanner
        src="/hero-flatmates.png"
        title="Flatmate Requirements"
        subtitle="Find your next house‑mate in Pokhara"
      />

      {/* Page content */}
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Flatmate Requirements</h1>
        <Link
          href="/flatmates/new"
          className="inline-block mb-6 bg-[#0d7369] text-white rounded px-4 py-2 hover:bg-[#0a5c54]"
        >
          Post a Requirement
        </Link>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {!loading && requirements.length === 0 && (
          <p className="text-gray-600">No flatmate requirements available.</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requirements.map((req) => (
            <div key={req.id} className="border rounded p-4 bg-white shadow-sm hover:shadow-md">
              <h2 className="font-semibold text-lg mb-2">{req.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{req.description}</p>
              <p className="text-xs mb-1"><strong>Occupation:</strong> {req.occupation_type}</p>
              <p className="text-xs mb-1"><strong>Smoking:</strong> {req.smoking_allowed ? "Yes" : "No"}</p>
              <p className="text-xs mb-1"><strong>Drinking:</strong> {req.drinking_allowed ? "Yes" : "No"}</p>
              <p className="text-xs mb-1"><strong>Max occupants:</strong> {req.max_occupants}</p>
              <p className="text-xs mb-1"><strong>Budget (NPR):</strong> {req.budget_npr}</p>
              <p className="text-xs mb-1"><strong>Contact:</strong> {req.contact_name}</p>
              {req.contact_phone && <p className="text-xs mb-1">Phone: {req.contact_phone}</p>}
              {req.contact_email && <p className="text-xs break-all">Email: {req.contact_email}</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
