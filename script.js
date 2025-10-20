// ===== FUNÇÃO DE NEGRITO CORRIGIDA =====
function ativarNegrito() {
    const body = document.body;
    const botao = document.querySelector('.bold-toggle-btn');
    
    // Alterna a classe no body
    body.classList.toggle('texto-negrito');
    
    // Alterna a classe ativa no botão
    if (botao) {
        botao.classList.toggle('active');
    }
    
    // Salva a preferência do usuário
    const isActive = body.classList.contains('texto-negrito');
    localStorage.setItem('negritoAtivo', isActive);
    
    console.log('Negrito ' + (isActive ? 'ativado' : 'desativado'));
}
// Carregar preferências salvas
document.addEventListener('DOMContentLoaded', function() {
    const savedContrast = localStorage.getItem('contrast');
    const savedFontSize = localStorage.getItem('fontSize');
    const negritoAtivo = localStorage.getItem('negritoAtivo');
    
    if (savedContrast) {
        changeContrast(savedContrast);
    }
    
    if (savedFontSize === 'large') {
        changeFontSize('large');
    }
    
    // Carregar estado do negrito
    if (negritoAtivo === 'true') {
        document.body.classList.add('texto-negrito');
        const botao = document.querySelector('.bold-toggle-btn');
        if (botao) {
            botao.classList.add('active');
        }
    }
    
    // Configurar evento de Enter para pesquisa
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Fechar menu de acessibilidade ao clicar fora
    document.addEventListener('click', function(e) {
        const menu = document.getElementById('accessibilityOptions');
        const button = document.querySelector('.accessibility-btn');
        
        if (menu && button && !menu.contains(e.target) && !button.contains(e.target)) {
            menu.classList.remove('show');
        }
    });
});
// ===== FUNÇÕES BÁSICAS DE NAVEGAÇÃO =====
// Otimização do slideshow para diferentes tamanhos de tela
function optimizeSlideshowForScreen() {
    const slideshows = document.querySelectorAll('.slideshow');
    const isMobile = window.innerWidth <= 768;
    
    slideshows.forEach(slideshow => {
        const images = slideshow.querySelectorAll('img');
        images.forEach(img => {
            if (isMobile) {
                // Para mobile, garantir que object-fit seja contain se necessário
                img.style.objectFit = 'contain';
                img.style.objectPosition = 'center';
            } else {
                // Para desktop, pode usar cover
                img.style.objectFit = 'cover';
                img.style.objectPosition = 'center';
            }
        });
    });
}

// Executar na carga e no redimensionamento
document.addEventListener('DOMContentLoaded', function() {
    optimizeSlideshowForScreen();
    window.addEventListener('resize', optimizeSlideshowForScreen);
});
// Voz fala

    function lerTexto(id) {
      const texto = document.getElementById(id).innerText;
      const fala = new SpeechSynthesisUtterance(texto);
 
      fala.lang = "pt-BR"; // idioma português
      fala.rate = 1;       // velocidade normal
      fala.pitch = 1;      // tom normal
 
      speechSynthesis.speak(fala);
    }
 
    function parar() {
      speechSynthesis.cancel();
    }
// Galeria responsiva
function initAllSlideshows() {
    const slideshows = document.querySelectorAll('.slideshow');
    
    slideshows.forEach(slideshow => {
        let currentSlide = 0;
        const slides = slideshow.querySelectorAll('.slide');
        const totalSlides = slides.length;
        
        // Configura intervalo individual para cada slideshow
        const intervalId = setInterval(() => {
            // Remove active do slide atual
            slides[currentSlide].classList.remove('active');
            
            // Avança para próximo slide
            currentSlide = (currentSlide + 1) % totalSlides;
            
            // Adiciona active ao novo slide
            slides[currentSlide].classList.add('active');
        }, 4000); // Aumentado para 4 segundos para melhor experiência
        
        // Pausar slideshow quando não estiver visível (performance)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Retomar slideshow quando visível
                    clearInterval(intervalId);
                    setInterval(() => {
                        slides[currentSlide].classList.remove('active');
                        currentSlide = (currentSlide + 1) % totalSlides;
                        slides[currentSlide].classList.add('active');
                    }, 4000);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(slideshow);
    });
}

