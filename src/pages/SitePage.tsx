
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { Site, SupportNumber } from '../types';
import { ICONS } from '../constants';

export const SitePage = () => {
    const { slug } = useParams();
    const [site, setSite] = useState<Site | null>(null);
    const [supportNumbers, setSupportNumbers] = useState<SupportNumber[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            Promise.all([
                supabaseService.getSiteBySlug(slug),
                supabaseService.getSupportNumbers()
            ]).then(([res, sn]) => {
                setSite(res || null);
                setSupportNumbers(sn);
                setLoading(false);
            });
        }
    }, [slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-[0.3em] text-xs">Aguarde...</div>;
    if (!site) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-[0.3em] text-xs">Site não encontrado</div>;

    if (!site.ativo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-8 text-center">
                <div className="max-w-md border border-zinc-800 p-10 md:p-14 rounded-lg bg-zinc-900 shadow-2xl">
                    <div className="mb-8 flex justify-center text-zinc-700">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    </div>
                    <h1 className="text-xl font-black uppercase tracking-widest mb-4">Instância Bloqueada</h1>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-loose">Este site está temporariamente desativado.</p>
                </div>
            </div>
        );
    }

    const mainSupport = supportNumbers.find(n => n.ativo);

    return (
        <div className="bg-zinc-950 text-white min-h-screen flex flex-col selection:bg-white selection:text-black relative font-sans overflow-hidden">
            {/* Dynamic Background Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-800/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Header: Razão Social */}
            <header className="py-24 md:py-40 px-6 md:px-8 border-b border-zinc-900/50 bg-inherit relative z-10">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-8 break-words italic animate-in fade-in slide-in-from-top-12 duration-1000">
                        {site.razao_social}
                    </h1>
                    <div className="h-2 w-32 bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"></div>
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full px-6 md:px-8 py-16 md:py-24 space-y-24 md:space-y-32">
                {/* Bloco: Sobre a Empresa */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="md:col-span-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 border-l-2 border-white pl-4">Manifesto</h2>
                    </div>
                    <div className="md:col-span-8">
                        <p className="text-2xl md:text-4xl font-black tracking-tight leading-tight whitespace-pre-wrap text-white/90 italic">{site.sobre}</p>
                    </div>
                </section>

                {/* Bloco: Missão */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <div className="md:col-span-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 border-l-2 border-white pl-4">Propósito</h2>
                    </div>
                    <div className="md:col-span-8">
                        <div className="bg-zinc-900 border border-zinc-800 p-10 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                            <p className="text-xl md:text-3xl font-bold text-zinc-400 italic tracking-tight leading-relaxed relative z-10">“{site.missao}”</p>
                        </div>
                    </div>
                </section>

                {/* Bloco: Contato */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 border-t border-zinc-900 pt-24 md:pt-32 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
                    <div className="md:col-span-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 border-l-2 border-white pl-4">Conexão</h2>
                    </div>
                    <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-10">Diretoria & Vendas</h3>
                            <ul className="space-y-8 text-2xl md:text-4xl font-black tracking-tighter uppercase italic">
                                <li className="flex items-center gap-5 hover:text-blue-500 transition-colors pointer-events-none">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                                    {site.telefones}
                                </li>
                                <li className="flex items-center gap-5 hover:text-blue-500 transition-colors pointer-events-none">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                                    <span className="break-all">{site.email}</span>
                                </li>
                                <li className="text-zinc-700 text-[10px] font-black tracking-[0.2em] border-t border-zinc-900 pt-8 not-italic">CNPJ: {site.cnpj}</li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-10">Presença Digital</h3>
                            {site.whatsapp && (
                                <a
                                    href={`https://wa.me/${site.whatsapp.replace(/\D/g, '')}`}
                                    className="flex items-center justify-center gap-4 w-full text-center py-5 border border-zinc-800 text-white text-[10px] uppercase font-black tracking-[0.3em] hover:bg-white hover:text-black transition-all rounded-2xl active:scale-95 shadow-xl bg-zinc-900/50 backdrop-blur-sm"
                                >
                                    <ICONS.WhatsApp /> WhatsApp Connect
                                </a>
                            )}
                            {site.instagram && (
                                <a
                                    href={`https://instagram.com/${site.instagram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-4 w-full text-center py-5 bg-white text-black text-[10px] uppercase font-black tracking-[0.3em] hover:bg-zinc-200 transition-all rounded-2xl active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                                >
                                    Instagram Profile
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Floating Help Button (Customer Support for Builder EXONE) */}
            {mainSupport && (
                <a
                    href={`https://wa.me/${mainSupport.numero.replace(/\D/g, '')}?text=Olá! Preciso de ajuda com o site ${site.razao_social}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-8 right-8 z-[50] group flex items-center gap-3 bg-black text-white p-4 rounded-lg shadow-2xl hover:scale-105 transition-all active:scale-95 border border-zinc-800"
                >
                    <div className="hidden md:block overflow-hidden max-w-0 group-hover:max-w-[200px] transition-all duration-500 whitespace-nowrap">
                        <span className="text-[10px] font-black uppercase tracking-widest ml-2">Receber Ajuda</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
                </a>
            )}

            <footer className="py-24 md:py-32 px-6 md:px-8 text-center border-t border-zinc-900 bg-black font-black uppercase tracking-widest text-[9px] relative z-10">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <p className="text-zinc-600 max-w-xs leading-relaxed italic">{site.rodape}</p>
                    <div className="flex items-center gap-6 px-8 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-xl group hover:border-white transition-all">
                        <p className="text-zinc-700 group-hover:text-zinc-500 transition-colors">Powered by</p>
                        <div className="flex items-center gap-3">
                            <img src="/LOGO.png" alt="" className="w-5 h-5 invert brightness-0" />
                            <p className="text-white tracking-tighter italic">Builder EXONE</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
