
import { supabase } from '../lib/supabase';
import { Site, SupportNumber, UserProfile } from '../types';
import { APP_CONFIG } from '../constants';

export const supabaseService = {
    // --- Auth is handled by Context/Supabase Client directly, but we might need helper for profiles ---
    getUser: async (id: string) => {
        const { data } = await supabase.from('users').select('*').eq('id', id).single();
        return data as UserProfile;
    },

    // --- Sites ---
    getSitesByUserId: async (userId: string) => {
        const { data } = await supabase.from('sites').select('*').eq('user_id', userId);
        return (data || []) as Site[];
    },

    getAllSites: async () => {
        const { data } = await supabase.from('sites').select('*');
        return (data || []) as Site[];
    },

    getAllUsers: async () => {
        const { data } = await supabase.from('users').select('*');
        return (data || []) as UserProfile[];
    },

    getSiteBySlug: async (slug: string) => {
        const { data } = await supabase.from('sites').select('*').eq('slug', slug).single();
        return data as Site;
    },

    getSiteById: async (id: string) => {
        const { data } = await supabase.from('sites').select('*').eq('id', id).single();
        return data as Site;
    },

    createSite: async (siteData: Omit<Site, 'id' | 'created_at' | 'ativo'>) => {
        // Check limit? usually done in RLS or Edge Function, but client check:
        // We assume caller checked limit or we check here by fetching profile.
        const { data, error } = await supabase.from('sites').insert([{ ...siteData, ativo: true }]).select().single();
        if (error) throw error;

        // We also need to increment slots_usados? 
        // Ideally this is a trigger. 
        // construct SQL trigger for this.
        return data as Site;
    },

    updateSite: async (id: string, siteData: Partial<Site>) => {
        const { data, error } = await supabase.from('sites').update(siteData).eq('id', id).select().single();
        if (error) throw error;
        return data as Site;
    },

    toggleSiteStatus: async (siteId: string, status: boolean) => {
        await supabase.from('sites').update({ ativo: status }).eq('id', siteId);
    },

    // --- Support Numbers ---
    getSupportNumbers: async () => {
        const { data } = await supabase.from('support_numbers').select('*');
        return (data || []) as SupportNumber[];
    },
    addSupportNumber: async (nome: string, numero: string) => {
        const { data, error } = await supabase.from('support_numbers').insert([{ nome, numero, ativo: true }]).select().single();
        if (error) throw error;
        return data as SupportNumber;
    },
    removeSupportNumber: async (id: string) => {
        await supabase.from('support_numbers').delete().eq('id', id);
    },

    // --- Live Help Configuration ---
    // Store this in a 'config' table or similar. For now, let's assume a table 'app_config' Key-Value
    getLiveHelpConfig: async () => {
        const { data } = await supabase.from('app_config').select('value').eq('key', 'live_help_whatsapp').single();
        return data?.value || '';
    },
    updateLiveHelpConfig: async (numero: string) => {
        const cleanNum = numero.replace(/\D/g, '');
        const { error } = await supabase.from('app_config').upsert({ key: 'live_help_whatsapp', value: cleanNum });
        if (error) throw error;
        return cleanNum;
    },

    // --- Checkout ---
    createCheckout: async (userId: string, type: 'plano' | 'slot' | 'live_help') => {
        // Call Edge Function
        const { data, error } = await supabase.functions.invoke('create-checkout', {
            body: { type, userId }
        });
        if (error) throw error;
        return data; // { url: '...' }
    }
};
