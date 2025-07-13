// Admin Panel JavaScript

// Store products in localStorage
let products = JSON.parse(localStorage.getItem('purpleCurlProducts')) || [];

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadImageGallery();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Add product form
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }

    // Image preview
    const productImageInput = document.getElementById('productImage');
    if (productImageInput) {
        productImageInput.addEventListener('change', handleImagePreview);
    }

    // Upload images form
    const uploadImagesForm = document.getElementById('uploadImagesForm');
    if (uploadImagesForm) {
        uploadImagesForm.addEventListener('submit', handleUploadImages);
    }

    // Gallery tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadImageGallery(btn.dataset.category);
        });
    });

    // Update shop button
    const updateShopBtn = document.getElementById('updateShopBtn');
    if (updateShopBtn) {
        updateShopBtn.addEventListener('click', updateShop);
    }
}

// Handle add product
function handleAddProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productName = formData.get('productName');
    const productPrice = formData.get('productPrice');
    const productCategory = formData.get('productCategory');
    const productImage = formData.get('productImage');

    if (!productName || !productPrice || !productCategory || !productImage) {
        alert('Please fill in all fields');
        return;
    }

    // Create product object
    const product = {
        id: Date.now(),
        name: productName,
        price: productPrice,
        category: productCategory,
        image: URL.createObjectURL(productImage),
        createdAt: new Date().toISOString()
    };

    // Add to products array
    products.push(product);
    localStorage.setItem('purpleCurlProducts', JSON.stringify(products));

    // Reload products display
    loadProducts();

    // Reset form
    e.target.reset();
    document.getElementById('imagePreview').innerHTML = '';

    // Show success message
    showNotification('Product added successfully!', 'success');
}

// Handle image preview
function handleImagePreview(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
}

// Handle upload images
function handleUploadImages(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const files = formData.get('imageFiles');
    const category = formData.get('imageCategory');

    if (!files || files.length === 0 || !category) {
        alert('Please select images and category');
        return;
    }

    // Simulate upload (in a real app, this would upload to server)
    const uploadedImages = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = URL.createObjectURL(file);
        uploadedImages.push({
            name: file.name,
            url: imageUrl,
            category: category
        });
    }

    // Store uploaded images
    const existingImages = JSON.parse(localStorage.getItem('purpleCurlImages')) || [];
    existingImages.push(...uploadedImages);
    localStorage.setItem('purpleCurlImages', JSON.stringify(existingImages));

    // Reload gallery
    loadImageGallery();

    // Reset form
    e.target.reset();

    // Show success message
    showNotification(`${uploadedImages.length} images uploaded successfully!`, 'success');
}

// Load products
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    if (products.length === 0) {
        productsGrid.innerHTML = '<p>No products added yet.</p>';
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-admin-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-admin-info">
                <h4>${product.name}</h4>
                <p>${product.price}</p>
                <span class="category">${product.category}</span>
            </div>
            <div class="product-admin-actions">
                <button class="btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // For now, just show an alert with product info
    // In a real app, this would open an edit modal
    alert(`Edit product: ${product.name}\nPrice: ${product.price}\nCategory: ${product.category}`);
}

// Delete product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('purpleCurlProducts', JSON.stringify(products));
        loadProducts();
        showNotification('Product deleted successfully!', 'success');
    }
}

// Load image gallery
function loadImageGallery(category = 'gallery') {
    const imageGallery = document.getElementById('imageGallery');
    if (!imageGallery) return;

    // Get images from localStorage or use default images
    const images = JSON.parse(localStorage.getItem('purpleCurlImages')) || [];
    
    // Filter by category if specified
    const filteredImages = category ? images.filter(img => img.category === category) : images;

    if (filteredImages.length === 0) {
        imageGallery.innerHTML = '<p>No images uploaded yet.</p>';
        return;
    }

    imageGallery.innerHTML = filteredImages.map((image, index) => `
        <div class="gallery-item">
            <img src="${image.url}" alt="${image.name}">
            <div class="gallery-item-overlay">
                <button onclick="deleteImage(${index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Delete image
function deleteImage(index) {
    if (confirm('Are you sure you want to delete this image?')) {
        const images = JSON.parse(localStorage.getItem('purpleCurlImages')) || [];
        images.splice(index, 1);
        localStorage.setItem('purpleCurlImages', JSON.stringify(images));
        loadImageGallery();
        showNotification('Image deleted successfully!', 'success');
    }
}

// Update shop
function updateShop() {
    const updateStatus = document.getElementById('updateStatus');
    if (!updateStatus) return;

    try {
        // Generate shop HTML with current products
        generateShopHTML();
        
        updateStatus.textContent = 'Shop updated successfully!';
        updateStatus.className = 'update-status success';
        updateStatus.style.display = 'block';
        
        setTimeout(() => {
            updateStatus.style.display = 'none';
        }, 3000);
        
        showNotification('Shop updated successfully!', 'success');
    } catch (error) {
        updateStatus.textContent = 'Error updating shop: ' + error.message;
        updateStatus.className = 'update-status error';
        updateStatus.style.display = 'block';
        
        setTimeout(() => {
            updateStatus.style.display = 'none';
        }, 3000);
    }
}

// Generate shop HTML
function generateShopHTML() {
    // This would generate the actual shop HTML file
    // For now, we'll just update the localStorage with current products
    const shopData = {
        clothes: products.filter(p => p.category === 'clothes'),
        fabric: products.filter(p => p.category === 'fabric'),
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('purpleCurlShopData', JSON.stringify(shopData));
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
    notification.style.color = '#fff';
    notification.style.padding = '1rem 2rem';
    notification.style.borderRadius = '5px';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    notification.style.zIndex = '1000';
    
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