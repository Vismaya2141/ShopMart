// Load and display products
function loadProducts() {
    const container = document.getElementById('productsContainer');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const loggedInUser = localStorage.getItem('loggedInUser');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const isAdmin = users.find(u => u.email === loggedInUser)?.isAdmin || false;

    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="material-icons display-1 text-muted">inventory_2</i>
                    <h3 class="mt-3">No products available</h3>
                    ${isAdmin ? '<p class="text-muted">Be the first to add a product!</p>' : ''}
                    ${isAdmin ? '<a href="admin-add-product.html" class="btn btn-primary btn-lg mt-3">Add First Product</a>' : ''}
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 shadow-sm hover-shadow">
                <img src="${product.image}" class="card-img-top product-card-img" alt="${product.name}" 
                     onerror="this.src='https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300'">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text flex-grow-1">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <h4 class="text-primary mb-0">$${product.price}</h4>
                        <div class="btn-group" role="group">
                            <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                                <i class="material-icons">add_shopping_cart</i>
                            </button>
                            ${isAdmin ? `
                                <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">
                                    <i class="material-icons">edit</i>
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
                                    <i class="material-icons">delete</i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Delete product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        let products = JSON.parse(localStorage.getItem('products') || '[]');
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        
        showSnackbar('Product deleted successfully!', 'success');
        setTimeout(loadProducts, 500);
    }
}

// Edit product
function editProduct(id) {
    localStorage.setItem('editingProductId', id);
    window.location.href = 'admin-edit-product.html';
}