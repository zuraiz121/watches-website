// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.querySelector('.badge');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function addToCart(productId, name, price, image, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name,
            price,
            image,
            quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            if (window.location.pathname.includes('cart.html')) {
                renderCart();
            }
        }
    }
}

// Cart Page Rendering
function renderCart() {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="text-center py-5"><h3>Your cart is empty</h3><a href="shop.html" class="btn btn-primary mt-3">Continue Shopping</a></div>';
        return;
    }

    const fallbackImage = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80';
    const fallbackName = 'Product';
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartContainer.innerHTML = cart.map(item => {
        const image = item.image && item.image !== 'undefined' ? item.image : fallbackImage;
        const name = item.name && item.name !== 'undefined' ? item.name : fallbackName;
        return `
        <div class="cart-item">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${image}" alt="${name}" class="img-fluid">
                </div>
                <div class="col-md-4">
                    <h5>${name}</h5>
                </div>
                <div class="col-md-2">
                    <div class="input-group">
                        <button class="btn btn-outline-secondary" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <input type="number" class="form-control text-center" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)">
                        <button class="btn btn-outline-secondary" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="col-md-2">
                    <span class="price">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div class="col-md-2">
                    <button class="btn btn-danger" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('') + `
        <div class="cart-summary mt-4">
            <div class="row">
                <div class="col-md-6 offset-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5>Order Summary</h5>
                            <div class="d-flex justify-content-between mb-3">
                                <span>Subtotal:</span>
                                <span>$${total.toFixed(2)}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span>Shipping:</span>
                                <span>Free</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between mb-3">
                                <strong>Total:</strong>
                                <strong>$${total.toFixed(2)}</strong>
                            </div>
                            <button class="btn btn-primary w-100" onclick="checkout()">Proceed to Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Toast Notifications
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">Notification</strong>
            <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Product Filtering and Sorting
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function sortProducts(sortBy) {
    const productContainer = document.querySelector('.products-container');
    const products = Array.from(productContainer.children);
    
    products.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        
        if (sortBy === 'price-low-high') {
            return priceA - priceB;
        } else if (sortBy === 'price-high-low') {
            return priceB - priceA;
        }
    });
    
    products.forEach(product => productContainer.appendChild(product));
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        form.querySelectorAll('[required]').forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        });
        
        if (isValid) {
            // Handle form submission
            showToast('Form submitted successfully!');
            form.reset();
        }
    });
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-question');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.nextElementSibling;
            answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
            item.classList.toggle('active');
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
    
    if (window.location.pathname.includes('contact.html')) {
        validateForm('contactForm');
    }
    
    if (window.location.pathname.includes('faq.html')) {
        initFAQ();
    }
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}); 