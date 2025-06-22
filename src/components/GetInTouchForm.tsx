"use client";
import React, { useState } from "react";

export default function GetInTouchForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/send-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, message }),
    });
    if (res.ok) {
      setStatus("sent");
      setEmail("");
      setMessage("");
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        type="email"
        required
        placeholder="Your email"
        className="w-full border rounded px-3 py-2"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <textarea
        required
        placeholder="Your message"
        className="w-full border rounded px-3 py-2"
        rows={5}
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="bg-primary text-white px-6 py-2 rounded font-bold"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending..." : "Send"}
      </button>
      {status === "sent" && <div className="text-green-600 mt-2">Message sent!</div>}
      {status === "error" && <div className="text-red-600 mt-2">Failed to send. Try again.</div>}
    </form>
  );
} 