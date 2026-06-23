
const container = document.getElementById('particles');
for (let i = 0; i < 20; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.cssText = `
    left: ${Math.random() * 100}%;
    animation-duration: ${8 + Math.random() * 12}s;
    animation-delay: ${Math.random() * 10}s;
    width: ${1 + Math.random() * 2}px;
    height: ${1 + Math.random() * 2}px;
    background: ${Math.random() > 0.5 ? '#00f5ff' : '#ff00e5'};
    box-shadow: 0 0 4px currentColor;
  `;
  container.appendChild(p);
}

// ── MENU MOBILE ───────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ── SCROLL REVEAL ──────────────────────
const revealEls = document.querySelectorAll('.reveal');

// pequeno delay escalonado para elementos vizinhos (cards na mesma grade)
revealEls.forEach((el) => {
  const siblings = Array.from(el.parentElement.children).filter((s) =>
    s.classList.contains('reveal')
  );
  const idx = siblings.indexOf(el);
  el.style.transitionDelay = `${Math.min(idx * 0.08, 0.32)}s`;
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  // fallback: navegadores sem suporte simplesmente mostram tudo
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

const sobre = document.querySelector('.sobre');

if (window.innerWidth <= 600) {
  sobre.textContent = 'Sobre';
}
// ── FORMULÁRIO DE CONTATO COM VALIDAÇÃO + FORMSPREE ──────────────

const form        = document.getElementById('contactForm');
const btnEnviar   = document.getElementById('btnEnviar');
const btnTexto    = document.getElementById('btnTexto');
const feedback    = document.getElementById('formFeedback');

// Regex de e-mail
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valida um campo e exibe mensagem de erro
function validarCampo(id, erroId, mensagem, condicao) {
  const campo = document.getElementById(id);
  const erro  = document.getElementById(erroId);
  if (condicao) {
    campo.classList.add('invalido');
    erro.textContent = mensagem;
    return false;
  }
  campo.classList.remove('invalido');
  erro.textContent = '';
  return true;
}

// Remove marcação de erro ao digitar
['nome','email','assunto','mensagem'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => {
    document.getElementById(id).classList.remove('invalido');
    document.getElementById('erro' + id.charAt(0).toUpperCase() + id.slice(1)).textContent = '';
  });
});

// Submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome     = document.getElementById('nome').value.trim();
  const email    = document.getElementById('email').value.trim();
  const assunto  = document.getElementById('assunto').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  // Validações
  const v1 = validarCampo('nome',     'erroNome',     'Por favor, informe seu nome.',           nome.length < 2);
  const v2 = validarCampo('email',    'erroEmail',    'Informe um e-mail válido.',              !regexEmail.test(email));
  const v3 = validarCampo('assunto',  'erroAssunto',  'Informe o assunto da mensagem.',         assunto.length < 3);
  const v4 = validarCampo('mensagem', 'erroMensagem', 'A mensagem deve ter ao menos 10 caracteres.', mensagem.length < 10);

  if (!v1 || !v2 || !v3 || !v4) return; // para aqui se tiver erro

  // Envia para o Formspree
  btnEnviar.disabled = true;
  btnTexto.textContent = 'Enviando...';
  feedback.className = 'form-feedback';
  feedback.textContent = '';

  try {
    const resposta = await fetch('https://formspree.io/f/mkolgbnj', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, assunto, mensagem })
    });

    if (resposta.ok) {
      feedback.textContent = '✓ Mensagem enviada com sucesso! Entrarei em contato em breve.';
      feedback.className = 'form-feedback sucesso';
      form.reset();
    } else {
      throw new Error('Falha no envio');
    }
  } catch {
    feedback.textContent = '✗ Erro ao enviar. Tente novamente ou use o e-mail diretamente.';
    feedback.className = 'form-feedback erro';
  } finally {
    btnEnviar.disabled = false;
    btnTexto.textContent = 'Enviar Mensagem';
  }
});