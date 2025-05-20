// Wishlist functionality for Luxury Watches

document.addEventListener('DOMContentLoaded', function () {
    const wishlistKey = 'wishlistItems';
    const wishlistContainer = document.getElementById('wishlist-items');
    const emptyWishlist = document.getElementById('empty-wishlist');

    // Demo: Pre-populate with 5 products if wishlist is empty
    function demoPopulateWishlist() {
        if (!localStorage.getItem(wishlistKey) || getWishlist().length === 0) {
            const demoProducts = [
                {
                    id: 'demo1',
                    name: 'Rolex Submariner',
                    price: 8950,
                    image: 'https://images.unsplash.com/photo-1548169874-53e85f753f1e?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'demo2',
                    name: 'Omega Seamaster',
                    price: 4250,
                    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'demo3',
                    name: 'Tag Heuer Carrera',
                    price: 3950,
                    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'demo4',
                    name: 'Rolex Daytona',
                    price: 12500,
                    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'demo5',
                    name: 'Omega Speedmaster',
                    price: 5250,
                    image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=800&q=80'
                }
            ];
            saveWishlist(demoProducts);
        }
    }

    function getWishlist() {
        return JSON.parse(localStorage.getItem(wishlistKey)) || [];
    }

    function saveWishlist(items) {
        localStorage.setItem(wishlistKey, JSON.stringify(items));
    }

    function removeFromWishlist(productId) {
        let items = getWishlist();
        items = items.filter(item => item.id !== productId);
        saveWishlist(items);
        renderWishlist();
    }

    function renderWishlist() {
        const items = getWishlist();
        wishlistContainer.innerHTML = '';
        if (items.length === 0) {
            emptyWishlist.classList.remove('d-none');
            return;
        } else {
            emptyWishlist.classList.add('d-none');
        }
        items.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';
            col.innerHTML = `
                <div class="card h-100">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text mb-2">$${item.price.toLocaleString()}</p>
                        <button class="btn btn-outline-danger mt-auto" onclick="removeFromWishlist('${item.id}')">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
            wishlistContainer.appendChild(col);
        });
    }

    // Expose removeFromWishlist globally
    window.removeFromWishlist = removeFromWishlist;

    demoPopulateWishlist();
    renderWishlist();
}); 