// Inicia quando a página carregar
document.addEventListener('DOMContentLoaded', initAllSlideshows);
// Scroll suave

  const btnTopo = document.getElementById("btnTopo");
 
 
    window.onscroll = () => {
      if (document.documentElement.scrollTop > 200) {
        btnTopo.style.display = "block";
      } else {
        btnTopo.style.display = "none";
      }
    };
 

    btnTopo.onclick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    
// Função para rolar para seções específicas
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Função para ir para home
function goToHome() {
    scrollToSection('home');
}

// ===== SISTEMA DE PESQUISA =====

// Função de pesquisa principal
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const clearBtn = document.querySelector('.clear-search-btn');
    
    // Validação de entrada vazia
    if (searchTerm === '') {
        alert('Por favor, digite algo para pesquisar.');
        return;
    }
    
    // Rolagem para a seção de energias
    scrollToEnergySection();
    
    // Pequeno delay para garantir que a rolagem terminou antes da pesquisa
    setTimeout(() => {
        filterEnergyCards(searchTerm);
    }, 500);
    
    // Mostra botão limpar
    if (clearBtn) {
        clearBtn.style.display = 'inline-block';
    }
}

// Função para filtrar os cards de energia
function filterEnergyCards(searchTerm) {
    const energyCards = document.querySelectorAll('.energy-card');
    let foundResults = false;

    // Remove destaque anterior
    energyCards.forEach(card => {
        card.classList.remove('highlight');
    });

    // Remove mensagem de resultados anterior
    const existingMessage = document.getElementById('searchResultsMessage');
    if (existingMessage) {
        existingMessage.remove();
    }

    energyCards.forEach(card => {
        if (searchTerm === '') {
            // Mostra todos os cards se pesquisa estiver vazia
            card.style.display = 'flex';
            return;
        }

        const cardTitle = card.querySelector('h3').textContent.toLowerCase();
        const cardText = card.querySelector('p').textContent.toLowerCase();
        const cardTags = card.getAttribute('data-tags').toLowerCase();

        // Verifica se o termo de pesquisa está no título, texto ou tags
        if (cardTitle.includes(searchTerm) || 
            cardText.includes(searchTerm) || 
            cardTags.includes(searchTerm)) {
            
            card.style.display = 'flex';
            card.classList.add('highlight');
            
            if (!foundResults) {
                foundResults = true;
                // Rolagem suave para o primeiro resultado
                setTimeout(() => {
                    card.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 600);
            }
        } else {
            card.style.display = 'none';
        }
    });

    // Mostra mensagem se não encontrar resultados
    if (searchTerm !== '' && !foundResults) {
        showNoResultsMessage(searchTerm);
    }
}

// Função para mostrar mensagem de nenhum resultado
function showNoResultsMessage(searchTerm) {
    const energySection = document.getElementById('energias');
    if (!energySection) return;

    const messageElement = document.createElement('div');
    messageElement.id = 'searchResultsMessage';
    messageElement.innerHTML = `
        <p>Termo "${searchTerm}" não encontrado. Tente pesquisar por: solar, eólica, hidrelétrica, biomassa, empresas, vendas ou locais.</p>
    `;
    messageElement.style.cssText = `
        background: #fff3e0;
        border: 2px solid #ff9800;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
        text-align: center;
    `;
    
    energySection.appendChild(messageElement);
}

// Função para limpar pesquisa
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.querySelector('.clear-search-btn');
    
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }
    
    // Mostra todos os cards novamente
    filterEnergyCards('');
}

// Rolagem suave para a seção de energias
function scrollToEnergySection() {
    scrollToSection('energias');
}

// ===== ACESSIBILIDADE =====

// Função para toggle do menu de acessibilidade
function toggleAccessibilityMenu() {
    const menu = document.getElementById('accessibilityOptions');
    if (menu) {
        menu.classList.toggle('show');
    }
}

// Função para mudar contraste
function changeContrast(type) {
    const body = document.body;
    
    // Remover classes anteriores
    body.classList.remove('high-contrast', 'dark-mode');
    
    // Aplicar nova classe
    switch(type) {
        case 'high':
            body.classList.add('high-contrast');
            localStorage.setItem('contrast', 'high');
            break;
        case 'dark':
            body.classList.add('dark-mode');
            localStorage.setItem('contrast', 'dark');
            break;
        default:
            localStorage.setItem('contrast', 'normal');
            break;
    }
}

