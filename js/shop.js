// Initialize price range slider
document.addEventListener('DOMContentLoaded', function() {
    // Price Range Slider
    const priceSlider = document.getElementById('price-slider');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');

    if (priceSlider) {
        noUiSlider.create(priceSlider, {
            start: [0, 5000],
            connect: true,
            range: {
                'min': 0,
                'max': 5000
            },
            format: {
                to: value => Math.round(value),
                from: value => value
            }
        });

        // Update input fields when slider changes
        priceSlider.noUiSlider.on('update', function(values, handle) {
            const value = values[handle];
            if (handle === 0) {
                minPriceInput.value = value;
            } else {
                maxPriceInput.value = value;
            }
        });

        // Update slider when input fields change
        minPriceInput.addEventListener('change', function() {
            priceSlider.noUiSlider.set([this.value, null]);
        });

        maxPriceInput.addEventListener('change', function() {
            priceSlider.noUiSlider.set([null, this.value]);
        });
    }

    // Product Quick View
    const quickViewButtons = document.querySelectorAll('.btn-quick-view');
    const quickViewModal = document.getElementById('quickViewModal');

    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productImage = productCard.querySelector('.product-image img').src;
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productRating = productCard.querySelector('.product-rating').innerHTML;
            const productPrice = productCard.querySelector('.product-price').innerHTML;
            
            // Update modal content
            const modalImage = quickViewModal.querySelector('.modal-body img');
            const modalTitle = quickViewModal.querySelector('.modal-body h3');
            const modalRating = quickViewModal.querySelector('.modal-body .product-rating');
            const modalPrice = quickViewModal.querySelector('.modal-body .product-price');

            modalImage.src = productImage;
            modalTitle.textContent = productTitle;
            modalRating.innerHTML = productRating;
            modalPrice.innerHTML = productPrice;
        });
    });

    // Quantity Selector
    const quantityInput = document.querySelector('.quantity-selector input');
    const minusBtn = document.querySelector('.quantity-selector .btn:first-child');
    const plusBtn = document.querySelector('.quantity-selector .btn:last-child');

    if (quantityInput && minusBtn && plusBtn) {
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
    }

    // Filter Functionality
    const filterForm = document.querySelector('.filters-sidebar');
    const applyFiltersBtn = filterForm.querySelector('.btn-primary');

    applyFiltersBtn.addEventListener('click', function() {
        const selectedCategories = Array.from(filterForm.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.id);
        
        const minPrice = minPriceInput.value;
        const maxPrice = maxPriceInput.value;

        // Filter products based on selected criteria
        filterProducts(selectedCategories, minPrice, maxPrice);
    });

    // Sort Functionality
    const sortSelect = document.querySelector('.form-select');
    sortSelect.addEventListener('change', function() {
        sortProducts(this.value);
    });
});

// Filter Products Function
function filterProducts(categories, minPrice, maxPrice) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productCategory = product.querySelector('.product-category').textContent.toLowerCase();
        const productPrice = parseFloat(product.querySelector('.current-price').textContent.replace('$', '').replace(',', ''));
        
        const categoryMatch = categories.length === 0 || categories.includes(productCategory);
        const priceMatch = productPrice >= minPrice && productPrice <= maxPrice;

        if (categoryMatch && priceMatch) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });

    updateProductCount();
}

// Sort Products Function
function sortProducts(sortBy) {
    const productsContainer = document.querySelector('.row.g-4');
    const products = Array.from(productsContainer.children);

    products.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.current-price').textContent.replace('$', '').replace(',', ''));
        const priceB = parseFloat(b.querySelector('.current-price').textContent.replace('$', '').replace(',', ''));

        switch(sortBy) {
            case 'Price: Low to High':
                return priceA - priceB;
            case 'Price: High to Low':
                return priceB - priceA;
            case 'Newest First':
                // Assuming newer products have the "New" badge
                const isNewA = a.querySelector('.product-badge')?.textContent === 'New';
                const isNewB = b.querySelector('.product-badge')?.textContent === 'New';
                return isNewB - isNewA;
            default: // Featured
                return 0;
        }
    });

    // Reappend sorted products
    products.forEach(product => productsContainer.appendChild(product));
}

// Update Product Count
function updateProductCount() {
    const visibleProducts = document.querySelectorAll('.product-card[style="display: block"]').length;
    document.getElementById('product-count').textContent = visibleProducts;
}

// Add to Cart Functionality
function addToCart(productId, quantity = 1) {
    // Get existing cart items from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            quantity: quantity
        });
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart badge
    updateCartBadge();
    
    // Show success message
    showToast('Product added to cart successfully!');
}

// Update Cart Badge
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.querySelector('.navbar .badge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
    }
}

// Show Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">Success</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize cart badge on page load
document.addEventListener('DOMContentLoaded', updateCartBadge); 