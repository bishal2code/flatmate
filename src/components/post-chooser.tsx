"use client";

import { Home, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PostChooser() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        type="button"
        className="order-2 inline-flex items-center gap-1.5 rounded-xl bg-[#0d7369] px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-[#0a5c54] sm:order-3"
      >
        <span aria-hidden="true">+</span> Post
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md gap-0 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 shadow-xl sm:max-w-md"
      >
        <div className="relative border-b border-slate-200 px-5 py-5 pr-14 sm:px-6">
          <DialogTitle className="text-base font-semibold text-slate-900">
            What would you like to post?
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm leading-5 text-slate-600">
            Choose whether to list an available room/flat or post your flatmate
            preferences.
          </DialogDescription>
          <DialogClose
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
          >
            <X aria-hidden="true" className="size-4" />
          </DialogClose>
        </div>

        <div className="space-y-2.5 p-4 sm:p-5">
          <Link
            href="/listings/new"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3.5 text-left transition hover:border-teal-700/40 hover:bg-teal-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Home aria-hidden="true" className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-slate-900">
                Post a listing
              </span>
              <span className="mt-0.5 block text-xs leading-4 text-slate-600">
                For owners or existing tenants with an available room or flat.
              </span>
            </span>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
