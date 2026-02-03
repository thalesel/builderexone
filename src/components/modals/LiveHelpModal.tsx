
import React from 'react';
import { ICONS } from '../../constants';
import { Button } from '../ui/Button';

export const LiveHelpModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center overflow-hidden">
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-white rounded-t-[3rem] md:rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300 z-[100000]">
                <button onClick={onClose} className="absolute top-6 right-6 md:top-8 md:right-8 p-2 bg-zinc-100 rounded-full text-zinc-500 active:scale-90">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-red-600 text-white rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                        <ICONS.LiveSupport />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-3">Auxílio ao Vivo</h3>
                        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed">
                            Verificação de <span className="text-black underline decoration-2 underline-offset-4">Business Manager</span> em tempo real.
                        </p>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Como funciona:</p>
                        <ul className="text-[11px] font-bold text-zinc-600 space-y-2">
                            <li className="flex items-start gap-2">• Sessão via WhatsApp/Discord com compartilhamento de tela</li>
                            <li className="flex items-start gap-2">• Analisamos passo a passo sua BM</li>
                            <li className="flex items-start gap-2">• Valor: <span className="text-black">R$ 20,00 por hora</span></li>
                        </ul>
                    </div>
                    <Button onClick={onConfirm} variant="live" className="w-full py-4 rounded-2xl">Contratar Auxílio (R$ 20,00)</Button>
                </div>
            </div>
        </div>
    );
};
