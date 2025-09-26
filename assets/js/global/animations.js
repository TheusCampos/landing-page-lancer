// Efeitos globais e interações
// Navbar ao rolar
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  if (window.scrollY > 50) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
});
// Rolagem suave de âncoras
Array.from(document.querySelectorAll('a[href^="#"]')).forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
  });
});
// IntersectionObserver: revela seções
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // Quando o elemento entra no viewport, adiciona classe visível
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Uma vez visível, não precisamos observar novamente (melhora performance)
      io.unobserve(entry.target);
    }
  });
}, {
  // Antecipar o disparo em 10% antes de entrar totalmente no viewport
  rootMargin: '0px 0px -10% 0px',
  threshold: 0.15
});
const animatables = Array.from(document.querySelectorAll('[data-animate]'));
animatables.forEach(el => io.observe(el));

// Fallback: garantir que elementos já visíveis no carregamento recebam a classe
// Útil se o observer não disparar imediatamente ou em browsers antigos
(function ensureInitialVisibility(){
  try {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    animatables.forEach(el => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < vh * 0.9 && rect.bottom > 0; // margem de 10%
      if (inView) el.classList.add('is-visible');
    });
  } catch(e) { console.debug('[animations] initial visibility check error', e); }
})();
window.addEventListener('load', () => {
  // Reforço no onload para casos de fontes/estilos que mudam o layout
  try {
    animatables.forEach(el => {
      if (getComputedStyle(el).opacity === '0') {
        // Se ainda estiver invisível, força a classe
        el.classList.add('is-visible');
      }
    });
  } catch(e) { console.debug('[animations] load visibility check error', e); }
});

// Controle do vídeo de fundo (autoplay em mobile precisa de muted)
(function(){
  const video = document.getElementById('bgVideo');
  if (!video) return;
  
  // Garante autoplay em mobile e qualidade original
  video.muted = true; // garante autoplay
  
  // Define uma função idempotente para ajustar a velocidade do vídeo
  // Comentário (PT-BR): reduzimos a velocidade para um ritmo mais suave, sem alterar a qualidade
  const desiredRate = 0.65;
  const setSmoothPlaybackRate = () => {
    try {
      if (video.playbackRate !== desiredRate) {
        video.playbackRate = desiredRate;
      }
    } catch(e) {
      console.debug('[animations] playbackRate ajuste falhou', e);
    }
  };

  // Tenta reproduzir o vídeo e em seguida ajusta o playbackRate
  video.play().then(() => setSmoothPlaybackRate()).catch(() => { /* caso bloqueie, mostramos overlay */ });

  // Reaplica o rate em eventos comuns para garantir consistência entre navegadores
  video.addEventListener('loadedmetadata', setSmoothPlaybackRate);
  video.addEventListener('canplay', setSmoothPlaybackRate);
  video.addEventListener('play', setSmoothPlaybackRate);
  video.addEventListener('ratechange', () => { if (video.playbackRate !== desiredRate) setSmoothPlaybackRate(); });
})();