// Função para mudar tamanho da fonte
function changeFontSize(size) {
    const body = document.body;
    
    // Remover classes anteriores
    body.classList.remove('normal-font', 'large-font');
    
    // Aplicar nova classe
    if (size === 'large') {
        body.classList.add('large-font');
        localStorage.setItem('fontSize', 'large');
    } else {
        body.classList.add('normal-font');
        localStorage.setItem('fontSize', 'normal');
    }
}
// ===== MAPA DE VENDAS =====

// Função para mostrar mapa de vendas melhorada
function showSalesMap() {
    const stateSelect = document.getElementById('stateSelect');
    const selectedState = stateSelect.value;
    const mapDiv = document.getElementById('salesMap');
    
    if (selectedState === '') {
        showNotification('Por favor, selecione um estado.', 'warning');
        return;
    }
    
    const stateData = states[selectedState];
    
    if (stateData && stateData.stores.length > 0) {
        let html = `
        <div class="company-sale">
                <h3>Pontos de Venda em ${stateData.name}</h3>
                <p class="store-count">${stateData.stores.length} loja(s) encontrada(s)</p>
            </div>
            <div class="stores-list">
        `;
        
        stateData.stores.forEach((store, index) => {
            // Formatar telefone para WhatsApp
            const phone = store.phone.replace(/\D/g, '');
            const whatsappLink = phone.length >= 10 ? `https://wa.me/55${phone}` : '#';
            
            html += `
                <div class="store-item">
                    <div class="store-info">
                        <h4>${store.name}</h4>
                        <p> ${store.address}</p>
                        <p>📞 ${store.phone}</p>
                        ${store.website ? `<p>🌐 ${store.website}</p>` : ''}
                    </div>
                    <div class="store-actions">
                        <button class="contact-store-btn" onclick="contactStore('${store.name}', '${store.phone}')">
                            📞 Ligar
                        </button>
                        ${phone.length >= 10 ? `
                        <a href="${whatsappLink}" target="_blank" class="whatsapp-btn">
                                    <img src="./img/whatsapp.png" alt="whats"> WhatsApp </a>
                        ` : ''}
                        <button class="contact-store-btn" onclick="showStoreDetails('${store.name}', '${store.address}', '${store.phone}')">
                            ℹ️ Detalhes
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        mapDiv.innerHTML = html;
    } else {
        mapDiv.innerHTML = `
            <div class="no-stores">
                <h3>Nenhum ponto de venda encontrado</h3>
                <p>Não encontramos pontos de venda para ${getStateName(selectedState)}.</p>
                <button onclick="suggestStore()" class="show-map-btn">Sugerir uma loja</button>
            </div>
        `;
    }
}

// Funções auxiliares melhoradas
function contactStore(storeName, phone) {
    if (phone && phone !== 'Não disponível' && !phone.includes('Site:')) {
        // Remove caracteres não numéricos
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length >= 10) {
            window.open(`tel:${cleanPhone}`);
        } else {
            showNotification(`Número de telefone inválido para ${storeName}`, 'error');
        }
    } else {
        showNotification(`Informações de contato não disponíveis para ${storeName}`, 'warning');
    }
}

function showStoreDetails(name, address, phone) {
    const detailsHtml = `
        <h4>${name}</h4>
        <p><strong>Endereço:</strong> ${address}</p>
        <p><strong>Telefone:</strong> ${phone}</p>
        <button onclick="closeStoreDetails()" class="contact-store-btn">Fechar</button>
    `;
    
    // Criar modal simples
    const modal = document.createElement('div');
    modal.className = 'store-modal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        max-width: 400px;
        width: 90%;
    `;
    modal.innerHTML = detailsHtml;
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 999;
    `;
    overlay.onclick = closeStoreDetails;
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}
function closeStoreDetails() {
    const modal = document.querySelector('.store-modal');
    const overlay = document.querySelector('.store-modal-overlay');
    
    if (modal) modal.remove();
    if (overlay) overlay.remove();
}

function showStoreDetails(name, address, phone) {
    const detailsHtml = `
        <h4>${name}</h4>
        <p><strong>Endereço:</strong> ${address}</p>
        <p><strong>Telefone:</strong> ${phone}</p>
        <button onclick="closeStoreDetails()" class="contact-store-btn">Fechar</button>
    `;
    
    // Criar modal simples
    const modal = document.createElement('div');
    modal.className = 'store-modal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        max-width: 400px;
        width: 90%;
    `;
    modal.innerHTML = detailsHtml;
    
    const overlay = document.createElement('div');
    overlay.className = 'store-modal-overlay'; // ADICIONE ESTA CLASSE
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 999;
    `;
    overlay.onclick = closeStoreDetails;
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

function suggestStore() {
    const emailSubject = "Sugestão de Ponto de Venda";
    const emailBody = `Gostaria de sugerir a inclusão de um ponto de venda de energia renovável.\n\nEstado: \nCidade: \nNome da Loja: \nEndereço: \nTelefone: \n `;
    window.open(`E-mail:Eclipse@gmail.com.br?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`);
}

// Sistema de notificação
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#4CAF50'};
        color: white;
        border-radius: 5px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}
// Div espansivo bonitin
        function toggleExpand(element) {
            const content = element.nextElementSibling;
            const icon = element.querySelector('.icon');
            
            content.classList.toggle('open');
            icon.classList.toggle('rotate');
        }
        
// Função auxiliar para contatar loja (precisa ser implementada)
function contactStore(storeName) {
    alert(`Contatando: ${storeName}`);

}
    // Pontos de venda por estado
const states = {
    'AC': {
        name: 'Acre',
        stores: [
            { name: 'Energisa Acre – Distribuidora de Energia S.A.', address: 'Rio Branco, AC', phone: '(68) 3212-5735' },
            { name: 'Energias do Acre Spe Ltda', address: 'Cruzeiro do Sul, AC', phone: '(69) 3216-9600' },
            { name: 'Acre Energia Ltda', address: 'Epitaciolândia, AC', phone: '(68) 99227-3005' }
        ]
    },
    'AL': {
        name: 'Alagoas',
        stores: [
            { name: 'Equatorial Alagoas Distribuidora de Energia S.A.', address: 'Maceió, AL', phone: '0800 082 0196' },
            { name: 'Origem Energia Alagoas S.A.', address: 'Pilar, AL', phone: '0800 121 0404' },
            { name: 'Alagoas Energia Solar Fotovoltaica Ltda.', address: 'Arapiraca, AL', phone: '(82) 3521-4983' }
        ]
    },
    'AP': {
        name: 'Amapá',
        stores: [
            { name: 'Companhia de Eletricidade do Amapá (CEA / Equatorial Amapá)', address: 'Macapá, AP', phone: '0800 096 0196' },
            { name: 'Amapá Power S/A', address: 'Brasília, DF', phone: '(61) 3039-8800' },
            { name: 'Linhas de Macapá Transmissão de Energia S.A.', address: 'Amapá', phone: '(11) 2595-5900' }
        ]
    },
    'AM': {
        name: 'Amazonas',
        stores: [
            { name: 'Amazonas Energia S.A.', address: 'Manaus, AM', phone: '0800 701 3001' },
            { name: 'Manaus Energia', address: 'Manaus, AM', phone: '0800 701 3001' }
        ]
    },
    'BA': {
        name: 'Bahia',
        stores: [
            { name: 'Parque Tecnológico da Bahia', address: 'Salvador, BA', phone: '(71) 98846-1372' },
            { name: 'Bahia Sol - Energia Solar Fotovoltaica', address: 'Salvador, BA', phone: '(71) 99336-3467' },
            { name: 'Rei da Energia Solar - Instalação de Energia Solar', address: 'Salvador, BA', phone: '(71) 99641-4342' }
        ]
    },
    'CE': {
        name: 'Ceará',
        stores: [
            { name: 'Enel Distribuição Ceará', address: 'Fortaleza, CE', phone: '0800 28 50 196' },
            { name: 'Volstrom Energia', address: 'Fortaleza, CE', phone: '(85) 3182-0105' },
            { name: 'Ceará Energia', address: 'Fortaleza, CE', phone: '(85) 99134-7203' }
        ]
    },
    'DF': {
        name: 'Distrito Federal',
        stores: [
            { name: 'Amapá Power S/A', address: 'Brasília, DF', phone: '(61) 3039-8800' }
        ]
    },
    'ES': {
        name: 'Espírito Santo',
        stores: [
            { name: 'EDP Espírito Santo Distribuição de Energia S.A.', address: 'Vitória, ES', phone: '0800 721 0707' },
            { name: 'Edp Smart Energia LTDA', address: 'Vitória, ES', phone: '(11) 2185-5010' },
            { name: 'Enervix – Energias do Espírito Santo LTDA', address: 'Vitória, ES', phone: '(27) 3429-6000' }
        ]
    },
    'GO': {
        name: 'Goiás',
        stores: [
            { name: 'COOPGOIÁS ENERGIA', address: 'Goiânia, GO', phone: '(62) 3240-2600' },
            { name: 'Goias Energia Solar LTDA', address: 'Goiânia, GO', phone: '(62) 99948-3700' },
            { name: 'Bravo Energia Renovável', address: 'Goiânia, GO', phone: '(62) 98147-4118' }
        ]
    },
    'MA': {
        name: 'Maranhão',
        stores: [
            { name: 'Eneva', address: 'São Luís, MA', phone: '0800 730 1060' },
            { name: 'Equatorial Energia', address: 'São Luís, MA', phone: '0800 091 0196' },
            { name: 'Âmbar Energia', address: 'São Luís, MA', phone: '(11) 3668-1154' }
        ]
    },
    'MT': {
        name: 'Mato Grosso',
        stores: [
            { name: 'Energia Total Ind. Com. Equip. Energia Solar LTDA', address: 'Cuiabá, MT', phone: '(65) 3665-0858' },
            { name: 'Mt Sol Energia Solar Tecnologia e Serviços LTDA', address: 'Cuiabá, MT', phone: '(65) 99963-2645' },
            { name: 'Sunna Energy', address: 'Cuiabá, MT', phone: '(65) 98120-6640' }
        ]
    },
    'MS': {
        name: 'Mato Grosso do Sul',
        stores: [
            { name: 'LUMINAR ENERGIA SOLAR LTDA', address: 'Campo Grande, MS', phone: '(67) 3201-7149' },
            { name: 'Eco Energy MS Energia Solar LTDA', address: 'Campo Grande, MS', phone: '(67) 99983-6589' },
            { name: 'S S Energia Solar LTDA', address: 'Campo Grande, MS', phone: '(67) 99131-3868' }
        ]
    },
    'MG': {
        name: 'Minas Gerais',
        stores: [
            { name: 'Grid Energia - Soluções Inteligentes e Sustentáveis', address: 'Belo Horizonte, MG', phone: '(31) 2115-1515' },
            { name: 'GDE Energia', address: 'Belo Horizonte, MG', phone: '(31) 3261-3020' },
            { name: 'Maya Energy | Energia Solar para Negócios e Residências', address: 'Belo Horizonte, MG', phone: '(31) 99677-8922' }
        ]
    },
    'PA': {
        name: 'Pará',
        stores: [
            { name: 'Solartec Energia Solar e Engenharia LTDA', address: 'Xinguara, PA', phone: '(94) 3426-2157' },
            { name: 'Alfredo Solar (Alfredo Integração de Energia Solar LTDA)', address: 'Xinguara, PA', phone: '(94) 99131-9000' },
            { name: 'Grupo TM Energia Solar', address: 'Belém, PA', phone: '(91) 99379-8054' }
        ]
    },
    'PB': {
        name: 'Paraíba',
        stores: [
            { name: 'BIO Energy Trade', address: 'João Pessoa, PB', phone: '(41) 3348-7445' },
            { name: 'EDP Brasil', address: 'João Pessoa, PB', phone: '0800 721 5044' },
            { name: 'CPFL Renováveis', address: 'Interior da PB', phone: '(11) 3157-9300' }
        ]
    },
    'PR': {
        name: 'Paraná',
        stores: [
            { name: 'Copel – Companhia Paranaense de Energia', address: 'Curitiba, PR', phone: '(41) 3322-3535' },
            { name: 'Pacto Energia – Distribuição Pacto Energia PR', address: 'Coronel Vivida, PR', phone: '(46) 3232-1244' },
            { name: 'Parana Energia Ltda', address: 'São José dos Pinhais, PR', phone: '(41) 3383-4497' }
        ]
    },
    'PE': {
        name: 'Pernambuco',
        stores: [
            { name: 'Solare Power - Energia Solar', address: 'Recife, PE', phone: '(81) 99784-6279' },
            { name: 'Ekosolarne - Energia Solar', address: 'Recife, PE', phone: '(81) 99245-6615' },
            { name: 'CBC Energias Renováveis - Energia Solar', address: 'Recife, PE', phone: '(81) 98101-1951' }
        ]
    },
    'PI': {
        name: 'Piauí',
        stores: [
            { name: 'Green energy piauí', address: 'Teresina, PI', phone: '(86) 99454-6961' },
            { name: 'Energia Solar Teresina | Cruze Energia', address: 'Teresina, PI', phone: '(86) 99917-1119' },
            { name: 'Renove Energia Solar', address: 'Teresina, PI', phone: '(86) 98117-3609' }
        ]
    },
    'RJ': {
        name: 'Rio de Janeiro',
        stores: [
            { name: 'Light – Light Serviços de Eletricidade S.A.', address: 'Rio de Janeiro, RJ', phone: '0800-021-0196' },
            { name: 'Energisa Nova Friburgo – Distribuidora de Energia S.A.', address: 'Nova Friburgo, RJ', phone: '(22) 2102-2500' },
            { name: 'Energisa Geração – Usina Maurício S.A.', address: 'Nova Friburgo, RJ', phone: '(32) 3429-6280' }
        ]
    },
    'RN': {
        name: 'Rio Grande do Norte',
        stores: [
            { name: 'Casa dos Ventos', address: 'Natal, RN', phone: '(11) 4084-4200' },
            { name: 'Echo Energia', address: 'Natal, RN', phone: '(11) 4935-4000' },
            { name: 'Omega Geração', address: 'Interior do RN', phone: '(31) 2513-3500' }
        ]
    },
    'RS': {
        name: 'Rio Grande do Sul',
        stores: [
            { name: 'RGE Sul Distribuidora de Energia S.a.', address: 'São Leopoldo, RS', phone: '(51) 3316-1400' },
            { name: 'Rio Grande Energia S.A. (RGE)', address: 'Caxias do Sul, RS', phone: '0800 970 0900' },
            { name: 'Solled Energia', address: 'Santa Cruz do Sul, RS', phone: '(51) 3909-7279' }
        ]
    },
    'RO': {
        name: 'Rondônia',
        stores: [
            { name: 'Energia Sustentável do Brasil (ESBR)', address: 'Porto Velho, RO', phone: '0800 647 77 47' },
            { name: 'Auren Energia', address: 'Porto Velho, RO', phone: '0800 704 0589' },
            { name: 'Elera Renováveis', address: 'Porto Velho, RO', phone: '(21) 3543-2234' }
        ]
    },
    'RR': {
        name: 'Roraima',
        stores: [
            { name: 'Roraima Energia S.A.', address: 'Boa Vista, RR', phone: '(95) 6239-380' },
            { name: 'Companhia Energética de Roraima (CER)', address: 'Cantá, RR', phone: ' 0800 701 9120 '},
            { name: 'Boa Vista Energia S/A', address: 'Caracaraí, RR', phone: '(95) 2121-1156' }
        ]
    },
    'SC': {
        name: 'Santa Catarina',
        stores: [
            { name: 'Celesc – Centrais Elétricas de Santa Catarina', address: 'Florianópolis, SC', phone: '0800 48 0120' },
            { name: 'Energisa – iniciativas em Santa Catarina', address: 'Vários municípios, SC', phone: '0800 701 0326' },
            { name: 'Energisa Instalações e Manutenções Elétricas Ltda', address: 'Joinville, SC', phone: '(47) 9123-1712' }
        ]
    },
    'SP': {
        name: 'São Paulo',
        stores: [
            { name: 'Enel Distribuição São Paulo', address: 'São Paulo, SP', phone: '0800 72 72 120' },
            { name: 'CPFL Paulista', address: 'Interior de SP', phone: '0800 010 10 10' },
            { name: 'Persaid Comercial e Distribuidora LTDA', address: 'São Paulo, SP', phone: '(11) 96694-5456' }
        ]
    },
    'SE': {
        name: 'Sergipe',
        stores: [
            { name: 'Energisa Sergipe – Distribuidora de Energia S.A.', address: 'Aracaju, SE', phone: '(79) 2106-1670' },
            { name: 'Energisa Sergipe (Call Center)', address: 'Aracaju, SE', phone: '0800 079 0196' },
            { name: 'Energisa Sergipe (Filial em Lagarto)', address: 'Lagarto, SE', phone: '(32) 3429-6000' }
        ]
    },
    'TO': {
        name: 'Tocantins',
        stores: [
            { name: 'Energisa Tocantins Distribuidora de Energia S.A.', address: 'Palmas, TO', phone: '(63) 3219-5000' },
            { name: 'EcoSol (Energia Solar)', address: 'Araguaína, TO', phone: '(63) 99111-0273' },
            { name: 'V.Power Energia', address: 'Tocantins', phone: '(63) 98401-8501' }
        ]
    }
};

function getStateName(uf) {
    return states[uf] ? states[uf].name : 'Estado não encontrado';
}

function getStateStores(uf) {
    return states[uf] ? states[uf].stores : [];
}

    
    const stateData = salesData[selectedState];
    
if (states) {
    let html = `
        <div class="simple-empresas-box">
            <h3>Pontos de Venda em ${states.name}</h3>
            <p class="subtitle">${stateData.stores.length} estabelecimento(s) disponível(is)</p>
        </div>
        <div class="stores-list">
    `;
        
        html += '</div>';
        mapDiv.innerHTML = html;
    } else {
        mapDiv.innerHTML = `<p>Em breve: pontos de venda para ${getStateName(selectedState)}</p>`;
    }


// Função auxiliar para nome do estado
function getStateName(uf) {
    const states = {
        'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
        'BA': 'Bahia', 'CE': 'Ceará', 'ES': 'Espírito Santo', 'GO': 'Goiás',
        'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
        'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
        'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro',
        'RN': 'Rio Grande do Norte', 'RS': 'Rio Grande do Sul', 'RO': 'Rondônia',
        'RR': 'Roraima', 'SC': 'Santa Catarina', 'SP': 'São Paulo',
        'SE': 'Sergipe', 'TO': 'Tocantins'
    };
    return states[uf] || uf;
}

// ===== INICIALIZAÇÃO =====

// Carregar preferências salvas
document.addEventListener('DOMContentLoaded', function() {
    const savedContrast = localStorage.getItem('contrast');
    const savedFontSize = localStorage.getItem('fontSize');
    
    if (savedContrast) {
        changeContrast(savedContrast);
    }
    
    if (savedFontSize === 'large') {
        changeFontSize('large');
    }
    
    // Configurar evento de Enter para pesquisa
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    
    // Fechar menu de acessibilidade ao clicar fora
    document.addEventListener('click', function(e) {
        const menu = document.getElementById('accessibilityOptions');
        const button = document.querySelector('.accessibility-btn');
        
        if (menu && button && !menu.contains(e.target) && !button.contains(e.target)) {
            menu.classList.remove('show');
        }
    });
});
// Função para filtrar os cards de energia
function filterEnergyCards(searchTerm) {
    const energyCards = document.querySelectorAll('.energy-card');
    let foundResults = false;

    // Remove destaque anterior
    energyCards.forEach(card => {
        card.classList.remove('highlight');
    });

    // Remove mensagem de resultados anterior
    const existingMessage = document.getElementById('searchResultsMessage');
    if (existingMessage) {
        existingMessage.remove();
    }

    energyCards.forEach(card => {
        if (searchTerm === '') {
            // Mostra todos os cards se pesquisa estiver vazia
            card.style.display = 'flex';
            // Mostra também o expandable relacionado
            const expandable = card.nextElementSibling;
            if (expandable && expandable.classList.contains('expandable')) {
                expandable.style.display = 'block';
            }
            return;
        }

        const cardTitle = card.querySelector('h3').textContent.toLowerCase();
        const cardText = card.querySelector('p').textContent.toLowerCase();
        const cardTags = card.getAttribute('data-tags').toLowerCase();

        // Verifica se o termo de pesquisa está no título, texto ou tags
        if (cardTitle.includes(searchTerm) || 
            cardText.includes(searchTerm) || 
            cardTags.includes(searchTerm)) {
            
            card.style.display = 'flex';
            card.classList.add('highlight');
            
            // Mostra o expandable relacionado
            const expandable = card.nextElementSibling;
            if (expandable && expandable.classList.contains('expandable')) {
                expandable.style.display = 'block';
            }
            
            if (!foundResults) {
                foundResults = true;
                // Rolagem suave para o primeiro resultado
                setTimeout(() => {
                    card.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 600);
            }
        } else {
            card.style.display = 'none';
            // Esconde o expandable relacionado
            const expandable = card.nextElementSibling;
            if (expandable && expandable.classList.contains('expandable')) {
                expandable.style.display = 'none';
            }
        }
    });
// Função para limpar pesquisa
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.querySelector('.clear-search-btn');
    
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }
    
    // Mostra todos os cards E expandables novamente
    filterEnergyCards('');
}
    // Mostra mensagem se não encontrar resultados
    if (searchTerm !== '' && !foundResults) {
        showNoResultsMessage(searchTerm);
    }
}
console.log('Site de Energias Renováveis carregado com sucesso!');