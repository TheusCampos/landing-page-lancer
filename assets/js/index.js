// index.js - ponto único de entrada JS
// Comentários em Português: Mantemos módulos separados e importados aqui para melhor manutenção

console.debug('index.js carregado');

// Globais
import './global/utils.js';
import './global/animations.js';
import './global/validation.js';
import './global/api.js';

// Páginas
import './pages/home.js';

// Seções específicas
import './pages/partials/tech-specs.js';