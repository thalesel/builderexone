
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ICONS } from '../../constants';
import { UserProfile } from '../../types';
import { Button } from '../ui/Button';

export const AppLayout = ({ user, onLogout, children }: { user: UserProfile; onLogout: () => void; children?: React.ReactNode }) => {
    const isAdmin = user.role === 'admin';
    const location = useLocation();

    const navLinkClass = (path: string) => {
        const isActive = location.pathname === path;
        return `flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl font-black transition-all text-[10px] md:text-sm uppercase tracking-widest ${isActive ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'
            }`;
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-zinc-950 text-white font-sans">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 bg-zinc-900/50 backdrop-blur-xl border-r border-zinc-800/50 flex-col sticky top-0 h-screen">
                <div className="p-8 border-b border-zinc-800/50 flex flex-row items-center justify-start gap-3">
                    <h1 className="text-xl font-black tracking-tighter uppercase italic">
                        BUILDER EXONE
                    </h1>
                </div>
                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                        <ICONS.Dashboard /> Dashboard
                    </Link>
                    <Link to="/planos" className={navLinkClass('/planos')}>
                        <ICONS.CreditCard /> Planos
                    </Link>
                    <a
                        href="https://chat.whatsapp.com/Ln98VLGI0mKIOWv1uLKcjU"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl font-black transition-all text-[10px] md:text-sm uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5"
                    >
                        <ICONS.WhatsApp /> WHATSAPP
                    </a>
                    <a
                        href="https://discord.gg/EK8su2XQ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl font-black transition-all text-[10px] md:text-sm uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5"
                    >
                        <ICONS.Discord /> DISCORD
                    </a>
                    {isAdmin && (
                        <Link to="/admin" className={navLinkClass('/admin')}>
                            <ICONS.Users /> Admin
                        </Link>
                    )}
                    <div className="mt-auto pt-8 border-t border-zinc-800/50 space-y-6">
                        <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1 font-black">Sessão Ativa</p>
                            <p className="text-xs font-bold truncate text-white/80">{user.email}</p>
                        </div>
                        <Button variant="outline" className="w-full border-zinc-800 rounded-xl py-3 text-[10px]" onClick={onLogout}>Encerrar Sessão</Button>
                    </div>
                </nav>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between px-6 py-5 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <h1 className="text-sm font-black tracking-tighter uppercase italic">BUILDER EXONE</h1>
                </div>
                <button onClick={onLogout} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 border border-zinc-800 px-4 py-2 rounded-xl bg-zinc-950">Sair</button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-24 md:pb-12 p-5 md:p-12">
                <div className="max-w-5xl mx-auto w-full">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-zinc-900/90 backdrop-blur-xl border border-white/5 px-6 py-3 flex justify-around items-center z-40 shadow-2xl rounded-2xl">
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                    <ICONS.Dashboard />
                    <span>Início</span>
                </Link>
                <Link to="/planos" className={navLinkClass('/planos')}>
                    <ICONS.CreditCard />
                    <span>Planos</span>
                </Link>
                <a
                    href="https://chat.whatsapp.com/Ln98VLGI0mKIOWv1uLKcjU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg font-black transition-all text-[10px] uppercase tracking-widest text-zinc-400"
                >
                    <ICONS.WhatsApp />
                    <span>Whats</span>
                </a>
                <a
                    href="https://discord.gg/EK8su2XQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg font-black transition-all text-[10px] uppercase tracking-widest text-zinc-400"
                >
                    <ICONS.Discord />
                    <span>Discord</span>
                </a>
                {isAdmin && (
                    <Link to="/admin" className={navLinkClass('/admin')}>
                        <ICONS.Users />
                        <span>Admin</span>
                    </Link>
                )}
            </nav>
        </div>
    );
};
