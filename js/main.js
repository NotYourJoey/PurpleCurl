// Video Background Handling
const videoSources = [
    'videos/hero-bg.mp4',
    'videos/hero-bg-2.mp4',
    'videos/hero-bg-3.mp4',
    'videos/hero-bg-4.mp4'
];

const videoFrames = document.querySelectorAll('.video-frame');
const prevButton = document.querySelector('.prev-video');
const nextButton = document.querySelector('.next-video');

// Initialize starting indices for each frame
let currentIndices = [0, 1, 2];
let isTransitioning = false;

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to get next set of indices with frame shuffling
function getNextIndices(direction) {
    let newIndices;
    if (direction === 'shuffle') {
        // Get all available indices
        const allIndices = Array.from({length: videoSources.length}, (_, i) => i);
        // Shuffle them and take the first three
        newIndices = shuffleArray([...allIndices]).slice(0, 3);
    } else {
        newIndices = currentIndices.map(index => {
            return (index + direction + videoSources.length) % videoSources.length;
        });
    }
    
    // Randomly reorder the frame positions 50% of the time
    if (Math.random() < 0.5) {
        shuffleArray(newIndices);
    }
    
    return newIndices;
}

// Function to prepare next video in wrapper
function prepareNextVideo(wrapper, videoSrc) {
    const video = wrapper.querySelector('video');
    const source = video.querySelector('source');
    source.src = videoSrc;
    video.load();
    return video.play();
}

// Function to crossfade between videos
async function crossfadeVideos(frame, nextVideoSrc) {
    const wrappers = frame.querySelectorAll('.video-wrapper');
    const activeWrapper = frame.querySelector('.video-wrapper.active');
    const inactiveWrapper = frame.querySelector('.video-wrapper:not(.active)');
    
    // Prepare the next video
    try {
        await prepareNextVideo(inactiveWrapper, nextVideoSrc);
        
        // Start crossfade
        inactiveWrapper.classList.add('active');
        activeWrapper.classList.add('fade-out');
        
        // Wait for transition to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Clean up
        activeWrapper.classList.remove('active', 'fade-out');
    } catch (error) {
        console.log("Video transition failed:", error);
    }
}

// Function to update videos with crossfade
async function updateVideos(indices) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const transitions = videoFrames.map((frame, frameIndex) => {
        return crossfadeVideos(frame, videoSources[indices[frameIndex]]);
    });
    
    try {
        await Promise.all(transitions);
        currentIndices = indices;
    } catch (error) {
        console.log("Video update failed:", error);
    }
    
    isTransitioning = false;
}

// Function to change videos
function changeVideos(direction) {
    if (isTransitioning) return;
    const newIndices = getNextIndices(direction);
    updateVideos(newIndices);
}

// Auto shuffle every 20 seconds with random positioning
let autoShuffleInterval = setInterval(() => {
    changeVideos('shuffle');
}, 20000);

// Event listeners for manual navigation
if (prevButton && nextButton) {
    prevButton.addEventListener('click', () => {
        if (!isTransitioning) {
            changeVideos(-1);
            // Reset auto shuffle timer
            clearInterval(autoShuffleInterval);
            autoShuffleInterval = setInterval(() => {
                changeVideos('shuffle');
            }, 20000);
        }
    });

    nextButton.addEventListener('click', () => {
        if (!isTransitioning) {
            changeVideos(1);
            // Reset auto shuffle timer
            clearInterval(autoShuffleInterval);
            autoShuffleInterval = setInterval(() => {
                changeVideos('shuffle');
            }, 20000);
        }
    });
}

// Handle video quality
function setVideoQuality(video) {
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'auto');
    
    // Set video properties for best quality
    if (video.videoWidth) {
        video.style.width = '100%';
        video.style.height = '100%';
    }
}

// Initialize video quality for all frames
document.querySelectorAll('.hero-video').forEach(video => {
    setVideoQuality(video);
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }
    });
});

// Shopping Cart Functionality
const cartItems = [];
const shopNowButtons = document.querySelectorAll('.shop-now-btn');

