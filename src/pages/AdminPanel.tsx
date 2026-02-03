
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
        <div className="space-y-12 md:space-y-16">
            <header>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Gestão Master</h2>
                <p className="text-zinc-400 uppercase tracking-widest text-[9px] font-black mt-2">Administração do ecossistema</p>
            </header>

            {/* Global Live Help Configuration */}
            <section className="bg-white border border-zinc-200 p-8 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">WhatsApp: Auxílio ao Vivo</h3>
                    <div className="flex flex-col gap-4">
                        <Input
                            label="WhatsApp de Redirecionamento"
                            value={liveHelpNumber}
                            onChange={setLiveHelpNumber}
                            placeholder="Ex: 5511999999999"
                        />
                        <Button onClick={handleUpdateLiveHelp} className="px-10 h-[50px]">Salvar Número</Button>
                        <p className="text-[9px] text-zinc-400 uppercase font-black tracking-widest">Número legado para fallback de WhatsApp.</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">URL: Auxílio ao Vivo</h3>
                    <div className="flex flex-col gap-4">
                        <Input
                            label="URL de Redirecionamento Principal"
                            value={liveHelpUrl}
                            onChange={setLiveHelpUrl}
                            placeholder="Ex: https://checkout..."
                        />
                        <Button onClick={handleUpdateLiveHelpUrl} className="px-10 h-[50px]">Salvar URL</Button>
                        <p className="text-[9px] text-zinc-400 uppercase font-black tracking-widest">Esta URL será usada prioritariamente no botão do Dashboard.</p>
                    </div>
                </div>
            </section>

            {/* Support Numbers Management */}
            <section className="bg-white border border-zinc-200 p-8 rounded-lg shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">Canais de Suporte (Botão de Ajuda nos Sites)</h3>

                <form onSubmit={handleAddSupport} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 items-end">
                    <Input label="Nome/Setor" value={newName} onChange={setNewName} placeholder="Ex: Suporte Financeiro" />
                    <Input label="Número WhatsApp" value={newNumber} onChange={setNewNumber} placeholder="Ex: 5511999999999" />
                    <Button type="submit" className="mb-5 h-[50px]">Adicionar Canal</Button>
                </form>

                <div className="space-y-3">
                    {supportList.map(n => (
                        <div key={n.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                            <div>
                                <p className="text-xs font-black uppercase tracking-tight">{n.nome}</p>
                                <p className="text-[10px] font-mono text-zinc-400">{n.numero}</p>
                            </div>
                            <button onClick={() => handleRemoveSupport(n.id)} className="text-red-500 hover:text-red-700 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    ))}
                    {supportList.length === 0 && <p className="text-center text-[9px] text-zinc-400 uppercase font-black">Nenhum canal cadastrado.</p>}
                </div>
            </section>

            <section>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6 px-2">Usuários Registrados</h3>
                <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black text-white text-[9px] uppercase font-black tracking-widest">
                                <th className="px-6 py-4">Usuário</th>
                                <th className="px-6 py-4">Papel</th>
                                <th className="px-6 py-4 text-center">Slots</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {usersList.map(u => (
                                <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-6 py-5 font-bold text-xs truncate max-w-[150px]">{u.email}</td>
                                    <td className="px-6 py-5">
                                        <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-1 rounded-lg ${u.role === 'admin' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-500'}`}>{u.role}</span>
                                    </td>
                                    <td className="px-6 py-5 text-[10px] font-mono font-bold text-center">{u.slots_usados} / {u.role === 'admin' ? '∞' : u.slots_total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6 px-2">Projetos Ativos na Rede</h3>
                <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black text-white text-[9px] uppercase font-black tracking-widest">
                                <th className="px-6 py-4">Site</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Controle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {sitesList.map(s => (
                                <tr key={s.id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="font-bold uppercase tracking-tight text-xs">{s.razao_social}</div>
                                        <div className="text-[9px] text-zinc-400 font-mono mt-0.5">{s.dominio}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${s.ativo ? 'bg-green-500' : 'bg-zinc-300'}`}></div>
                                            <span className={`text-[9px] font-black tracking-widest uppercase ${s.ativo ? 'text-black' : 'text-zinc-300'}`}>
                                                {s.ativo ? 'Ativo' : 'Off'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="text-[9px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4 hover:text-zinc-400 transition-colors" onClick={() => toggleSite(s.id, s.ativo)}>
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
