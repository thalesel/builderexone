
import React from 'react';

export const TextArea = ({ label, value, onChange, placeholder, rows = 3 }: any) => (
    <div className="flex flex-col gap-1.5 mb-5">
        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400 ml-1">{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="border border-zinc-300 bg-white rounded-xl px-4 py-3 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all shadow-sm text-sm resize-none"
        />
    </div>
);
