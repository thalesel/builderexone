
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
        return `flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-lg font-black transition-all text-[10px] md:text-sm uppercase tracking-widest ${isActive ? 'bg-black text-white shadow-md' : 'text-zinc-400 hover:text-black hover:bg-zinc-50'
            }`;
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-zinc-50">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 bg-white border-r border-zinc-200 flex-col sticky top-0 h-screen">
                <div className="p-8 border-b border-zinc-100 flex flex-col items-center justify-center gap-3">
                    <img src="/logo.png" alt="Builder Exone" className="w-auto h-8" />
                    <h1 className="text-lg font-black tracking-tighter uppercase text-center">
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
                        className="flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-lg font-black transition-all text-[10px] md:text-sm uppercase tracking-widest text-zinc-400 hover:text-black hover:bg-zinc-50"
                    >
                        <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5 object-contain" /> WHATSAPP
                    </a>
                    <a
                        href="https://discord.gg/EK8su2XQ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-lg font-black transition-all text-[10px] md:text-sm uppercase tracking-widest text-zinc-400 hover:text-black hover:bg-zinc-50"
                    >
                        <img src="/discord.png" alt="Discord" className="w-5 h-5 object-contain" /> DISCORD
                    </a>
                    {isAdmin && (
                        <Link to="/admin" className={navLinkClass('/admin')}>
                            <ICONS.Users /> Admin
                        </Link>
                    )}
                    <div className="mt-auto pt-8 border-t border-zinc-100 space-y-4">
                        <div className="px-4">
                            <p className="text-[9px] uppercase tracking-widest text-zinc-400 mb-1 font-black">Sessão Ativa</p>
                            <p className="text-xs font-bold truncate text-zinc-600">{user.email}</p>
                        </div>
                        <Button variant="outline" className="w-full border-zinc-200 rounded-lg py-2" onClick={onLogout}>Sair</Button>
                    </div>
                </nav>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-zinc-200 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Builder Exone" className="h-6 w-auto" />
                    <h1 className="text-sm font-black tracking-tighter uppercase">BUILDER EXONE</h1>
                </div>
                <button onClick={onLogout} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-zinc-200 px-3 py-1.5 rounded-lg">Sair</button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-24 md:pb-12 p-5 md:p-12">
                <div className="max-w-5xl mx-auto w-full">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-4 py-2.5 flex justify-around items-center z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] rounded-t-lg">
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
                    <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
                    <span>Whats</span>
                </a>
                <a
                    href="https://discord.gg/EK8su2XQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg font-black transition-all text-[10px] uppercase tracking-widest text-zinc-400"
                >
                    <img src="/discord.png" alt="Discord" className="w-5 h-5 object-contain" />
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
