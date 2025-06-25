import React, { useEffect, useRef, useState } from 'react';

const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeSection, setActiveSection] = useState('home');
    const [scrollY, setScrollY] = useState(0);

    // Star field and meteor shower animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Star properties
        const stars: { x: number; y: number; radius: number; color: string; twinkleSpeed: number; twinkleOffset: number }[] = [];
        const meteors: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];
        let lastMeteorTime = 0;

        // Adjust number of stars based on screen size for performance
        const starCount = window.innerWidth < 640 ? 100 : 200; // Fewer stars on mobile
        for (let i = 0; i < starCount; i++) {
            const radius = Math.random() * 1.5;
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius,
                color: `rgba(${200 + Math.random() * 55}, ${200 + Math.random() * 55}, ${200 + Math.random() * 55}, 1)`,
                twinkleSpeed: 0.003 + Math.random() * 0.007,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }

        // Create meteor
        const createMeteor = () => {
            const x = Math.random() * canvas.width;
            const y = 0;
            const length = window.innerWidth < 640 ? 50 + Math.random() * 100 : 100 + Math.random() * 150; // Smaller meteors on mobile
            const speed = 5 + Math.random() * 10;
            meteors.push({
                x,
                y,
                length,
                speed,
                opacity: 1
            });
        };

        // Animation loop
        let animationFrameId: number;
        const animate = (timestamp: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw stars with twinkling effect
            stars.forEach(star => {
                const opacity = Math.abs(Math.sin(timestamp * star.twinkleSpeed + star.twinkleOffset));
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${star.color.split(',')[0].split('(')[1]}, ${star.color.split(',')[1]}, ${star.color.split(',')[2]}, ${opacity})`;
                ctx.fill();
            });

            // Create meteors every 10 seconds (1-2 meteors)
            if (timestamp - lastMeteorTime > 10000) {
                const meteorCount = 1 + Math.floor(Math.random() * 2);
                for (let i = 0; i < meteorCount; i++) {
                    createMeteor();
                }
                lastMeteorTime = timestamp;
            }

            // Draw meteors
            ctx.lineCap = 'round';
            meteors.forEach((meteor, index) => {
                ctx.strokeStyle = `rgba(255, 255, 255, ${meteor.opacity})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(meteor.x, meteor.y);
                ctx.lineTo(meteor.x + meteor.length, meteor.y + meteor.length);
                ctx.stroke();

                // Update meteor position
                meteor.x += meteor.speed;
                meteor.y += meteor.speed;
                meteor.opacity -= 0.01;

                // Remove faded meteors
                if (meteor.opacity <= 0 || meteor.y > canvas.height) {
                    meteors.splice(index, 1);
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Handle scroll events
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
            // Determine active section based on scroll position
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop - 200 && window.scrollY < sectionTop + sectionHeight - 200) {
                    setActiveSection(section.id);
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative min-h-screen bg-black text-white font-sans">
            {/* Canvas background for stars and meteors */}
            <canvas
                ref={canvasRef}
                className="fixed top-0 left-0 w-full h-full z-0"
            />

            {/* Navigation */}
            <header className="fixed top-0 left-0 w-full z-10 bg-black bg-opacity-50 backdrop-blur-sm">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-lg sm:text-xl font-bold mb-4 sm:mb-0">...</div>
                        <ul className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 text-center">
                            {['home', 'projects', 'contact'].map((section) => (
                                <li key={section}>
                                    <a
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const element = document.getElementById(section);
                                            if (element) {
                                                element.scrollIntoView({
                                                    behavior: 'smooth',
                                                    block: 'start'
                                                });
                                            }
                                        }}
                                        href={`#${section}`}
                                        className={`cursor-pointer transition-all duration-300 hover:text-blue-300 text-sm sm:text-base ${activeSection === section ? 'text-blue-400' : ''}`}
                                    >
                                        {section.charAt(0).toUpperCase() + section.slice(1)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </header>

            <main className="relative z-1">
                {/* Home Section */}
                <section
                    id="home"
                    className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-20"
                    style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                >
                    <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
                        <div className="flex flex-col items-start w-full lg:w-1/2">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 animate-fade-in">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                    Geoffrey Beenie P. Orpia
                                </span>
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 text-gray-300">
                                Exploring the universe of web development and design
                            </p>
                            <div className="flex flex-col gap-6">
                                <a href="https://drive.google.com/file/d/1b9R0sXupTzllXS2cSwXhg0c-N9ac_4Xe/view?usp=sharing" download>
                                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 whitespace-nowrap !rounded-button cursor-pointer text-sm sm:text-base">
                                        <i className="fas fa-download mr-2"></i> Download CV
                                    </button>
                                </a>
                                <div className="flex gap-4">
                                    <a href="https://www.facebook.com/geoffrey.beenie.p.orpia/" target="_blank" rel="noopener noreferrer" className="text-xl sm:text-2xl text-gray-400 hover:text-blue-500 transition-colors duration-300">
                                        <i className="fab fa-facebook"></i>
                                    </a>
                                    <a href="mailto:g.orpia.126373.tc@umindanao.edu.ph?subject=Portfolio%20Contact&body=Hi%20Jaybee,%20I%20saw%20your%20portfolio..." className="text-xl sm:text-2xl text-gray-400 hover:text-red-500 transition-colors duration-300">
                                        <i className="fab fa-google"></i>
                                    </a>
                                    <a href="https://github.com/tropangpotchiph86" target="_blank" rel="noopener noreferrer" className="text-xl sm:text-2xl text-gray-400 hover:text-purple-500 transition-colors duration-300">
                                        <i className="fab fa-github"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 flex justify-center">
                            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-blue-500/30">
                                <img
                                    src="https://i.ibb.co/vv6vzyy2/profile.jpg"
                                    alt="Developer Portrait"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-8 sm:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <a href="#projects" className="text-gray-400 hover:text-white">
                            <i className="fas fa-chevron-down text-xl sm:text-2xl"></i>
                        </a>
                    </div>
                </section>

                {/* Projects Section */}
                <section
                    id="projects"
                    className="min-h-screen py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
                    style={{ transform: `translateY(${scrollY * 0.05}px)` }}
                >
                    <div className="max-w-7xl mx-auto w-full">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 sm:mb-16 text-center">
                            <span className="border-b-2 border-blue-500 pb-2">My Projects</span>
                        </h2>
                        <div className="relative flex flex-col space-y-8 sm:space-y-12 before:absolute before:inset-0 before:ml-8 sm:before:ml-12 before:w-0.5 before:bg-gray-700 max-w-5xl mx-auto">
                            {[
                                {
                                    id: 1,
                                    title: "Lost and Found Dog Mobile App",
                                    description: "A mobile application helping users find and report lost dogs with real-time notifications.",
                                    image: "https://readdy.ai/api/search-image?query=modern%20mobile%20app%20interface%20showing%20lost%20and%20found%20items%20interface%20with%20clean%20design%2C%20professional%20UI%20showcase%20with%20map%20and%20item%20listings&width=400&height=400&seq=1&orientation=squarish",
                                    technologies: ["React Native", "MongoDB", "Node.js", "Python", "Tensorflow", "Socket.io"]
                                },
                                {
                                    id: 2,
                                    title: "Kodeledger",
                                    description: "Kodeledger is a minimalist, web-based budgeting app crafted with HTML, CSS, and JavaScript, designed to help you track your finances effortlessly.",
                                    image: "https://kode-ledger-v2.netlify.app/images/home/showcase.jpg",
                                    technologies: ["Html", "Css", "Javascript"]
                                },
                                {
                                    id: 4,
                                    title: "Shopping list v2",
                                    description: "Shopping List v2 is a lightweight, web-based application built using HTML, CSS, and JavaScript, designed to simplify your grocery shopping.",
                                    image: "https://shopping-list-v2.netlify.app/images/note.png",
                                    technologies: ["Html", "Css", "Javascript"]
                                },
                                {
                                    id: 5,
                                    title: "Cinezone v1",
                                    description: "Real-time movie search platform with advanced filtering and recommendations.",
                                    image: "https://cine-zone.netlify.app/images/showcase-bg.jpg",
                                    technologies: ["Html", "Css", "Javascript"]
                                },
                                {
                                    id: 6,
                                    title: "Beach Resort Booking",
                                    description: "Luxury beach resort booking platform with virtual tours and instant booking.",
                                    image: "https://diri-ta-beach.netlify.app/images/slideShow/slide-1.jpg",
                                    technologies: ["Html", "Php", "Css", "MySQL"]
                                },
                                {
                                    id: 8,
                                    title: "Pokemon Battle",
                                    description: "In a Pokémon battle, trainers face off in a vibrant, strategic showdown, commanding their Pokémon to unleash a flurry of dynamic moves under a bright.",
                                    image: "https://web-battle.netlify.app/img/pikachu.jpg",
                                    technologies: ["Html", "Css", "Javascript"]
                                },
                                {
                                    id: 9,
                                    title: "Cinezone v2",
                                    description: "Real-time movie search platform with advanced filtering and recommendations.",
                                    image: "https://cine-zone.netlify.app/images/showcase-bg.jpg",
                                    technologies: ["React.js", "Tailwind css"]
                                },
                            ].map((project) => (
                                <div
                                    key={project.id}
                                    className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 md:gap-12 lg:gap-16 group relative sm:ml-12 md:ml-16 lg:ml-24"
                                >
                                    <div className="relative z-10 -ml-[1.75rem] sm:-ml-[2.75rem]">
                                        <div className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 ml-[-2px]"></div>
                                    </div>
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 z-10">
                                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-blue-500 transition-all duration-300">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-gray-900 bg-opacity-40 p-4 sm:p-6 rounded-lg hover:bg-opacity-60 transition-all duration-300">
                                        <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors duration-300">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-400 mb-4">{project.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="bg-blue-900 bg-opacity-50 text-blue-300 text-xs px-2 py-1 rounded"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                        {(project.id === 2 || project.id === 4 || project.id === 5 || project.id === 8 || project.id === 9) && (
                                            <a
                                                href={
                                                    project.id === 2
                                                        ? "https://kode-ledger-v2.netlify.app/"
                                                        : project.id === 4
                                                            ? "https://shopping-list-v2.netlify.app/"
                                                            : project.id === 5
                                                                ? "https://moviezone-v1.netlify.app/"
                                                                : project.id === 8
                                                                    ? "https://pokemon-battle-v2.netlify.app/"
                                                                    : "https://cinezone-v2.vercel.app/"
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
                                            >
                                                View
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section
                    id="contact"
                    className="min-h-screen py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
                    style={{ transform: `translateY(${scrollY * 0.02}px)` }}
                >
                    <div className="max-w-4xl mx-auto w-full">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 sm:mb-16 text-center">
                            <span className="border-b-2 border-blue-500 pb-2">Get In Touch</span>
                        </h2>
                        <div className="bg-gray-900 bg-opacity-70 rounded-lg p-6 sm:p-8 shadow-lg">
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-gray-400 mb-2 text-sm sm:text-base">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full bg-gray-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-gray-400 mb-2 text-sm sm:text-base">Message</label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        className="w-full bg-gray-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base resize-none"
                                        placeholder="Your message here..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 whitespace-nowrap !rounded-button cursor-pointer text-sm sm:text-base"
                                >
                                    <i className="fas fa-paper-plane mr-2"></i> Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-1 bg-gray-900 bg-opacity-70 py-6 sm:py-8">
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                        <div className="mb-4 sm:mb-0">
                            <p className="text-gray-400 text-sm sm:text-base">© 2017 Geoffrey Dev.</p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Custom CSS for responsive timeline and other minor adjustments */}
            <style>{`
                @media (max-width: 640px) {
                    .before\\:ml-12 {
                        margin-left: 2rem;
                    }
                    .before\\:ml-8 {
                        margin-left: 1.5rem;
                    }
                    .sm\\:ml-12 {
                        margin-left: 0;
                    }
                    .sm\\:-ml-\\[2\\.75rem\\] {
                        margin-left: -1.25rem;
                    }
                    .sm\\:flex-row {
                        flex-direction: column;
                    }
                    .sm\\:space-y-12 {
                        space-y: 8;
                    }
                }
                @media (min-width: 641px) and (max-width: 768px) {
                    .before\\:ml-12 {
                        margin-left: 2.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default App;