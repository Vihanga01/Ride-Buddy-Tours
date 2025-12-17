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

  // BOOKING MODAL POPUP
  const bookingModal = document.getElementById('bookingModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('cancelBtn');
  const bookingForm = document.getElementById('bookingForm');
  const bookBtns = document.querySelectorAll('.book-btn');
  
  const openModal = (tourId, tourName, tourPrice) => {
    document.getElementById('tourId').value = tourId;
    document.getElementById('tourName').value = tourName;
    document.getElementById('tourPrice').value = tourPrice;
    document.getElementById('modalTourName').textContent = tourName;
    document.getElementById('modalTourPrice').textContent = '$' + tourPrice;
    bookingForm.reset();
    bookingModal.classList.add('active');
  };

  const closeModal = () => {
    bookingModal.classList.remove('active');
  };

  bookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tourId = btn.dataset.tourId;
      const tourName = btn.dataset.tourName;
      const tourPrice = btn.dataset.tourPrice;
      openModal(tourId, tourName, tourPrice);
    });
  });

  modalClose.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  // Handle booking form submission
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(bookingForm);
    
    try {
      const res = await fetch(bookingForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if(res.ok){
        alert('Booking inquiry sent! The tour guide will contact you soon.');
        closeModal();
        bookingForm.reset();
      } else {
        alert('Failed to send booking. Please try again.');
      }
    } catch(err){
      alert('Network error. Please try again.');
    }
  });

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