shopNowButtons.forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('p').textContent;
        
        cartItems.push({
            name: productName,
            price: productPrice
        });

        // Show notification
        showNotification(`${productName} added to cart!`);
    });
});

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#3F154B';
    notification.style.color = '#FEFDFF';
    notification.style.padding = '1rem 2rem';
    notification.style.borderRadius = '5px';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Form Submission (guarded for pages without contact form)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });

        // Show success message
        showNotification('Message sent successfully!');

        // Reset form
        this.reset();
    });
}

// Helper to bind WhatsApp click to a card button
function bindWhatsApp(btn, card) {
    if (!btn || btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
        const productName = card.querySelector('h3')?.textContent || 'Purple Curl product';
        const productPrice = card.querySelector('.price')?.textContent || '';
        const productImage = card.querySelector('img')?.src || '';
        
        // Create WhatsApp message with image link
        const message = `Hi Purple Curl, I'm interested in ${productName}${productPrice ? ' priced at ' + productPrice : ''}. You can see the product here: ${productImage}`;
        const phone = '233558533072';
        
        // Open WhatsApp with message
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    });
}

// ===== Store Search & Sort =====
const searchInput = document.querySelector('.store-search');
const sortSelect = document.querySelector('.store-sort');

if (searchInput || sortSelect) {
    const allCards = Array.from(document.querySelectorAll('.shop-grid .product-card'));

    const filterAndSort = () => {
        const term = (searchInput ? searchInput.value.trim().toLowerCase() : '');
        let filtered = allCards.filter(card => {
            const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
            return name.includes(term);
        });

        const sortValue = sortSelect ? sortSelect.value : 'default';
        if (sortValue === 'price-asc' || sortValue === 'price-desc') {
            const dir = sortValue === 'price-asc' ? 1 : -1;
            filtered.sort((a, b) => {
                const aPrice = parseFloat(a.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));
                const bPrice = parseFloat(b.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));
                return (aPrice - bPrice) * dir;
            });
        }

        const grid = document.querySelector('.shop-grid');
        if (!grid) return;
        // Clear and reappend
        grid.innerHTML = '';
        filtered.forEach(card => grid.appendChild(card));
    };

    if (searchInput) searchInput.addEventListener('input', filterAndSort);
    if (sortSelect) sortSelect.addEventListener('change', filterAndSort);
}

// ===== New Arrivals – horizontal carousel controls =====
(function () {
    // Select elements
    const productGrid = document.querySelector('.product-scroll-container .product-grid');
    const prevBtn = document.querySelector('.product-scroll-container .scroll-button.prev');
    const nextBtn = document.querySelector('.product-scroll-container .scroll-button.next');

    // Abort if markup doesn’t exist (failsafe)
    if (!productGrid || !prevBtn || !nextBtn) return;

    // Helper – work out one-card scroll distance (card width + gap)
    const getScrollDistance = () => {
        const firstCard = productGrid.querySelector('.product-card');
        if (!firstCard) return 0;
        const cardStyles = window.getComputedStyle(firstCard);
        const cardWidth = firstCard.getBoundingClientRect().width;
        const gap = parseFloat(cardStyles.marginRight || 0) || 40; // fallback gap 40px (≈2.5rem)
        return cardWidth + gap;
    };

    const scrollByCard = (direction = 1) => {
        const distance = getScrollDistance();
        if (!distance) return;
        productGrid.scrollBy({ left: distance * direction, behavior: 'smooth' });
    };

    prevBtn.addEventListener('click', () => scrollByCard(-1));
    nextBtn.addEventListener('click', () => scrollByCard(1));
})();
// ===== End Arrivals carousel ===== 

// removed shop carousel logic

// ===== Shop section scrolling =====
(function () {
    document.querySelectorAll('.shop-category .product-scroll-container').forEach(container => {
        const grid = container.querySelector('.product-grid');
        const prevBtn = container.querySelector('.scroll-button.prev');
        const nextBtn = container.querySelector('.scroll-button.next');
        if (!grid || !prevBtn || !nextBtn) return;

        const getDistance = () => {
            const firstCard = grid.querySelector('.product-card');
            if (!firstCard) return 0;
            const cardStyles = window.getComputedStyle(firstCard);
            const cardWidth = firstCard.getBoundingClientRect().width;
            const gap = parseFloat(cardStyles.marginRight || 0) || 32;
            return cardWidth + gap;
        };

        const scrollGrid = dir => {
            const dist = getDistance();
            if (!dist) return;
            grid.scrollBy({ left: dist * dir, behavior: 'smooth' });
        };

        prevBtn.addEventListener('click', () => scrollGrid(-1));
        nextBtn.addEventListener('click', () => scrollGrid(1));
    });
})();

