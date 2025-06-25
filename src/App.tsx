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

        // Create stars
        for (let i = 0; i < 200; i++) {
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
            const length = 100 + Math.random() * 150;
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
                <nav className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="text-xl font-bold">...</div>
                        <ul className="flex space-x-8">
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
                                        className={`cursor-pointer transition-all duration-300 hover:text-blue-300 ${activeSection === section ? 'text-blue-400' : ''}`}
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
                    className="min-h-screen flex items-center px-4 pt-20"
                    style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                >
                    <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex flex-col items-start w-full md:w-1/2">
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                    Geoffrey Beenie P. Orpia
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl mb-10 text-gray-300">
                                Exploring the universe of web development and design
                            </p>
                            <div className="flex flex-col gap-6">
                                <a href="https://drive.google.com/file/d/1b9R0sXupTzllXS2cSwXhg0c-N9ac_4Xe/view?usp=sharing" download>
                                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 whitespace-nowrap !rounded-button cursor-pointer">
                                        <i className="fas fa-download mr-2"></i> Download CV
                                    </button>
                                </a>
                                <div className="flex gap-4">
                                    <a href="https://www.facebook.com/geoffrey.beenie.p.orpia/" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-400 hover:text-blue-500 transition-colors duration-300">
                                        <i className="fab fa-facebook"></i>
                                    </a>
                                    <a href="mailto:g.orpia.126373.tc@umindanao.edu.ph?subject=Portfolio%20Contact&body=Hi%20Jaybee,%20I%20saw%20your%20portfolio..." className="text-2xl text-gray-400 hover:text-red-500 transition-colors duration-300">
                                        <i className="fab fa-google"></i>
                                    </a>
                                    <a href="https://github.com/tropangpotchiph86" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-400 hover:text-purple-500 transition-colors duration-300">
                                        <i className="fab fa-github"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center">
                            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-blue-500/30">
                                <img
                                    src="https://i.ibb.co/vv6vzyy2/profile.jpg"
                                    alt="Developer Portrait"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <a href="#projects" className="text-gray-400 hover:text-white">
                            <i className="fas fa-chevron-down text-2xl"></i>
                        </a>
                    </div>
                </section>

                {/* Projects Section */}
                <section
                    id="projects"
                    className="min-h-screen py-20 px-4"
                    style={{ transform: `translateY(${scrollY * 0.05}px)` }}
                >
                    <div className="max-w-6xl mx-auto w-full">
                        <h2 className="text-4xl font-bold mb-16 text-center">
                            <span className="border-b-2 border-blue-500 pb-2">My Projects</span>
                        </h2>
                        <div className="relative flex flex-col space-y-12 before:absolute before:inset-0 before:ml-12 before:w-0.5 before:bg-gray-700 max-w-5xl mx-auto">
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
                                    className="flex items-start gap-16 group relative ml-24"
                                >
                                    <div className="relative z-10 -ml-[2.75rem]">
                                        <div className="absolute w-4 h-4 bg-blue-500 rounded-full left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 ml-[-2px]"></div>
                                    </div>
                                    <div className="w-24 h-24 z-10">
                                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-blue-500 transition-all duration-300">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-gray-900 bg-opacity-40 p-6 rounded-lg hover:bg-opacity-60 transition-all duration-300">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors duration-300">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-400 mb-4">{project.description}</p>
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
                                                className="mt-4 inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1"
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
                    className="min-h-screen py-20 px-4"
                    style={{ transform: `translateY(${scrollY * 0.02}px)` }}
                >
                    <div className="max-w-4xl mx-auto w-full">
                        <h2 className="text-4xl font-bold mb-16 text-center">
                            <span className="border-b-2 border-blue-500 pb-2">Get In Touch</span>
                        </h2>
                        <div className="bg-gray-900 bg-opacity-70 rounded-lg p-8 shadow-lg">
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full bg-gray-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-gray-400 mb-2">Message</label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        className="w-full bg-gray-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                                        placeholder="Your message here..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 whitespace-nowrap !rounded-button cursor-pointer"
                                >
                                    <i className="fas fa-paper-plane mr-2"></i> Send Message
                                </button>
                            </form>
                            {/* <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-8">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center cursor-pointer">
                  <i className="fab fa-github text-2xl mr-2"></i> GitHub
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center cursor-pointer">
                  <i className="fab fa-linkedin text-2xl mr-2"></i> LinkedIn
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center cursor-pointer">
                  <i className="fab fa-twitter text-2xl mr-2"></i> Twitter
                </a>
                <a href="mailto:contact@example.com" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center cursor-pointer">
                  <i className="fas fa-envelope text-2xl mr-2"></i> Email
                </a>
              </div> */}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-1 bg-gray-900 bg-opacity-70 py-8">
                <div className="max-w-6xl mx-auto w-full px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-gray-400">© 2017 Geoffrey Dev.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;