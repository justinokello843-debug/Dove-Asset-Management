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