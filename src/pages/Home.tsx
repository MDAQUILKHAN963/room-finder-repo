import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Sparkles, Shield, Zap, Home as HomeIcon } from 'lucide-react';
import { RoomCard } from '@/components/rooms/RoomCard';

export default function Home() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [recentRooms, setRecentRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(6);

            if (!error && data) {
                setRecentRooms(data);
            }
            setLoading(false);
        };

        fetchRooms();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate('/search');
        }
    };

    return (
        <div className="space-y-24 animate-in">
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center justify-center rounded-[2.5rem] overflow-hidden">
                {/* Modern Abstract Background */}
                <div className="absolute inset-0 bg-primary overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512918766775-d26322044f21?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay scale-110 animate-pulse-slow"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-background"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-12">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-dark text-white text-sm font-medium mb-8 border-white/20">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span>Discover premium living spaces</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tighter leading-[1.1]">
                        The Smarter Way to <br />
                        <span className="text-secondary">Find Your Home</span>
                    </h1>

                    <p className="text-xl text-blue-100/90 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        Join thousands of students and professionals finding the perfect room with verified owners and zero brokerage.
                    </p>

                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto p-2 rounded-2xl glass-dark border-white/10 shadow-2xl">
                        <div className="flex-grow flex items-center px-4 bg-white/10 rounded-xl focus-within:bg-white/20 transition-colors">
                            <MapPin className="w-5 h-5 text-blue-200 mr-2" />
                            <Input
                                className="border-0 bg-transparent focus-visible:ring-0 text-white placeholder:text-blue-200/50 text-lg h-14"
                                placeholder="Where do you want to live?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button type="submit" size="xl" className="h-14 px-8 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg shadow-lg shadow-accent/20">
                            Search Now
                        </Button>
                    </form>
                </div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard
                    icon={<Shield className="w-10 h-10 text-primary" />}
                    title="Verified Owners"
                    desc="Every listing is strictly verified by our team for your peace of mind."
                />
                <FeatureCard
                    icon={<Zap className="w-10 h-10 text-accent" />}
                    title="Zero Brokerage"
                    desc="Direct communication with owners. No hidden charges or middleman."
                />
                <FeatureCard
                    icon={<HomeIcon className="w-10 h-10 text-primary" />}
                    title="Premium Stays"
                    desc="Quality living spaces curated for modern students and workers."
                />
            </section>

            {/* Recent Listings */}
            <section>
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Handpicked Collections</h2>
                        <p className="text-muted-foreground mt-1 text-lg">Recently added premium spaces in your city</p>
                    </div>
                    <Button variant="outline" size="lg" onClick={() => navigate('/search')} className="rounded-full px-8 hover:bg-primary hover:text-white transition-all">
                        Discover More
                    </Button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[400px] glass rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : recentRooms.length === 0 ? (
                    <div className="text-center py-20 glass rounded-[2.5rem] border-dashed">
                        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <HomeIcon className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">No listings yet</h3>
                        <p className="text-muted-foreground mb-8">Be the first one to host a professional space.</p>
                        <Button size="lg" onClick={() => navigate('/rooms/add')} className="rounded-full px-10">
                            List Your Space
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentRooms.map((room) => (
                            <div key={room.id} className="animate-in" style={{ animationDelay: '0.1s' }}>
                                <RoomCard room={room} />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="glass p-8 rounded-3xl hover-lift">
            <div className="mb-6">{icon}</div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed italic">{desc}</p>
        </div>
    );
}
