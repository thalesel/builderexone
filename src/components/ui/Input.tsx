
import React from 'react';

export const Input = ({ label, value, onChange, placeholder, type = 'text', required = false, error }: any) => (
    <div className="flex flex-col gap-1.5 mb-5 w-full">
        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400 ml-1">{label} {required && '*'}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={`border bg-zinc-900/50 backdrop-blur-sm rounded-xl px-4 py-3.5 focus:border-white focus:ring-0 outline-none transition-all text-sm font-medium placeholder:text-zinc-600 ${error ? 'border-red-500/50' : 'border-zinc-800 hover:border-zinc-700'}`}
        />
        {error && <span className="text-[9px] text-red-500 font-bold ml-1 uppercase tracking-wider">{error}</span>}
    </div>
);
