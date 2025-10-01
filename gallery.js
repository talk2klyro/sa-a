let images = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let showFavoritesOnly = false;

// Fetch JSON
fetch('images.json')
  .then(res => res.json())
  .then(data => {
    images = data;
    renderGallery();
  });

// Render gallery
function renderGallery() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  let filteredImages = images;

  if (showFavoritesOnly) {
    filteredImages = images.filter(img => favorites.includes(img.id));
  }

  const searchQuery = document.getElementById('search').value.toLowerCase();
  if (searchQuery) {
    filteredImages = filteredImages.filter(img =>
      img.alt.toLowerCase().includes(searchQuery) ||
      img.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    );
  }

  filteredImages.forEach(img => {
    const imageEl = document.createElement('img');
    imageEl.src = img.src;
    imageEl.alt = img.alt;
    imageEl.dataset.id = img.id;

    // Favorite mark
    if (favorites.includes(img.id)) {
      imageEl.style.border = '3px solid red';
    }

    imageEl.addEventListener('click', () => openLightbox(img));
    imageEl.addEventListener('dblclick', () => toggleFavorite(img.id));

    gallery.appendChild(imageEl);
  });
}

// Favorite toggle
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderGallery();
}

// Search input
document.getElementById('search').addEventListener('input', renderGallery);

// Toggle favorites
document.getElementById('toggleFavorites').addEventListener('click', () => {
  showFavoritesOnly = !showFavoritesOnly;
  renderGallery();
});

// Toggle layout
document.getElementById('toggleLayout').addEventListener('click', () => {
  const gallery = document.getElementById('gallery');
  gallery.classList.toggle('carousel');
  gallery.classList.toggle('grid');
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox(img) {
  lightbox.classList.remove('hidden');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
}

document.getElementById('closeLightbox').addEventListener('click', () => {
  lightbox.classList.add('hidden');
});

// Developer link
document.getElementById('developerLink').addEventListener('dblclick', () => {
  alert("Hello! I'm the developer 🤔");
});
