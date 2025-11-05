import React from "react";

export default function Dropdown({ label, options = [], value, onChange }) {
  return (
    <div className="flex flex-col mb-2">
      {label && <label className="text-sm text-gray-600 mb-1">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
