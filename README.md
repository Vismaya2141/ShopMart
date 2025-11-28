# ShopMart — Dynamic Online Shopping Website

> A responsive, client-side online shopping prototype built with Bootstrap 5, Material Design styling, and JavaScript using LocalStorage as a lightweight database. Supports user registration/login, admin product CRUD, and a shopping cart — all stored in browser LocalStorage.

---

## Project Overview

- **Purpose:** Demonstrate a full front-end shopping application implementing authentication, CRUD operations, and cart management using JavaScript and LocalStorage. Useful as a learning project or classroom assignment.
- **Tech stack:** HTML, CSS (Bootstrap 5 + custom), JavaScript, LocalStorage. No backend required.

---

## Files / Pages

- `index.html` — Home / landing page shown after successful login. Contains responsive Bootstrap navbar, hero banner and category highlights.
- `register.html` — Registration page (user signup). Material-style form inputs (name, email, password, confirm password) with client-side validation. On success stores new user in LocalStorage `users` array and redirects to `login.html`.
- `login.html` — Login page. Validates non-empty fields, checks credentials against LocalStorage `users`. On success stores session in `localStorage.loggedInUser` and redirects to `index.html`.
- `shop.html` — Product listing page. Renders products from LocalStorage `products` as Material-style cards with image, name, description, price, and `Add to Cart` button. Admin users also see `Edit` and `Delete` buttons.
- `admin-add-product.html` — Admin-only page to create products. Material inputs, validation, pushes product to `products` array in LocalStorage and redirects to `shop.html`.
- `admin-edit-product.html` — Admin-only page to edit product details. Loads product by `id`, updates LocalStorage and returns to `shop.html`.
- `cart.html` — Shopping cart page. Shows items added to cart (stored in LocalStorage `cart`), supports quantity updates and item removal.
- `checkout.html` — Checkout flow placeholder to enter details and complete purchase; can clear the cart and redirect to `order-success.html`.
- `order-success.html` — Confirmation page after checkout.

Supporting files:
- `css/style.css` — Custom styles including Material shadows and tweaks.
- `js/auth.js` — Registration and login logic.
- `js/products.js` — Product CRUD + render logic.
- `js/cart.js` — Cart operations (add, update, remove) and rendering.

---

## LocalStorage Data Models

All data is stored in LocalStorage as JSON strings. Primary keys used:

- `users` (array): list of user objects.

Example:

```json
[
  { "id": 1, "name": "John", "email": "john@gmail.com", "password": "123456" },
  { "id": 2, "name": "Admin", "email": "admin@gmail.com", "password": "admin123" }
]
```

- `products` (array): list of product objects.

Example:

```json
[
  { "id": 1, "name": "T-Shirt", "price": 199, "description": "Comfortable cotton tee", "imagename": "images/tshirt.jpg" }
]
```

- `cart` (array): items for the logged-in user. Each entry:

```json
[
  { "productId": 1, "name": "T-Shirt", "price": 199, "quantity": 2, "imagename": "images/tshirt.jpg" }
]
```

- `loggedInUser` (string): the email of the currently logged-in user, e.g. `localStorage.setItem('loggedInUser', 'john@gmail.com')`.

Notes:
- IDs are numeric and should be unique. When adding new objects, generate the next ID by finding the current max and adding 1.
- All reads/writes should parse (`JSON.parse`) and stringify (`JSON.stringify`) the arrays.

---

## Authentication & Workflows

Registration (`register.html`):
- Validate: email format, password length >= 6, passwords match, required fields present.
- On submit: load `users` from LocalStorage (or `[]`), check for duplicate email, add new user object, save back to LocalStorage.
- On success: show a Material snackbar/alert and redirect to `login.html`.

Login (`login.html`):
- Validate: fields not empty.
- On submit: check that a user exists in `users` with matching email and password.
- On success: `localStorage.setItem('loggedInUser', email)` and redirect to `index.html`.
- On failure: show Material snackbar/alert: "Invalid credentials".

Admin account (example):
- Email: `admin@gmail.com`
- Password: `admin123`
- Admin detection: simple email check against admin email in front-end logic. (You can extend with an `isAdmin` flag in user objects.)

