// header shadow on scroll
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
  });

  // reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  }, {threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // mobile burger -> simple toggle of mega menus stacked (basic fallback)
  const burger = document.querySelector('.burger');
  const mainMenu = document.querySelector('.main-menu');
  burger.addEventListener('click', ()=>{
    const open = mainMenu.style.display === 'flex';
    mainMenu.style.display = open ? 'none' : 'flex';
    mainMenu.style.flexDirection = 'column';
    mainMenu.style.position='absolute';
    mainMenu.style.top='100%';
    mainMenu.style.left='0';
    mainMenu.style.right='0';
    mainMenu.style.background='var(--ink)';
    mainMenu.style.padding='10px 20px 20px';
  });

  // ===== Payments: tab switching =====
  const payTabs = document.querySelectorAll('.pay-tab');
  const payPanels = document.querySelectorAll('.pay-panel');
  payTabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
      payTabs.forEach(t=>{ t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      payPanels.forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected','true');
      document.querySelector(`.pay-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
    });
  });

  // ===== Payments: placeholder submit handlers =====
  // NOTE: These are UI placeholders only. No payment is actually processed here.
  // Wire each button to your real gateway's checkout call (Stripe/Flutterwave/
  // Paystack Elements, PayPal Buttons SDK, or Safaricom Daraja STK push) on a
  // secure backend before going live. See README.md for details.
  document.querySelectorAll('.pay-submit').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      alert('This is a demo checkout button. Connect a real payment gateway (see README.md) before accepting live payments.');
    });
  });