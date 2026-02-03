
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { LiveHelpModal } from '../components/modals/LiveHelpModal';
import { supabaseService } from '../services/supabaseService';
import { ICONS } from '../constants';
import { Site } from '../types';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
    const { user, refreshProfile } = useAuth();
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLiveHelp, setShowLiveHelp] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            supabaseService.getSitesByUserId(user.id).then(res => {
                setSites(res);
                setLoading(false);
            });
        }
    }, [user]);

    const handleLiveHelp = async () => {
        if (!user) return;

        try {
            // Get the destination URL from config
            const customUrl = await supabaseService.getLiveHelpUrl();

            if (customUrl) {
                // If admin set a custom URL (e.g. Kiwify link), go there directly
                window.location.href = customUrl;
            } else {
                // Fallback to WhatsApp if no URL is configured
                const waNumber = await supabaseService.getLiveHelpConfig();
                const message = encodeURIComponent(`Olá! Acabei de contratar o Auxílio ao Vivo para verificação de BM. Meu e-mail é ${user.email}.`);
                window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
            }
        } catch (error) {
            console.error("Error redirecting to Live Help:", error);
            // Fallback for safety
            window.open('https://wa.me/5511999999999', '_blank');
        }

        setShowLiveHelp(false);
    };

    const handleDeleteSite = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir o site "${name}"? Esta ação não pode ser desfeita.`)) return;

        try {
            await supabaseService.deleteSite(id);
            setSites(sites.filter(s => s.id !== id));
            refreshProfile();
        } catch (error: any) {
            alert("Erro ao excluir site: " + error.message);
        }
    };

    const activeSitesCount = sites.filter(s => s.ativo).length;

    if (!user) return null; // Should not happen due to PrivateRoute

    const hasNoPlan = user.slots_total === 0;
    const isLimitReached = user.role !== 'admin' && user.slots_usados >= user.slots_total;

    return (
        <div className="space-y-8 md:space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">Painel Geral</h2>
                    <p className="text-zinc-500 uppercase tracking-widest text-[9px] font-black mt-2">Controle de aplicações em tempo real</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={() => setShowLiveHelp(true)} variant="live" className="text-[10px] w-full sm:w-auto py-3">
                        <ICONS.LiveSupport /> Auxílio ao Vivo
                    </Button>
                    <Button onClick={() => navigate('/planos')} variant="secondary" className="text-[10px] w-full sm:w-auto">Planos</Button>
                    <Button onClick={() => navigate('/create')} className="text-[10px] w-full sm:w-auto">
                        Novo Site
                    </Button>
                </div>
            </header>

            <LiveHelpModal
                isOpen={showLiveHelp}
                onClose={() => setShowLiveHelp(false)}
                onConfirm={handleLiveHelp}
            />

            {(isLimitReached || hasNoPlan) && (
                <div className="border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-900 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-5">
                        <div className="bg-white text-black p-4 rounded-xl shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            <ICONS.CreditCard />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase tracking-tight text-white">
                                {hasNoPlan ? "Ative sua conta" : "Aumente seu limite"}
                            </p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                                {hasNoPlan ? "Assine um plano para liberar seus primeiros 3 sites!" : "Você atingiu seu limite atual de slots disponíveis."}
                            </p>
                        </div>
                    </div>
                    <Button variant="accent" onClick={() => navigate('/planos')} className="text-[10px] px-8 rounded-xl shrink-0">
                        {hasNoPlan ? "Liberar 3 Sites" : "Comprar mais slots"}
                    </Button>
                </div>
            )}

            {/* Stats Cards - Compact on mobile, grid on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-6 md:p-8 rounded-2xl flex flex-col justify-between">
                    <p className="text-[9px] uppercase tracking-widest font-black text-zinc-500 mb-6">Slots Utilizados</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl md:text-5xl font-black tracking-tighter text-white">{user.slots_usados}</span>
                        <span className="text-xl text-zinc-700 font-black">/ {user.role === 'admin' ? '∞' : user.slots_total}</span>
                    </div>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-6 md:p-8 rounded-2xl flex flex-col justify-between">
                    <p className="text-[9px] uppercase tracking-widest font-black text-zinc-500 mb-6">Instâncias Online</p>
                    <div>
                        <span className="text-4xl md:text-5xl font-black tracking-tighter text-white">{activeSitesCount}</span>
                        <p className="text-[8px] text-zinc-600 mt-2 uppercase font-black tracking-widest">Publicados na rede</p>
                    </div>
                </div>
                <div className="col-span-2 md:col-span-1 p-6 md:p-8 bg-white text-black rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white flex flex-col justify-between group overflow-hidden relative">
                    <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-zinc-200/50 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700"></div>
                    <p className="text-[9px] uppercase tracking-widest font-black text-zinc-400 mb-6 relative z-10">Status do Sistema</p>
                    <div className="relative z-10">
                        <p className="text-lg font-black uppercase tracking-tighter italic">{user.slots_total > 0 ? 'Plano Vitalício' : 'Aguardando'}</p>
                        <div className="mt-3 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${user.slots_total > 0 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,44,44,0.5)]'}`}></span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Builder Engine v2.5</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sites List */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Projetos Ativos</h3>
                    {sites.length > 0 && <span className="text-[10px] font-black bg-zinc-200 px-2 py-0.5 rounded-md uppercase">{sites.length}</span>}
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        <div className="py-20 text-center flex flex-col items-center gap-6">
                            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <p className="uppercase tracking-widest text-[9px] font-black text-zinc-600">Sincronizando Banco de Dados...</p>
                        </div>
                    ) : sites.length === 0 ? (
                        <div className="border border-dashed border-zinc-800 p-16 md:p-24 text-center rounded-3xl bg-zinc-900/30 group hover:border-zinc-500 transition-all duration-500">
                            <div className="bg-zinc-800 w-16 h-16 rounded-2xl mx-auto mb-8 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                                <ICONS.Plus />
                            </div>
                            <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-black">Nenhum projeto iniciado na sua conta</p>
                            <Button variant="primary" className="mt-10 mx-auto rounded-xl px-12" onClick={() => navigate('/create')}>Criar Primeiro Site</Button>
                        </div>
                    ) : (
                        sites.map(site => (
                            <div key={site.id} className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-500 rounded-3xl group relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex-1 relative z-10">
                                    <h4 className="text-2xl font-black tracking-tighter uppercase italic text-white group-hover:text-blue-400 transition-colors">{site.razao_social}</h4>
                                    <div className="flex items-center gap-2 mt-3">
                                        <span className="text-[10px] font-mono text-zinc-500 bg-black/40 px-3 py-1 rounded-lg border border-zinc-800/50">{site.dominio}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-6">
                                        <span className={`w-2 h-2 rounded-full ${site.ativo ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-zinc-800 border border-zinc-700'}`}></span>
                                        <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">{site.ativo ? 'Server Online' : 'Server Suspenso'}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 md:self-center relative z-10">
                                    <a
                                        href={`#/${site.slug}`}
                                        target="_blank"
                                        className="h-12 min-w-[110px] flex items-center justify-center px-6 text-[10px] font-black uppercase tracking-widest border border-zinc-800 hover:border-white hover:bg-white hover:text-black rounded-xl transition-all active:scale-95 bg-transparent text-zinc-400"
                                    >
                                        Acessar
                                    </a>
                                    <Button
                                        variant="secondary"
                                        className="h-12 min-w-[130px] py-4 px-8 text-[10px] rounded-xl border border-zinc-800"
                                        onClick={() => navigate(`/edit/${site.id}`)}
                                    >
                                        Gerenciar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-12 w-12 p-0 flex items-center justify-center rounded-xl border-zinc-800 text-zinc-600 hover:border-red-500/50 hover:bg-red-950/20 hover:text-red-500 transition-all"
                                        onClick={() => handleDeleteSite(site.id, site.razao_social)}
                                    >
                                        <ICONS.Trash />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};
