
import React from 'react';

export const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }: any) => {
  const base = "px-4 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed border text-sm uppercase tracking-widest";
  const variants: any = {
    primary: "bg-black text-white hover:bg-zinc-800 border-black shadow-lg active:scale-95",
    secondary: "bg-zinc-100 text-black hover:bg-zinc-200 border-zinc-200 active:scale-95",
    danger: "bg-white text-black hover:bg-zinc-100 border-black active:scale-95",
    outline: "bg-transparent border-zinc-300 text-black hover:bg-zinc-50 active:scale-95",
    accent: "bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-700 shadow-lg active:scale-95",
    live: "bg-red-600 text-white hover:bg-red-700 border-red-700 shadow-[0_0_20px_rgba(220,38,38,0.3)] active:scale-95 animate-none"
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};
