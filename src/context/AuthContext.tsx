
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (email: string, pass: string) => Promise<void>;
    signInWithOAuth: (provider: 'google') => Promise<void>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (id: string, email: string) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                setUser(data);
            } else {
                // If profile doesn't exist (e.g. first login after signup if trigger didn't run), use fallback
                //Ideally, we insert it here or wait for trigger.
                // For this demo, let's just set local state, but in production we want a row in 'profiles'.
                setUser({ id, email, role: 'user', slots_total: 0, slots_usados: 0 });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchProfile(session.user.id, session.user.email!);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchProfile(session.user.id, session.user.email!);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, pass: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
    };

    const signUp = async (email: string, pass: string) => {
        const { error } = await supabase.auth.signUp({ email, password: pass });
        if (error) throw error;
    };

    const signInWithOAuth = async (provider: 'google') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        });
        if (error) throw error;
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id, user.email);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithOAuth, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
