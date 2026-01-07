import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Home as HomeIcon, Search, PlusCircle, LayoutDashboard, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function Navbar() {
    const { user, signOut } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                isScrolled ? "glass py-3" : "bg-transparent py-5"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <span className="text-white font-bold text-2xl">R</span>
                            </div>
                            <span className="text-2xl font-extrabold tracking-tighter text-foreground group-hover:text-primary transition-colors">
                                Room<span className="text-primary group-hover:text-foreground transition-colors">Finder</span>
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-1">
                            <NavLink to="/" icon={<HomeIcon className="w-4 h-4" />} label="Home" />
                            <NavLink to="/search" icon={<Search className="w-4 h-4" />} label="Find Rooms" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {user ? (
                            <>
                                <Link to="/rooms/add">
                                    <Button variant="ghost" className="hidden sm:flex items-center rounded-full hover:bg-primary/5 hover:text-primary">
                                        <PlusCircle className="w-4 h-4 mr-2" />
                                        List Room
                                    </Button>
                                </Link>
                                <Link to="/dashboard">
                                    <Button variant="ghost" className="rounded-full hover:bg-primary/5 hover:text-primary">
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <div className="h-8 w-[1px] bg-border mx-2" />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => signOut()}
                                    className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                                >
                                    <LogOut className="w-5 h-5" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" className="rounded-full hover:bg-primary/5">Sign In</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
                                        Join Now
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
    return (
        <Link
            to={to}
            className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200"
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
