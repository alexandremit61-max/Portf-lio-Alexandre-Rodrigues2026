// Dashboard Analytics System
class DashboardSystem {
    constructor() {
        this.charts = {};
        this.realtimeData = {
            isRunning: false,
            interval: null
        };
        this.init();
    }

    init() {
        this.initCharts();
        this.initEventListeners();
        this.updateLastUpdateTime();
        this.startRealTimeUpdates();
        this.loadRealData();
    }

    // Carregar dados reais do blog e portfolio
    async loadRealData() {
        try {
            // Carregar estatísticas do blog
            const blogResponse = await fetch('tables/blog_posts');
            const blogData = await blogResponse.json();
            
            // Calcular estatísticas
            const totalPosts = blogData.data.length;
            const totalViews = blogData.data.reduce((sum, post) => sum + (post.views || 0), 0);
            const totalLikes = blogData.data.reduce((sum, post) => sum + (post.likes || 0), 0);
            
            // Atualizar KPIs
            this.updateKPI('total-posts', totalPosts);
            this.updateKPI('total-views', totalViews);
            this.updateKPI('total-likes', totalLikes);
            
            // Criar gráfico de categorias
            this.createCategoriesChart(blogData.data);
            
            // Criar gráfico de timeline
            this.createTimelineChart(blogData.data);
            
        } catch (error) {
            console.error('Erro ao carregar dados reais:', error);
            // Usar dados de fallback
            this.loadFallbackData();
        }
    }

