// CalendarPage.jsx
"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

export default function CalendarPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/economic-calendar`);
        const json = await res.json();
        setData(json.calendar || []);
      } catch (err) {
        console.error("Error fetching economic calendar:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData =
    filter === "all" ? data : data.filter((s) => s.section.includes(filter));

  return (
    <div className="p-6 text-white min-h-screen bg-panel">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Economic Calendar</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
        >
          <option value="all">All</option>
          <option value="This Week">This Week</option>
          <option value="Next Week">Next Week</option>
          <option value="Last Week">Last Week</option>
        </select>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 bg-primary text-white rounded hover:bg-primary/80"
      >
        ← Back to News Panel
      </button>

      {loading ? (
        <p className="text-primary">Loading...</p>
      ) : filteredData.length === 0 ? (
        <p className="text-white/60">No data available.</p>
      ) : (
        filteredData.map((section, idx) => (
          <div key={idx} className="mb-10">
            <h2 className="text-xl font-bold mb-2">{section.section}</h2>
            {section.events.map((day, i) => (
              <div key={i} className="mb-4">
                <h3 className="text-md text-primary mb-1 font-semibold">
                  {day.date_label}
                </h3>
                <table className="w-full text-sm border-collapse border border-gray-600">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="text-left py-1 px-2">Time</th>
                      <th className="text-left py-1 px-2">Title</th>
                      <th className="text-left py-1 px-2">Period</th>
                      <th className="text-left py-1 px-2">Actual</th>
                      <th className="text-left py-1 px-2">Forecast</th>
                      <th className="text-left py-1 px-2">Previous</th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.events.map((event, j) => (
                      <tr key={j} className="border-t border-gray-700">
                        <td className="py-1 px-2">{event.time}</td>
                        <td className="py-1 px-2">{event.title}</td>
                        <td className="py-1 px-2">{event.period}</td>
                        <td className="py-1 px-2">{event.actual}</td>
                        <td className="py-1 px-2">{event.forecast}</td>
                        <td className="py-1 px-2">{event.previous}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