Session behavior:
- Pages that require authentication check `localStorage.loggedInUser`; if missing, redirect to `login.html`.
- Navbar shows/hides `Add Product` (admin) and `Logout` depending on login state.

---

## Products CRUD (Admin)

- Create (`admin-add-product.html`): validate form, construct new product object (`id`, `name`, `price`, `description`, `imagename`), push to `products` array in LocalStorage, notify and redirect to `shop.html`.
- Read (`shop.html`): render all products from `products` as cards.
- Update (`admin-edit-product.html`): prefill form from product by `id`, save edits back into `products` array and redirect.
- Delete (`shop.html`): remove product from `products` array, save, and re-render.

UI notes:
- Only admin users see Edit/Delete controls on product cards.

---

## Cart Functionality

- Adding to cart: `Add to Cart` button pushes or updates item in LocalStorage `cart` (for the currently logged-in user).
- Viewing cart: `cart.html` loads `cart`, lists items, shows subtotal and total.
- Update quantity: modify item quantity and update `cart` in LocalStorage.
- Remove item: delete from `cart` and re-render.
- Checkout: a simple flow that clears the `cart` and optionally records an order (not implemented in storage by default).

---

## Bootstrap & Material Components Used

- Bootstrap 5 core features used:
  - Navbar (`.navbar`, responsive collapse)
  - Grid system (`.container`, `.row`, `.col-*-*`)
  - Forms (`.form-control`, `.form-group`, `.row` layouts)
  - Buttons (`.btn`, color variants)

- Material Design elements (implemented via CSS + Bootstrap):
  - Material-style Cards (elevated shadows, rounded corners)
  - Material Buttons (contained/raised look)
  - Material Form Inputs (floating labels, focus states)
  - Shadows / elevation to distinguish cards and buttons
  - Snackbar / alerts for success/error notifications

You can improve the Material look using a lightweight Material CSS library or by adding styles in `css/style.css`.

---

## How to Run Locally

1. Clone or copy the project into a local folder (you already have the files in the workspace).
2. Because this is a static front-end app, you can simply open the HTML files in your browser, but for full functionality (CORS-safe resources), it's recommended to run a simple local server.

Using Python (if installed):

```powershell
cd path\\to\\project
python -m http.server 8000; Start-Process "http://localhost:8000/index.html"
```

Using VS Code: install the **Live Server** extension and click *Go Live*.

Open `http://localhost:8000/` (or the Live Server URL) to use the app.

---

## GitHub Submission

- Create a GitHub repository and push your project. Example commands:

```powershell
cd path\\to\\project
git init
git add .
git commit -m "Add ShopMart project"
git remote add origin https://github.com/<your-username>/ShopMart.git
git branch -M main
git push -u origin main
```

- After pushing, provide the repository link in your submission (example): `https://github.com/<your-username>/ShopMart`.

---

## README Notes for Grading Checklist

- Registration: Material inputs, client validation, LocalStorage `users`, duplicate-email checks.
- Login: validation, LocalStorage authentication, `loggedInUser` session key.
- Home page: Navbar reacts to login status, hero banner and Start Shopping button.
- Shop page: dynamic rendering from `products` (READ), `Add to Cart`, admin Edit/Delete.
- Admin add/edit pages: CREATE/UPDATE operations updating `products` in LocalStorage.
- Delete: removes product from `products` (DELETE).
- Cart: add items, view cart, update qty, delete items — stored under `cart` key.

---

## Suggested Enhancements

- Add hashed passwords (currently plain text for learning simplicity). Use browser crypto methods in production.
- Add per-user carts (key namespacing by user email), order history storage.
- Use a small JSON file or a backend server (Node/Express) for persistent storage.
- Add image upload support (currently uses `imagename` path references).

---

## License

MIT — free to use and modify for learning purposes.

---

If you'd like, I can also:
- add sample seed data for `users` and `products` into a `seed.js`; or
- walk through wiring up the admin detection to an `isAdmin` flag; or
- push this repo to GitHub for you (if you provide a remote URL).

Enjoy building and extending ShopMart!
