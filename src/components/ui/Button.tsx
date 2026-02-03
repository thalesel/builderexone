
import React from 'react';

export const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }: any) => {
  const base = "px-4 py-2.5 rounded-xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed border text-[10px] uppercase tracking-widest";
  const variants: any = {
    primary: "bg-white text-black hover:bg-zinc-200 border-white shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95",
    secondary: "bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-800 active:scale-95",
    danger: "bg-red-950/30 text-red-500 hover:bg-red-900/50 border-red-900/50 active:scale-95",
    outline: "bg-transparent border-zinc-800 text-zinc-400 hover:border-white hover:text-white active:scale-95",
    accent: "bg-blue-600 text-white hover:bg-blue-500 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)] active:scale-95",
    live: "bg-blue-600 text-white hover:bg-blue-500 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.3)] active:scale-95 animate-pulse"
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};
