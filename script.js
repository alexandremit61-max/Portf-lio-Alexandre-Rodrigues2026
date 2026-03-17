document.addEventListener('DOMContentLoaded', () => {
    // Typed.js
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: ['Desenvolvedor Web', 'Especialista em Infra', 'Analista de Operações'],
            typeSpeed: 60,
            backSpeed: 40,
            loop: true
        });
    }

    // Menu Hamburger
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Dark/Light Mode
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'light';

    themeToggle.addEventListener('change', () => {
        const theme = themeToggle.checked ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // Particles.js
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 50 },
                color: { value: "#0066cc" },
                shape: { type: "circle" },
                opacity: { value: 0.5 },
                size: { value: 3 },
                line_linked: { enable: true, distance: 150, color: "#9966cc", opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2 }
            }
        });
    }
});
