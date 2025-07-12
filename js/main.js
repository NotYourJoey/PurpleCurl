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

// Form Submission
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', function(e) {
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