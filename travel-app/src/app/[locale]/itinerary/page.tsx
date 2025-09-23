"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState("medium");
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult("⏳ Generating your itinerary...");

    const res = await fetch("/api/itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days, interests, budget }),
    });

    const data = await res.json();
    setResult(data.itinerary || `⚠️ ${data.error}`);
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/coffe.png')" }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Floating form container */}
      <motion.div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 60 }}
      >
        <h1 className="text-3xl font-bold text-green-900 text-center mb-6">
          🌿 AI Trip Planner
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trip Length */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">Trip Length (days)</label>
            <input
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">Interests</label>
            <div className="flex gap-2 flex-wrap">
              {["nature", "culture", "adventure"].map((item) => (
                <motion.button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className={`px-4 py-1 rounded-full text-sm font-medium border transition ${
                    interests.includes(item)
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-green-600 border-green-300 hover:bg-green-100"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">Budget</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="low">ETB Low</option>
              <option value="medium">ETB Medium</option>
              <option value="luxury">ETB Luxury</option>
            </select>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-lime-400 text-white font-bold shadow-md hover:scale-105 transition-transform"
            whileTap={{ scale: 0.97 }}
          >
            Generate Itinerary
          </motion.button>
        </form>

        {/* Result */}
        {result && (
          <motion.div
            className="mt-6 p-4 max-h-[40vh] overflow-y-auto bg-white/70 backdrop-blur-md rounded-xl border border-green-200 text-green-900 whitespace-pre-line shadow-inner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {result}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
