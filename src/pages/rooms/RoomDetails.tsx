import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { MapPin, Home, Bed, User, Phone, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function RoomDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [room, setRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [showContact, setShowContact] = useState(false);

    useEffect(() => {
        const fetchRoom = async () => {
            if (!id) return;
            const { data, error } = await supabase
                .from('rooms')
                .select('*, profiles(full_name, email)')
                .eq('id', id)
                .single();

            if (!error) {
                setRoom(data);
            }
            setLoading(false);
        };

        fetchRoom();
    }, [id]);

    if (loading) return <div className="text-center py-20 font-sans">Loading details...</div>;
    if (!room) return <div className="text-center py-20 font-sans">Room not found.</div>;

    const images = room.images || [];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in font-sans">
            {/* Image Gallery */}
            <div className="relative aspect-video md:aspect-[21/9] bg-muted rounded-3xl !overflow-hidden group shadow-2xl">
                {images.length > 0 ? (
                    <>
                        <img
                            src={images[activeImage]}
                            alt={room.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setActiveImage(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => setActiveImage(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 glass-dark p-2 rounded-2xl">
                                    {images.map((_: any, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeImage ? 'bg-primary w-6' : 'bg-white/50'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                        <Home className="w-20 h-20" />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            Verified Property
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">{room.title}</h1>
                        <div className="flex items-center text-muted-foreground text-lg">
                            <MapPin className="w-5 h-5 mr-2 text-primary" />
                            {room.location}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <InfoCard icon={<Bed />} label="Type" value={room.property_type} />
                        <InfoCard icon={<User />} label="Preference" value={room.tenant_preference} />
                        <InfoCard icon={<Home />} label="Living" value="Furnished" />
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Professional Description</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed italic border-l-4 border-primary/20 pl-6 bg-muted/20 py-6 rounded-r-3xl">
                            {room.description || "No description provided."}
                        </p>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="glass p-8 rounded-[2.5rem] border-primary/10 shadow-2xl sticky top-28">
                        <div className="mb-8 p-6 rounded-3xl bg-primary/5 border border-primary/10">
                            <span className="text-4xl font-black text-primary">₹{room.price}</span>
                            <span className="text-muted-foreground font-medium ml-2">/month</span>
                        </div>

                        <div className="space-y-4">
                            {user ? (
                                <>
                                    <Button
                                        className="w-full text-lg h-16 rounded-2xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
                                        onClick={() => setShowContact(!showContact)}
                                    >
                                        <Phone className="w-5 h-5 mr-2" />
                                        {showContact ? 'Hide Contact' : 'View Contact Details'}
                                    </Button>

                                    {showContact && (
                                        <div className="p-6 bg-accent/10 border border-accent/20 text-accent rounded-2xl text-center animate-in">
                                            <p className="text-xs uppercase font-bold tracking-widest mb-1">Owner Contact</p>
                                            <p className="text-2xl font-black">{room.contact_number}</p>
                                            <a
                                                href={`tel:${room.contact_number}`}
                                                className="mt-4 flex items-center justify-center py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-all text-sm"
                                            >
                                                <Phone className="w-4 h-4 mr-2" /> Call Now
                                            </a>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <Button
                                        className="w-full text-lg h-16 rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary/80 flex flex-col pt-4"
                                        onClick={() => navigate('/login')}
                                    >
                                        <div className="flex items-center justify-center">
                                            <Lock className="w-4 h-4 mr-2" />
                                            <span>Login to Contact</span>
                                        </div>
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground px-4">
                                        For security and privacy, owner details are only available to registered users.
                                    </p>
                                </div>
                            )}

                            <div className="pt-6 border-t border-border mt-4">
                                <p className="text-xs text-center text-muted-foreground uppercase tracking-widest font-bold">
                                    Listing ID: #{room.id}
                                </p>
                                <p className="text-[10px] text-center text-muted-foreground mt-1 italic">
                                    Last Updated: {new Date(room.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoCard({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] text-center border border-border/50 hover-lift shadow-sm">
            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 text-primary">
                {icon}
            </div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter mb-1">{label}</span>
            <span className="font-extrabold text-foreground">{value}</span>
        </div>
    );
}
