document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute("href")).scrollIntoView({
                behavior: "smooth",
            });
        });
    });
  
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("fade-in-up");
                }
            });
        },
        {
            threshold: 0.1,
        }
    );
  
    document.querySelectorAll(".product-card, .product-section h2, .about-us h2, .about-us p").forEach((el) => {
        observer.observe(el);
    });
  
    // Floating pills animation
    createFloatingPills();
  
    // Dynamic background for product sections
    updateBackgrounds();
  
    // Call updateBackgrounds every 5 minutes
    setInterval(updateBackgrounds, 300000);
  
    // Add parallax effect event listener
    window.addEventListener("scroll", handleParallax);
  
    // Add to cart animation
    setupAddToCartAnimation();
  
    // Handle explore button clicks
    setupExploreButtons();
  
    // Account icon logout functionality
    setupAccountIconLogout();
  
    // Dynamic background for product page
    setupProductPageBackground();
  
    // Lazy loading images
    setupLazyLoadingImages();
  
    // Cart functionality
    setupCartFunctionality();
  
    // Buy button functionality
    setupBuyButton();
  });
  
  function createFloatingPills() {
    const container = document.querySelector(".floating-pills");
    if (container) {
        for (let i = 0; i < 20; i++) {
            const pill = document.createElement("div");
            pill.classList.add("pill");
            pill.style.left = `${Math.random() * 100}%`;
            pill.style.top = `${Math.random() * 100}%`;
            pill.style.width = `${Math.random() * 40 + 10}px`;
            pill.style.height = pill.style.width;
            pill.style.animationDuration = `${Math.random() * 10 + 5}s`;
            pill.style.animationDelay = `${Math.random() * 5}s`;
            container.appendChild(pill);
        }
    }
  }
  
  function updateBackgrounds() {
    const sections = document.querySelectorAll(".product-section");
    sections.forEach((section) => {
        const img = new Image();
        img.onload = function () {
            section.style.backgroundImage = `url(${this.src})`;
        };
        img.src = `https://source.unsplash.com/1600x900/?${section.id},medicine`;
    });
  }
  
  function handleParallax() {
    const scrolled = window.pageYOffset;
    document.querySelectorAll(".product-section").forEach((section) => {
        const limit = section.offsetTop + section.offsetHeight;
        if (scrolled > section.offsetTop && scrolled <= limit) {
            section.style.backgroundPositionY = `${(scrolled - section.offsetTop) / 5}px`;
        } else {
            section.style.backgroundPositionY = "0";
        }
    });
  }
  
  function addToCart(name, id, price) {
    console.log('Sending data:', { name, id, price });
    fetch('/add_to_cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            id: id,
            price: parseFloat(price)
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message || `${name} added to cart!`);
        } else {
            alert(data.error || 'Failed to add item to cart. Please try again.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
  }
  
  function setupAddToCartAnimation() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartIcon = document.querySelector('.fa-shopping-cart');
  
    if (addToCartButtons.length > 0 && cartIcon) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const product = this.closest('.product-card');
                const productRect = product.getBoundingClientRect();
                const cartRect = cartIcon.getBoundingClientRect();
                
                const ghost = product.cloneNode(true);
                ghost.style.position = 'fixed';
                ghost.style.left = `${productRect.left}px`;
                ghost.style.top = `${productRect.top}px`;
                ghost.style.width = `${productRect.width}px`;
                ghost.style.height = `${productRect.height}px`;
                ghost.style.opacity = '0.8';
                ghost.style.pointerEvents = 'none';
                ghost.style.zIndex = '1000';
                ghost.style.transition = 'all 0.5s ease-in-out';
                
                document.body.appendChild(ghost);
                
                setTimeout(() => {
                    ghost.style.left = `${cartRect.left}px`;
                    ghost.style.top = `${cartRect.top}px`;
                    ghost.style.width = '0';
                    ghost.style.height = '0';
                    ghost.style.opacity = '0';
                }, 50);
                
                setTimeout(() => {
                    ghost.remove();
                    cartIcon.classList.add('bounce');
                    setTimeout(() => cartIcon.classList.remove('bounce'), 300);
                }, 550);
  
                const name = this.dataset.name;
                const id = this.dataset.id;
                const price = this.dataset.price;
                addToCart(name, id, price);
            });
        });
    }
  }
  
  function setupExploreButtons() {
    const exploreButtons = document.querySelectorAll('.explore-btn');
    exploreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('Explore button clicked');
        });
    });
  }
  
  function setupAccountIconLogout() {
    const accountIcon = document.getElementById('accountIcon');
    if (accountIcon) {
        accountIcon.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                console.log('User confirmed logout');
                fetch('/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Logout successful');
                        window.location.href = '/';
                    } else {
                        console.error('Logout failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            } else {
                console.log('User cancelled logout');
            }
        });
    }
  }
  
  function setupProductPageBackground() {
    const productPage = document.querySelector('.product-page');
    if (productPage) {
        const img = new Image();
        img.onload = function() {
            productPage.style.backgroundImage = `url(${this.src})`;
        }
        img.src = 'https://source.unsplash.com/1600x900/?pharmacy';
    }
  }
  
  function setupLazyLoadingImages() {
    const images = document.querySelectorAll('.product-image img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                observer.unobserve(img);
            }
        });
    });
  
    images.forEach(img => {
        imageObserver.observe(img);
    });
  }
  
  function setupCartFunctionality() {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const removeButtons = document.querySelectorAll('.remove-item');
  
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateCartItem(this.dataset.id, this.value);
        });
    });
  
    removeButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            removeCartItem(this.dataset.id);
        });
    });
  }
  
  function setupBuyButton() {
    const buyBtn = document.getElementById('buy-btn');
    if (buyBtn) {
      buyBtn.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/order_form';
      });
    }
  }
  
  function updateCartItem(productId, quantity) {
    fetch('/update_cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `product_id=${productId}&quantity=${quantity}`
    }).then(response => {
        if (response.ok) {
            window.location.reload();
        } else {
            console.error('Failed to update cart');
        }
    }).catch(error => {
        console.error('Error updating cart:', error);
    });
  }
  
  function removeCartItem(productId) {
    console.log('Attempting to remove item with ID:', productId);
    fetch(`/remove_from_cart/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => {
        console.log('Remove item response:', response);
        if (response.ok) {
            window.location.reload();
        } else {
            console.error('Failed to remove item');
        }
    }).catch(error => {
        console.error('Error removing item:', error);
    });
  } 