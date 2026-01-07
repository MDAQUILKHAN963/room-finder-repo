import { Link } from 'react-router-dom';
import { MapPin, Home, Bed, User, Phone, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface Room {
    id: number;
    title: string;
    location: string;
    price: number;
    property_type: string;
    tenant_preference: string;
    contact_number: string;
    images: string[];
}

interface RoomCardProps {
    room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
    const { user } = useAuth();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="group relative glass rounded-3xl overflow-hidden hover-lift h-full flex flex-col">
            <Link to={`/rooms/${room.id}`} className="block h-64 relative overflow-hidden">
                {room.images && room.images.length > 0 ? (
                    <img
                        src={room.images[0]}
                        alt={room.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground">
                        <Home className="w-12 h-12" />
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <div className="glass-dark border-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-1.5 text-white text-xs font-bold shadow-lg">
                        <Sparkles className="w-3 h-3 text-accent" />
                        <span>Verified</span>
                    </div>
                </div>
                <div className="absolute top-4 right-4">
                    <div className="glass-dark border-white/20 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg">
                        {room.property_type}
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <Link to={`/rooms/${room.id}`}>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 tracking-tight">
                            {room.title}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1.5 text-primary/60" />
                    <span className="truncate">{room.location}</span>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                        <Bed className="w-3.5 h-3.5 mr-1.5 text-primary" />
                        {room.property_type}
                    </div>
                    <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                        <User className="w-3.5 h-3.5 mr-1.5 text-primary" />
                        {room.tenant_preference}
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="text-2xl font-black text-primary tracking-tight">
                        {formatPrice(room.price)}
                        <span className="text-xs text-muted-foreground font-normal ml-1">/mo</span>
                    </div>
                </div>

                <div className="mt-4">
                    {user ? (
                        <a
                            href={`tel:${room.contact_number}`}
                            className="flex items-center justify-center w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200 text-sm shadow-lg shadow-primary/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            Contact Owner
                        </a>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center justify-center w-full py-3 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-secondary/80 hover:scale-[1.02] transition-all duration-200 text-sm shadow-lg shadow-black/5"
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            Login to Contact
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
