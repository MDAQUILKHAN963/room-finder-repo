import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, MapPin, Tag, Users, Info, CreditCard } from 'lucide-react';

export default function AddRoom() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        price: '',
        property_type: '1 BHK',
        tenant_preference: 'Any',
        contact_number: '',
        description: '',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages((prev) => [...prev, ...newFiles]);
            const newUrls = newFiles.map(file => URL.createObjectURL(file));
            setImageUrls((prev) => [...prev, ...newUrls]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImages = async () => {
        const uploadedUrls: string[] = [];
        for (const file of images) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user?.id}/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('room-images').upload(filePath, file);
            if (uploadError) continue;
            const { data: { publicUrl } } = supabase.storage.from('room-images').getPublicUrl(filePath);
            uploadedUrls.push(publicUrl);
        }
        return uploadedUrls;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const uploadedImageUrls = await uploadImages();
            const { error } = await supabase.from('rooms').insert([{
                owner_id: user.id,
                title: formData.title,
                location: formData.location,
                price: parseFloat(formData.price),
                property_type: formData.property_type,
                tenant_preference: formData.tenant_preference,
                contact_number: formData.contact_number,
                description: formData.description,
                images: uploadedImageUrls,
            }]);
            if (error) throw error;
            navigate('/');
        } catch (error) {
            console.error('Error adding room:', error);
            alert('Failed to add room. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 animate-in font-sans">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-black text-foreground tracking-tight mb-3">List Your Space</h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">Fill in the details below to reach thousands of potential tenants instantly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Section 1: Basic Info */}
                <div className="glass p-8 md:p-12 rounded-[2.5rem] space-y-8 shadow-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Info className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Basic Information</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Catchy Title</label>
                            <Input
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Modern Minimalist BHK with City View"
                                className="h-14 bg-muted/30 border-0 rounded-2xl px-6 focus-visible:ring-primary/20"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Monthly Rent (₹)</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                    <Input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="15000"
                                        className="h-14 bg-muted/30 border-0 rounded-2xl pl-14 focus-visible:ring-primary/20"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Precise Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                    <Input
                                        required
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="Area, City"
                                        className="h-14 bg-muted/30 border-0 rounded-2xl pl-14 focus-visible:ring-primary/20"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Room Type</label>
                                <div className="relative">
                                    <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                                    <select
                                        className="flex h-14 w-full rounded-2xl border-0 bg-muted/30 pl-14 pr-6 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all"
                                        value={formData.property_type}
                                        onChange={e => setFormData({ ...formData, property_type: e.target.value })}
                                    >
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
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Tenant Preference</label>
                                <div className="relative">
                                    <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                                    <select
                                        className="flex h-14 w-full rounded-2xl border-0 bg-muted/30 pl-14 pr-6 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all"
                                        value={formData.tenant_preference}
                                        onChange={e => setFormData({ ...formData, tenant_preference: e.target.value })}
                                    >
                                        <option value="Any">Any</option>
                                        <option value="Bachelor">Bachelor</option>
                                        <option value="Family">Family</option>
                                        <option value="Girls">Girls</option>
                                        <option value="Working">Working</option>
                                        <option value="Students">Students</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Direct Contact</label>
                            <Input
                                required
                                value={formData.contact_number}
                                onChange={e => setFormData({ ...formData, contact_number: e.target.value })}
                                placeholder="+91 98765 43210"
                                className="h-14 bg-muted/30 border-0 rounded-2xl px-6 focus-visible:ring-primary/20"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Rich Description</label>
                            <textarea
                                className="flex min-h-[140px] w-full rounded-2xl border-0 bg-muted/30 px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe amenities, proximity to transport, security etc."
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Images */}
                <div className="glass p-8 md:p-12 rounded-[2.5rem] space-y-8 shadow-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Upload className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Gallery</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {imageUrls.map((url, index) => (
                            <div key={index} className="relative aspect-square rounded-3xl overflow-hidden bg-muted group border border-border shadow-md">
                                <img src={url} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <label className="flex flex-col items-center justify-center aspect-square rounded-3xl border-2 border-dashed border-primary/20 cursor-pointer hover:bg-primary/5 transition-all group">
                            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Upload</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>

                <div className="pt-4 pb-20">
                    <Button type="submit" className="w-full h-16 rounded-[2rem] text-xl font-black shadow-2xl shadow-primary/20 tracking-tight bg-primary hover:bg-primary/90" disabled={loading}>
                        {loading ? 'Submitting Your Listing...' : 'Publish Room Listing'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