// =========================
// GSAP animations avançadas
// =========================
(function gsapAnimations(){
  if (typeof gsap === 'undefined') return; // GSAP carregado via CDN
  if (gsap && gsap.registerPlugin && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ===== CONFIGURAÇÕES GLOBAIS =====
  // Configuração de performance e suavidade
  gsap.config({ 
    nullTargetWarn: false,
    trialWarn: false,
    force3D: true, // Força aceleração de hardware
    autoSleep: 60 // Pausa animações inativas após 60 segundos
  });

  // Configurações de performance para ScrollTrigger
  ScrollTrigger.config({
    limitCallbacks: true, // Limita callbacks para melhor performance
    ignoreMobileResize: true // Ignora redimensionamento em mobile
  });

  // ===== ANIMAÇÃO INICIAL DO HERO =====
  const hero = document.querySelector('.hero-content');
  if (hero) {
    // Timeline complexa para entrada do hero
    const heroTl = gsap.timeline({ delay: 0.3 });
    
    heroTl
      .from(hero.querySelector('h1'), {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      })
      .from(hero.querySelector('p'), {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.6')
      .from(hero.querySelector('.btn'), {
        opacity: 0,
        y: 20,
        scale: 0.9,
        duration: 0.6,
        ease: 'back.out(1.7)'
      }, '-=0.4');
  }

  // ===== ANIMAÇÕES EM LOTE COM SCROLLTRIGGER.BATCH =====
  // Animação coordenada para títulos de seção
  ScrollTrigger.batch('.section-title', {
    onEnter: (elements) => {
      gsap.from(elements, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        overwrite: 'auto'
      });
    },
    start: 'top 85%',
    once: true
  });

  // Animação em lote para cards e elementos de conteúdo
  ScrollTrigger.batch('.timeline-item, .engine-card, .card', {
    onEnter: (elements) => {
      gsap.from(elements, {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        overwrite: 'auto'
      });
    },
    start: 'top 90%',
    once: true
  });

  // ===== ANIMAÇÃO AVANÇADA PARA SEÇÃO DE HISTÓRIA =====
  const historySection = document.querySelector('#history');
  if (historySection) {
    // Timeline com pinning suave para a seção de história
    const historyTl = gsap.timeline({
      scrollTrigger: {
        trigger: historySection,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        anticipatePin: 1
      }
    });

    // Animação paralax sutil para elementos da timeline
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
      gsap.to(item, {
        y: -30 * (index % 2 === 0 ? 1 : -1),
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
          ease: 'none'
        }
      });
    });
  }

  // ===== ANIMAÇÃO AVANÇADA PARA SEÇÃO DE MOTOR =====
  const engineSection = document.querySelector('#engine');
  if (engineSection) {
    // Timeline complexa para revelar especificações do motor
    const engineTl = gsap.timeline({
      scrollTrigger: {
        trigger: engineSection,
        start: 'top 70%',
        end: 'bottom 30%',
        toggleActions: 'play none none reverse'
      }
    });

    engineTl
      .from('.engine-specs h3', {
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: 'power2.out'
      })
      .from('.engine-specs .spec-item', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1
      }, '-=0.4')
      .from('.engine-image', {
        opacity: 0,
        scale: 0.8,
        rotation: 5,
        duration: 1,
        ease: 'back.out(1.7)'
      }, '-=0.6');
  }

  // ===== EFEITO MAGNÉTICO AVANÇADO PARA BOTÕES =====
  const magneticButtons = document.querySelectorAll('.btn, .cta-button');
  magneticButtons.forEach(btn => {
    let hover = false;
    const strength = 20;
    
    const reset = () => {
      gsap.to(btn, { 
        x: 0, 
        y: 0, 
        duration: 0.6, 
        ease: 'elastic.out(1, 0.3)' 
      });
    };

    btn.addEventListener('mouseenter', () => {
      hover = true;
      gsap.to(btn, { 
        scale: 1.05, 
        duration: 0.3, 
        ease: 'power2.out' 
      });
    });

    btn.addEventListener('mouseleave', () => {
      hover = false;
      reset();
      gsap.to(btn, { 
        scale: 1, 
        duration: 0.3, 
        ease: 'power2.out' 
      });
    });

    btn.addEventListener('mousemove', (e) => {
      if (!hover) return;
      const rect = btn.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      
      gsap.to(btn, { 
        x: relX * strength, 
        y: relY * strength, 
        duration: 0.3, 
        ease: 'power2.out' 
      });
    });

    // Efeito ripple avançado
    btn.addEventListener('click', (e) => {
      const circle = document.createElement('span');
      circle.className = 'btn-ripple';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.5;
      
      circle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size/2}px;
        top: ${e.clientY - rect.top - size/2}px;
        background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
      `;
      
      btn.appendChild(circle);
      
      gsap.fromTo(circle, 
        { scale: 0, opacity: 0.6 }, 
        { 
          scale: 1, 
          opacity: 0, 
          duration: 0.8, 
          ease: 'power2.out',
          onComplete: () => circle.remove() 
        }
      );
    });
  });

  // ===== ANIMAÇÃO DE REVELAÇÃO SUAVE PARA IMAGENS =====
  ScrollTrigger.batch('img, .image-container', {
    onEnter: (elements) => {
      gsap.from(elements, {
        opacity: 0,
        scale: 1.1,
        duration: 1.2,
        ease: 'power2.out',
        stagger: 0.2,
        overwrite: 'auto'
      });
    },
    start: 'top 85%',
    once: true
  });

  // ===== ANIMAÇÃO DE CONTADOR PARA NÚMEROS/ESTATÍSTICAS =====
  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-counter')) || 0;
    const obj = { value: 0 };
    
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(obj, {
          value: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = Math.round(obj.value);
          }
        });
      },
      once: true
    });
  });

  // ===== SISTEMA DE LAZY LOADING PARA ANIMAÇÕES =====
  const lazyAnimations = new Map();
  
  // Função para criar animações sob demanda
  function createLazyAnimation(element, animationConfig) {
    if (lazyAnimations.has(element)) return;
    
    const animation = gsap.from(element, animationConfig);
    lazyAnimations.set(element, animation);
    return animation;
  }

  // Observer para lazy loading de animações pesadas
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        // Animações específicas para diferentes tipos de elementos
        if (element.classList.contains('heavy-animation')) {
          createLazyAnimation(element, {
            opacity: 0,
            scale: 0.8,
            rotation: 10,
            duration: 1.5,
            ease: 'elastic.out(1, 0.3)'
          });
        }
        
        lazyObserver.unobserve(element);
      }
    });
  }, { 
    rootMargin: '50px',
    threshold: 0.1 
  });

  // Aplicar lazy loading a elementos pesados
  document.querySelectorAll('.heavy-animation').forEach(el => {
    lazyObserver.observe(el);
  });

  // ===== OTIMIZAÇÃO DE PERFORMANCE BASEADA EM DEVICE =====
  const isLowEndDevice = () => {
    return navigator.hardwareConcurrency <= 2 || 
           navigator.deviceMemory <= 2 ||
           /Android.*Chrome\/[.0-9]*\s/.test(navigator.userAgent);
  };

  const isMobile = () => {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const isSmallScreen = () => {
    return window.innerWidth <= 480;
  };

  // Configurações responsivas
  const applyResponsiveConfig = () => {
    if (isSmallScreen()) {
      // Telas muito pequenas - animações mínimas
      gsap.globalTimeline.timeScale(0.5);
      ScrollTrigger.config({ 
        limitCallbacks: true,
        anticipatePin: 0,
        ignoreMobileResize: true
      });
      
      // Desabilitar efeitos magnéticos
      document.querySelectorAll('.cta-button, .btn').forEach(btn => {
        btn.style.transform = 'none';
        btn.removeEventListener('mouseenter', () => {});
        btn.removeEventListener('mouseleave', () => {});
      });
      
    } else if (isMobile()) {
      // Mobile - animações reduzidas
      gsap.globalTimeline.timeScale(0.6);
      ScrollTrigger.config({ 
        limitCallbacks: true,
        anticipatePin: 1
      });
      
    } else if (isLowEndDevice()) {
      // Dispositivos menos potentes
      gsap.globalTimeline.timeScale(0.7);
      ScrollTrigger.config({ 
        limitCallbacks: true,
        anticipatePin: 0 
      });
    }
  };

  // Aplicar configurações iniciais
  applyResponsiveConfig();

  // Reconfigurar em mudanças de orientação/resize
  window.addEventListener('resize', debounce(() => {
    applyResponsiveConfig();
    ScrollTrigger.refresh();
  }, 250));

  // Função debounce para otimizar resize
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ===== REFRESH SCROLLTRIGGER APÓS CARREGAMENTO =====
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    
    // Cleanup de animações não utilizadas após carregamento
    setTimeout(() => {
      gsap.globalTimeline.clear();
    }, 5000);
  });

  // ===== OTIMIZAÇÃO PARA REDUÇÃO DE MOVIMENTO =====
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.globalTimeline.timeScale(0.3);
    ScrollTrigger.config({ 
      limitCallbacks: true,
      anticipatePin: 0 
    });
    
    // Desabilitar animações complexas
    document.querySelectorAll('.timeline-item, .engine-card').forEach(el => {
      el.style.transform = 'none';
      el.style.opacity = '1';
    });
  }

  // ===== CLEANUP E GERENCIAMENTO DE MEMÓRIA =====
  window.addEventListener('beforeunload', () => {
    ScrollTrigger.killAll();
    gsap.killTweensOf('*');
    lazyAnimations.clear();
  });

  // Pausar animações quando a aba não está ativa
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
    }
  });

})();