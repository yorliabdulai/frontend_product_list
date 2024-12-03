class ProductShop {
    constructor() {
        this.cart = [];
        this.productList = document.getElementById('productList');
        this.cartCount = document.getElementById('cartCount');
        this.cartTotal = document.getElementById('cartTotal');
        this.cartContent = document.getElementById('cartContent');
        this.cartToggle = document.getElementById('cartToggle');
        this.cartItems = document.getElementById('cartItems');
        this.searchInput = document.getElementById('searchInput');
        this.productModal = document.getElementById('productModal');
        this.productModalContent = document.getElementById('productModalContent');
        this.checkoutBtn = document.getElementById('checkoutBtn');

        this.initEventListeners();
        this.renderProducts(products);
    }

    initEventListeners() {
        this.cartToggle.addEventListener('click', () => this.toggleCart());
        this.searchInput.addEventListener('input', (e) => this.searchProducts(e.target.value));
        this.productList.addEventListener('click', (e) => this.handleProductClick(e));
        this.productModal.addEventListener('click', (e) => this.handleModalClose(e));
        this.checkoutBtn.addEventListener('click', () => this.checkout());
    }

    renderProducts(productsToRender) {
        this.productList.innerHTML = '';
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.dataset.productId = product.id;
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-details">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <div class="product-actions">
                        <button onclick="productShop.showProductDetails(${product.id})">Details</button>
                        <button onclick="productShop.addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            `;
            this.productList.appendChild(productCard);
        });
    }

    searchProducts(query) {
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        this.renderProducts(filteredProducts);
    }

    showProductDetails(productId) {
        const product = products.find(p => p.id === productId);
        this.productModalContent.innerHTML = `
            <h2 id="productModalTitle">${product.name}</h2>
            <img src="${product.image}" alt="${product.name}" style="max-width: 100%;">
            <p>${product.description}</p>
            <p>Price: $${product.price.toFixed(2)}</p>
            <p>Category: ${product.category}</p>
            <button onclick="productShop.addToCart(${productId})">Add to Cart</button>
        `;
        this.productModal.style.display = 'block';
    }

    handleModalClose(e) {
        if (e.target.classList.contains('modal') || 
            e.target.classList.contains('close-modal')) {
            this.productModal.style.display = 'none';
        }
    }

    addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }

        this.updateCart();
        this.productModal.style.display = 'none';
    }

    updateCart() {
        this.cartContent.innerHTML = '';
        let total = 0;

        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <div>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    <button onclick="productShop.removeFromCart(${item.id})">Remove</button>
                </div>
            `;
            this.cartContent.appendChild(cartItem);
            total += item.price * item.quantity;
        });

        this.cartCount.textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        this.cartTotal.textContent = total.toFixed(2);
    }

    removeFromCart(productId) {
        const index = this.cart.findIndex(item => item.id === productId);
        if (index !== -1) {
            if (this.cart[index].quantity > 1) {
                this.cart[index].quantity--;
            } else {
                this.cart.splice(index, 1);
            }
            this.updateCart();
        }
    }

    toggleCart() {
        const isHidden = this.cartItems.hidden;
        this.cartItems.hidden = !isHidden;
        this.cartToggle.setAttribute('aria-expanded', !isHidden);
    }

    checkout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Basic checkout simulation
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Checkout successful! Total: $${total.toFixed(2)}`);
        this.cart = [];
        this.updateCart();
    }
}

const productShop = new ProductShop();