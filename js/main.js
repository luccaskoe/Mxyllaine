// ====================================
// CONFIGURAÇÃO INICIAL
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initFAQ();
    initForm();
    initChatbot();
    initScrollAnimations();
});

// ====================================
// NAVEGAÇÃO RESPONSIVA
// ====================================

function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu.querySelectorAll('a');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ====================================
// FAQ - ACORDEÃO
// ====================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Fechar outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Abrir/fechar item atual
            item.classList.toggle('active');
        });
    });
}

// ====================================
// FORMULÁRIO DE CONTATO
// ====================================

function initForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const procedure = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;

            // Simular envio (em produção, enviar para servidor)
            console.log('Dados do formulário:', {
                nome: name,
                email: email,
                telefone: phone,
                procedimento: procedure,
                mensagem: message
            });

            // Mostrar feedback ao usuário
            showNotification('✓ Solicitação enviada com sucesso! Entraremos em contato em breve.');

            // Limpar formulário
            contactForm.reset();
        });
    }
}

// ====================================
// NOTIFICAÇÕES
// ====================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #25d366;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(37, 211, 102, 0.3);
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ====================================
// CHATBOT
// ====================================

function initChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotInput = document.getElementById('chatbotInput');

    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
        if (chatbotContainer.classList.contains('active')) {
            chatbotInput.focus();
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });

    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

function sendMessage() {
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const userMessage = chatbotInput.value.trim();

    if (!userMessage) return;

    // Adicionar mensagem do usuário
    addMessage(userMessage, 'user', chatbotMessages);
    chatbotInput.value = '';

    // Mostrar indicador de digitação
    showTypingIndicator(chatbotMessages);

    // Enviar para a API Groq
    setTimeout(() => {
        sendToGroqAPI(userMessage);
    }, 500);
}

function addMessage(content, sender, container) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'chatbot-message-content';
    contentDiv.textContent = content;

    messageDiv.appendChild(contentDiv);
    container.appendChild(messageDiv);

    // Scroll para o final
    container.scrollTop = container.scrollHeight;
}

function showTypingIndicator(container) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message bot';
    messageDiv.id = 'typing-indicator';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'chatbot-message-content';
    contentDiv.innerHTML = `
        <div class="message-typing">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    messageDiv.appendChild(contentDiv);
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

// ====================================
// INTEGRAÇÃO COM API GROQ
// ====================================

async function sendToGroqAPI(userMessage) {
    const chatbotMessages = document.getElementById('chatbotMessages');
    const apiKey = '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'; 
    const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

    const systemPrompt = `Você é a assistente virtual especializada do salão Maxyllaine. Seu objetivo é ser educada, profissional e técnica.

Suas especialidades para responder:

Botox: Explique que a durabilidade é de 4 a 6 meses e serve para prevenir rugas. O resultado aparece entre 3-7 dias. Sempre mencione a importância da manutenção periódica.

Lipo de Papada: Procedimento para redução de gordura localizada na região submentoniana. Mencione que o resultado é imediato e a recuperação é rápida (2-3 dias).

Micropigmentação/Sobrancelhas: Explique sobre cicatrização (30 dias), design personalizado e que dura entre 2-3 anos.

Pós-procedimento: Sempre oriente a não tomar sol direto nos primeiros 30 dias e seguir as recomendações da especialista.

