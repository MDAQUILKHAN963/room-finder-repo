import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { RoomCard } from '@/components/rooms/RoomCard'; // We can reuse RoomCard or make a row version
import { Link } from 'react-router-dom';
import { PlusCircle, Trash2, Pencil } from 'lucide-react';

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
        if (!confirm('Are you sure you want to delete this listing?')) return;

        // Optional: Delete images from storage first (omitted for brevity)

        const { error } = await supabase.from('rooms').delete().eq('id', roomId);
        if (!error) {
            setRooms(prev => prev.filter(r => r.id !== roomId));
        } else {
            alert("Failed to delete room.");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">My Dashboard</h1>
                <Link to="/rooms/add">
                    <Button>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Room
                    </Button>
                </Link>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold">My Listings ({rooms.length})</h2>

                {rooms.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border">
                        <p className="text-gray-500 mb-4">You haven't listed any rooms yet.</p>
                        <Link to="/rooms/add">
                            <Button variant="outline">Create your first listing</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map(room => (
                            <div key={room.id} className="relative group">
                                <RoomCard room={room} />
                                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link to={`/rooms/edit/${room.id}`}>
                                        <Button variant="secondary" size="icon" className="h-8 w-8">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete(room.id);
                                    }}>
                                        <Trash2 className="w-4 h-4" />
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
