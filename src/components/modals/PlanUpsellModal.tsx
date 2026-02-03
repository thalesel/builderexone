
import React from 'react';
import { ICONS } from '../../constants';
import { Button } from '../ui/Button';

export const PlanUpsellModal = ({ isOpen, onClose, onGoToPlans }: { isOpen: boolean; onClose: () => void; onGoToPlans: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center overflow-hidden">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-300 ease-in-out"
                style={{ width: '100vw', height: '100vh', left: 0, top: 0 }}
                onClick={onClose}
            ></div>

            {/* Mobile Pop-up (Bottom Sheet) */}
            <div className="md:hidden relative w-full h-[60vh] bg-zinc-900 rounded-t-[40px] p-8 pb-12 shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500 ease-out overflow-hidden z-[100000] border-t border-zinc-800">
                <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-zinc-800 rounded-full text-white active:scale-90">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="flex-1 flex flex-col justify-center text-center space-y-8">
                    <div className="w-24 h-24 bg-blue-600 text-white rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.3)]">
                        <ICONS.CreditCard />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic text-white">Quase lá!</h3>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] leading-loose">
                            Você precisa do <span className="text-white underline decoration-2 underline-offset-8">Combo Inicial</span> para publicar sua primeira aplicação.
                        </p>
                    </div>
                    <Button onClick={onGoToPlans} className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl">Visualizar Planos</Button>
                </div>
            </div>

            {/* Desktop Modal */}
            <div className="hidden md:flex relative w-full max-w-lg bg-zinc-900 rounded-[40px] p-16 shadow-[0_0_80px_rgba(0,0,0,0.5)] flex-col animate-in zoom-in-95 duration-300 ease-out border border-zinc-800 z-[100000] overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>

                <button onClick={onClose} className="absolute top-10 right-10 p-3 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="text-center space-y-10 relative z-10">
                    <div className="w-20 h-20 bg-blue-600 text-white rounded-[24px] mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                        <ICONS.CreditCard className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-4xl font-black uppercase tracking-tighter mb-6 italic text-white">Ativação Necessária</h3>
                        <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-sm mx-auto">
                            Para concluir a criação e publicar seu site, você precisa adquirir o <span className="font-black text-white px-1">Combo Inicial</span> ou contratar Slots estratégicos.
                        </p>
                    </div>
                    <div className="flex flex-col gap-6 pt-4">
                        <Button onClick={onGoToPlans} className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-blue-500/5">Explorar Assinaturas</Button>
                        <button onClick={onClose} className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-zinc-400 transition-colors">Voltar para o editor</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