Regras de Resposta:
- Responda de forma curta e acolhedora (máximo 3 parágrafos)
- Se não souber um valor específico, peça para a cliente agendar uma avaliação
- Sempre termine incentivando o agendamento via link de WhatsApp
- Seja empática e profissional
- Use linguagem clara e acessível
- Mencione benefícios e tranquilize dúvidas comuns
- Se a pergunta não for sobre estética, redirecione para assuntos da clínica`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 500,
            })
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        const botResponse = data.choices[0].message.content;

        removeTypingIndicator();
        addMessage(botResponse, 'bot', chatbotMessages);

        // Adicionar link de WhatsApp ao final da resposta
        addWhatsAppLink(chatbotMessages);

    } catch (error) {
        console.error('Erro ao conectar com a API Groq:', error);
        removeTypingIndicator();
        addMessage(
            '❌ Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente ou entre em contato pelo WhatsApp.',
            'bot',
            chatbotMessages
        );
    }
}

function addWhatsAppLink(container) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message bot';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'chatbot-message-content';
    contentDiv.innerHTML = `
        <a href="https://wa.me/5531994921781?text=Olá!%20Gostaria%20de%20agendar%20uma%20avaliação%20na%20Maxyllaine." 
           target="_blank" 
           style="color: #25d366; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 5px;">
            <i class="fab fa-whatsapp"></i> Agendar consulta no WhatsApp
        </a>
    `;

    messageDiv.appendChild(contentDiv);
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// ====================================
// SCROLL SUAVE PARA SEÇÕES
// ====================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ====================================
// ANIMAÇÕES AO SCROLL
// ====================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar cards de procedimentos
    document.querySelectorAll('.procedimento-card').forEach(card => {
        observer.observe(card);
    });

    // Observar itens de galeria
    document.querySelectorAll('.galeria-item').forEach(item => {
        observer.observe(item);
    });

    // Observar itens FAQ
    document.querySelectorAll('.faq-item').forEach(item => {
        observer.observe(item);
    });
}

// ====================================
// COMPARISON SLIDER - ANTES/DEPOIS
// ====================================

function initComparisonSliders() {
    const sliders = document.querySelectorAll('.comparison-slider');

    sliders.forEach(slider => {
        const wrapper = slider.querySelector('.img-wrapper');
        const afterContainer = slider.querySelector('.img-after-container');
        const handle = slider.querySelector('.comparison-handle');
        const labels = slider.querySelector('.comparison-labels');

        let isActive = false;

        // Função para atualizar posição
        function updatePosition(x) {
            const rect = wrapper.getBoundingClientRect();
            const relativeX = x - rect.left;
            const percentage = (relativeX / rect.width) * 100;

            // Limitar entre 0 e 100
            const clampedPercentage = Math.max(0, Math.min(100, percentage));

            // Atualizar largura da imagem "Depois"
            afterContainer.style.width = clampedPercentage + '%';

            // Atualizar posição do divisor
            handle.style.left = clampedPercentage + '%';

            // Atualizar posição das labels
            if (clampedPercentage < 20) {
                labels.querySelector('.label-before').style.opacity = '0';
            } else {
                labels.querySelector('.label-before').style.opacity = '1';
            }

            if (clampedPercentage > 80) {
                labels.querySelector('.label-after').style.opacity = '0';
            } else {
                labels.querySelector('.label-after').style.opacity = '1';
            }
        }

        // Mouse events
        slider.addEventListener('mousedown', () => {
            isActive = true;
            slider.style.cursor = 'grabbing';
        });

        document.addEventListener('mouseup', () => {
            isActive = false;
                       slider.style.cursor = 'grab';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isActive) return;
            updatePosition(e.clientX);
        });

        // Touch events para mobile
        slider.addEventListener('touchstart', () => {
            isActive = true;
        });

        document.addEventListener('touchend', () => {
            isActive = false;
        });

        document.addEventListener('touchmove', (e) => {
            if (!isActive) return;
            updatePosition(e.touches[0].clientX);
        });

        // Click na imagem para mover
        wrapper.addEventListener('click', (e) => {
            updatePosition(e.clientX);
        });

        // Inicializar com 50%
        updatePosition(wrapper.getBoundingClientRect().left + wrapper.getBoundingClientRect().width / 2);
    });
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComparisonSliders);
} else {
    initComparisonSliders();
}


// ====================================
// LAZY LOADING DE IMAGENS
// ====================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ====================================
// Dark MODE (OPCIONAL)
// ====================================

function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (!darkModeToggle) return;

    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
}

// ====================================
// FUNÇÕES UTILITÁRIAS
// ====================================

function formatPhoneNumber(phone) {
    return phone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Adicionar data de atualização do site
function addLastUpdate() {
    const lastUpdate = new Date().toLocaleDateString('pt-BR');
    const footer = document.querySelector('.footer-bottom p');
    if (footer) {
        footer.innerHTML += ` | Última atualização: ${lastUpdate}`;
    }
}

// ====================================
// EVENT LISTENERS GLOBAIS
// ====================================

// Adicionar estilos de animação CSS
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .procedimento-card {
        animation: slideInUp 0.6s ease-out;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .galeria-item {
        animation: zoomIn 0.6s ease-out;
    }

    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(animationStyles);

// Inicializar ao carregar a página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initLazyLoading();
        addLastUpdate();
    });
} else {
    initLazyLoading();
    addLastUpdate();
}