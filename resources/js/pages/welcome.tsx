import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { type SharedData } from '@/types';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    useEffect(() => {
        if (window.particlesJS) {
            window.particlesJS('particles', {
                particles: {
                    number: { value: 60, density: { enable: true, value_area: 1000 } },
                    color: { value: ['#3b82f6', '#60a5fa', '#93c5fd'] },
                    shape: { type: 'circle' },
                    opacity: { value: 0.4, random: true },
                    size: { value: 3, random: true },
                    line_linked: { enable: true, distance: 150, color: '#93c5fd', opacity: 0.3, width: 1 },
                    move: { enable: true, speed: 2, direction: 'none', random: true, out_mode: 'out' }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
                    modes: { grab: { distance: 140 }, push: { particles_nb: 2 } }
                },
                retina_detect: true
            });
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <>
            <Head title="Welcome" />
            
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')"
                }}
            >
                <canvas id="particles" className="absolute top-0 left-0 w-full h-full -z-10"></canvas>

                <div className="container px-4 mx-auto">
                    <div className="flex justify-center">
                        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
                            <div className="bg-white/90 dark:bg-gray-800/95 rounded-2xl shadow-2xl p-8 md:p-12 lg:p-16 animate-[slideIn_0.8s_ease-out]">
                                <h1 className="text-gray-800 dark:text-white font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 text-center">
                                    Welcome to Kaleg PKL
                                </h1>
                                <h2 className="text-gray-600 dark:text-gray-300 font-semibold text-xl sm:text-2xl md:text-3xl mb-8 text-center">
                                    {auth.user ? 'Access your dashboard' : 'Login or Register to View Data'}
                                </h2>
                                
                                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                                    {auth.user ? (
                                        <Link 
                                            href={route('dashboard')}
                                            className="px-8 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                                        >
                                            Go to Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link 
                                                href={route('login')}
                                                className="px-8 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                                            >
                                                Login
                                            </Link>
                                            <Link 
                                                href={route('register')}
                                                className="px-8 py-3 rounded-lg font-semibold text-white bg-blue-800 hover:bg-blue-900 transition-colors duration-300"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideIn {
                    0% { transform: translateY(50px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes neonGlow {
                    from { text-shadow: 0 0 15px rgba(59, 130, 246, 0.9), 0 0 25px rgba(96, 165, 250, 0.7); }
                    to { text-shadow: 0 0 25px rgba(59, 130, 246, 1), 0 0 35px rgba(96, 165, 250, 0.9); }
                }
                
                .btn-primary::before, .btn-secondary::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
                    transition: 0.4s;
                }
                
                .btn-primary:hover::before, .btn-secondary:hover::before {
                    left: 100%;
                }
            `}</style>
        </>
    );
}

declare global {
    interface Window {
        particlesJS: (id: string, config: any) => void;
    }
}