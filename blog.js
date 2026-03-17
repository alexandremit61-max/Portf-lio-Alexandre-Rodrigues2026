/**
 * Blog System - CRUD Operations
 * Sistema completo de blog com API REST
 */

class BlogManager {
    constructor() {
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.currentFilter = 'all';
        this.editingPostId = null;
        
        this.init();
    }

    async init() {
        await this.loadBlogPosts();
        this.setupEventListeners();
        this.setupSearch();
        this.setupFilters();
        this.setupEditor();
    }

    // Carregar posts do servidor
    async loadBlogPosts(page = 1, search = '', category = 'all') {
        try {
            const params = new URLSearchParams({
                page: page,
                limit: this.postsPerPage,
                search: search,
                sort: 'created_at:desc'
            });

            if (category !== 'all') {
                params.append('category', category);
            }

            const response = await fetch(`tables/blog_posts?${params}`);
            const data = await response.json();

            this.displayBlogPosts(data.data);
            this.updatePagination(data.total, page);
            
        } catch (error) {
            console.error('Erro ao carregar posts:', error);
            this.showNotification('Erro ao carregar posts do blog', 'error');
        }
    }

    // Exibir posts no blog
    displayBlogPosts(posts) {
        const blogContainer = document.querySelector('.blog-posts-container');
        if (!blogContainer) return;

        if (posts.length === 0) {
            blogContainer.innerHTML = `
                <div class="no-posts">
                    <i class="fas fa-blog"></i>
                    <h3>Nenhum post encontrado</h3>
                    <p>Seja o primeiro a compartilhar suas ideias!</p>
                </div>
            `;
            return;
        }

        blogContainer.innerHTML = posts.map(post => `
            <article class="blog-card" data-post-id="${post.id}">
                <div class="blog-card-header">
                    ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}" class="blog-card-image">` : ''}
                    <div class="blog-card-meta">
                        <span class="blog-card-category">${post.category}</span>
                        <span class="blog-card-date">${this.formatDate(post.created_at)}</span>
                    </div>
                </div>
                
                <div class="blog-card-content">
                    <h3 class="blog-card-title">${post.title}</h3>
                    <p class="blog-card-excerpt">${this.createExcerpt(post.content, 150)}</p>
                    
                    <div class="blog-card-footer">
                        <div class="blog-card-author">
                            <i class="fas fa-user"></i>
                            <span>${post.author || 'Alexandre da Silva'}</span>
                        </div>
                        
                        <div class="blog-card-actions">
                            <button class="btn-read-more" onclick="blogManager.readPost('${post.id}')">
                                Ler Mais
                            </button>
                            <button class="btn-edit" onclick="blogManager.editPost('${post.id}')" style="display: ${this.isAdmin() ? 'block' : 'none'}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-delete" onclick="blogManager.deletePost('${post.id}')" style="display: ${this.isAdmin() ? 'block' : 'none'}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `).join('');

        // Adicionar animações
        this.animateBlogCards();
    }

