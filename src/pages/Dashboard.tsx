
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
        // Wait for checkout logic or redirect? User asked for dynamic URL update.
        // If they bought it, we record it.
        await supabaseService.createCheckout(user.id, 'live_help');

        const customUrl = await supabaseService.getLiveHelpUrl();
        if (customUrl) {
            window.open(customUrl, '_blank');
        } else {
            const waNumber = await supabaseService.getLiveHelpConfig();
            const message = encodeURIComponent(`Olá! Acabei de contratar o Auxílio ao Vivo para verificação de BM. Meu e-mail é ${user.email}.`);
            window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
        }
        setShowLiveHelp(false);
    };

    const activeSitesCount = sites.filter(s => s.ativo).length;

    if (!user) return null; // Should not happen due to PrivateRoute

    const hasNoPlan = user.slots_total === 0;
    const isLimitReached = user.role !== 'admin' && user.slots_usados >= user.slots_total;

    return (
        <div className="space-y-8 md:space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Painel Geral</h2>
                    <p className="text-zinc-400 uppercase tracking-widest text-[9px] font-black mt-2">Controle de aplicações</p>
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
                <div className="border border-black p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white shadow-lg animate-in slide-in-from-top duration-500">
                    <div className="flex items-center gap-5">
                        <div className="bg-black text-white p-3 rounded-2xl shrink-0 shadow-md">
                            <ICONS.CreditCard />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase tracking-tight">
                                {hasNoPlan ? "Ative sua conta" : "Aumente seu limite"}
                            </p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                                {hasNoPlan ? "Assine um plano para liberar seus primeiros 3 sites!" : "Você atingiu seu limite atual de slots disponíveis."}
                            </p>
                        </div>
                    </div>
                    <Button variant="primary" onClick={() => navigate('/planos')} className="text-[10px] px-8 rounded-xl shadow-none">
                        {hasNoPlan ? "Liberar 3 Sites" : "Comprar mais slots"}
                    </Button>
                </div>
            )}

            {/* Stats Cards - Compact on mobile, grid on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                <div className="bg-white border border-zinc-200 p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col justify-between">
                    <p className="text-[9px] uppercase tracking-widest font-black text-zinc-400 mb-4">Slots Utilizados</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl md:text-5xl font-black tracking-tighter">{user.slots_usados}</span>
                        <span className="text-xl text-zinc-300 font-black">/ {user.role === 'admin' ? '∞' : user.slots_total}</span>
                    </div>
                </div>
                <div className="bg-white border border-zinc-200 p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col justify-between">
                    <p className="text-[9px] uppercase tracking-widest font-black text-zinc-400 mb-4">Sites Ativos</p>
                    <div>
                        <span className="text-4xl md:text-5xl font-black tracking-tighter">{activeSitesCount}</span>
                        <p className="text-[8px] text-zinc-400 mt-2 uppercase font-black tracking-widest">Publicados na rede</p>
                    </div>
                </div>
                <div className="col-span-2 md:col-span-1 p-6 md:p-8 bg-black text-white rounded-[2rem] shadow-xl border border-black flex flex-col justify-between">
                    <p className="text-[9px] uppercase tracking-widest font-black text-zinc-500 mb-4">Status da Rede</p>
                    <div>
                        <p className="text-lg font-black uppercase tracking-tighter">{user.slots_total > 0 ? 'Plano Ativo' : 'Pendente'}</p>
                        <div className="mt-3 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${user.slots_total > 0 ? 'bg-green-500' : 'bg-zinc-500'}`}></span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Builder v2.5 Online</span>
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
                        <div className="py-20 text-center flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                            <p className="uppercase tracking-widest text-[9px] font-black text-zinc-400">Carregando Instâncias...</p>
                        </div>
                    ) : sites.length === 0 ? (
                        <div className="border-2 border-dashed border-zinc-200 p-16 md:p-24 text-center rounded-[2.5rem] bg-white/50 group hover:border-black transition-all">
                            <div className="bg-zinc-100 w-12 h-12 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                <ICONS.Plus />
                            </div>
                            <p className="text-zinc-400 uppercase tracking-widest text-[10px] font-black">Nenhum projeto iniciado</p>
                            <Button variant="outline" className="mt-8 mx-auto rounded-xl px-10" onClick={() => navigate('/create')}>Criar Primeiro Site</Button>
                        </div>
                    ) : (
                        sites.map(site => (
                            <div key={site.id} className="bg-white border border-zinc-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-black transition-all rounded-3xl shadow-sm hover:shadow-md group">
                                <div className="flex-1">
                                    <h4 className="text-xl font-black tracking-tighter uppercase group-hover:text-black">{site.razao_social}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100">{site.dominio}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-5">
                                        <span className={`w-2 h-2 rounded-full ${site.ativo ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-zinc-200 border border-zinc-300'}`}></span>
                                        <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">{site.ativo ? 'Online' : 'Suspenso'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 md:self-center">
                                    <a href={`#/site/${site.slug}`} target="_blank" className="flex-1 md:flex-none text-center px-6 py-3 text-[10px] font-black uppercase tracking-widest border border-zinc-200 hover:border-black rounded-xl transition-all active:scale-95">Preview</a>
                                    <Button variant="secondary" className="flex-1 md:flex-none py-3 px-6 text-[10px] rounded-xl" onClick={() => navigate(`/edit/${site.id}`)}>Gerenciar</Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};
