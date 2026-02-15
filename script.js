// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.connectionDistance = 150;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            // Mouse interaction
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    particle.vx -= Math.cos(angle) * force * 0.2;
                    particle.vy -= Math.sin(angle) * force * 0.2;
                }
            }

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Keep within bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 136, ${particle.opacity})`;
            this.ctx.fill();
            
            // Add glow
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = 'rgba(0, 255, 136, 0.5)';
        });
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.shadowBlur = 0;
        
        this.drawConnections();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== TECH SKILLS DATA =====
const techSkills = {
    brain: {
        name: "AI & Machine Learning",
        skills: ["Neural Networks", "Deep Learning", "NLP", "Computer Vision"],
        color: "#00ff88"
    },
    chip: {
        name: "Hardware Engineering",
        skills: ["IoT Systems", "Embedded Systems", "PCB Design", "Microcontrollers"],
        color: "#39ff14"
    },
    software: {
        name: "Software Development",
        skills: ["Full Stack", "Cloud Computing", "DevOps", "API Design"],
        color: "#00cc6a"
    },
    iot: {
        name: "Connected Devices",
        skills: ["Smart Home", "Wearables", "Automation", "Edge Computing"],
        color: "#00ff88"
    }
};

// ===== PROJECT MODAL SYSTEM =====
class ProjectModal {
    constructor() {
        this.projects = {
            ml: {
                title: "Machine Learning Projects",
                description: "Advanced neural network implementations for real-world applications",
                details: [
                    "Built sentiment analysis model with 94% accuracy",
                    "Developed image classification system using CNNs",
                    "Created chatbot using transformer architecture",
                    "Implemented recommendation engine for e-commerce"
                ],
                tech: ["Python", "TensorFlow", "PyTorch", "Scikit-learn"]
            },
            robotics: {
                title: "Robotics & Automation",
                description: "Autonomous systems with intelligent navigation capabilities",
                details: [
                    "Designed autonomous drone with obstacle avoidance",
                    "Built robotic arm with computer vision control",
                    "Developed warehouse automation system",
                    "Created path planning algorithms for mobile robots"
                ],
                tech: ["ROS", "C++", "OpenCV", "SLAM"]
            },
            software: {
                title: "Software Development",
                description: "Full-stack applications with modern architecture",
                details: [
                    "Built real-time data visualization dashboard",
                    "Developed cloud-native microservices platform",
                    "Created progressive web apps with offline support",
                    "Implemented CI/CD pipelines for automated deployment"
                ],
                tech: ["React", "Node.js", "Docker", "AWS"]
            }
        };
    }

    showDetails(category) {
        const project = this.projects[category];
        if (!project) return;

        // Create notification instead of modal for better UX
        this.showNotification(project);
    }

    showNotification(project) {
        const notification = document.createElement('div');
        notification.className = 'project-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="tech-stack">
                    ${project.tech.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                </div>
            </div>
        `;

        // Add styles dynamically
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .project-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(15, 22, 41, 0.95);
                    border: 2px solid var(--primary-green);
                    border-radius: 15px;
                    padding: 25px;
                    max-width: 400px;
                    z-index: 1000;
                    animation: slideInRight 0.5s ease-out;
                    box-shadow: 0 10px 40px rgba(0, 255, 136, 0.3);
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(120%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(120%);
                        opacity: 0;
                    }
                }
                
                .notification-content h3 {
                    color: var(--primary-green);
                    margin-bottom: 10px;
                    font-size: 1.3rem;
                }
                
                .notification-content p {
                    color: var(--text-dim);
                    margin-bottom: 15px;
                    line-height: 1.5;
                }
                
                .tech-stack {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                
                .tech-badge {
                    background: rgba(0, 255, 136, 0.2);
                    color: var(--primary-green);
                    padding: 5px 12px;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    border: 1px solid var(--primary-green);
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
}

// ===== FORM VALIDATION & SUBMISSION =====
class FormHandler {
    constructor() {
        this.form = {
            name: document.getElementById('name'),
            email: document.getElementById('email')
        };
        this.submitBtn = document.getElementById('submitBtn');
        this.init();
    }

    init() {
        this.setupValidation();
        this.setupSubmission();
    }

    setupValidation() {
        // Real-time validation
        this.form.name.addEventListener('input', (e) => {
            this.validateName(e.target);
        });

        this.form.email.addEventListener('input', (e) => {
            this.validateEmail(e.target);
        });

        // Add focus effects
        Object.values(this.form).forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateX(5px)';
                this.parentElement.style.transition = 'transform 0.3s ease';
            });

            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateX(0)';
            });
        });
    }

    validateName(input) {
        const value = input.value.trim();
        if (value.length < 2) {
            this.showError(input, 'Name must be at least 2 characters');
            return false;
        }
        this.showSuccess(input);
        return true;
    }

    validateEmail(input) {
        const value = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            this.showError(input, 'Please enter a valid email');
            return false;
        }
        this.showSuccess(input);
        return true;
    }

    showError(input, message) {
        input.style.borderColor = '#ff4444';
        input.style.boxShadow = '0 0 20px rgba(255, 68, 68, 0.4)';
        
        // Remove existing error message
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ff4444;
            font-size: 0.85rem;
            margin-top: 5px;
            animation: fadeIn 0.3s ease;
        `;
        input.parentElement.appendChild(errorDiv);
    }

    showSuccess(input) {
        input.style.borderColor = 'var(--primary-green)';
        input.style.boxShadow = '0 0 20px var(--glow-color)';
        
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();
    }

    setupSubmission() {
        this.submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const nameValid = this.validateName(this.form.name);
            const emailValid = this.validateEmail(this.form.email);
            
            if (nameValid && emailValid) {
                this.submitForm();
            } else {
                this.shakeButton();
            }
        });
    }

    submitForm() {
        // Simulate form submission
        this.submitBtn.textContent = 'SENDING...';
        this.submitBtn.style.background = 'linear-gradient(135deg, #00cc6a, #00ff88)';
        this.submitBtn.disabled = true;

        setTimeout(() => {
            this.submitBtn.textContent = '✓ SENT!';
            this.submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #39ff14)';
            
            // Show success notification
            this.showSuccessNotification();
            
            setTimeout(() => {
                this.submitBtn.textContent = 'SEND MESSAGE';
                this.submitBtn.style.background = 'linear-gradient(135deg, var(--dark-green), var(--primary-green))';
                this.submitBtn.disabled = false;
                
                // Clear form
                this.form.name.value = '';
                this.form.email.value = '';
            }, 2000);
        }, 1500);
    }

    shakeButton() {
        this.submitBtn.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            this.submitBtn.style.animation = '';
        }, 500);
        
        // Add shake animation to styles
        if (!document.getElementById('shake-animation')) {
            const style = document.createElement('style');
            style.id = 'shake-animation';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showSuccessNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--dark-green), var(--primary-green));
            color: var(--dark-bg);
            padding: 20px 30px;
            border-radius: 12px;
            font-weight: 700;
            z-index: 1000;
            animation: slideInRight 0.5s ease-out;
            box-shadow: 0 10px 40px rgba(0, 255, 136, 0.5);
        `;
        notification.textContent = '✓ Message sent successfully!';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// ===== INTERACTIVE ELEMENTS =====
class InteractiveElements {
    constructor() {
        this.init();
    }

    init() {
        this.setupProjectCards();
        this.setupSocialIcons();
        this.setupHexIcons();
        this.setupDecorativeStar();
        this.setupScrollAnimations();
        this.setupTypingEffect();
    }

    setupProjectCards() {
        const projectModal = new ProjectModal();
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                projectModal.showDetails(category);
            });

            // Add ripple effect
            card.addEventListener('mousedown', (e) => {
                const ripple = document.createElement('span');
                const rect = card.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(0, 255, 136, 0.3);
                    left: ${x}px;
                    top: ${y}px;
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

                card.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation
        if (!document.getElementById('ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupSocialIcons() {
    const icons = document.querySelectorAll('.social-icon');
    icons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            // Check if the href is just "#" (placeholder)
            if (icon.getAttribute('href') === '#') {
                e.preventDefault();
                const network = icon.dataset.network;
                this.showSocialMessage(network);
            }
            // If there's a real URL, let the link work normally (don't prevent default)
        });
    });
}

    showSocialMessage(network) {
        const messages = {
            facebook: 'Connect with me on Facebook!',
            twitter: 'Follow me on Twitter!',
            github: 'Check out my GitHub repositories!',
            youtube: 'Subscribe to my YouTube channel!'
        };

        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 255, 136, 0.95);
            color: var(--dark-bg);
            padding: 30px 50px;
            border-radius: 15px;
            font-size: 1.2rem;
            font-weight: 700;
            z-index: 1000;
            animation: popIn 0.3s ease-out;
            box-shadow: 0 20px 60px rgba(0, 255, 136, 0.6);
        `;
        message.textContent = messages[network] || 'Coming soon!';
        document.body.appendChild(message);

        if (!document.getElementById('pop-animation')) {
            const style = document.createElement('style');
            style.id = 'pop-animation';
            style.textContent = `
                @keyframes popIn {
                    from {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 0;
                    }
                    to {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            message.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => message.remove(), 300);
        }, 2000);
    }

    setupHexIcons() {
        const hexIcons = document.querySelectorAll('.hex-icon');
        hexIcons.forEach(hex => {
            hex.addEventListener('click', () => {
                // Create pulse effect
                const pulse = document.createElement('div');
                pulse.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                    height: 100%;
                    border: 2px solid var(--primary-green);
                    border-radius: 50%;
                    animation: pulsate 0.6s ease-out;
                    pointer-events: none;
                `;
                hex.appendChild(pulse);

                setTimeout(() => pulse.remove(), 600);
            });
        });

        if (!document.getElementById('pulsate-animation')) {
            const style = document.createElement('style');
            style.id = 'pulsate-animation';
            style.textContent = `
                @keyframes pulsate {
                    to {
                        transform: translate(-50%, -50%) scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupDecorativeStar() {
        const star = document.querySelector('.decorative-star');
        star.addEventListener('click', () => {
            // Create sparkle effect
            for (let i = 0; i < 8; i++) {
                const sparkle = document.createElement('div');
                sparkle.textContent = '✦';
                sparkle.style.cssText = `
                    position: fixed;
                    bottom: 40px;
                    right: 40px;
                    font-size: 1.5rem;
                    color: var(--primary-green);
                    animation: sparkleOut 1s ease-out forwards;
                    animation-delay: ${i * 0.1}s;
                    pointer-events: none;
                    z-index: 1000;
                `;
                document.body.appendChild(sparkle);

                setTimeout(() => sparkle.remove(), 1200);
            }
        });

        if (!document.getElementById('sparkle-animation')) {
            const style = document.createElement('style');
            style.id = 'sparkle-animation';
            style.textContent = `
                @keyframes sparkleOut {
                    to {
                        transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.8s ease-out forwards';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.project-card, .hex-icon').forEach(el => {
            observer.observe(el);
        });
    }

    setupTypingEffect() {
        const subtitle = document.querySelector('.subtitle');
        const text = subtitle.textContent;
        subtitle.textContent = '';
        
        let index = 0;
        const typingSpeed = 100;

        function type() {
            if (index < text.length) {
                subtitle.textContent += text.charAt(index);
                index++;
                setTimeout(type, typingSpeed);
            }
        }

        setTimeout(type, 1000);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const canvas = document.getElementById('particleCanvas');
    new ParticleSystem(canvas);

    // Initialize form handler
    new FormHandler();

    // Initialize interactive elements
    new InteractiveElements();

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);

    console.log('%c🚀 Portfolio Loaded Successfully!', 'color: #00ff88; font-size: 16px; font-weight: bold;');
    console.log('%cDesigned by Alex Chen', 'color: #00ff88; font-size: 12px;');
});

// ===== EASTER EGGS =====
let konamiCode = [];
const konamiPattern = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiPattern.join(',')) {
        activateMatrixMode();
    }
});

function activateMatrixMode() {
    document.body.style.animation = 'rainbow 2s linear infinite';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        document.body.style.animation = '';
        style.remove();
    }, 5000);
}
