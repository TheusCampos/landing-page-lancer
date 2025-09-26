// Validações de formulário
(function(){
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('email');
    const isValid = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email.value);
    if (!isValid) {
      email.setAttribute('aria-invalid','true');
      alert('Por favor, insira um e-mail válido.');
      return;
    }
    email.removeAttribute('aria-invalid');
    alert('Inscrição realizada com sucesso!');
  });
})();