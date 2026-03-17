/**
 * Certificates and Achievements System
 * Sistema de certificados e conquistas profissionais
 */

class CertificatesManager {
    constructor() {
        this.certificates = [];
        this.achievements = [];
        this.init();
    }

    async init() {
        await this.loadCertificates();
        await this.loadAchievements();
        this.renderCertificates();
        this.renderAchievements();
        this.setupEventListeners();
    }

    // Carregar certificados do banco de dados
    async loadCertificates() {
        try {
            const response = await fetch('tables/certificates');
            const data = await response.json();
            this.certificates = data.data;
        } catch (error) {
            console.error('Erro ao carregar certificados:', error);
            // Usar dados de fallback
            this.loadFallbackCertificates();
        }
    }

    // Carregar conquistas do banco de dados
    async loadAchievements() {
        try {
            const response = await fetch('tables/achievements');
            const data = await response.json();
            this.achievements = data.data;
        } catch (error) {
            console.error('Erro ao carregar conquistas:', error);
            // Usar dados de fallback
            this.loadFallbackAchievements();
        }
    }

    // Dados de fallback para certificados
    loadFallbackCertificates() {
        this.certificates = [
            {
                id: '1',
                title: 'HTML5 e CSS3 - Fundamentos',
                issuer: 'Udemy',
                issue_date: '2024-01-15',
                expiration_date: null,
                credential_id: 'UC-123456789',
                credential_url: 'https://udemy.com/certificate/UC-123456789',
                category: 'Frontend',
                level: 'Iniciante',
                hours: 40,
                image_url: 'https://via.placeholder.com/300x200/667eea/ffffff?text=HTML5+CSS3',
                description: 'Fundamentos completos de HTML5 e CSS3 para desenvolvimento web moderno.'
            },
            {
                id: '2',
                title: 'JavaScript Moderno - ES6+',
                issuer: 'Coursera',
                issue_date: '2024-02-20',
                expiration_date: null,
                credential_id: 'COURSERA-JS-2024',
                credential_url: 'https://coursera.org/verify/COURSERA-JS-2024',
                category: 'Programação',
                level: 'Intermediário',
                hours: 60,
                image_url: 'https://via.placeholder.com/300x200/f093fb/ffffff?text=JavaScript',
                description: 'JavaScript moderno com ES6+, async/await, promises e muito mais.'
            },
            {
                id: '3',
                title: 'React - Do Zero ao Avançado',
                issuer: 'Alura',
                issue_date: '2024-03-10',
                expiration_date: null,
                credential_id: 'ALURA-REACT-2024',
                credential_url: 'https://alura.com.br/certificate/ALURA-REACT-2024',
                category: 'Frontend',
                level: 'Avançado',
                hours: 120,
                image_url: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=React',
                description: 'Desenvolvimento completo com React, hooks, context API e Styled Components.'
            }
        ];
    }

    // Dados de fallback para conquistas
    loadFallbackAchievements() {
        this.achievements = [
            {
                id: '1',
                title: 'Primeiro Projeto Completo',
                description: 'Concluiu seu primeiro projeto de programação',
                icon: 'fas fa-trophy',
                color: '#ffd700',
                date_earned: '2024-01-01',
                category: 'Marcos',
                rarity: 'common',
                points: 100
            },
            {
                id: '2',
                title: '100 Horas de Código',
                description: 'Acumulou 100 horas de programação',
                icon: 'fas fa-clock',
                color: '#4ecdc4',
                date_earned: '2024-02-15',
                category: 'Dedicação',
                rarity: 'uncommon',
                points: 250
            },
            {
                id: '3',
                title: 'Primeiro Bug Resolvido',
                description: 'Resolveu seu primeiro bug de programação',
                icon: 'fas fa-bug',
                color: '#ff6b6b',
                date_earned: '2024-01-20',
                category: 'Problemas',
                rarity: 'common',
                points: 150
            },
            {
                id: '4',
                title: 'Portfolio Online',
                description: 'Publicou seu portfolio pessoal',
                icon: 'fas fa-globe',
                color: '#667eea',
                date_earned: '2024-03-01',
                category: 'Marcos',
                rarity: 'rare',
                points: 500
            }
        ];
    }

