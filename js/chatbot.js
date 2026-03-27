// ====================================
// CHATBOT - ARQUIVO SEPARADO
// ====================================

class MaxyllaineAssistant {
  constructor() {
    this.conversationHistory = [];
    this.apiKey = this.getApiKey();
    this.apiUrl = "https://api.groq.com/openai/v1/chat/completions";
    this.init();
  }

   getApiKey() {
        // Tentar obter de variável global (GitHub Actions)
        if (window.__GROQ_API_KEY__) {
            return window.__GROQ_API_KEY__;
        }
        
        // Tentar obter de localStorage (local storage)
        const storedKey = localStorage.getItem('groq_api_key');
        if (storedKey) {
            return storedKey;
        }
        
        // Fallback - usar padrão (será preenchido em produção)
        return 'gsk_' + 'chave_nao_configurada';
    }

  init() {
    this.chatbotMessages = document.getElementById("chatbotMessages");
    this.chatbotInput = document.getElementById("chatbotInput");
    this.chatbotSend = document.getElementById("chatbotSend");

    // Adicionar mensagem de boas-vindas
    this.addWelcomeMessage();
  }

  addWelcomeMessage() {
    const welcomeMessage = `Olá! 👋 Bem-vinda(o) à D'Luz! Sou a sua assistente virtual. Posso ajudá-la(o) com informações sobre:

✨ Botox
✨ Lipo de Papada
✨ Micropigmentação
✨ Design de Sobrancelhas

Como posso ajudá-la hoje?`;

    this.addMessage(welcomeMessage, "bot");
  }

  addMessage(content, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chatbot-message ${sender}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "chatbot-message-content";
    contentDiv.innerHTML = this.formatMessage(content);

    messageDiv.appendChild(contentDiv);
    this.chatbotMessages.appendChild(messageDiv);
    this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;

    return messageDiv;
  }

  // ====================================
  // FORMATAR MENSAGENS
  // ====================================

  formatMessage(text) {
    let formatted = text;

    // Converter quebras de linha
    formatted = formatted.replace(/\n/g, "<br>");

    // Converter links de WhatsApp com botão bonito
    formatted = formatted.replace(
      /\[WhatsApp\]\((https:\/\/wa\.me\/[^\)]+)\)/g,
      '<a href="$1" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; background-color: #25d366; color: white; padding: 10px 16px; border-radius: 25px; text-decoration: none; font-weight: 600; margin-top: 10px;">📱 Agendar no WhatsApp</a>',
    );

