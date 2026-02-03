
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
    const { signIn, signUp, signInWithOAuth } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const cleanEmail = email.trim();
            const cleanPass = password.trim();

            if (isRegistering) {
                await signUp(cleanEmail, cleanPass);
                alert('Cadastro realizado! Verifique seu e-mail ou faça login.');
                setIsRegistering(false);
            } else {
                await signIn(cleanEmail, cleanPass);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center md:bg-blue-600 bg-zinc-950 font-sans relative overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/bk.mp4?v=2" type="video/mp4" />
                </video>
                {/* Dark Overlay to help contrast */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
            </div>

            <div className="bg-white w-full md:max-w-5xl md:h-[650px] md:shadow-[0_20px_50px_rgba(0,0,0,0.3)] md:rounded-3xl flex flex-col md:flex-row overflow-hidden min-h-screen md:min-h-fit relative z-10">

                {/* Left Side: Illustration/Brand (PC only) */}
                <div className="hidden md:flex flex-1 relative bg-zinc-950 overflow-hidden group">
                    {/* Darker Inner Background for the left panel */}
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-900 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-800 rounded-full blur-[120px] animate-pulse delay-700"></div>
                    </div>

                    <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
                        <div className="flex items-center gap-3">
                            <img src="/LOGO.png?v=2" alt="" className="h-8 w-auto brightness-0 invert" />
                            <span className="text-white font-black tracking-tighter text-xl uppercase italic">BUILDER EXONE</span>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="space-y-4">
                                <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em]">Personal Hub</p>
                                <h2 className="text-white text-3xl md:text-4xl font-black leading-[1.1] tracking-tighter uppercase italic">
                                    Conecte-se à sua <br />
                                    <span className="text-zinc-600">Produtividade.</span>
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Form */}
                <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white text-zinc-950">
                    {/* Mobile Header (Hidden on PC) */}
                    <div className="md:hidden text-center mb-12">
                        <img src="/LOGO.png?v=2" alt="" className="h-16 w-auto mx-auto mb-6" />
                        <h1 className="text-3xl font-black tracking-tighter uppercase italic" style={{ color: '#000000' }}>BUILDER EXONE</h1>
                        <div className="h-1 w-12 bg-black mx-auto mt-4"></div>
                    </div>

                    <div className="max-w-sm mx-auto w-full">
                        <div className="mb-10 text-left">
                            <div className="text-blue-600 text-3xl font-light mb-4">✱</div>
                            <h2 className="text-3xl font-black tracking-tighter uppercase mb-2 italic" style={{ color: '#000000' }}>
                                {isRegistering ? 'Criar Conta' : 'Acesse sua Conta'}
                            </h2>
                            <p className="text-zinc-500 text-sm font-medium">
                                {isRegistering
                                    ? 'Preencha os dados abaixo para iniciar sua jornada.'
                                    : 'Bem-vindo de volta! Insira suas credenciais.'}
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-600 text-[10px] p-4 rounded-r-lg mb-6 font-black uppercase tracking-widest animate-in slide-in-from-left">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleAuth} className="space-y-6 text-left">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500 ml-1">Seu E-mail</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border-b-2 border-zinc-100 bg-transparent px-1 py-3 focus:border-blue-600 outline-none transition-all text-black text-sm font-bold"
                                    placeholder="exemplo@clubx1.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500 ml-1">Sua Senha</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border-b-2 border-zinc-100 bg-transparent px-1 py-3 focus:border-blue-600 outline-none transition-all text-black text-sm font-bold"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="secondary"
                                className="w-full py-4 rounded-xl text-xs uppercase font-black tracking-widest !bg-black !text-white hover:bg-zinc-900 active:scale-95 transition-all mt-4 border-none shadow-xl shadow-zinc-200"
                                style={{ backgroundColor: '#000000', color: '#ffffff' }}
                                disabled={loading}
                            >
                                {loading ? 'Aguarde...' : isRegistering ? 'Cadastrar Agora' : 'Entrar no Sistema'}
                                <span className="sr-only text-[8px] opacity-10">v2.1.2</span>
                            </Button>
                        </form>

                        <div className="mt-8 flex flex-col gap-6">
                            <div className="relative flex items-center justify-center">
                                <div className="border-t border-zinc-100 w-full absolute"></div>
                                <span className="bg-white px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 relative z-10">ou continue com</span>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-3 w-full py-3.5 border border-zinc-100 rounded-xl hover:bg-zinc-50 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm"
                                    onClick={() => signInWithOAuth('google')}
                                >
                                    <svg className="w-5 h-5 grayscale" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                    Google
                                </button>
                            </div>
                        </div>

                        <div className="mt-10 text-center">
                            <button
                                className="text-[10px] uppercase tracking-widest font-black text-zinc-500 hover:text-black transition-all"
                                onClick={() => setIsRegistering(!isRegistering)}
                            >
                                {isRegistering ? (
                                    <span>Já tem conta? <span className="text-black underline underline-offset-4 decoration-2">Faça Login</span></span>
                                ) : (
                                    <span>Não tem conta? <span className="text-black underline underline-offset-4 decoration-2">Cadastre-se</span></span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
