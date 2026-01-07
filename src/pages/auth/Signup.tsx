import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { data, error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }
        if (data.user) {
            await supabase.from('profiles').insert([{ id: data.user.id, email, full_name: fullName }]);
            setLoading(false);
            navigate('/login');
        }
    };

    return (
        <div className="flex min-h-[85vh] items-center justify-center px-4 font-sans animate-in">
            <div className="w-full max-w-lg glass p-10 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black tracking-tight text-foreground mb-4">Join Room Finder</h2>
                    <p className="text-muted-foreground font-medium">Start your journey to finding or listing the perfect space.</p>
                </div>

                <form className="space-y-6" onSubmit={handleSignup}>
                    {error && (
                        <div className="p-4 text-sm font-bold text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl animate-in">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    className="h-16 bg-muted/30 border-0 rounded-2xl pl-14 px-6 focus-visible:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="h-16 bg-muted/30 border-0 rounded-2xl pl-14 px-6 focus-visible:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Secure Password</label>
                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="h-16 bg-muted/30 border-0 rounded-2xl pl-14 px-6 focus-visible:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all group mt-4" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Get Started Now'}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <div className="text-center pt-4">
                        <p className="text-muted-foreground font-medium">
                            Already a member?{' '}
                            <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4 decoration-2">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
