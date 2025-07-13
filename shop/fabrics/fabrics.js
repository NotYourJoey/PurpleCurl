// All Fabrics Page JavaScript

// Catchy fabric names for all 19 images
const allFabricNames = [
    'Silk Satin', 'Organic Cotton', 'Linen Blend', 'Wool Tweed', 'Brocade',
    'Chiffon', 'Bamboo Rayon', 'Velvet Touch', 'Cashmere Blend', 'Silk Crepe',
    'Cotton Poplin', 'Linen Canvas', 'Wool Flannel', 'Silk Organza', 'Cotton Voile',
    'Linen Twill', 'Wool Gabardine', 'Silk Charmeuse', 'Cotton Jersey'
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadAllFabrics();
    setupWhatsAppButtons();
});

// Load all fabrics
function loadAllFabrics() {
    const fabricsGrid = document.getElementById('allFabricsGrid');
    if (!fabricsGrid) return;

    fabricsGrid.innerHTML = '';
    
    for (let i = 1; i <= 19; i++) {
        const imgFile = `../../images/fabric-${i}.jpeg`;
        const title = allFabricNames[i - 1] || `Fabric ${i.toString().padStart(2, '0')}`;
        const price = `₵${((19 + i) * 12).toFixed(2)} / yd`;
        
        const card = createFabricsCard(imgFile, title, price);
        fabricsGrid.appendChild(card);
    }
}

// Create fabrics card
function createFabricsCard(imgPath, title, priceText) {
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
            const message = `Hi Purple Curl, I'm interested in ${productName}${productPrice ? ' priced at ' + productPrice : ''}. You can see the fabric here: ${productImage}`;
            const phone = '233558533072';
            
            // Open WhatsApp with message
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        });
    });
} 