    updateKPI(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            // Animação de contador
            this.animateCounter(element, parseInt(element.textContent) || 0, value);
        }
    }

    animateCounter(element, start, end) {
        const duration = 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * this.easeOutQuart(progress));
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    // Adicionar mais gráficos e funcionalidades
    initCharts() {
        // Gráfico de tráfego em tempo real
        this.createTrafficChart();
        
        // Gráfico de performance
        this.createPerformanceChart();
        
        // Gráfico de atividades
        this.createActivityChart();
        
        // Gráfico de progresso de skills
        this.createSkillsChart();
    }

    createTrafficChart() {
        const ctx = document.getElementById('trafficChart');
        if (!ctx) return;

        const data = {
            labels: this.generateTimeLabels(24),
            datasets: [{
                label: 'Visitas ao Portfolio',
                data: this.generateRandomData(24, 10, 100),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }, {
                label: 'Visitas ao Blog',
                data: this.generateRandomData(24, 5, 50),
                borderColor: '#764ba2',
                backgroundColor: 'rgba(118, 75, 162, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#764ba2',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        };

        this.charts.traffic = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#ffffff',
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }

    createPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        this.charts.performance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
                datasets: [{
                    label: 'Nível Atual',
                    data: [85, 75, 60, 70, 65, 80],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }, {
                    label: 'Meta',
                    data: [90, 90, 85, 85, 80, 85],
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(118, 75, 162, 0.2)',
                    pointBackgroundColor: '#764ba2',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#ffffff',
                            usePointStyle: true
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        },
                        pointLabels: {
                            color: '#ffffff'
                        },
                        ticks: {
                            color: '#ffffff',
                            backdropColor: 'transparent'
                        }
                    }
                }
            }
        });
    }

    createActivityChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        this.charts.activity = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Portfolio', 'Blog', 'Estudos', 'Projetos', 'Redes Sociais'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#ffffff',
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    createSkillsChart() {
        const ctx = document.getElementById('skillsChart');
        if (!ctx) return;

        this.charts.skills = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['JavaScript', 'HTML/CSS', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
                datasets: [{
                    label: 'Proficiência (%)',
                    data: [75, 85, 60, 70, 65, 80, 90],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(240, 147, 251, 0.8)',
                        'rgba(245, 87, 108, 0.8)',
                        'rgba(79, 172, 254, 0.8)',
                        'rgba(0, 242, 254, 0.8)',
                        'rgba(124, 58, 237, 0.8)'
                    ],
                    borderColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe',
                        '#00f2fe',
                        '#7c3aed'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }

    // Gerar dados aleatórios para demonstração
    generateRandomData(count, min, max) {
        return Array.from({ length: count }, () => 
            Math.floor(Math.random() * (max - min + 1)) + min
        );
    }

    generateTimeLabels(hours) {
        const labels = [];
        const now = new Date();
        
        for (let i = hours - 1; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);
            labels.push(time.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }));
        }
        
        return labels;
    }

    // Atualizações em tempo real
    startRealTimeUpdates() {
        this.realtimeData.isRunning = true;
        this.updateRealTimeData();
        
        this.realtimeData.interval = setInterval(() => {
            this.updateRealTimeData();
        }, 5000); // Atualizar a cada 5 segundos
    }

    updateRealTimeData() {
        if (!this.realtimeData.isRunning) return;
        
        // Atualizar indicadores de tempo real
        const indicators = document.querySelectorAll('.realtime-indicator');
        indicators.forEach(indicator => {
            indicator.style.opacity = Math.random() > 0.5 ? '1' : '0.7';
        });
        
        // Atualizar gráficos com novos dados
        if (this.charts.traffic) {
            const newData = this.generateRandomData(24, 10, 100);
            this.charts.traffic.data.datasets[0].data = newData;
            this.charts.traffic.update('none'); // Atualizar sem animação
        }
        
        this.updateLastUpdateTime();
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR');
        const dateString = now.toLocaleDateString('pt-BR');
        
        const lastUpdateElement = document.querySelector('.last-update');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = `Última atualização: ${dateString} ${timeString}`;
        }
    }

    stopRealTimeUpdates() {
        this.realtimeData.isRunning = false;
        if (this.realtimeData.interval) {
            clearInterval(this.realtimeData.interval);
        }
    }

    // Dados de fallback quando não há conexão com o banco
    loadFallbackData() {
        // Dados de exemplo
        this.updateKPI('total-posts', 12);
        this.updateKPI('total-views', 1560);
        this.updateKPI('total-likes', 89);
        
        // Criar gráficos com dados de exemplo
        const samplePosts = [
            { category: 'Desenvolvimento Pessoal' },
            { category: 'Programação' },
            { category: 'Tecnologia' },
            { category: 'Desenvolvimento Pessoal' },
            { category: 'Carreira' },
            { category: 'Programação' }
        ];
        
        this.createCategoriesChart(samplePosts);
        this.createTimelineChart(samplePosts);
    }

    // Event listeners e controles
    initEventListeners() {
        // Controles de período dos gráficos
        const chartButtons = document.querySelectorAll('.chart-btn');
        chartButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remover classe ativa de todos os botões do mesmo grupo
                const period = e.target.dataset.period;
                const buttonGroup = e.target.closest('.chart-controls');
                if (buttonGroup) {
                    buttonGroup.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                }
                
                // Atualizar gráfico com novo período
                this.updateChartPeriod(period);
            });
        });

        // Toggle de tema
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', (e) => {
                document.body.setAttribute('data-theme', e.target.checked ? 'light' : 'dark');
                localStorage.setItem('theme', e.target.checked ? 'light' : 'dark');
                
                // Atualizar gráficos para novo tema
                this.updateChartsTheme();
            });
        }

        // Menu mobile
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }

    updateChartPeriod(period) {
        // Atualizar dados baseados no período selecionado
        const multiplier = period === '24h' ? 1 : period === '7d' ? 7 : 30;
        
        if (this.charts.traffic) {
            const hours = period === '24h' ? 24 : period === '7d' ? 168 : 720;
            this.charts.traffic.data.labels = this.generateTimeLabels(hours);
            this.charts.traffic.data.datasets[0].data = this.generateRandomData(hours, 10, 100);
            this.charts.traffic.data.datasets[1].data = this.generateRandomData(hours, 5, 50);
            this.charts.traffic.update();
        }
    }

    updateChartsTheme() {
        // Atualizar cores dos gráficos baseado no tema
        const isDark = document.body.getAttribute('data-theme') !== 'light';
        const textColor = isDark ? '#ffffff' : '#2c3e50';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options) {
                // Atualizar cores dos textos
                if (chart.options.plugins && chart.options.plugins.legend) {
                    chart.options.plugins.legend.labels.color = textColor;
                }
                
                if (chart.options.scales) {
                    Object.values(chart.options.scales).forEach(scale => {
                        if (scale.ticks) scale.ticks.color = textColor;
                        if (scale.grid) scale.grid.color = gridColor;
                    });
                }
                
                chart.update();
            }
        });
    }

    createCategoriesChart(posts) {
        const categories = {};
        posts.forEach(post => {
            categories[post.category] = (categories[post.category] || 0) + 1;
        });

        const ctx = document.getElementById('categoriesChart');
        if (!ctx) return;

        this.charts.categories = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe',
                        '#00f2fe'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    createTimelineChart(posts) {
        // Agrupar posts por mês
        const timeline = {};
        posts.forEach(post => {
            const date = new Date(parseInt(post.created_at));
            const month = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
            timeline[month] = (timeline[month] || 0) + 1;
        });

        const ctx = document.getElementById('timelineChart');
        if (!ctx) return;

        this.charts.timeline = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(timeline),
                datasets: [{
                    label: 'Posts por Mês',
                    data: Object.values(timeline),
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: '#667eea',
                    borderWidth: 1,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    }
                }
            });
        }

        // Servers Chart
        const serversCtx = document.getElementById('serversChart');
        if (serversCtx) {
            this.charts.servers = new Chart(serversCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Online', 'Offline', 'Manutenção'],
                    datasets: [{
                        data: [24, 1, 0],
                        backgroundColor: [
                            '#00cc66',
                            '#ff4444',
                            '#ff9966'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#e0e0e0',
                                padding: 20
                            }
                        }
                    }
                }
            });
        }

        // Performance Chart (ECharts)
        const performanceChart = document.getElementById('performanceChart');
        if (performanceChart) {
            this.charts.performance = echarts.init(performanceChart);
            
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data: ['CPU', 'Memória', 'Disco'],
                    textStyle: {
                        color: '#e0e0e0'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: this.generateTimeLabels(24),
                    axisLine: {
                        lineStyle: {
                            color: '#3a3a3a'
                        }
                    },
                    axisLabel: {
                        color: '#b0b0b0'
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#3a3a3a'
                        }
                    },
                    axisLabel: {
                        color: '#b0b0b0',
                        formatter: '{value}%'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#2a2a2a'
                        }
                    }
                },
                series: [
                    {
                        name: 'CPU',
                        type: 'line',
                        smooth: true,
                        data: this.generateRandomData(24, 30, 70),
                        itemStyle: {
                            color: '#00ff88'
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(0, 255, 136, 0.3)' },
                                { offset: 1, color: 'rgba(0, 255, 136, 0.1)' }
                            ])
                        }
                    },
                    {
                        name: 'Memória',
                        type: 'line',
                        smooth: true,
                        data: this.generateRandomData(24, 50, 85),
                        itemStyle: {
                            color: '#00ccff'
                        }
                    },
                    {
                        name: 'Disco',
                        type: 'line',
                        smooth: true,
                        data: this.generateRandomData(24, 20, 60),
                        itemStyle: {
                            color: '#ff6b6b'
                        }
                    }
                ]
            };

            this.charts.performance.setOption(option);
        }
    }

    initEventListeners() {
        // Chart period buttons
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateChartPeriod(e.target.dataset.period);
            });
        });

        // Real-time controls
        document.getElementById('start-realtime')?.addEventListener('click', () => {
            this.startRealTimeUpdates();
        });

        document.getElementById('pause-realtime')?.addEventListener('click', () => {
            this.pauseRealTimeUpdates();
        });

        document.getElementById('export-data')?.addEventListener('click', () => {
            this.exportData();
        });

        // Responsive chart resize
        window.addEventListener('resize', () => {
            Object.values(this.charts).forEach(chart => {
                if (chart && chart.resize) {
                    chart.resize();
                }
            });
        });
    }

    generateTimeLabels(hours) {
        const labels = [];
        const now = new Date();
        
        for (let i = hours - 1; i >= 0; i--) {
            const time = new Date(now - (i * 60 * 60 * 1000));
            const hours = time.getHours().toString().padStart(2, '0');
            const minutes = time.getMinutes().toString().padStart(2, '0');
            labels.push(`${hours}:${minutes}`);
        }
        
        return labels;
    }

    generateRandomData(count, min, max) {
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        return data;
    }

    updateChartPeriod(period) {
        // Simulate data update based on period
        const hours = period === '24h' ? 24 : period === '7d' ? 168 : 720;
        
        if (this.charts.traffic) {
            this.charts.traffic.data.labels = this.generateTimeLabels(hours);
            this.charts.traffic.data.datasets[0].data = this.generateRandomData(hours, 50, 200);
            this.charts.traffic.update();
        }
    }

    startRealTimeUpdates() {
        if (this.realtimeData.isRunning) return;
        
        this.realtimeData.isRunning = true;
        this.realtimeData.interval = setInterval(() => {
            this.updateRealTimeData();
            this.updateKPIs();
        }, 2000);
    }

    pauseRealTimeUpdates() {
        this.realtimeData.isRunning = false;
        if (this.realtimeData.interval) {
            clearInterval(this.realtimeData.interval);
            this.realtimeData.interval = null;
        }
    }

    updateRealTimeData() {
        // Update real-time values
        const connections = document.getElementById('active-connections');
        const requests = document.getElementById('requests-per-sec');
        const errors = document.getElementById('errors-per-sec');
        const responseTime = document.getElementById('response-time');

        if (connections) {
            const currentValue = parseInt(connections.textContent.replace(',', ''));
            const newValue = currentValue + Math.floor(Math.random() * 20 - 10);
            connections.textContent = Math.max(0, newValue).toLocaleString();
        }

        if (requests) {
            const newValue = Math.floor(Math.random() * 500 + 600);
            requests.textContent = newValue.toLocaleString();
        }

        if (errors) {
            const newValue = Math.floor(Math.random() * 5);
            errors.textContent = newValue;
        }

        if (responseTime) {
            const newValue = Math.floor(Math.random() * 200 + 150);
            responseTime.textContent = newValue + 'ms';
        }

        // Update charts with new data
        if (this.charts.traffic) {
            const chartData = this.charts.traffic.data.datasets[0].data;
            chartData.shift();
            chartData.push(Math.floor(Math.random() * 150 + 50));
            this.charts.traffic.update('none');
        }
    }

    updateKPIs() {
        const kpis = [
            { id: 'servers-online', value: 24, max: 25 },
            { id: 'latency', value: 45, unit: 'ms' },
            { id: 'error-rate', value: 0.8, unit: '%' },
            { id: 'uptime', value: 99.9, unit: '%' }
        ];

        kpis.forEach(kpi => {
            const element = document.getElementById(kpi.id);
            if (element) {
                const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
                const newValue = kpi.value * (1 + variation);
                element.textContent = kpi.unit === '%' ? newValue.toFixed(1) : Math.round(newValue);
            }
        });
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR');
        const element = document.getElementById('last-update-time');
        if (element) {
            element.textContent = timeString;
        }
    }

    exportData() {
        // Simulate data export
        const data = {
            timestamp: new Date().toISOString(),
            kpis: {
                serversOnline: 24,
                latency: 45,
                errorRate: 0.8,
                uptime: 99.9
            },
            charts: {
                traffic: this.charts.traffic?.data.datasets[0].data || [],
                servers: this.charts.servers?.data.datasets[0].data || []
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-data-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.dashboard-hero')) {
        new DashboardSystem();
    }
});
