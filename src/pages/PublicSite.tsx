
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { Site, SupportNumber } from '../types';
import { ICONS } from '../constants';

export const PublicSite = () => {
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
    if (!site) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-[0.3em] text-xs">Instância não encontrada</div>;

    if (!site.ativo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-8 text-center">
                <div className="max-w-md border border-zinc-800 p-10 md:p-14 rounded-[3rem] bg-zinc-900 shadow-2xl">
                    <div className="mb-8 flex justify-center text-zinc-700">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    </div>
                    <h1 className="text-xl font-black uppercase tracking-widest mb-4">Instância Bloqueada</h1>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-loose">Acesso restrito por pendências técnicas ou financeiras. Contate o administrador do BUILDER EXONE.</p>
                </div>
            </div>
        );
    }

    const mainSupport = supportNumbers.find(n => n.ativo);

    return (
        <div className="bg-white text-black min-h-screen flex flex-col selection:bg-black selection:text-white relative">
            <header className="py-16 md:py-24 px-6 md:px-8 border-b border-zinc-100">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8 break-words">{site.razao_social}</h1>
                    <div className="h-1 w-16 bg-black mb-8"></div>
                    <p className="text-lg md:text-2xl font-bold max-w-2xl text-zinc-500 uppercase tracking-tight leading-snug">{site.missao}</p>
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full px-6 md:px-8 py-16 md:py-24 space-y-24 md:space-y-32">
                <section className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
                    <div className="md:col-span-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">Perfil / Atuação</h2>
                    </div>
                    <div className="md:col-span-8">
                        <p className="text-xl md:text-3xl font-bold tracking-tight leading-snug whitespace-pre-wrap">{site.sobre}</p>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-zinc-100 pt-16 md:pt-24">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-8">Contato Direto</h3>
                        <ul className="space-y-6 text-xl md:text-2xl font-black tracking-tighter uppercase">
                            <li className="flex items-center gap-4">
                                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                                {site.telefones}
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                                {site.email}
                            </li>
                            <li className="text-zinc-300 text-sm font-bold tracking-widest border-t border-zinc-50 pt-4">CNPJ: {site.cnpj}</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-8">Ecossistema Digital</h3>
                        <div className="flex flex-col gap-3">
                            {site.instagram && (
                                <a href={`https://instagram.com/${site.instagram.replace('@', '')}`} className="w-full text-center py-4 bg-black text-white text-[10px] uppercase font-black tracking-[0.2em] hover:bg-zinc-800 transition-all rounded-2xl shadow-xl active:scale-95">Instagram Oficial</a>
                            )}
                            {site.whatsapp && (
                                <a href={`https://wa.me/${site.whatsapp}`} className="w-full text-center py-4 border-2 border-black text-black text-[10px] uppercase font-black tracking-[0.2em] hover:bg-zinc-50 transition-all rounded-2xl active:scale-95">WhatsApp Business</a>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Floating Help Button */}
            {mainSupport && (
                <a
                    href={`https://wa.me/${mainSupport.numero}?text=Olá! Preciso de ajuda com o site ${site.razao_social}`}
                    target="_blank"
                    className="fixed bottom-8 right-8 z-[50] group flex items-center gap-3 bg-black text-white p-4 rounded-3xl shadow-2xl hover:scale-105 transition-all active:scale-95 border border-zinc-800"
                >
                    <div className="hidden md:block overflow-hidden max-w-0 group-hover:max-w-[200px] transition-all duration-500 whitespace-nowrap">
                        <span className="text-[10px] font-black uppercase tracking-widest ml-2">Receber Ajuda</span>
                    </div>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .001 5.413 0 12.05c0 2.123.553 4.197 1.602 6.034L0 24l6.135-1.61a11.785 11.785 0 005.912 1.579h.005c6.635 0 12.049-5.414 12.05-12.053a11.77 11.77 0 00-3.414-8.523" /></svg>
                </a>
            )}

            <footer className="py-16 md:py-20 px-6 md:px-8 text-center border-t border-zinc-100 bg-zinc-50">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <p className="text-[9px] uppercase tracking-[0.3em] font-black text-zinc-400 max-w-xs leading-relaxed">{site.rodape}</p>
                    <div className="flex items-center gap-4 px-6 py-3 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                        <p className="text-[9px] uppercase tracking-widest text-zinc-300 font-black">By</p>
                        <div className="flex items-center gap-2">
                            <ICONS.Logo className="w-4 h-4 text-black" />
                            <p className="text-[9px] uppercase tracking-widest text-black font-black">Builder EXONE</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
