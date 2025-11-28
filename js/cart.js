// ========================================
// ShopMart - COMPLETE CART SYSTEM
// Fully functional cart with all features
// ========================================

// Update cart count badge in navbar (ALL PAGES)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCountElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCountElement) {
        if (totalItems > 0) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = 'block';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

// Add item to cart
function addToCart(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showSnackbar('Product not found', 'error');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category || 'general',
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showSnackbar(`✅ ${product.name} added to cart!`, 'success');
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    showSnackbar('🗑️ Item removed from cart', 'warning');
    loadCart(); // Reload cart page
    updateCartCount();
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart(); // Reload to update totals
        updateCartCount();
        showSnackbar('✅ Quantity updated', 'success');
    }
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your entire cart?')) {
        localStorage.removeItem('cart');
        loadCart();
        updateCartCount();
        showSnackbar('🗑️ Cart cleared', 'warning');
    }
}

// Load and display cart items (CART PAGE ONLY)
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const container = document.getElementById('cartItemsContainer');
    const itemsCount = document.getElementById('cartItemsCount');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!container) return; // Not on cart page

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="material-icons display-1 text-muted mb-4">shopping_cart</i>
                <h5 class="mb-4 text-muted">Your cart is empty</h5>
                <p class="text-muted mb-4">Add some items to get started!</p>
                <a href="shop.html" class="btn btn-primary btn-lg px-4">
                    <i class="material-icons">store</i> Start Shopping
                </a>
            </div>
        `;
        if (itemsCount) itemsCount.textContent = 'Your cart is empty';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }

    // Show items count
    if (itemsCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        itemsCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`;
    }

    // Show checkout button
    if (checkoutBtn) checkoutBtn.style.display = 'block';

    let itemsHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div class="cart-item p-4 border-bottom">
                <div class="row align-items-center">
                    <div class="col-md-2 col-3">
                        <img src="${item.image}" class="cart-item-img img-fluid rounded-3 shadow-sm" 
                             alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150'">
                    </div>
                    <div class="col-md-5 col-6">
                        <h6 class="mb-2 fw-bold">${item.name}</h6>
                        <p class="mb-2 text-muted small">${item.category}</p>
                        <p class="mb-0 fw-bold text-primary">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="col-md-3 col-6">
                        <div class="quantity-controls d-flex align-items-center justify-content-center">
                            <button class="btn btn-sm btn-outline-secondary me-2" 
                                    onclick="updateQuantity(${item.id}, ${item.quantity - 1})" 
                                    ${item.quantity <= 1 ? 'disabled' : ''}>
                                <i class="material-icons">remove</i>
                            </button>
                            <span class="fw-bold mx-2 fs-5">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary ms-2" 
                                    onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                                <i class="material-icons">add</i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2 col-3 text-end">
                        <h6 class="mb-2 fw-bold text-success">$${itemTotal.toFixed(2)}</h6>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = itemsHTML;

    // Update summary totals
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    document.getElementById('cartSubtotal').textContent = subtotal.toFixed(2);
    document.getElementById('cartTax').textContent = tax.toFixed(2);
    document.getElementById('cartTotal').textContent = total.toFixed(2);
}

// Load checkout items (CHECKOUT PAGE ONLY)
function loadCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');

    if (!checkoutItems || !checkoutTotal) return; // Not on checkout page

    if (cart.length === 0) {
        checkoutItems.innerHTML = `
            <div class="text-center py-5">
                <i class="material-icons display-1 text-muted">shopping_cart</i>
                <h5 class="mt-3 text-muted">Your cart is empty</h5>
                <a href="shop.html" class="btn btn-primary mt-3">Start Shopping</a>
            </div>
        `;
        return;
    }

    let total = 0;
    let itemsHTML = '';

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        itemsHTML += `
            <div class="d-flex align-items-center p-3 border-bottom">
                <img src="${item.image}" class="cart-item-img rounded-3 me-3 shadow-sm" 
                     alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h6 class="mb-1 fw-bold">${item.name}</h6>
                    <p class="mb-1 text-muted small">$${item.price.toFixed(2)} × ${item.quantity}</p>
                    <p class="mb-0 fw-bold text-success">$${subtotal.toFixed(2)}</p>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        `;
    });

    checkoutItems.innerHTML = itemsHTML;
    checkoutTotal.textContent = total.toFixed(2);
}

// Initialize cart system on EVERY page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Auto-load specific pages
    if (document.getElementById('cartItemsContainer')) {
        loadCart();
    }
    if (document.getElementById('checkoutItems')) {
        loadCheckout();
    }
});

// Export functions for global use (used in HTML onclick)
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.loadCart = loadCart;
window.loadCheckout = loadCheckout;