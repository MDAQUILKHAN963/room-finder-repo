import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { RoomCard } from '@/components/rooms/RoomCard';
import { Link } from 'react-router-dom';
import { PlusCircle, Trash2, Pencil, LayoutDashboard, Home } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyRooms = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setRooms(data);
            }
            setLoading(false);
        };

        fetchMyRooms();
    }, [user]);

    const handleDelete = async (roomId: number) => {
        if (!confirm('Are you sure you want to delete this listing permanently?')) return;

        const { error } = await supabase.from('rooms').delete().eq('id', roomId);
        if (!error) {
            setRooms(prev => prev.filter(r => r.id !== roomId));
        } else {
            alert("Failed to delete room. Please try again.");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 py-8 animate-in font-sans">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-primary">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-sm font-black uppercase tracking-widest">Management Console</span>
                    </div>
                    <h1 className="text-5xl font-black text-foreground tracking-tight">Your Dashboard</h1>
                    <p className="text-muted-foreground text-lg">Manage your property listings and monitor tenant interest.</p>
                </div>
                <Link to="/rooms/add">
                    <Button size="xl" className="rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 px-8 font-black">
                        <PlusCircle className="w-5 h-5 mr-3" />
                        New Listing
                    </Button>
                </Link>
            </header>

            <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <h2 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center">
                        Active Listings
                        <span className="ml-4 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                            {rooms.length} Total
                        </span>
                    </h2>
                </div>

                {rooms.length === 0 ? (
                    <div className="text-center py-32 glass rounded-[3rem] border-dashed border-2">
                        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Home className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-foreground mb-2">No properties yet</h3>
                        <p className="text-muted-foreground text-lg mb-8 max-w-sm mx-auto">Start reaching potential tenants by creating your first property listing.</p>
                        <Link to="/rooms/add">
                            <Button variant="outline" size="xl" className="rounded-2xl px-12 border-primary/20 text-primary hover:bg-primary/5">
                                Create Listing
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {rooms.map(room => (
                            <div key={room.id} className="relative group/dashboard animate-in">
                                <RoomCard room={room} />
                                <div className="absolute top-4 right-4 flex flex-col space-y-3 opacity-0 group-hover/dashboard:opacity-100 transition-all duration-300 transform translate-x-4 group-hover/dashboard:translate-x-0">
                                    <Link to={`/rooms/edit/${room.id}`}>
                                        <Button variant="secondary" size="icon" className="h-12 w-12 rounded-2xl glass-dark border-white/20 text-white hover:bg-white/40 shadow-xl backdrop-blur-md">
                                            <Pencil className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-12 w-12 rounded-2xl bg-destructive/90 hover:bg-destructive shadow-xl shadow-destructive/20"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete(room.id);
                                        }}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