// ===== Populate shop showroom grids dynamically =====
(function () {
    console.log('Shop grid population script starting...');
    const clothesGrid = document.querySelector('.clothes-grid');
    const fabricGrid = document.querySelector('.fabric-grid');
    console.log('Found grids:', { clothesGrid: !!clothesGrid, fabricGrid: !!fabricGrid });
    if (!clothesGrid && !fabricGrid) {
        console.log('No shop grids found, exiting...');
        return; // run only on shop page
    }

    const createCard = (imgPath, title, priceText = '') => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${imgPath}" alt="${title}" />
                <button class="quick-add">Order via WhatsApp</button>
            </div>
            <div class="product-info">
                <h3>${title}</h3>
                <div class="price">${priceText}</div>
            </div>`;
        // Bind click for the new button
        bindWhatsApp(card.querySelector('.quick-add'), card);
        return card;
    };

    // Catchy clothing names
    const clothingNames = [
        'Elegant Summer Dress', 'Modern Blazer', 'Casual Comfort Set', 'Statement Piece',
        'Urban Collection', 'Designer Series', 'Weekend Comfort', 'Signature Collection',
        'Timeless Pieces', 'Seasonal Must-Haves', 'Designer Edit', 'Urban Style',
        'Classic Elegance', 'Contemporary Chic', 'Fashion Forward', 'Style Statement',
        'Trending Look', 'Premium Collection'
    ];

    // Catchy fabric names
    const fabricNames = [
        'Silk Satin', 'Organic Cotton', 'Linen Blend', 'Wool Tweed', 'Brocade',
        'Chiffon', 'Bamboo Rayon', 'Velvet Touch', 'Cashmere Blend', 'Silk Crepe',
        'Cotton Poplin', 'Linen Canvas', 'Wool Flannel', 'Silk Organza', 'Cotton Voile',
        'Linen Twill', 'Wool Gabardine', 'Silk Charmeuse', 'Cotton Jersey'
    ];

    // --- Clothes (gallery images 1..9 for 3x3 grid) ---
    if (clothesGrid) {
        clothesGrid.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const imgFile = `../images/gallery-img-${i}.jpeg`;
            const title = clothingNames[i - 1] || `Gallery Look ${i}`;
            const price = `₵${((99 + i) * 12).toFixed(2)}`;
            const card = createCard(imgFile, title, price);
            
            // Add error handling for image loading
            const img = card.querySelector('img');
            img.onerror = function() {
                console.error(`Failed to load image: ${imgFile}`);
                this.style.display = 'none';
                this.parentElement.style.backgroundColor = '#f0f0f0';
                this.parentElement.innerHTML += '<div style="padding: 20px; text-align: center; color: #666;">Image not available</div>';
            };
            img.onload = function() {
                console.log(`Successfully loaded: ${imgFile}`);
            };
            
            clothesGrid.appendChild(card);
        }
    }

    // --- Fabric (fabric images 1..9 for 3x3 grid) ---
    if (fabricGrid) {
        fabricGrid.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const imgFile = `../images/fabric-${i}.jpeg`;
            const title = fabricNames[i - 1] || `Fabric ${i.toString().padStart(2, '0')}`;
            const price = `₵${((19 + i) * 12).toFixed(2)} / yd`;
            const card = createCard(imgFile, title, price);
            
            // Add error handling for image loading
            const img = card.querySelector('img');
            img.onerror = function() {
                console.error(`Failed to load image: ${imgFile}`);
                this.style.display = 'none';
                this.parentElement.style.backgroundColor = '#f0f0f0';
                this.parentElement.innerHTML += '<div style="padding: 20px; text-align: center; color: #666;">Image not available</div>';
            };
            img.onload = function() {
                console.log(`Successfully loaded: ${imgFile}`);
            };
            
            fabricGrid.appendChild(card);
        }
    }
})(); 