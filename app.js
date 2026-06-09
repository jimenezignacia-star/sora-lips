document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // 1. STATE & CONSTANTS
    // ----------------------------------------------------
    let cart = [];
    let activeQuantity = 1;
    
    // Active product details (keeps track of currently selected shade)
    let activeProduct = {
        id: 'sora-peptide-gloss',
        name: 'Sora Peptide Lip Gloss',
        shade: 'Ribbon',
        shadeDesc: 'Soft Baby Pink',
        price: 20.00,
        img: 'assets/lip-gloss-pink.png',
        bg: '#F8C3CD'
    };

    // DOM Elements
    const header = document.getElementById('site-header');
    
    // Shade Selector Elements
    const shadeBtns = document.querySelectorAll('.shade-btn');
    const activeProductImg = document.getElementById('active-product-img');
    const showcaseVisual = document.querySelector('.showcase-visual');
    const activeShadeName = document.getElementById('active-shade-name');
    const activeShadeDesc = document.getElementById('active-shade-desc');
    const activeGlow = document.getElementById('showcase-glow');
    
    // Quantity Selector Elements
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const qtyCount = document.getElementById('qty-count');
    
    // Cart Elements
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const cartToggleBtn = document.getElementById('cart-toggle');
    const cartCloseBtn = document.getElementById('cart-close');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartEmptyMsg = document.getElementById('empty-cart-msg');
    const cartFooter = document.getElementById('cart-footer');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartCountBadge = document.getElementById('cart-count');
    const cartDrawerCount = document.getElementById('cart-drawer-count');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Toast Elements
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');

    // Form Elements
    const waitlistForm = document.getElementById('waitlist-form');
    const vipNameInput = document.getElementById('vip-name');
    const vipEmailInput = document.getElementById('vip-email');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');

    // ----------------------------------------------------
    // 2. SCROLL HEADER HANDLER
    // ----------------------------------------------------
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ----------------------------------------------------
    // 3. SHADE SELECTOR HANDLER
    // ----------------------------------------------------
    shadeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;

            // Remove active class from all and add to clicked
            shadeBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-checked', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-checked', 'true');

            // Gather data from attributes
            const shadeKey = btn.dataset.shade;
            const name = btn.dataset.name;
            const desc = btn.dataset.desc;
            const imgUrl = btn.dataset.img;
            const bgGlow = btn.dataset.bg;
            
            // Set details of the color description label
            let shadeColorLabel = '';
            if (shadeKey === 'pink') {
                shadeColorLabel = 'Soft Baby Pink';
                activeProduct.bg = '#F8C3CD';
            } else if (shadeKey === 'peach') {
                shadeColorLabel = 'Coral Beige';
                activeProduct.bg = '#E2B29F';
            } else if (shadeKey === 'rose') {
                shadeColorLabel = 'Berry Rose';
                activeProduct.bg = '#A96E75';
            }

            // Smooth transition animation
            showcaseVisual.classList.add('switching');
            
            setTimeout(() => {
                // Update product image and details
                activeProductImg.src = imgUrl;
                activeProductImg.alt = `Sora Peptide Gloss in ${name} (${shadeColorLabel})`;
                activeShadeName.textContent = name;
                document.querySelector('.shade-color-desc').textContent = `(${shadeColorLabel})`;
                activeShadeDesc.textContent = desc;
                
                // Shift background glow accent color
                activeGlow.style.background = `radial-gradient(circle, ${activeProduct.bg}44 0%, rgba(255, 255, 255, 0) 70%)`;
                
                // Update active state details for cart additions
                activeProduct.shade = name;
                activeProduct.shadeDesc = shadeColorLabel;
                activeProduct.img = imgUrl;

                // Remove transition class
                showcaseVisual.classList.remove('switching');
            }, 200);
        });
    });

    // ----------------------------------------------------
    // 4. PRODUCT QUANTITY SELECTOR
    // ----------------------------------------------------
    qtyMinus.addEventListener('click', () => {
        if (activeQuantity > 1) {
            activeQuantity--;
            qtyCount.textContent = activeQuantity;
        }
    });

    qtyPlus.addEventListener('click', () => {
        activeQuantity++;
        qtyCount.textContent = activeQuantity;
    });

    // ----------------------------------------------------
    // 5. SHOPPING CART SYSTEM
    // ----------------------------------------------------

    // Open Cart Drawer
    function openCart() {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Stop page scrolling
    }

    // Close Cart Drawer
    function closeCart() {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('open');
        document.body.style.overflow = ''; // Resume scrolling
    }

    // Toggle click listeners
    cartToggleBtn.addEventListener('click', openCart);
    cartCloseBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Add To Cart Functionality
    addToCartBtn.addEventListener('click', () => {
        const productToAdd = {
            id: `${activeProduct.id}-${activeProduct.shade.toLowerCase().replace(/\s+/g, '-')}`,
            name: activeProduct.name,
            shade: activeProduct.shade,
            shadeDesc: activeProduct.shadeDesc,
            price: activeProduct.price,
            img: activeProduct.img,
            qty: activeQuantity
        };

        // Check if item shade already in cart
        const existingItemIndex = cart.findIndex(item => item.id === productToAdd.id);
        
        if (existingItemIndex > -1) {
            // Update quantity
            cart[existingItemIndex].qty += productToAdd.qty;
        } else {
            // Add new item
            cart.push(productToAdd);
        }

        // Reset display quantity
        activeQuantity = 1;
        qtyCount.textContent = '1';

        // Refresh Cart and show UI feedback
        updateCartUI();
        showToast(`Added ${productToAdd.qty}x '${productToAdd.shade}' to your bag!`);
        
        // Open Cart Drawer after a brief moment for visual satisfaction
        setTimeout(() => {
            openCart();
        }, 300);
    });

    // Toast notification display helper
    function showToast(message) {
        toastMsg.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }

    // Update Cart HTML and Summary
    function updateCartUI() {
        // Clear previous dynamic elements except empty state
        const cartItems = document.querySelectorAll('.cart-item');
        cartItems.forEach(el => el.remove());

        let totalQty = 0;
        let totalPrice = 0.00;

        if (cart.length === 0) {
            cartEmptyMsg.style.display = 'block';
            cartFooter.classList.remove('show');
        } else {
            cartEmptyMsg.style.display = 'none';
            cartFooter.classList.add('show');

            // Render items
            cart.forEach(item => {
                totalQty += item.qty;
                totalPrice += (item.price * item.qty);

                const itemHTML = `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-img-wrapper">
                            <img src="${item.img}" alt="${item.name} - ${item.shade}">
                        </div>
                        <div class="cart-item-details">
                            <span class="cart-item-name">${item.name}</span>
                            <span class="cart-item-shade">${item.shade} (${item.shadeDesc})</span>
                            <div class="cart-item-actions">
                                <div class="cart-item-qty">
                                    <button class="cart-item-qty-btn decrease-qty-btn" aria-label="Decrease quantity">-</button>
                                    <span class="cart-item-qty-value">${item.qty}</span>
                                    <button class="cart-item-qty-btn increase-qty-btn" aria-label="Increase quantity">+</button>
                                </div>
                                <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
                            </div>
                        </div>
                        <button class="cart-item-remove-btn" aria-label="Remove item">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                `;
                
                // Insert above footer / bottom of items list
                cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
            });
        }

        // Update counts and totals
        cartCountBadge.textContent = totalQty;
        cartDrawerCount.textContent = totalQty;
        cartSubtotal.textContent = `$${totalPrice.toFixed(2)}`;

        // Re-attach listeners to dynamic elements (remove / increase / decrease buttons)
        attachCartItemEventListeners();
    }

    // Helper to wire up buttons inside the shopping cart drawer
    function attachCartItemEventListeners() {
        const itemCards = document.querySelectorAll('.cart-item');

        itemCards.forEach(card => {
            const itemId = card.dataset.id;
            const removeBtn = card.querySelector('.cart-item-remove-btn');
            const decBtn = card.querySelector('.decrease-qty-btn');
            const incBtn = card.querySelector('.increase-qty-btn');

            removeBtn.addEventListener('click', () => {
                cart = cart.filter(item => item.id !== itemId);
                updateCartUI();
            });

            decBtn.addEventListener('click', () => {
                const itemIndex = cart.findIndex(item => item.id === itemId);
                if (itemIndex > -1) {
                    if (cart[itemIndex].qty > 1) {
                        cart[itemIndex].qty--;
                    } else {
                        // Remove if quantity becomes 0
                        cart = cart.filter(item => item.id !== itemId);
                    }
                    updateCartUI();
                }
            });

            incBtn.addEventListener('click', () => {
                const itemIndex = cart.findIndex(item => item.id === itemId);
                if (itemIndex > -1) {
                    cart[itemIndex].qty++;
                    updateCartUI();
                }
            });
        });
    }

    // Checkout Event
    checkoutBtn.addEventListener('click', () => {
        showToast("Directing you to secure checkout... Thank you for shopping!");
        setTimeout(() => {
            cart = [];
            updateCartUI();
            closeCart();
        }, 1500);
    });

    // ----------------------------------------------------
    // 6. WAITLIST FORM VALIDATION & SUBMISSION
    // ----------------------------------------------------
    
    // Realtime field validation helpers
    function validateName() {
        const value = vipNameInput.value.trim();
        if (value.length === 0) {
            vipNameInput.parentElement.classList.add('invalid');
            nameError.textContent = "Please enter your name.";
            return false;
        } else {
            vipNameInput.parentElement.classList.remove('invalid');
            return true;
        }
    }

    function validateEmail() {
        const value = vipEmailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (value.length === 0) {
            vipEmailInput.parentElement.classList.add('invalid');
            emailError.textContent = "Please enter your email address.";
            return false;
        } else if (!emailRegex.test(value)) {
            vipEmailInput.parentElement.classList.add('invalid');
            emailError.textContent = "Please enter a valid email address.";
            return false;
        } else {
            vipEmailInput.parentElement.classList.remove('invalid');
            return true;
        }
    }

    // Blur listeners for input validation feedback
    vipNameInput.addEventListener('blur', validateName);
    vipEmailInput.addEventListener('blur', validateEmail);

    vipNameInput.addEventListener('input', () => {
        if (vipNameInput.value.trim().length > 0) {
            vipNameInput.parentElement.classList.remove('invalid');
        }
    });

    vipEmailInput.addEventListener('input', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(vipEmailInput.value.trim())) {
            vipEmailInput.parentElement.classList.remove('invalid');
        }
    });

    // Form Submission
    waitlistForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateName();
        const isEmailValid = validateEmail();

        if (isNameValid && isEmailValid) {
            const submitBtn = waitlistForm.querySelector('.btn-submit');
            const originalBtnContent = submitBtn.innerHTML;

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span>Joining waitlist...</span>
                <svg class="loading-spinner" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10"></path>
                </svg>
            `;

            // Simulate server network latency
            setTimeout(() => {
                const userName = vipNameInput.value.trim();
                
                // Reset submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                
                // Show Success Message (elegant transition inside waitlist card)
                const waitlistCard = document.querySelector('.waitlist-card');
                
                // Save height to prevent layout jarring jumps
                const cardHeight = waitlistCard.offsetHeight;
                waitlistCard.style.minHeight = `${cardHeight}px`;

                // Fade out old content and show success message
                waitlistCard.innerHTML = `
                    <div class="success-message-state" style="opacity: 0; transform: translateY(15px); transition: var(--transition-smooth); padding: 20px 0;">
                        <div class="success-icon" style="color: var(--color-pink-deep); margin-bottom: 24px;">
                            <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" stroke-width="1.2" fill="none">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <span class="waitlist-tag">welcome to the list, ${userName}</span>
                        <h2 class="waitlist-title" style="font-size: 2.5rem; margin-bottom: 16px;">You're on the VIP List!</h2>
                        <p class="waitlist-description" style="margin-bottom: 0;">
                            We have sent your 15% off discount code to your inbox. Keep an eye out for updates as we get closer to launch day!
                        </p>
                    </div>
                `;

                // Trigger animation fade in
                setTimeout(() => {
                    const successState = document.querySelector('.success-message-state');
                    if (successState) {
                        successState.style.opacity = '1';
                        successState.style.transform = 'translateY(0)';
                    }
                }, 50);

            }, 1800);
        }
    });

    // CSS injection for form loading animation spinner
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .loading-spinner {
            display: inline-block;
            vertical-align: middle;
        }
    `;
    document.head.appendChild(styleSheet);
});