    // Converter links genéricos normais
    formatted = formatted.replace(
      /\[([^\]]+)\]\((https:\/\/wa\.me\/[^\)]+)\)/g,
      '<a href="$2" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; background-color: #25d366; color: white; padding: 10px 16px; border-radius: 25px; text-decoration: none; font-weight: 600; margin-top: 10px;">📱 $1</a>',
    );

    // Converter outros links normais
    formatted = formatted.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" style="color: #d4af37; text-decoration: none; font-weight: 600;">$1</a>',
    );

    return formatted;
  }

  showTypingIndicator() {
    const messageDiv = document.createElement("div");
    messageDiv.className = "chatbot-message bot";
    messageDiv.id = "typing-indicator";

    const contentDiv = document.createElement("div");
    contentDiv.className = "chatbot-message-content";
    contentDiv.innerHTML = `
            <div class="message-typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

    messageDiv.appendChild(contentDiv);
    this.chatbotMessages.appendChild(messageDiv);
    this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
  }

  removeTypingIndicator() {
    const indicator = document.getElementById("typing-indicator");
    if (indicator) indicator.remove();
  }

  getSystemPrompt() {
    return `Você é a assistente virtual especializada do salão D'LUZ. Seu objetivo é ser educada, profissional, técnica e acolhedora, 
        esse salão atende homens e mulheres trate com igualde para ambos generos.

ESPECIALIDADES E INFORMAÇÕES DETALHADAS:

📌 BOTOX
- Durabilidade: 4 a 6 meses
- Resultado inicial: 3 a 7 dias
- Efeito máximo: 2 semanas
- Finalidade: Prevenir e suavizar rugas de expressão
- Pós-procedimento: Sem tempo de recuperação
- Dica: Manutenção periódica recomendada

📌 LIPO DE PAPADA
- Reduz gordura localizada na região submentoniana
- Resultado: Imediato e progressivo
- Recuperação: 2 a 3 dias
- Incisão: Mínima e discreta
- Pós-procedimento: Evitar sol por 30 dias
- Dica: Resultados naturais e harmoniosos

📌 MICROPIGMENTAÇÃO E DESIGN DE SOBRANCELHAS
- Duração do efeito: 2 a 3 anos
- Cicatrização: 30 dias
- Durante cicatrização: Mudanças normais de cor e textura
- Design: Personalizado e sob medida
- Conforto: Anestésico local aplicado
- Dica: Sem dor durante o procedimento

PÓS-PROCEDIMENTO GERAL:
✓ Evitar sol direto nos primeiros 30 dias
✓ Usar protetor solar FPS 50+ sempre
✓ Seguir rigorosamente as recomendações da especialista
✓ Não aplicar maquiagem imediatamente
✓ Evitar atividades físicas intensas nos primeiros dias

REGRAS DE RESPOSTA:
1. Responda de forma curta, clara e acolhedora (máximo 3 parágrafos)
2. Use emojis para deixar mais amigável
3. Se não souber um valor específico, peça para agendar avaliação
4. Sempre termine incentivando o agendamento via WhatsApp
5. Seja empática com dúvidas e preocupações
6. Use linguagem clara e acessível
7. Se a pergunta não for sobre estética, redirecione gentilmente

PADRÃO DE RESPOSTA:
[Resposta principal com informações técnicas]

[Informação pós-procedimento ou dica importante]

🔗// Adicione isto quando for necessario do system prompt:

PADRÃO DE LINKS:
- Para WhatsApp: [Agende no WhatsApp](https://wa.me/5531994921781)
- Sempre termine quando o cliente agradecer ou pedir para falar 
com um especialista, quando cliente fazer perguntas pelas quais você
nao sabe responder encominhe o link do agendamento e da especialista 
conforme for o assuto.

NUNCA mostre URLs puras. SEMPRE use o formato: [texto](url)`;
  }

  async sendMessage(userMessage) {
    if (!userMessage.trim()) return;

    // Adicionar mensagem do usuário
    this.addMessage(userMessage, "user");
    this.chatbotInput.value = "";

    // Mostrar indicador de digitação
    this.showTypingIndicator();

    // Adicionar à histórico
    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

 /**/

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: this.getSystemPrompt(),
            },
            ...this.conversationHistory,
          ],
          temperature: 0.7,
          max_tokens: 600,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erro ${response.status}: ${errorData.error?.message || "Erro desconhecido"}`,
        );
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;

      // Remover indicador de digitação
      this.removeTypingIndicator();

      // Adicionar resposta do bot
      this.addMessage(botResponse, "bot");

      // Adicionar ao histórico
      this.conversationHistory.push({
        role: "assistant",
        content: botResponse,
      });

      // Manter apenas últimas 10 mensagens no histórico
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }
    } catch (error) {
      console.error("Erro ao conectar com API Groq:", error);
      this.removeTypingIndicator();

      let errorMessage =
        "❌ Desculpe, ocorreu um erro ao processar sua pergunta.";

      if (error.message.includes("401")) {
        errorMessage +=
          "\n\n⚠️ Erro de autenticação. Verifique sua chave API Groq.";
      } else if (error.message.includes("429")) {
        errorMessage +=
          "\n\n⏳ Muitas requisições. Aguarde um momento e tente novamente.";
      } else if (error.message.includes("GROQ")) {
        errorMessage +=
          "\n\n🔌 Serviço temporariamente indisponível. Tente novamente em alguns momentos.";
      }

      errorMessage +=
        "\n\n📞 Ou entre em contato pelo WhatsApp: https://wa.me/5511999999999";

      this.addMessage(errorMessage, "bot");
    }
  }

  clearChat() {
    this.chatbotMessages.innerHTML = "";
    this.conversationHistory = [];
    this.addWelcomeMessage();
  }
}

// Inicializar assistente quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  const assistant = new MaxyllaineAssistant();

  // Setup de event listeners
  const chatbotSend = document.getElementById("chatbotSend");
  const chatbotInput = document.getElementById("chatbotInput");

  if (chatbotSend && chatbotInput) {
    chatbotSend.addEventListener("click", () => {
      assistant.sendMessage(chatbotInput.value);
    });

    chatbotInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        assistant.sendMessage(chatbotInput.value);
      }
    });
  }

  // Armazenar instância global para debug
  window.maxyllaineAssistant = assistant;
});
