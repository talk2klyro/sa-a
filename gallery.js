let allPhotos = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let layout = localStorage.getItem("layout") || "grid";
let showFavorites = false;

// Load images.json and build gallery
async function loadGallery() {
  const res = await fetch('images.json');
  allPhotos = await res.json();
  renderGallery();
}

// Render gallery
function renderGallery() {
  const gallery = document.getElementById('gallery');
  gallery.className = `gallery ${layout}`;
  gallery.innerHTML = "";

  const search = document.getElementById("search").value.toLowerCase();

  let photosToRender = allPhotos.filter(p =>
    (!showFavorites || favorites.includes(p.src)) &&
    (p.alt.toLowerCase().includes(search) ||
     p.tags.join(" ").toLowerCase().includes(search))
  );

  photosToRender.forEach(photo => {
    const div = document.createElement("div");
    div.className = "photo-container";
    div.innerHTML = `
      <img src="${photo.src}" alt="${photo.alt}">
      <div class="favorite ${favorites.includes(photo.src) ? 'active' : ''}">❤️</div>
    `;
    div.querySelector("img").addEventListener("click", () => openLightbox(photo));
    div.querySelector(".favorite").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(photo.src, div.querySelector(".favorite"));
    });
    gallery.appendChild(div);
  });
}

// Toggle favorite
function toggleFavorite(src, el) {
  if (favorites.includes(src)) {
    favorites = favorites.filter(f => f !== src);
    el.classList.remove("active");
  } else {
    favorites.push(src);
    el.classList.add("active");
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Lightbox
function openLightbox(photo) {
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  img.src = photo.src;
  img.alt = photo.alt;
  lb.classList.remove("hidden");
}
document.getElementById("closeLightbox").addEventListener("click", () => {
  document.getElementById("lightbox").classList.add("hidden");
});

// Fullscreen
document.getElementById("fullscreen").addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// Layout toggle
document.getElementById("toggleLayout").addEventListener("click", () => {
  layout = layout === "grid" ? "carousel" : "grid";
  localStorage.setItem("layout", layout);
  renderGallery();
});

// View favorites
document.getElementById("viewFavorites").addEventListener("click", () => {
  showFavorites = !showFavorites;
  renderGallery();
});

// Search filter
document.getElementById("search").addEventListener("input", renderGallery);

// Share buttons
document.querySelectorAll(".share").forEach(btn => {
  btn.addEventListener("click", () => {
    const url = window.location.href;
    const type = btn.dataset.type;
    let shareUrl = "";

    if (navigator.share) {
      navigator.share({ title: "Wedding Gallery", url });
      return;
    }

    switch(type) {
      case "whatsapp": shareUrl = `https://wa.me/?text=${encodeURIComponent(url)}`; break;
      case "facebook": shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
      case "twitter": shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`; break;
      case "copy":
        navigator.clipboard.writeText(url);
        alert("Link copied!");
        return;
    }
    window.open(shareUrl, "_blank");
  });
});

// Init
document.addEventListener("DOMContentLoaded", loadGallery);
