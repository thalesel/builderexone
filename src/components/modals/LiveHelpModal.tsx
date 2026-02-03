
import React from 'react';
import { ICONS } from '../../constants';
import { Button } from '../ui/Button';

export const LiveHelpModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center overflow-hidden">
            <div className="fixed inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose}></div>
            <div className="relative w-full max-w-lg bg-zinc-900 rounded-t-[40px] md:rounded-[40px] p-10 md:p-14 shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-500 z-[100000] border-t md:border border-zinc-800 overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl"></div>

                <button onClick={onClose} className="absolute top-10 right-10 p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-all active:scale-95">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="text-center space-y-10 relative z-10">
                    <div className="w-24 h-24 bg-red-600 text-white rounded-[24px] mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.2)]">
                        <ICONS.LiveSupport className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 italic text-white">Consultoria Life</h3>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] leading-loose">
                            Verificação Premium de <span className="text-white underline decoration-red-600 decoration-2 underline-offset-8">Business Manager</span>
                        </p>
                    </div>
                    <div className="bg-black/40 p-8 rounded-3xl border border-zinc-800 text-left backdrop-blur-sm">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500 mb-6">Workflow de Atendimento:</p>
                        <ul className="text-[11px] font-black uppercase tracking-widest text-zinc-400 space-y-5 leading-relaxed">
                            <li className="flex items-start gap-4">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1 flex-shrink-0"></span>
                                Sessão dedicada via WhatsApp ou Discord
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1 flex-shrink-0"></span>
                                Diagnóstico estrutural completo da BM
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="w-1.5 h-1.5 bg-white rounded-full mt-1 flex-shrink-0"></span>
                                Investimento: <span className="text-white font-black ml-1">R$ 20,00 / Hora</span>
                            </li>
                        </ul>
                    </div>
                    <Button onClick={onConfirm} variant="live" className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-red-600/10">Requisitar Master (R$ 20,00)</Button>
                </div>
            </div>
        </div>
    );
};