    // Criar resumo do post
    createExcerpt(content, maxLength) {
        const text = content.replace(/<[^>]*>/g, ''); // Remover HTML
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // Formatar data
    formatDate(timestamp) {
        const date = new Date(parseInt(timestamp));
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    // Animação dos cards do blog
    animateBlogCards() {
        const cards = document.querySelectorAll('.blog-card');
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

    // Ler post completo
    readPost(postId) {
        // Abrir modal com o post completo
        this.openPostModal(postId);
    }

    // Abrir modal do post
    async openPostModal(postId) {
        try {
            const response = await fetch(`tables/blog_posts/${postId}`);
            const post = await response.json();

            const modal = document.createElement('div');
            modal.className = 'post-modal';
            modal.innerHTML = `
                <div class="post-modal-content">
                    <button class="post-modal-close" onclick="this.closest('.post-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}" class="post-modal-image">` : ''}
                    
                    <div class="post-modal-header">
                        <h2 class="post-modal-title">${post.title}</h2>
                        <div class="post-modal-meta">
                            <span class="post-modal-category">${post.category}</span>
                            <span class="post-modal-date">${this.formatDate(post.created_at)}</span>
                            <span class="post-modal-author">${post.author || 'Alexandre da Silva'}</span>
                        </div>
                    </div>
                    
                    <div class="post-modal-body">
                        ${post.content}
                    </div>
                    
                    <div class="post-modal-footer">
                        <div class="post-modal-tags">
                            ${post.tags ? post.tags.split(',').map(tag => 
                                `<span class="tag">${tag.trim()}</span>`
                            ).join('') : ''}
                        </div>
                        
                        <div class="post-modal-actions">
                            <button class="btn-share" onclick="blogManager.sharePost('${post.id}')">
                                <i class="fas fa-share"></i> Compartilhar
                            </button>
                            <button class="btn-like" onclick="blogManager.likePost('${post.id}')">
                                <i class="fas fa-heart"></i> <span class="like-count">${post.likes || 0}</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            
            // Adicionar animação de entrada
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);

        } catch (error) {
            console.error('Erro ao carregar post:', error);
            this.showNotification('Erro ao carregar post', 'error');
        }
    }

    // Configurar busca
    setupSearch() {
        const searchInput = document.querySelector('.blog-search-input');
        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.currentPage = 1;
                this.loadBlogPosts(1, e.target.value, this.currentFilter);
            }, 500);
        });
    }

    // Configurar filtros
    setupFilters() {
        const filterButtons = document.querySelectorAll('.blog-filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.currentFilter = btn.dataset.filter;
                this.currentPage = 1;
                this.loadBlogPosts(1, '', this.currentFilter);
            });
        });
    }

    // Configurar editor de posts
    setupEditor() {
        const editor = document.querySelector('.post-editor');
        if (!editor) return;

        // Preview em tempo real
        const titleInput = editor.querySelector('#post-title');
        const contentInput = editor.querySelector('#post-content');
        const preview = editor.querySelector('.post-preview');

        if (titleInput && preview) {
            titleInput.addEventListener('input', () => {
                preview.querySelector('.preview-title').textContent = titleInput.value;
            });
        }

        if (contentInput && preview) {
            contentInput.addEventListener('input', () => {
                preview.querySelector('.preview-content').innerHTML = contentInput.value;
            });
        }
    }

    // Criar novo post
    async createPost(postData) {
        try {
            const response = await fetch('tables/blog_posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: postData.title,
                    content: postData.content,
                    category: postData.category,
                    tags: postData.tags,
                    image_url: postData.image_url,
                    author: 'Alexandre da Silva',
                    likes: 0,
                    views: 0,
                    created_at: Date.now().toString(),
                    updated_at: Date.now().toString()
                })
            });

            if (response.ok) {
                this.showNotification('Post criado com sucesso!', 'success');
                this.loadBlogPosts();
                this.closeEditor();
            } else {
                throw new Error('Erro ao criar post');
            }
        } catch (error) {
            console.error('Erro ao criar post:', error);
            this.showNotification('Erro ao criar post', 'error');
        }
    }

    // Editar post existente
    async editPost(postId) {
        try {
            const response = await fetch(`tables/blog_posts/${postId}`);
            const post = await response.json();

            this.editingPostId = postId;
            this.openEditor(post);
        } catch (error) {
            console.error('Erro ao carregar post para edição:', error);
            this.showNotification('Erro ao carregar post para edição', 'error');
        }
    }

    // Atualizar post
    async updatePost(postId, postData) {
        try {
            const response = await fetch(`tables/blog_posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: postData.title,
                    content: postData.content,
                    category: postData.category,
                    tags: postData.tags,
                    image_url: postData.image_url,
                    updated_at: Date.now().toString()
                })
            });

            if (response.ok) {
                this.showNotification('Post atualizado com sucesso!', 'success');
                this.loadBlogPosts();
                this.closeEditor();
            } else {
                throw new Error('Erro ao atualizar post');
            }
        } catch (error) {
            console.error('Erro ao atualizar post:', error);
            this.showNotification('Erro ao atualizar post', 'error');
        }
    }

    // Deletar post
    async deletePost(postId) {
        if (!confirm('Tem certeza que deseja deletar este post?')) return;

        try {
            const response = await fetch(`tables/blog_posts/${postId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showNotification('Post deletado com sucesso!', 'success');
                this.loadBlogPosts();
            } else {
                throw new Error('Erro ao deletar post');
            }
        } catch (error) {
            console.error('Erro ao deletar post:', error);
            this.showNotification('Erro ao deletar post', 'error');
        }
    }

    // Abrir editor
    openEditor(post = null) {
        const editor = document.querySelector('.post-editor');
        if (!editor) return;

        if (post) {
            // Preencher formulário com dados existentes
            editor.querySelector('#post-title').value = post.title;
            editor.querySelector('#post-content').value = post.content;
            editor.querySelector('#post-category').value = post.category;
            editor.querySelector('#post-tags').value = post.tags || '';
            editor.querySelector('#post-image').value = post.image_url || '';
        }

        editor.classList.add('show');
    }

    // Fechar editor
    closeEditor() {
        const editor = document.querySelector('.post-editor');
        if (editor) {
            editor.classList.remove('show');
            editor.querySelector('form').reset();
            this.editingPostId = null;
        }
    }

    // Configurar listeners de eventos
    setupEventListeners() {
        // Botão de novo post
        const newPostBtn = document.querySelector('.btn-new-post');
        if (newPostBtn) {
            newPostBtn.addEventListener('click', () => this.openEditor());
        }

        // Formulário de post
        const postForm = document.querySelector('.post-editor-form');
        if (postForm) {
            postForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const postData = {
                    title: formData.get('title'),
                    content: formData.get('content'),
                    category: formData.get('category'),
                    tags: formData.get('tags'),
                    image_url: formData.get('image_url')
                };

                if (this.editingPostId) {
                    this.updatePost(this.editingPostId, postData);
                } else {
                    this.createPost(postData);
                }
            });
        }

        // Botão de fechar editor
        const closeEditorBtn = document.querySelector('.close-editor');
        if (closeEditorBtn) {
            closeEditorBtn.addEventListener('click', () => this.closeEditor());
        }
    }

    // Atualizar paginação
    updatePagination(totalItems, currentPage) {
        const pagination = document.querySelector('.blog-pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(totalItems / this.postsPerPage);
        
        pagination.innerHTML = '';
        
        // Botão anterior
        if (currentPage > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'pagination-btn';
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevBtn.addEventListener('click', () => {
                this.currentPage--;
                this.loadBlogPosts(this.currentPage);
            });
            pagination.appendChild(prevBtn);
        }

        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                this.currentPage = i;
                this.loadBlogPosts(i);
            });
            pagination.appendChild(pageBtn);
        }

        // Botão próximo
        if (currentPage < totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'pagination-btn';
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.addEventListener('click', () => {
                this.currentPage++;
                this.loadBlogPosts(this.currentPage);
            });
            pagination.appendChild(nextBtn);
        }
    }

    // Verificar se é administrador
    isAdmin() {
        // Implementar lógica de autenticação real aqui
        return true; // Por enquanto, todos podem editar
    }

    // Compartilhar post
    sharePost(postId) {
        const url = `${window.location.origin}/blog.html#post-${postId}`;
        if (navigator.share) {
            navigator.share({
                title: 'Blog - Alexandre da Silva',
                url: url
            });
        } else {
            navigator.clipboard.writeText(url);
            this.showNotification('Link copiado para a área de transferência!', 'success');
        }
    }

    // Curtir post
    async likePost(postId) {
        try {
            const response = await fetch(`tables/blog_posts/${postId}`);
            const post = await response.json();

            const updatedLikes = (post.likes || 0) + 1;

            await fetch(`tables/blog_posts/${postId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    likes: updatedLikes
                })
            });

            // Atualizar contador na interface
            const likeCount = document.querySelector('.like-count');
            if (likeCount) {
                likeCount.textContent = updatedLikes;
            }

            this.showNotification('Post curtido!', 'success');
        } catch (error) {
            console.error('Erro ao curtir post:', error);
            this.showNotification('Erro ao curtir post', 'error');
        }
    }

    // Sistema de notificações
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

// Inicializar o sistema de blog
document.addEventListener('DOMContentLoaded', () => {
    window.blogManager = new BlogManager();
});
