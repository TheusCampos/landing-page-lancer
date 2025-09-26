// Utilidades genéricas - comentários em Português
export function throttle(fn, wait = 100) { let last = 0; return (...args) => { const now = Date.now(); if (now - last >= wait) { last = now; fn(...args); } }; }
export function qs(sel, scope=document) { return scope.querySelector(sel); }
export function qsa(sel, scope=document) { return Array.from(scope.querySelectorAll(sel)); }