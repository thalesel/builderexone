
import React from 'react';
import { ICONS } from '../../constants';
import { Button } from '../ui/Button';

export const PlanUpsellModal = ({ isOpen, onClose, onGoToPlans }: { isOpen: boolean; onClose: () => void; onGoToPlans: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center overflow-hidden">
            {/* Backdrop - High priority z-index and fixed position to cover everything */}
            <div
                className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300 ease-in-out"
                style={{ width: '100vw', height: '100vh', left: 0, top: 0 }}
                onClick={onClose}
            ></div>

            {/* Mobile Pop-up (Bottom Sheet) */}
            <div className="md:hidden relative w-full h-[65vh] bg-white rounded-t-lg p-8 shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500 ease-out overflow-hidden z-[100000]">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-zinc-100 rounded-full text-zinc-500 active:scale-90">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="flex-1 flex flex-col justify-center text-center space-y-6">
                    <div className="w-20 h-20 bg-black text-white rounded-lg mx-auto flex items-center justify-center shadow-2xl">
                        <ICONS.CreditCard />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-3">Quase lá!</h3>
                        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed">
                            Você precisa do <span className="text-black underline decoration-2 underline-offset-4">Combo Inicial</span> para publicar seu primeiro site.
                        </p>
                    </div>
                    <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest px-8">
                        Com o plano inicial você libera 3 slots e suporte completo.
                    </p>
                    <Button onClick={onGoToPlans} className="w-full py-4 rounded-lg shadow-none mt-4">Ver Planos Agora</Button>
                </div>
            </div>

            {/* Desktop Modal */}
            <div className="hidden md:flex relative w-full max-w-md bg-white rounded-lg p-12 shadow-2xl flex-col animate-in zoom-in-95 duration-300 ease-out border border-zinc-100 z-[100000]">
                <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="text-center space-y-8">
                    <div className="w-16 h-16 bg-black text-white rounded-lg mx-auto flex items-center justify-center shadow-lg">
                        <ICONS.CreditCard />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Assine um Plano</h3>
                        <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                            Para concluir a criação e publicar seu site, você precisa adquirir o <span className="font-black text-black">Combo Inicial</span> ou um Slot extra.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Button onClick={onGoToPlans} className="w-full py-4 rounded-lg">Ir para Planos</Button>
                        <button onClick={onClose} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">Voltar e continuar editando</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
