// Small interactions for the homepage
(function(){
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const yearEl = document.getElementById('year');
  const addTourBtn = document.getElementById('addTourBtn');
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');

  if(yearEl) yearEl.textContent = new Date().getFullYear();

  if(menuToggle && mainNav){
    menuToggle.addEventListener('click', ()=>{
      const isVisible = getComputedStyle(mainNav).display !== 'none';
      mainNav.style.display = isVisible ? 'none' : 'flex';
    });
  }

  if(addTourBtn){
    addTourBtn.addEventListener('click', ()=>{
      alert('To add a tour, go to the admin or contact page.');
    });
  }

  if(searchBtn && searchInput){
    searchBtn.addEventListener('click', ()=>{
      const q = searchInput.value.trim();
      if(!q) return alert('Try searching for a destination or tag.');
      alert('Search for: ' + q + '\n(Implement search backend or client filtering next.)');
    });
  }

  // Contact form submit (works with Formspree or any POST endpoint)
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const notice = document.getElementById('formNotice');
      if(notice) notice.textContent = 'Sending...';

      const url = contactForm.action;
      const formData = new FormData(contactForm);

      try{
        const res = await fetch(url, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if(res.ok){
          if(notice) notice.textContent = 'Message sent — we will contact you soon.';
          contactForm.reset();
        } else {
          const data = await res.json().catch(()=>null);
          if(notice) notice.textContent = data && data.error ? data.error : 'Failed to send message. Try again later.';
        }
      } catch(err){
        if(notice) notice.textContent = 'Network error. Please try again.';
      }
    });
  }
})();
