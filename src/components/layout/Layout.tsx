import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
    return (
        <div className="min-h-screen flex flex-col selection:bg-primary/10 selection:text-primary">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-0">
                <Outlet />
            </main>
            <footer className="glass border-t mt-auto">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">R</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">Room Finder</span>
                        </div>
                        <p className="text-center text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Room Finder. Built for Excellence.
                        </p>
                        <div className="flex space-x-6 text-sm text-muted-foreground">
                            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms</a>
                            <a href="#" className="hover:text-primary transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
