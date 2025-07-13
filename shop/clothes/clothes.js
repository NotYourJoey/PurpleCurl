// All Clothes Page JavaScript

// Catchy clothing names for all 18 images
const allClothingNames = [
    'Elegant Summer Dress', 'Modern Blazer', 'Casual Comfort Set', 'Statement Piece',
    'Urban Collection', 'Designer Series', 'Weekend Comfort', 'Signature Collection',
    'Timeless Pieces', 'Seasonal Must-Haves', 'Designer Edit', 'Urban Style',
    'Classic Elegance', 'Contemporary Chic', 'Fashion Forward', 'Style Statement',
    'Trending Look', 'Premium Collection'
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadAllClothes();
    setupWhatsAppButtons();
});

// Load all clothes
function loadAllClothes() {
    const clothesGrid = document.getElementById('allClothesGrid');
    if (!clothesGrid) return;

    clothesGrid.innerHTML = '';
    
    for (let i = 1; i <= 18; i++) {
        const imgFile = `../../images/gallery-img-${i}.jpeg`;
        const title = allClothingNames[i - 1] || `Gallery Look ${i}`;
        const price = `₵${((99 + i) * 12).toFixed(2)}`;
        
        const card = createClothesCard(imgFile, title, price);
        clothesGrid.appendChild(card);
    }
}

// Create clothes card
function createClothesCard(imgPath, title, priceText) {
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
    return card;
}

// Setup WhatsApp buttons
function setupWhatsAppButtons() {
    document.querySelectorAll('.quick-add').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const productName = card.querySelector('h3').textContent;
            const productPrice = card.querySelector('.price').textContent;
            const productImage = card.querySelector('img').src;
            
            // Create WhatsApp message with image link
            const message = `Hi Purple Curl, I'm interested in ${productName}${productPrice ? ' priced at ' + productPrice : ''}. You can see the product here: ${productImage}`;
            const phone = '233558533072';
            
            // Open WhatsApp with message
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        });
    });
} 