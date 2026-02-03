
import React from 'react';
import { Button } from '../components/ui/Button';
import { supabaseService } from '../services/supabaseService';
import { APP_CONFIG, ICONS } from '../constants';
import { useAuth } from '../context/AuthContext';

export const PlansPage = () => {
    const { user, refreshProfile } = useAuth();

    const handleBuy = (type: 'plano' | 'slot') => {
        if (!user) return;

        // Construct URL with email pre-fill if possible (Kiwify supports ?email=)
        const baseUrl = type === 'plano' ? APP_CONFIG.KIWIFY_LINKS.BASE_PLAN : APP_CONFIG.KIWIFY_LINKS.EXTRA_SLOT;
        const url = `${baseUrl}?email=${encodeURIComponent(user.email)}`;

        // Open in same tab or new tab depending on preference. 
        // window.open might be blocked. try direct navigation or ensure '_blank' works
        // Better yet: use an anchor tag in the UI, but for now let's force location change for debugging
        window.location.href = url;
    };

    if (!user) return null;

    return (
        <div className="space-y-12">
            <header className="border-b border-zinc-800 pb-8">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">Planos & Slots</h2>
                <p className="text-zinc-500 uppercase tracking-widest text-[9px] font-black mt-2">Sua infraestrutura digital de alta performance</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {/* Basic Plan */}
                <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 p-8 rounded-3xl flex flex-col hover:border-blue-500/50 transition-all duration-500 shadow-sm group">
                    <div className="mb-8">
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white text-black rounded-full group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all">Destaque</span>
                        <h3 className="text-2xl font-black mt-6 uppercase italic text-white">Combo Inicial</h3>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">Pacote completo de entrada</p>
                    </div>
                    <div className="mb-10">
                        <span className="text-4xl font-black text-white">R$ {APP_CONFIG.PRICES.BASE_PLAN}</span>
                        <span className="text-zinc-600 text-xs font-black uppercase tracking-widest ml-1">Pagamento Único</span>
                    </div>
                    <ul className="space-y-4 mb-10 flex-1">
                        {[`${APP_CONFIG.SLOTS_PER_BASE_PLAN} Slots de Site inclusos`, 'Acesso Vitalício', 'Hospedagem inclusa'].map((item, i) => (
                            <li key={i} className="text-xs font-bold flex items-center gap-3">
                                <div className="w-5 h-5 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                    <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="text-zinc-400">{item}</span>
                            </li>
                        ))}
                    </ul>
                    <Button onClick={() => handleBuy('plano')} className="w-full py-4 rounded-xl">Adquirir Combo</Button>
                </div>

                {/* Extra Slot */}
                <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 p-8 rounded-3xl flex flex-col hover:border-zinc-500 transition-all duration-500 shadow-sm group">
                    <div className="mb-8">
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full">Expansão</span>
                        <h3 className="text-2xl font-black mt-6 uppercase italic text-white">Slot Extra</h3>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">Cresça seu portfólio</p>
                    </div>
                    <div className="mb-10">
                        <span className="text-4xl font-black text-white">R$ {APP_CONFIG.PRICES.EXTRA_SLOT}</span>
                        <span className="text-zinc-600 text-xs font-black uppercase tracking-widest ml-1">/Unidade</span>
                    </div>
                    <ul className="space-y-4 mb-10 flex-1">
                        {['+1 Slot de Site disponível', 'Sem taxas mensais', 'Sem limite de compra'].map((item, i) => (
                            <li key={i} className="text-xs font-bold flex items-center gap-3">
                                <div className="w-5 h-5 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                                    <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="text-zinc-400">{item}</span>
                            </li>
                        ))}
                    </ul>
                    <Button variant="secondary" onClick={() => handleBuy('slot')} className="w-full py-4 rounded-xl">Comprar Slot</Button>
                </div>

                {/* Status Card */}
                <div className="bg-white text-black p-8 md:p-10 rounded-3xl flex flex-col justify-center border border-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-zinc-100 rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4 relative z-10 italic">Vitalício</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed mb-10 relative z-10 font-bold">
                        Não cobramos mensalidades. Todos os slots adquiridos são <strong className="text-black underline underline-offset-4 decoration-2">vitalícios</strong> e incluem hospedagem sem custos recorrentes.
                    </p>
                    <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 relative z-10">
                        <p className="text-[9px] uppercase font-black tracking-widest text-zinc-400 mb-3">Capacidade da Rede</p>
                        <div className="flex items-end gap-2">
                            <p className="text-3xl font-black">{user.slots_usados}</p>
                            <p className="text-[10px] font-black text-zinc-400 mb-1">/ {user.role === 'admin' ? '∞' : user.slots_total} SLOTS</p>
                        </div>
                        <div className="w-full bg-zinc-200 h-2 rounded-full mt-5 overflow-hidden">
                            <div
                                className="bg-black h-full transition-all duration-1000 ease-out"
                                style={{ width: `${Math.min((user.slots_usados / (user.slots_total || 1)) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
