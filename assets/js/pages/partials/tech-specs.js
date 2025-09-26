/**
 * Animações GSAP para a Seção de Ficha Técnica
 * Implementa animações suaves e profissionais para a apresentação das especificações
 */

// Registra plugins necessários
gsap.registerPlugin(ScrollTrigger);

/**
 * Inicializa todas as animações da seção de ficha técnica
 */
function initTechSpecsAnimations() {
  // Verifica se a seção existe na página
  const techSpecsSection = document.querySelector('.tech-specs-section');
  if (!techSpecsSection) return;

  // Configurações responsivas
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth <= 992;

  // Timeline principal para coordenar todas as animações
  const mainTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.tech-specs-section',
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      onEnter: () => console.log('Ficha técnica: animações iniciadas'),
      onLeave: () => console.log('Ficha técnica: animações finalizadas')
    }
  });

  // Animação do título da seção
  animateSectionTitle(mainTimeline, isMobile);
  
  // Animação da tabela de especificações
  animateSpecsTable(mainTimeline, isMobile);
  
  // Animação da imagem técnica
  animateTechImage(mainTimeline, isMobile);
  
  // Efeitos de hover para interatividade
  setupHoverEffects();
  
  // Animações de entrada staggered para as linhas da tabela
  setupStaggeredRowAnimations();
}

/**
 * Anima o título da seção com efeito de fade e scale
 */
function animateSectionTitle(timeline, isMobile) {
  const title = document.querySelector('.tech-specs-section .section-title');
  if (!title) return;

  timeline.fromTo(title, 
    {
      opacity: 0,
      y: isMobile ? 30 : 50,
      scale: 0.8
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: isMobile ? 0.8 : 1.2,
      ease: 'power3.out'
    }
  );

  // Animação da linha decorativa do título
  const titleLine = title.querySelector('::after');
  timeline.fromTo(title, 
    {
      '--line-width': '0%'
    },
    {
      '--line-width': '100%',
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5'
  );
}

/**
 * Anima a tabela de especificações com efeito de slide
 */
function animateSpecsTable(timeline, isMobile) {
  const table = document.querySelector('.tech-specs-table');
  if (!table) return;

  // Animação do container da tabela
  timeline.fromTo(table,
    {
      opacity: 0,
      x: isMobile ? -30 : -50,
      rotationY: isMobile ? 0 : -15
    },
    {
      opacity: 1,
      x: 0,
      rotationY: 0,
      duration: isMobile ? 0.8 : 1.0,
      ease: 'power3.out'
    }, '-=0.3'
  );

  // Animação do cabeçalho da tabela
  const header = document.querySelector('.specs-header');
  if (header) {
    timeline.fromTo(header,
      {
        opacity: 0,
        y: -20
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.5'
    );
  }
}

/**
 * Anima a imagem técnica com efeito 3D
 */
function animateTechImage(timeline, isMobile) {
  const imageContainer = document.querySelector('.tech-specs-image');
  if (!imageContainer) return;

  timeline.fromTo(imageContainer,
    {
      opacity: 0,
      x: isMobile ? 30 : 50,
      scale: 0.9,
      rotationY: isMobile ? 0 : 15
    },
    {
      opacity: 1,
      x: 0,
      scale: 1,
      rotationY: 0,
      duration: isMobile ? 0.8 : 1.2,
      ease: 'power3.out'
    }, '-=0.8'
  );

  // Adiciona classe para CSS animations
  timeline.call(() => {
    imageContainer.classList.add('animate-in');
  });
}

/**
 * Configura animações staggered para as linhas da tabela
 */
function setupStaggeredRowAnimations() {
  const rows = document.querySelectorAll('.spec-row');
  if (rows.length === 0) return;

  // Animação sequencial das linhas
  gsap.fromTo(rows,
    {
      opacity: 0,
      x: -30,
      scale: 0.95
    },
    {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.specs-body',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      onComplete: () => {
        // Adiciona classes para CSS animations
        rows.forEach(row => row.classList.add('animate-in'));
      }
    }
  );
}

/**
 * Configura efeitos de hover interativos
 */
function setupHoverEffects() {
  const rows = document.querySelectorAll('.spec-row');
  const image = document.querySelector('.tech-specs-image img');

  // Efeitos de hover nas linhas da tabela
  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) { // Apenas em desktop
        gsap.to(row, {
          scale: 1.02,
          x: 5,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });

    row.addEventListener('mouseleave', () => {
      if (window.innerWidth > 768) {
        gsap.to(row, {
          scale: 1,
          x: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  });

  // Efeito de hover na imagem
  if (image) {
    image.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) {
        gsap.to(image, {
          scale: 1.05,
          rotationY: 5,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    });

    image.addEventListener('mouseleave', () => {
      if (window.innerWidth > 768) {
        gsap.to(image, {
          scale: 1,
          rotationY: 0,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    });
  }
}

/**
 * Animação de entrada com parallax suave
 */
function setupParallaxEffect() {
  const techSection = document.querySelector('.tech-specs-section');
  if (!techSection || window.innerWidth <= 768) return;

  gsap.to(techSection, {
    yPercent: -10,
    ease: 'none',
    scrollTrigger: {
      trigger: techSection,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
}

/**
 * Cleanup das animações quando necessário
 */
function cleanupTechSpecsAnimations() {
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger && trigger.trigger.closest('.tech-specs-section')) {
      trigger.kill();
    }
  });
}

/**
 * Reinicializa animações em resize responsivo
 */
function handleTechSpecsResize() {
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const debouncedResize = debounce(() => {
    cleanupTechSpecsAnimations();
    setTimeout(initTechSpecsAnimations, 100);
  }, 250);

  window.addEventListener('resize', debouncedResize);
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  initTechSpecsAnimations();
  setupParallaxEffect();
  handleTechSpecsResize();
});

// Reinicialização em mudanças de orientação mobile
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    cleanupTechSpecsAnimations();
    initTechSpecsAnimations();
  }, 300);
});

// Export para uso em outros módulos se necessário
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initTechSpecsAnimations,
    cleanupTechSpecsAnimations
  };
}