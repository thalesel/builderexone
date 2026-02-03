
import React from 'react';

export const Input = ({ label, value, onChange, placeholder, type = 'text', required = false }: any) => (
    <div className="flex flex-col gap-1.5 mb-5 w-full">
        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400 ml-1">{label} {required && '*'}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="border border-zinc-200 bg-white rounded-xl px-4 py-3 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all shadow-sm text-sm"
        />
    </div>
);
