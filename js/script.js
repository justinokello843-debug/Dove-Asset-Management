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

  // mobile burger menu — class-based toggle (robust across resizes/orientation changes)
  const burger = document.querySelector('.burger');
  const mainMenu = document.querySelector('.main-menu');

  function closeMobileMenu(){
    mainMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', ()=>{
    const isOpen = mainMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  // close the menu after tapping a link, so it doesn't stay open over the section
  mainMenu.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', closeMobileMenu);
  });

  // if the viewport grows past the mobile breakpoint (e.g. rotating a tablet,
  // or resizing a desktop window back up), make sure the menu isn't stuck open
  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 1080) closeMobileMenu();
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

  // ===== Payments: Paystack Inline checkout (Card + M-Pesa) =====
  //
  // IMPORTANT — replace this with your real Paystack PUBLIC key before going live.
  // Find it in your Paystack Dashboard → Settings → API Keys & Webhooks.
  // Only ever put the PUBLIC key here. Never put your SECRET key in any file
  // that ships to the browser — it must stay on a private backend server.
  const PAYSTACK_PUBLIC_KEY = "pk_test_152dff0c74a9cadc3d511b25603e3492a723adad";

  // generates a unique-enough reference if the client didn't enter an invoice number
  function generateReference(prefix){
    return `${prefix}-${Date.now()}-${Math.floor(Math.random()*10000)}`;
  }

  function payWithPaystack({ emailInputId, amountInputId, refInputId, currency, channels, btn }){
    const email = document.getElementById(emailInputId)?.value.trim();
    const amountRaw = document.getElementById(amountInputId)?.value.trim();
    const refInput = refInputId ? document.getElementById(refInputId) : null;
    const amount = parseFloat(amountRaw);

    if(!email || !/^\S+@\S+\.\S+$/.test(email)){
      alert('Please enter a valid email address — Paystack needs it for the payment receipt.');
      return;
    }
    if(!amountRaw || isNaN(amount) || amount <= 0){
      alert('Please enter a valid amount.');
      return;
    }
    if(typeof PaystackPop === 'undefined'){
      alert('Paystack checkout could not load — check your internet connection and try again.');
      return;
    }
    if(PAYSTACK_PUBLIC_KEY.includes('REPLACE_WITH')){
      alert('This site is not yet connected to a live Paystack account. Add your Paystack public key in js/script.js (see README.md) to accept real payments.');
      return;
    }

    const reference = (refInput && refInput.value.trim()) || generateReference('DOVE');

    // brief loading state so the click doesn't feel like it went nowhere while
    // the Paystack iframe spins up
    const originalLabel = btn ? btn.textContent : null;
    if(btn){
      btn.disabled = true;
      btn.classList.add('is-loading');
      btn.textContent = 'Opening secure checkout…';
    }

    function resetButton(){
      if(btn){
        btn.disabled = false;
        btn.classList.remove('is-loading');
        btn.textContent = originalLabel;
      }
    }

    const handler = PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: Math.round(amount * 100), // Paystack expects the amount in the smallest currency unit
      currency: currency,
      ref: reference,
      channels: channels,
      metadata: {
        custom_fields: [
          { display_name: "Invoice / Reference", variable_name: "invoice_reference", value: reference }
        ]
      },
      callback: function(response){
        // response.reference confirms the charge was authorized by Paystack.
        // In production, verify this server-side (GET /transaction/verify/:reference
        // with your SECRET key) before treating the payment as confirmed —
        // never trust the client-side callback alone.
        resetButton();
        alert(`Payment received. Reference: ${response.reference}\n\nWe'll confirm this against our records shortly.`);
      },
      onClose: function(){
        // customer closed the popup without paying
        resetButton();
      }
    });

    // give the button a brief moment to visibly change before the iframe opens,
    // so the click feels acknowledged rather than instant/jarring
    setTimeout(()=>{ handler.openIframe(); }, 150);
  }

  const paystackCardBtn = document.getElementById('paystackCardBtn');
  if(paystackCardBtn){
    paystackCardBtn.addEventListener('click', ()=>{
      payWithPaystack({
        emailInputId: 'cardEmail',
        amountInputId: 'cardAmount',
        refInputId: 'cardRef',
        currency: document.getElementById('cardCurrency')?.value || 'KES',
        channels: ['card'],
        btn: paystackCardBtn
      });
    });
  }

  const paystackMpesaBtn = document.getElementById('paystackMpesaBtn');
  if(paystackMpesaBtn){
    paystackMpesaBtn.addEventListener('click', ()=>{
      payWithPaystack({
        emailInputId: 'mpesaEmail',
        amountInputId: 'mpesaAmount',
        refInputId: 'mpesaRef',
        currency: 'KES',
        channels: ['mobile_money'],
        btn: paystackMpesaBtn
      });
    });
  }

  // ===== Payments: PayPal placeholder =====
  // PayPal is a separate integration from Paystack — wire this button to the
  // PayPal Checkout SDK (https://developer.paypal.com/sdk/js/) when you're
  // ready to accept PayPal. See README.md for the general flow.
  document.querySelectorAll('.pay-panel[data-panel="paypal"] .pay-submit').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      alert('PayPal checkout isn\'t connected yet. See README.md for how to add the PayPal Checkout SDK.');
    });
  });

  // ===== Payments: copy bank details to clipboard =====
  document.querySelectorAll('.copy-btn').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      try{
        await navigator.clipboard.writeText(btn.dataset.copy);
        const original = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(()=>{ btn.textContent = original; btn.classList.remove('copied'); }, 1600);
      }catch(err){
        alert('Could not copy automatically — please copy manually: ' + btn.dataset.copy);
      }
    });
  });