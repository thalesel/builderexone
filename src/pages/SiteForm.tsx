
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
import { generateSlug } from '../lib/utils';

export const SiteForm = () => {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [showUpsellModal, setShowUpsellModal] = useState(false);
    const [existingSite, setExistingSite] = useState<Site | undefined>(undefined);
    const [slugError, setSlugError] = useState('');
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    const [formData, setFormData] = useState({
        dominio: '',
        slug: '',
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
                        slug: site.slug || '',
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
        const isLimitReached = user.role !== 'admin' && user.slots_usados >= user.slots_total;

        if (!existingSite && isLimitReached) {
            setShowUpsellModal(true);
            return;
        }

        if (!formData.slug) {
            setSlugError('O slug é obrigatório');
            return;
        }

        setLoading(true);
        try {
            // Check slug availability
            const isAvailable = await supabaseService.isSlugAvailable(formData.slug, existingSite?.id);
            if (!isAvailable) {
                setSlugError('Este endereço (slug) já está sendo usado por outro site');
                setLoading(false);
                return;
            }

            if (existingSite) {
                await supabaseService.updateSite(existingSite.id, {
                    ...formData
                });
            } else {
                await supabaseService.createSite({
                    ...formData,
                    user_id: user.id
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
        <div className="space-y-12 max-w-5xl mx-auto">
            <header className="flex items-center gap-8 border-b border-zinc-800 pb-8">
                <button onClick={() => navigate(-1)} className="p-4 bg-zinc-900 border border-zinc-800 hover:border-white rounded-xl shadow-xl transition-all text-white"><ICONS.ChevronLeft /></button>
                <div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic text-white">{existingSite ? 'Configurações' : 'Novo Projeto'}</h2>
                    <p className="text-zinc-500 uppercase tracking-widest text-[9px] font-black mt-2">Editor de parâmetros e publicação</p>
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
                            {
                                label: "Razão Social",
                                key: "razao_social",
                                placeholder: "Minha Empresa LTDA",
                                required: true,
                                onChange: (val: string) => {
                                    const updates: any = { razao_social: val };
                                    if (!isSlugManuallyEdited && !existingSite) {
                                        updates.slug = generateSlug(val);
                                        setSlugError('');
                                    }
                                    setFormData({ ...formData, ...updates });
                                }
                            },
                            {
                                label: "Slug (Link do Site)",
                                key: "slug",
                                placeholder: "ex-minha-empresa",
                                required: true,
                                error: slugError,
                                onChange: (val: string) => {
                                    setIsSlugManuallyEdited(true);
                                    setFormData({ ...formData, slug: generateSlug(val) });
                                    setSlugError('');
                                }
                            },
                            { label: "Domínio próprio (Opcional)", key: "dominio", placeholder: "exemplo.com.br" },
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
                    <section key={idx} className="bg-zinc-900/40 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="border-b border-zinc-800 pb-6 mb-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-hover:text-white transition-colors">{section.title}</h3>
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
                                        onChange={(v: string) => field.onChange ? field.onChange(v) : setFormData({ ...formData, [field.key]: v })}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                        error={(field as any).error}
                                    />
                                )
                            ))}
                        </div>
                    </section>
                ))}

                <div className="flex flex-col md:flex-row justify-end gap-6 pt-12 border-t border-zinc-800">
                    <Button variant="secondary" className="w-full md:w-auto px-12 py-4 rounded-xl font-black uppercase tracking-widest order-2 md:order-1" onClick={() => navigate('/dashboard')}>Descartar</Button>
                    <Button type="submit" className="w-full md:w-auto px-20 py-4 rounded-xl font-black uppercase tracking-widest order-1 md:order-2 shadow-[0_0_30px_rgba(255,255,255,0.05)]" disabled={loading}>{loading ? 'Sincronizando...' : 'Salvar Alterações'}</Button>
                </div>
            </form>
        </div>
    );
};
