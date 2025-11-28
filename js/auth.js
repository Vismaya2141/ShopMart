// Initialize sample data if not exists
function initializeData() {
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            { id: 1, name: 'Admin', email: 'admin@gmail.com', password: 'admin123', isAdmin: true },
            { id: 2, name: 'John Doe', email: 'john@example.com', password: '123456', isAdmin: false }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem('products')) {
        const defaultProducts = [
            { id: 1, name: 'iPhone 15', price: 999, description: 'Latest iPhone with advanced camera', image: 'https://images.unsplash.com/photo-1592899677979-9a7c7e9f7138?w=300', category: 'electronics' },
            { id: 2, name: 'MacBook Pro', price: 1999, description: 'Powerful laptop for professionals', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300', category: 'electronics' },
            { id: 3, name: 'AirPods Pro', price: 249, description: 'Wireless earbuds with noise cancellation', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', category: 'electronics' },
            { id: 4, name: 'Samsung Galaxy S24', price: 899, description: 'Flagship Android smartphone', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300', category: 'electronics' },
            { id: 5, name: 'Sony Headphones', price: 349, description: 'Premium wireless headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', category: 'electronics' },
            { id: 6, name: 'Dell XPS 13', price: 1299, description: 'Ultra-thin premium laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300', category: 'electronics' }
        ];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
}

// Show Snackbar
function showSnackbar(message, type = 'success') {
    const snackbar = document.getElementById('snackbar');
    if (!snackbar) return;
    
    snackbar.textContent = message;
    snackbar.className = `snackbar ${type} show`;
    setTimeout(() => {
        snackbar.className = 'snackbar';
    }, 3000);
}

// CRITICAL: Check if user is logged in and redirect if needed
function checkAuthStatus() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Protected pages that REQUIRE login
    const protectedPages = ['shop.html', 'cart.html', 'admin-add-product.html', 'admin-edit-product.html'];
    
    // If on protected page but not logged in → REDIRECT TO LOGIN
    if (protectedPages.includes(currentPage) && !loggedInUser) {
        showSnackbar('Please login to continue shopping', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return;
    }
    
    // If on login/register but already logged in → REDIRECT TO HOME
    const authPages = ['login.html', 'register.html'];
    if (authPages.includes(currentPage) && loggedInUser) {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        return;
    }

    // Update navbar if user is logged in
    if (loggedInUser) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === loggedInUser);
        
        // Update navbar elements
        const adminLink = document.getElementById('adminLink');
        const loginLink = document.getElementById('loginLink');
        const logoutLink = document.getElementById('logoutLink');
        const adminControls = document.getElementById('adminControls');
        const userNameDisplay = document.getElementById('userNameDisplay');
        
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
        if (userNameDisplay) userNameDisplay.textContent = `Hi, ${user?.name}`;
        
        if (user && user.isAdmin) {
            if (adminLink) adminLink.style.display = 'block';
            if (adminControls) adminControls.style.display = 'flex';
        }
    }
}

// Login function
function loginUser() {
    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value.trim();

    if (!email || !password) {
        showSnackbar('Please fill in all fields', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', email);
        showSnackbar(`Welcome back, ${user.name}!`, 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showSnackbar('Invalid email or password', 'error');
    }
}

// Register function
function registerUser() {
    const name = document.getElementById('regName')?.value.trim();
    const email = document.getElementById('regEmail')?.value.trim();
    const password = document.getElementById('regPassword')?.value;
    const confirmPassword = document.getElementById('regConfirmPassword')?.value;

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showSnackbar('Please enter a valid email address', 'error');
        return;
    }

    if (password.length < 6) {
        showSnackbar('Password must be at least 6 characters', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showSnackbar('Passwords do not match', 'error');
        return;
    }

    // Check if email exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        showSnackbar('Email already exists', 'error');
        return;
    }

    // Add new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        isAdmin: false
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    showSnackbar('Account created successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// Logout function
function logout() {
    localStorage.removeItem('loggedInUser');
    showSnackbar('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Initialize on EVERY page load
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    checkAuthStatus();
});