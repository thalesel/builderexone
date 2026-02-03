
import React from 'react';

export const TextArea = ({ label, value, onChange, placeholder, rows = 3 }: any) => (
    <div className="flex flex-col gap-3 mb-8">
        <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm rounded-xl px-4 py-4 focus:border-white focus:ring-0 outline-none transition-all text-sm font-medium placeholder:text-zinc-600 text-white resize-none"
        />
    </div>
);
