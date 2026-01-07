import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Loader2 } from 'lucide-react';

export default function EditRoom() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
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

    useEffect(() => {
        const fetchRoom = async () => {
            if (!id || !user) return;
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('id', id)
                .eq('owner_id', user.id)
                .single();

            if (!error && data) {
                setFormData({
                    title: data.title,
                    location: data.location,
                    price: data.price.toString(),
                    property_type: data.property_type,
                    tenant_preference: data.tenant_preference,
                    contact_number: data.contact_number,
                    description: data.description || '',
                });
                setImageUrls(data.images || []);
            } else {
                alert("Room not found or you don't have permission.");
                navigate('/dashboard');
            }
            setFetching(false);
        };

        fetchRoom();
    }, [id, user, navigate]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages((prev) => [...prev, ...newFiles]);
            // Create previews
            const newUrls = newFiles.map(file => URL.createObjectURL(file));
            setImageUrls((prev) => [...prev, ...newUrls]);
        }
    };

    const removeImage = (index: number) => {
        // If it's a new file (from images array)
        if (index >= imageUrls.length - images.length) {
            const imageIndex = index - (imageUrls.length - images.length);
            setImages(prev => prev.filter((_, i) => i !== imageIndex));
        }
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImages = async () => {
        const uploadedUrls: string[] = [];
        // Keep existing URLs that weren't removed
        const existingUrls = imageUrls.filter(url => url.startsWith('http'));
        uploadedUrls.push(...existingUrls);

        for (const file of images) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user?.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('room-images')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                continue;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('room-images')
                .getPublicUrl(filePath);

            uploadedUrls.push(publicUrl);
        }
        return uploadedUrls;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !id) return;
        setLoading(true);

        try {
            const finalImageUrls = await uploadImages();

            const { error } = await supabase
                .from('rooms')
                .update({
                    title: formData.title,
                    location: formData.location,
                    price: parseFloat(formData.price),
                    property_type: formData.property_type,
                    tenant_preference: formData.tenant_preference,
                    contact_number: formData.contact_number,
                    description: formData.description,
                    images: finalImageUrls,
                })
                .eq('id', id);

            if (error) throw error;
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating room:', error);
            alert('Failed to update room.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin w-8 h-8" /></div>;

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Edit Room Listing</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Room Title</label>
                        <Input
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Price (₹/month)</label>
                            <Input
                                required
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <Input
                                required
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Property Type</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                        <div>
                            <label className="block text-sm font-medium mb-1">Tenant Preference</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

                    <div>
                        <label className="block text-sm font-medium mb-1">Contact Number</label>
                        <Input
                            required
                            value={formData.contact_number}
                            onChange={e => setFormData({ ...formData, contact_number: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Room Images</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {imageUrls.map((url, index) => (
                            <div key={index} className="relative aspect-video rounded-md overflow-hidden bg-gray-100 border">
                                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <label className="flex flex-col items-center justify-center aspect-video rounded-md border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
                            <Upload className="w-6 h-6 text-gray-400 mb-1" />
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'Updating...' : 'Save Changes'}
                </Button>
            </form>
        </div>
    );
}
