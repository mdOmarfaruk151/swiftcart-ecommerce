# SwiftCart E-Commerce

SwiftCart is a frontend e-commerce project built with HTML, Tailwind CSS, and vanilla JavaScript.  
It includes a responsive multi-page UI, dynamic product loading from Fake Store API, product modals, and a localStorage-based cart system.

## Live Features

### 1. Responsive Layout
- Responsive navbar with desktop + mobile menu
- Responsive footer (same design across all pages)
- Mobile-friendly sections/cards/modals

### 2. Homepage (`index.html`)
- Hero section with CTA
- Why Choose Us feature cards
- Trending products fetched dynamically from API
- Trending product details modal
- Add-to-cart support directly from trending cards/modal

### 3. Products Page (`products.html`)
- Dynamic product grid from API
- Category filters loaded dynamically
- Active category button state
- Loading spinner while fetching data
- Product details modal (title, description, price, rating)

### 4. Cart Functionality
- Add to cart from:
  - Products page cards
  - Products page product modal
  - Homepage trending cards/modal
- Cart data stored in `localStorage`
- Navbar cart count updates automatically
- Cart summary modal with:
  - Item list
  - Total price calculation
  - Quantity increase/decrease (`+ / -`)
  - Remove item

### 5. Additional Pages
- `about.html`
- `contact.html`
- `faq.html`
- `shipping.html`
- `returns.html`
- `privacy-policy.html`

All navigation/footer links are connected.

---

## APIs Used

- All products: `https://fakestoreapi.com/products`
- Categories: `https://fakestoreapi.com/products/categories`
- Single product: `https://fakestoreapi.com/products/{id}`
- Homepage trending (limited): `https://fakestoreapi.com/products?limit=3`

---

## Project Structure

```txt
swiftcart-ecommerce/
├── index.html
├── products.html
├── about.html
├── contact.html
├── faq.html
├── shipping.html
├── returns.html
├── privacy-policy.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── products.js
│   ├── cart.js
│   ├── api.js
│   └── modal.js
└── assets/
    └── images/
        └── banner-image.png
```

---

## JavaScript Modules

### `js/app.js`
- Mobile menu toggle
- Homepage trending fetch/render
- Homepage trending details modal open/close
- Homepage add-to-cart click handling
- Cart button behavior

### `js/products.js`
- Fetch/render products grid
- Fetch/render categories
- Category active state
- Loading state management
- Product details modal on products page
- Add-to-cart actions from product list + product modal

### `js/cart.js`
- Cart CRUD using localStorage
- Cart count + total calculation
- Quantity controls (`+ / -`)
- Remove item
- Cart summary rendering

---

## How to Run

1. Download/clone the project.
2. Open `index.html` in browser.

Recommended:
- Use VS Code + Live Server extension for better local development experience.

---

## Tech Stack

- HTML5
- Tailwind CSS (CDN)
- Font Awesome (CDN)
- Vanilla JavaScript (ES6+)
- Fake Store API

---

## JavaScript Short Q&A (বাংলা)

1. **`null` আর `undefined` এর পার্থক্য কী?**  
`undefined` মানে ভ্যারিয়েবল declare করা হয়েছে কিন্তু value দেওয়া হয়নি।  
`null` মানে ইচ্ছা করে খালি/না থাকা value সেট করা হয়েছে।

2. **JavaScript এ `map()` কী কাজে লাগে? `forEach()` থেকে পার্থক্য কী?**  
`map()` পুরনো array থেকে নতুন array বানায় (transform করে)।  
`forEach()` শুধু loop চালায়, নতুন array return করে না।

3. **`==` আর `===` এর পার্থক্য কী?**  
`==` শুধু value compare করে, দরকার হলে type convert করে।  
`===` value + type দুটোই compare করে (strict compare)।

4. **API fetch এ `async/await` কেন গুরুত্বপূর্ণ?**  
এটা asynchronous code সহজভাবে লিখতে সাহায্য করে।  
`.then()` chain এর বদলে normal code flow এর মতো লেখা যায়, পড়তে/ডিবাগ করতে সহজ হয়।

5. **JavaScript এ Scope (Global, Function, Block) কী?**  
Scope মানে ভ্যারিয়েবল কোথায় access করা যাবে।  
- **Global Scope:** সব জায়গা থেকে access করা যায়।  
- **Function Scope:** শুধু ওই function এর ভিতরে access করা যায়।  
- **Block Scope:** `{}` block এর ভিতরে access করা যায় (যেমন `let`, `const`)।
