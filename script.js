/* ---
   ORYXEN TECH - script.js
   Front-end Engineer
   --- */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Header ---
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));

    // --- 3. Hero Canvas Animation ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();

        window.addEventListener('resize', setCanvasSize);
        
        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor(x, y, size, color, weight) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.color = color;
                this.weight = weight;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 20) + 10; // Slower, less dense movement
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                // Mouse interaction
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = 100;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                if (distance < maxDistance && mouse.x !== null) {
                    this.x -= directionX * 0.2; // Subtle push away
                    this.y -= directionY * 0.2;
                } else {
                    // Return to base position
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 20; // Slow return
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 20;
                    }
                }

                // Add very subtle random movement
                this.x += (Math.random() - 0.5) * 0.1;
                this.y += (Math.random() - 0.5) * 0.1;

                this.draw();
            }
        }

        const init = () => {
            particles = [];
            const numberOfParticles = 50;
            const color = 'rgba(95, 89, 247, 0.3)'; // Subtle accent color

            for (let i = 0; i < numberOfParticles; i++) {
                let x = Math.random() * canvas.width;
                let y = Math.random() * (canvas.height - 100) + 50; // Avoid edges
                let size = (Math.random() * 1.5) + 0.5; // Small particles
                let weight = 1;
                particles.push(new Particle(x, y, size, color, weight));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            requestAnimationFrame(animate);
        };
        
        init();
        animate();
    }
});