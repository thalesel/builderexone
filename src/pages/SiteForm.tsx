
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { PlanUpsellModal } from '../components/modals/PlanUpsellModal';
import { supabaseService } from '../services/supabaseService';
import { ICONS } from '../constants';
import { Site } from '../types';
import { useAuth } from '../context/AuthContext';

export const SiteForm = () => {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [showUpsellModal, setShowUpsellModal] = useState(false);
    const [existingSite, setExistingSite] = useState<Site | undefined>(undefined);

    const [formData, setFormData] = useState({
        dominio: '',
        razao_social: '',
        cnpj: '',
        missao: '',
        telefones: '',
        email: '',
        instagram: '',
        whatsapp: '',
        sobre: '',
        rodape: '',
        pixel_meta: '',
        meta_tag: '',
        app_id: '',
        link_pagina: '',
    });

    useEffect(() => {
        if (id) {
            supabaseService.getSiteById(id).then(site => {
                if (site) {
                    setExistingSite(site);
                    setFormData({
                        dominio: site.dominio || '',
                        razao_social: site.razao_social || '',
                        cnpj: site.cnpj || '',
                        missao: site.missao || '',
                        telefones: site.telefones || '',
                        email: site.email || '',
                        instagram: site.instagram || '',
                        whatsapp: site.whatsapp || '',
                        sobre: site.sobre || '',
                        rodape: site.rodape || '',
                        pixel_meta: site.pixel_meta || '',
                        meta_tag: site.meta_tag || '',
                        app_id: site.app_id || '',
                        link_pagina: site.link_pagina || '',
                    });
                }
            });
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        // Check for plan before submitting (only for new sites)
        const hasNoPlan = user.role !== 'admin' && user.slots_total === 0;
        const isLimitReached = user.role !== 'admin' && user.slots_usados >= user.slots_total;

        if (!existingSite && (hasNoPlan || isLimitReached)) {
            setShowUpsellModal(true);
            return;
        }

        setLoading(true);
        try {
            const slug = formData.razao_social.toLowerCase().replace(/[^a-z0-9]/g, '-');

            if (existingSite) {
                await supabaseService.updateSite(existingSite.id, {
                    ...formData,
                    slug
                });
            } else {
                await supabaseService.createSite({
                    ...formData,
                    user_id: user.id,
                    slug,
                });
            }

            refreshProfile(); // Update slots usage in UI
            navigate('/dashboard');
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="space-y-8 md:space-y-12">
            <header className="flex items-center gap-6">
                <button onClick={() => navigate(-1)} className="p-3 bg-white border border-zinc-200 hover:border-black rounded-xl shadow-sm transition-all"><ICONS.ChevronLeft /></button>
                <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">{existingSite ? 'Configurações' : 'Novo Projeto'}</h2>
                    <p className="text-zinc-400 uppercase tracking-widest text-[9px] font-black mt-1">Editor de parâmetros</p>
                </div>
            </header>

            <PlanUpsellModal
                isOpen={showUpsellModal}
                onClose={() => setShowUpsellModal(false)}
                onGoToPlans={() => navigate('/planos')}
            />

            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
                {[
                    {
                        title: "01 / Identidade",
                        fields: [
                            { label: "Domínio", key: "dominio", placeholder: "exemplo.com.br", required: true },
                            { label: "Razão Social", key: "razao_social", placeholder: "Minha Empresa LTDA", required: true },
                            { label: "CNPJ", key: "cnpj", placeholder: "00.000.000/0001-00" },
                            { label: "Frase de Impacto", key: "missao", placeholder: "Ex: Especialistas em..." }
                        ]
                    },
                    {
                        title: "02 / Contato",
                        fields: [
                            { label: "Canais Telefônicos", key: "telefones", placeholder: "(00) 0000-0000" },
                            { label: "E-mail Comercial", key: "email", placeholder: "contato@empresa.com" },
                            { label: "Usuário Instagram", key: "instagram", placeholder: "perfil_empresa" },
                            { label: "WhatsApp (ID)", key: "whatsapp", placeholder: "5511999999999" }
                        ]
                    },
                    {
                        title: "03 / Estrutura",
                        isLarge: true,
                        fields: [
                            { label: "Descrição Institucional", key: "sobre", placeholder: "Conte a história do negócio...", type: "textarea" },
                            { label: "Texto do Rodapé", key: "rodape", placeholder: "Copyright © 2024...", type: "textarea" }
                        ]
                    },
                    {
                        title: "04 / Metadados & Scripts",
                        fields: [
                            { label: "Facebook Pixel", key: "pixel_meta", placeholder: "ID do Pixel" },
                            { label: "Meta Verification", key: "meta_tag", placeholder: "Código de Verificação" },
                            { label: "Facebook App ID", key: "app_id", placeholder: "ID da Aplicação" },
                            { label: "Página de Destino", key: "link_pagina", placeholder: "https://site.com/oferta" }
                        ]
                    }
                ].map((section, idx) => (
                    <section key={idx} className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                        <div className="border-b border-black pb-3 mb-8">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">{section.title}</h3>
                        </div>
                        <div className={`grid grid-cols-1 ${section.isLarge ? 'gap-0' : 'md:grid-cols-2 gap-x-12 gap-y-2'}`}>
                            {section.fields.map((field) => (
                                field.type === 'textarea' ? (
                                    <TextArea
                                        key={field.key}
                                        label={field.label}
                                        value={(formData as any)[field.key]}
                                        onChange={(v: string) => setFormData({ ...formData, [field.key]: v })}
                                        placeholder={field.placeholder}
                                        rows={6}
                                    />
                                ) : (
                                    <Input
                                        key={field.key}
                                        label={field.label}
                                        value={(formData as any)[field.key]}
                                        onChange={(v: string) => setFormData({ ...formData, [field.key]: v })}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                    />
                                )
                            ))}
                        </div>
                    </section>
                ))}

                <div className="flex flex-col md:flex-row justify-end gap-4 pt-8 md:pt-12 border-t border-zinc-200">
                    <Button variant="secondary" className="w-full md:w-auto px-10 rounded-xl order-2 md:order-1" onClick={() => navigate('/dashboard')}>Cancelar</Button>
                    <Button type="submit" className="w-full md:w-auto px-16 rounded-xl order-1 md:order-2" disabled={loading}>{loading ? 'Salvando...' : 'Confirmar'}</Button>
                </div>
            </form>
        </div>
    );
};
