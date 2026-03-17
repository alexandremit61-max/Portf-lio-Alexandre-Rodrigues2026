document.addEventListener('DOMContentLoaded', () => {
    // 1. MENU MOBILE
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 2. TEMA (LIGHT/DARK) - PERSISTENTE
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';

    // Aplica o tema salvo logo de cara
    htmlElement.setAttribute('data-theme', savedTheme);
    if (themeToggle) {
        themeToggle.checked = (savedTheme === 'light');

        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 3. TYPED JS (Apenas se o ID existir na página)
    const typedElement = document.getElementById('typed-text');
    if (typedElement && typeof Typed !== 'undefined') {
        new Typed('#typed-text', {
            strings: ['Desenvolvedor Full Stack', 'Especialista em Infraestrutura', 'Analista de Sistemas'],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true
        });
    }
});
