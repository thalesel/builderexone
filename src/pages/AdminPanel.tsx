
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { supabaseService } from '../services/supabaseService';
import { UserProfile, Site, SupportNumber } from '../types';

export const AdminPanel = () => {
    const [usersList, setUsersList] = useState<UserProfile[]>([]);
    const [sitesList, setSitesList] = useState<Site[]>([]);
    const [supportList, setSupportList] = useState<SupportNumber[]>([]);
    const [liveHelpNumber, setLiveHelpNumber] = useState('');
    const [liveHelpUrl, setLiveHelpUrl] = useState('');
    const [loading, setLoading] = useState(true);

    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');

    useEffect(() => {
        Promise.all([
            supabaseService.getAllUsers(),
            supabaseService.getAllSites(),
            supabaseService.getSupportNumbers(),
            supabaseService.getLiveHelpConfig(),
            supabaseService.getLiveHelpUrl()
        ]).then(([u, s, sn, lhn, lhu]) => {
            setUsersList(u);
            setSitesList(s);
            setSupportList(sn);
            setLiveHelpNumber(lhn || '');
            setLiveHelpUrl(lhu || '');
            setLoading(false);
        });
    }, []);

    const toggleSite = async (id: string, current: boolean) => {
        await supabaseService.toggleSiteStatus(id, !current);
        setSitesList(sitesList.map(s => s.id === id ? { ...s, ativo: !current } : s));
    };

    const handleAddSupport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newNumber) return;
        const added = await supabaseService.addSupportNumber(newName, newNumber);
        setSupportList([...supportList, added]);
        setNewName('');
        setNewNumber('');
    };

    const handleRemoveSupport = async (id: string) => {
        await supabaseService.removeSupportNumber(id);
        setSupportList(supportList.filter(n => n.id !== id));
    };

    const handleUpdateLiveHelp = async () => {
        try {
            await supabaseService.updateLiveHelpConfig(liveHelpNumber);
            alert("Número de Auxílio ao Vivo atualizado!");
        } catch (error: any) {
            console.error("Error saving number:", error);
            alert("Erro ao salvar número: " + (error.message || "Erro desconhecido"));
        }
    };

    const handleUpdateLiveHelpUrl = async () => {
        try {
            await supabaseService.updateLiveHelpUrl(liveHelpUrl);
            alert("URL de Auxílio ao Vivo atualizada!");
        } catch (error: any) {
            console.error("Error saving URL:", error);
            alert("Erro ao salvar URL: " + (error.message || "Erro desconhecido"));
        }
    };

    if (loading) return <div className="py-20 text-center uppercase tracking-widest text-[9px] font-black text-zinc-400">Autenticando Módulo Admin...</div>;

    return (
        <div className="space-y-12 md:space-y-16 max-w-6xl mx-auto">
            <header className="border-b border-zinc-800 pb-8">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic text-white">Gestão Master</h2>
                <p className="text-zinc-500 uppercase tracking-widest text-[9px] font-black mt-2">Administração do ecossistema e controle de rede</p>
            </header>

            {/* Global Live Help Configuration */}
            <section className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 p-8 md:p-12 rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-12 relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 opacity-50"></div>
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-8 border-l-2 border-white pl-4">WhatsApp: Auxílio ao Vivo</h3>
                    <div className="flex flex-col gap-6">
                        <Input
                            label="Redirecionamento WhatsApp"
                            value={liveHelpNumber}
                            onChange={setLiveHelpNumber}
                            placeholder="Ex: 5511999999999"
                        />
                        <Button onClick={handleUpdateLiveHelp} className="w-full py-4 text-[10px] rounded-xl font-black uppercase tracking-widest">Salvar Módulo</Button>
                        <p className="text-[8px] text-zinc-600 uppercase font-black tracking-widest leading-relaxed">Configuração de redirecionamento global para os botões de suporte direto.</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-8 border-l-2 border-white pl-4">Módulo: Link de Destino</h3>
                    <div className="flex flex-col gap-6">
                        <Input
                            label="URL Principal de Direcionamento"
                            value={liveHelpUrl}
                            onChange={setLiveHelpUrl}
                            placeholder="Ex: https://checkout..."
                        />
                        <Button onClick={handleUpdateLiveHelpUrl} className="w-full py-4 text-[10px] rounded-xl font-black uppercase tracking-widest">Atualizar Link</Button>
                        <p className="text-[8px] text-zinc-600 uppercase font-black tracking-widest leading-relaxed">Prioridade máxima sobre o número de WhatsApp no Dashboard Principal.</p>
                    </div>
                </div>
            </section>

            {/* Support Numbers Management */}
            <section className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-500 opacity-30"></div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-10 border-l-2 border-white pl-4">Canais de Suporte de Sites</h3>

                <form onSubmit={handleAddSupport} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
                    <Input label="Setor / Identificação" value={newName} onChange={setNewName} placeholder="Suporte Financeiro" />
                    <Input label="WhatsApp (DDI+DDD+Num)" value={newNumber} onChange={setNewNumber} placeholder="5511999999999" />
                    <Button type="submit" className="h-[52px] rounded-xl text-[10px] font-black uppercase tracking-widest">Vincular Canal</Button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {supportList.map(n => (
                        <div key={n.id} className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-zinc-800 group/item hover:border-zinc-500 transition-all">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-tight text-white mb-1">{n.nome}</p>
                                <p className="text-[10px] font-mono text-zinc-600 group-hover/item:text-zinc-400 transition-colors">{n.numero}</p>
                            </div>
                            <button onClick={() => handleRemoveSupport(n.id)} className="p-2 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    ))}
                    {supportList.length === 0 && (
                        <div className="col-span-full py-8 text-center bg-black/20 rounded-2xl border border-dashed border-zinc-800">
                            <p className="text-[9px] text-zinc-700 uppercase font-black">Nenhum canal ativo no momento.</p>
                        </div>
                    )}
                </div>
            </section>

            <section>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-8 px-4 border-l-2 border-white pl-4">Usuários Registrados</h3>
                <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white text-black text-[9px] uppercase font-black tracking-[0.2em]">
                                <th className="px-8 py-5">E-mail de Acesso</th>
                                <th className="px-8 py-5">Nível</th>
                                <th className="px-8 py-5 text-center">Capacidade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {usersList.map(u => (
                                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-6 font-bold text-xs truncate max-w-[200px] text-zinc-300 group-hover:text-white transition-colors">{u.email}</td>
                                    <td className="px-8 py-6">
                                        <span className={`text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg border ${u.role === 'admin' ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' : 'border-zinc-800 text-zinc-500 bg-zinc-800/30'}`}>{u.user_metadata?.role || u.role}</span>
                                    </td>
                                    <td className="px-8 py-6 text-[10px] font-mono font-black text-center text-zinc-200">
                                        <span className="text-white">{u.slots_usados}</span>
                                        <span className="text-zinc-600 mx-1">/</span>
                                        <span>{u.role === 'admin' ? '∞' : u.slots_total}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-8 px-4 border-l-2 border-white pl-4">Projetos Ativos na Rede</h3>
                <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white text-black text-[9px] uppercase font-black tracking-[0.2em]">
                                <th className="px-8 py-5">Identificação do Site</th>
                                <th className="px-8 py-5">Status Network</th>
                                <th className="px-8 py-5 text-right">Ação Master</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {sitesList.map(s => (
                                <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="font-bold uppercase tracking-tight text-xs text-white group-hover:text-blue-400 transition-colors italic">{s.razao_social}</div>
                                        <div className="text-[9px] text-zinc-600 font-mono mt-0.5 group-hover:text-zinc-400 transition-colors">{s.dominio}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${s.ativo ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 'bg-zinc-800 border border-zinc-700'}`}></div>
                                            <span className={`text-[9px] font-black tracking-widest uppercase ${s.ativo ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                                {s.ativo ? 'Online' : 'Suspenso'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            className={`text-[9px] font-black uppercase tracking-widest transition-all ${s.ativo ? 'text-zinc-500 hover:text-red-500 hover:underline' : 'text-blue-500 hover:text-blue-400 hover:underline'} underline-offset-8 decoration-2`}
                                            onClick={() => toggleSite(s.id, s.ativo)}
                                        >
                                            {s.ativo ? 'Suspender' : 'Reativar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};