    // Renderizar certificados
    renderCertificates() {
        const container = document.querySelector('.certificates-grid');
        if (!container) return;

        container.innerHTML = this.certificates.map(cert => `
            <div class="certificate-card" data-category="${cert.category}">
                <div class="certificate-image">
                    <img src="${cert.image_url}" alt="${cert.title}">
                    <div class="certificate-overlay">
                        <button class="btn-view-cert" onclick="certificatesManager.viewCertificate('${cert.id}')">
                            <i class="fas fa-eye"></i>
                            Ver Certificado
                        </button>
                    </div>
                </div>
                
                <div class="certificate-content">
                    <div class="certificate-header">
                        <h3 class="certificate-title">${cert.title}</h3>
                        <span class="certificate-level level-${cert.level.toLowerCase()}">${cert.level}</span>
                    </div>
                    
                    <p class="certificate-issuer">
                        <i class="fas fa-university"></i>
                        ${cert.issuer}
                    </p>
                    
                    <p class="certificate-description">${cert.description}</p>
                    
                    <div class="certificate-stats">
                        <div class="stat">
                            <i class="fas fa-calendar"></i>
                            <span>${this.formatDate(cert.issue_date)}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-clock"></i>
                            <span>${cert.hours}h</span>
                        </div>
                    </div>
                    
                    <div class="certificate-actions">
                        <button class="btn btn-outline" onclick="certificatesManager.viewCertificate('${cert.id}')">
                            <i class="fas fa-eye"></i>
                            Ver
                        </button>
                        <button class="btn btn-primary" onclick="certificatesManager.verifyCertificate('${cert.id}')">
                            <i class="fas fa-check-circle"></i>
                            Verificar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Adicionar animação de entrada
        this.animateCertificates();
    }

    // Renderizar conquistas
    renderAchievements() {
        const container = document.querySelector('.achievements-grid');
        if (!container) return;

        container.innerHTML = this.achievements.map(achievement => `
            <div class="achievement-card" data-rarity="${achievement.rarity}">
                <div class="achievement-icon" style="background: ${achievement.color}">
                    <i class="${achievement.icon}"></i>
                </div>
                
                <div class="achievement-content">
                    <h4 class="achievement-title">${achievement.title}</h4>
                    <p class="achievement-description">${achievement.description}</p>
                    
                    <div class="achievement-meta">
                        <span class="achievement-date">
                            <i class="fas fa-calendar"></i>
                            ${this.formatDate(achievement.date_earned)}
                        </span>
                        <span class="achievement-points">
                            <i class="fas fa-star"></i>
                            ${achievement.points} pts
                        </span>
                    </div>
                    
                    <div class="achievement-rarity">
                        <span class="rarity-badge rarity-${achievement.rarity}">
                            ${this.getRarityLabel(achievement.rarity)}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');

        // Adicionar animação de entrada
        this.animateAchievements();
    }

    // Animações
    animateCertificates() {
        const cards = document.querySelectorAll('.certificate-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    animateAchievements() {
        const cards = document.querySelectorAll('.achievement-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, index * 150);
        });
    }

    // Visualizar certificado
    viewCertificate(certId) {
        const cert = this.certificates.find(c => c.id === certId);
        if (!cert) return;

        // Abrir modal com detalhes do certificado
        this.openCertificateModal(cert);
    }

    // Verificar certificado
    verifyCertificate(certId) {
        const cert = this.certificates.find(c => c.id === certId);
        if (!cert) return;

        // Abrir URL do certificado em nova aba
        if (cert.credential_url) {
            window.open(cert.credential_url, '_blank');
        } else {
            this.showNotification('Certificado verificado com sucesso!', 'success');
        }
    }

    // Abrir modal do certificado
    openCertificateModal(cert) {
        const modal = document.createElement('div');
        modal.className = 'certificate-modal';
        modal.innerHTML = `
            <div class="certificate-modal-content">
                <button class="certificate-modal-close" onclick="this.closest('.certificate-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="certificate-modal-header">
                    <h2>${cert.title}</h2>
                    <span class="certificate-level level-${cert.level.toLowerCase()}">${cert.level}</span>
                </div>
                
                <div class="certificate-modal-body">
                    <img src="${cert.image_url}" alt="${cert.title}" class="certificate-modal-image">
                    
                    <div class="certificate-details">
                        <div class="detail-group">
                            <h4>Instituição</h4>
                            <p><i class="fas fa-university"></i> ${cert.issuer}</p>
                        </div>
                        
                        <div class="detail-group">
                            <h4>Data de Emissão</h4>
                            <p><i class="fas fa-calendar"></i> ${this.formatDate(cert.issue_date)}</p>
                        </div>
                        
                        <div class="detail-group">
                            <h4>Carga Horária</h4>
                            <p><i class="fas fa-clock"></i> ${cert.hours} horas</p>
                        </div>
                        
                        <div class="detail-group">
                            <h4>Categoria</h4>
                            <p><span class="category-badge">${cert.category}</span></p>
                        </div>
                        
                        <div class="detail-group">
                            <h4>Descrição</h4>
                            <p>${cert.description}</p>
                        </div>
                        
                        ${cert.credential_id ? `
                        <div class="detail-group">
                            <h4>ID da Credencial</h4>
                            <p><i class="fas fa-id-card"></i> ${cert.credential_id}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="certificate-modal-footer">
                    ${cert.credential_url ? `
                    <a href="${cert.credential_url}" target="_blank" class="btn btn-primary">
                        <i class="fas fa-external-link-alt"></i>
                        Ver Certificado Original
                    </a>
                    ` : ''}
                    <button class="btn btn-secondary" onclick="this.closest('.certificate-modal').remove()">
                        <i class="fas fa-times"></i>
                        Fechar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Adicionar animação de entrada
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    // Configurar filtros
    setupEventListeners() {
        // Filtros de categoria
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Atualizar botão ativo
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filtrar certificados
                this.filterCertificates(filter);
            });
        });

        // Busca
        const searchInput = document.querySelector('.certificates-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchCertificates(e.target.value);
            });
        }
    }

    // Filtrar certificados por categoria
    filterCertificates(category) {
        const cards = document.querySelectorAll('.certificate-card');
        
        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                setTimeout(() => card.classList.add('show'), 10);
            } else {
                card.classList.remove('show');
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    }

    // Buscar certificados
    searchCertificates(query) {
        const cards = document.querySelectorAll('.certificate-card');
        const lowerQuery = query.toLowerCase();
        
        cards.forEach(card => {
            const title = card.querySelector('.certificate-title').textContent.toLowerCase();
            const description = card.querySelector('.certificate-description').textContent.toLowerCase();
            const issuer = card.querySelector('.certificate-issuer').textContent.toLowerCase();
            
            if (title.includes(lowerQuery) || description.includes(lowerQuery) || issuer.includes(lowerQuery)) {
                card.style.display = 'block';
                card.classList.add('show');
            } else {
                card.classList.remove('show');
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    }

    // Utilitários
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }

    getRarityLabel(rarity) {
        const labels = {
            common: 'Comum',
            uncommon: 'Incomum',
            rare: 'Raro',
            epic: 'Épico',
            legendary: 'Lendário'
        };
        return labels[rarity] || raro;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Inicializar sistema de certificados
document.addEventListener('DOMContentLoaded', () => {
    window.certificatesManager = new CertificatesManager();
});
