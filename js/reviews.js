// reviews.js
// Fetches reviews from Google Places Details endpoint and renders them.
// IMPORTANT: set your PLACE_ID and API_KEY below.

const PLACE_ID = 'REPLACE_WITH_PLACE_ID';
const API_KEY = 'REPLACE_WITH_API_KEY';

const placeIdDisplay = document.getElementById('placeIdDisplay');
const reviewsList = document.getElementById('reviewsList');
const reviewsNotice = document.getElementById('reviewsNotice');
const writeReviewBtn = document.getElementById('writeReviewBtn');

if(placeIdDisplay) placeIdDisplay.textContent = PLACE_ID;
if(writeReviewBtn && PLACE_ID){
  writeReviewBtn.href = `https://search.google.com/local/writereview?placeid=${PLACE_ID}`;
}

async function loadReviews(){
  if(!PLACE_ID || !API_KEY){
    if(reviewsNotice) reviewsNotice.textContent = 'Place ID or API key not configured. Please update js/reviews.js with your values.';
    return;
  }

  if(reviewsNotice) reviewsNotice.textContent = 'Loading reviews...';

  // Use Places Details endpoint
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=rating,reviews,formatted_address,name&key=${API_KEY}`;

  try{
    const res = await fetch(url);
    const data = await res.json();

    if(data.status !== 'OK'){
      reviewsNotice.textContent = 'Google API error: ' + (data.status || 'unknown');
      return;
    }

    const place = data.result;
    if(!place.reviews || place.reviews.length === 0){
      reviewsNotice.textContent = 'No public Google reviews found.';
      return;
    }

    reviewsNotice.textContent = '';
    reviewsList.innerHTML = '';

    place.reviews.forEach(r => {
      const el = document.createElement('article');
      el.className = 'testimonial';
      el.innerHTML = `
        <p>"${escapeHtml(r.text || '')}"</p>
        <cite>— ${escapeHtml(r.author_name || 'Anonymous')} ${r.rating? '· ' + r.rating + '⭐':''}</cite>
      `;
      reviewsList.appendChild(el);
    });

  } catch(err){
    reviewsNotice.textContent = 'Failed to load reviews. Check API key, Place ID, and network.';
  }
}

function escapeHtml(s){
  return s.replace(/[&<>"]+/g, function(match){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[match]);
  });
}

// Load when DOM ready
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', loadReviews);
} else {
  loadReviews();
}
