
import React from 'react';
import { Button } from '../components/ui/Button';
import { supabaseService } from '../services/supabaseService';
import { APP_CONFIG, ICONS } from '../constants';
import { useAuth } from '../context/AuthContext';

export const PlansPage = () => {
    const { user, refreshProfile } = useAuth();

    const handleBuy = async (type: 'plano' | 'slot') => {
        if (!user) return;
        await supabaseService.createCheckout(user.id, type);
        refreshProfile();
    };

    if (!user) return null;

    return (
        <div className="space-y-8 md:space-y-12">
            <header>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Planos & Slots</h2>
                <p className="text-zinc-400 uppercase tracking-widest text-[9px] font-black mt-2">Sua infraestrutura digital</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {/* Basic Plan */}
                <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] flex flex-col hover:border-black transition-all shadow-sm group">
                    <div className="mb-8">
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-zinc-100 rounded-full group-hover:bg-black group-hover:text-white transition-colors">Destaque</span>
                        <h3 className="text-xl md:text-2xl font-black mt-4 uppercase">Combo Inicial</h3>
                        <p className="text-zinc-400 text-xs mt-2">Pacote completo de entrada</p>
                    </div>
                    <div className="mb-10">
                        <span className="text-4xl font-black">R$ {APP_CONFIG.PRICES.BASE_PLAN}</span>
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest ml-1">Único</span>
                    </div>
                    <ul className="space-y-4 mb-10 flex-1">
                        {[`${APP_CONFIG.SLOTS_PER_BASE_PLAN} Slots de Site inclusos`, 'Acesso Vitalício', 'Hospedagem inclusa'].map((item, i) => (
                            <li key={i} className="text-xs font-bold flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Button onClick={() => handleBuy('plano')} className="w-full py-4 rounded-2xl">Adquirir Combo</Button>
                </div>

                {/* Extra Slot */}
                <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] flex flex-col hover:border-black transition-all shadow-sm group">
                    <div className="mb-8">
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-zinc-100 rounded-full">Expansão</span>
                        <h3 className="text-xl md:text-2xl font-black mt-4 uppercase">Slot Extra</h3>
                        <p className="text-zinc-400 text-xs mt-2">Cresça seu portfólio</p>
                    </div>
                    <div className="mb-10">
                        <span className="text-4xl font-black">R$ {APP_CONFIG.PRICES.EXTRA_SLOT}</span>
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest ml-1">/Unidade</span>
                    </div>
                    <ul className="space-y-4 mb-10 flex-1">
                        {['+1 Slot de Site disponível', 'Sem taxas mensais', 'Sem limite de compra'].map((item, i) => (
                            <li key={i} className="text-xs font-bold flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Button variant="secondary" onClick={() => handleBuy('slot')} className="w-full py-4 rounded-2xl">Comprar Slot</Button>
                </div>

                {/* Status Card */}
                <div className="bg-black text-white p-8 md:p-10 rounded-[2rem] flex flex-col justify-center border border-black shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-900 rounded-full -mr-16 -mt-16 opacity-50"></div>
                    <h3 className="text-xl font-black uppercase tracking-tight mb-4 relative z-10">Vitalício</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed mb-8 relative z-10">
                        Não cobramos mensalidades. Todos os slots adquiridos são <strong className="text-white">vitalícios</strong> e incluem hospedagem sem custos recorrentes.
                    </p>
                    <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 relative z-10">
                        <p className="text-[9px] uppercase font-black tracking-widest text-zinc-500 mb-2">Capacidade Atual</p>
                        <div className="flex items-end gap-2">
                            <p className="text-2xl font-black">{user.slots_usados}</p>
                            <p className="text-xs font-black text-zinc-600 mb-1">/ {user.role === 'admin' ? '∞' : user.slots_total} SLOTS</p>
                        </div>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-4 overflow-hidden">
                            <div
                                className="bg-white h-full transition-all duration-500"
                                style={{ width: `${Math.min((user.slots_usados / (user.slots_total || 1)) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
