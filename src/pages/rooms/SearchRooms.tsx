import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RoomCard } from '@/components/rooms/RoomCard';
import { Filter, Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SearchRooms() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filters state
    const [location, setLocation] = useState(searchParams.get('q') || '');
    const [propertyType, setPropertyType] = useState('Any');
    const [tenantPreference, setTenantPreference] = useState('Any');
    const [maxPrice, setMaxPrice] = useState('50000');

    useEffect(() => {
        setLocation(searchParams.get('q') || '');
    }, [searchParams]);

    useEffect(() => {
        fetchRooms();
    }, [location, propertyType, tenantPreference, maxPrice]);

    const fetchRooms = async () => {
        setLoading(true);
        let query = supabase.from('rooms').select('*');

        if (location) {
            query = query.ilike('location', `%${location}%`);
        }

        if (propertyType !== 'Any') {
            query = query.eq('property_type', propertyType);
        }

        if (tenantPreference !== 'Any') {
            query = query.eq('tenant_preference', tenantPreference);
        }

        if (maxPrice) {
            query = query.lte('price', parseFloat(maxPrice));
        }

        const { data, error } = await query;
        if (error) {
            console.error('Error fetching rooms:', error);
        } else if (data) {
            setRooms(data);
        }
        setLoading(false);
    };

    const handleClearFilters = () => {
        setLocation('');
        setPropertyType('Any');
        setTenantPreference('Any');
        setMaxPrice('50000');
        setSearchParams({});
    };

    return (
        <div className="flex flex-col lg:flex-row gap-10 animate-in">
            {/* Mobile Filters Toggle */}
            <div className="lg:hidden">
                <Button size="xl" variant="outline" className="w-full glass rounded-2xl border-primary/20 text-primary font-bold" onClick={() => setShowFilters(!showFilters)}>
                    <Filter className="w-5 h-5 mr-3" />
                    Filters & Preferences
                    <ChevronRight className={cn("ml-auto w-5 h-5 transition-transform", showFilters && "rotate-90")} />
                </Button>
            </div>

            {/* Sidebar Filters */}
            <div className={cn(
                "w-full lg:w-80 lg:block space-y-8",
                showFilters ? "block animate-in" : "hidden"
            )}>
                <div className="glass p-8 rounded-[2rem] sticky top-28">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-extrabold text-2xl tracking-tight">Refine</h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Search Options</p>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-full px-4 text-destructive hover:bg-destructive/10" onClick={handleClearFilters}>
                            Reset
                        </Button>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Location</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g. Noida, Delhi"
                                    className="pl-10 h-12 bg-muted/30 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Budget</label>
                                <span className="text-primary font-black text-sm">₹{maxPrice}</span>
                            </div>
                            <input
                                type="range"
                                min="1000"
                                max="100000"
                                step="1000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full accent-primary"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                                <span>₹1k</span>
                                <span>Max Budget</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Structure</label>
                            <select
                                className="flex h-12 w-full rounded-xl border-0 bg-muted/30 px-4 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary/20"
                                value={propertyType}
                                onChange={e => setPropertyType(e.target.value)}
                            >
                                <option value="Any">All Types</option>
                                <option value="1 Room">1 Room</option>
                                <option value="1 RK">1 RK</option>
                                <option value="1 BHK">1 BHK</option>
                                <option value="2 BHK">2 BHK</option>
                                <option value="3 BHK">3 BHK</option>
                                <option value="1 Bed">1 Bed</option>
                                <option value="2 Bed">2 Bed</option>
                                <option value="3 Bed">3 Bed</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Preferred For</label>
                            <select
                                className="flex h-12 w-full rounded-xl border-0 bg-muted/30 px-4 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary/20"
                                value={tenantPreference}
                                onChange={e => setTenantPreference(e.target.value)}
                            >
                                <option value="Any">Anyone</option>
                                <option value="Bachelor">Bachelor</option>
                                <option value="Family">Family</option>
                                <option value="Girls">Girls</option>
                                <option value="Working">Working</option>
                                <option value="Students">Students</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="flex-1">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-foreground tracking-tighter">
                            {loading ? 'Finding Spaces...' : rooms.length === 0 ? 'No Matches' : `Discover ${rooms.length} Spaces`}
                        </h1>
                        {!loading && <p className="text-muted-foreground mt-1">Ready for immediate move-in</p>}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[430px] glass rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : rooms.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.map((room) => (
                            <div key={room.id} className="animate-in">
                                <RoomCard room={room} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 glass rounded-[2.5rem] border-dashed">
                        <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Search className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-3xl font-extrabold text-foreground mb-3">Keep Looking</h3>
                        <p className="text-muted-foreground text-lg mb-10 max-w-sm mx-auto">We couldn't find any rooms matching those exact criteria. Try broadening your search.</p>
                        <Button size="xl" onClick={handleClearFilters} className="rounded-full px-12">
                            Reset All Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
