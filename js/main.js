document.addEventListener("DOMContentLoaded", () => {
    // 1. PRELOADER DISMISSAL
    const preloader = document.querySelector(".preloader");
    if (preloader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                preloader.classList.add("fade-out");
                // Trigger page-entry animations if GSAP is available
                if (typeof gsap !== "undefined") {
                    triggerEntryAnimations();
                }
            }, 600);
        });
        
        // Fallback preloader dismissal if load event takes too long
        setTimeout(() => {
            preloader.classList.add("fade-out");
        }, 3000);
    }

    // 2. STICKY GLASSMORPHISM NAVBAR
    const header = document.querySelector(".header-wrapper");
    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }

    // 3. MOBILE MENU TOGGLE
    const mobileToggle = document.querySelector(".mobile-nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            const icon = mobileToggle.querySelector("i");
            if (icon) {
                if (navMenu.classList.contains("active")) {
                    icon.className = "fa-solid fa-xmark";
                } else {
                    icon.className = "fa-solid fa-bars";
                }
            }
        });
        
        // Close menu on click of nav items (mobile)
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (!link.classList.contains("dropdown-trigger")) {
                    navMenu.classList.remove("active");
                    const icon = mobileToggle.querySelector("i");
                    if (icon) icon.className = "fa-solid fa-bars";
                }
            });
        });
    }

    // 4. MOBILE NAVIGATION DROPDOWNS
    const dropdownTriggers = document.querySelectorAll(".dropdown-trigger");
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = trigger.closest(".dropdown");
                parent.classList.toggle("active");
            }
        });
    });

    // 5. FAQ ACCORDIONS
    const accordionHeaders = document.querySelectorAll(".accordion-header");
    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.closest(".accordion-item");
            const isAlreadyActive = item.classList.contains("active");
            
            // Close other items
            const activeItems = document.querySelectorAll(".accordion-item.active");
            activeItems.forEach(activeItem => {
                activeItem.classList.remove("active");
                activeItem.querySelector(".accordion-content").style.maxHeight = null;
            });
            
            // Toggle current item
            if (!isAlreadyActive) {
                item.classList.add("active");
                const content = item.querySelector(".accordion-content");
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // 6. STATISTICS COUNTER ANIMATION (Intersection Observer)
    const counters = document.querySelectorAll(".counter-value");
    if (counters.length > 0) {
        const countUp = (counter) => {
            const target = parseInt(counter.getAttribute("data-target"), 10);
            const duration = 2000; // 2 seconds
            const stepTime = Math.abs(Math.floor(duration / target));
            let current = 0;
            
            const timer = setInterval(() => {
                current += Math.ceil(target / 50); // Increment
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = current;
                }
            }, 30);
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countUp(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // 7. PATIENT TESTIMONIALS SLIDER
    const testimonialsSlider = document.querySelector(".testimonials-track");
    if (testimonialsSlider) {
        const slides = document.querySelectorAll(".testimonial-slide");
        const prevBtn = document.querySelector(".slider-btn-prev");
        const nextBtn = document.querySelector(".slider-btn-next");
        let currentIndex = 0;
        
        const updateSlider = () => {
            testimonialsSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
        };
        
        if (nextBtn && prevBtn) {
            nextBtn.addEventListener("click", () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlider();
            });
            
            prevBtn.addEventListener("click", () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateSlider();
            });
        }
        
        // Auto-play slider every 7 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        }, 7000);
    }

    // 7b. MEET FEATURED DOCTORS SLIDER
    const doctorsSlider = document.querySelector(".doctors-track");
    if (doctorsSlider) {
        const slides = document.querySelectorAll(".doctor-slide");
        const prevBtn = document.querySelector(".doc-btn-prev");
        const nextBtn = document.querySelector(".doc-btn-next");
        let currentIndex = 0;
        
        const getItemsPerView = () => {
            if (window.innerWidth > 1024) return 3;
            if (window.innerWidth > 768) return 2;
            return 1;
        };
        
        const updateSlider = () => {
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, slides.length - itemsPerView);
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            const slideWidthPercent = 100 / itemsPerView;
            doctorsSlider.style.transform = `translateX(-${currentIndex * slideWidthPercent}%)`;
        };
        
        if (nextBtn && prevBtn) {
            nextBtn.addEventListener("click", () => {
                const itemsPerView = getItemsPerView();
                const maxIndex = Math.max(0, slides.length - itemsPerView);
                if (currentIndex < maxIndex) {
                    currentIndex++;
                } else {
                    currentIndex = 0; // wrap around
                }
                updateSlider();
            });
            
            prevBtn.addEventListener("click", () => {
                const itemsPerView = getItemsPerView();
                const maxIndex = Math.max(0, slides.length - itemsPerView);
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = maxIndex; // wrap around to end
                }
                updateSlider();
            });
        }
        
        // Handle window resizing
        window.addEventListener("resize", updateSlider);
        
        // Auto-play slider every 8 seconds
        setInterval(() => {
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, slides.length - itemsPerView);
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, 8000);
        
        // Initial setup
        updateSlider();
    }

    // 7c. FEATURED SPECIALITIES SLIDER
    const specialitiesSlider = document.querySelector(".specialities-track");
    if (specialitiesSlider) {
        const slides = document.querySelectorAll(".speciality-slide");
        const prevBtn = document.querySelector(".spec-btn-prev");
        const nextBtn = document.querySelector(".spec-btn-next");
        let currentIndex = 0;
        
        const getItemsPerView = () => {
            if (window.innerWidth > 1024) return 3;
            if (window.innerWidth > 768) return 2;
            return 1;
        };
        
        const updateSlider = () => {
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, slides.length - itemsPerView);
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            const slideWidthPercent = 100 / itemsPerView;
            specialitiesSlider.style.transform = `translateX(-${currentIndex * slideWidthPercent}%)`;
        };
        
        if (nextBtn && prevBtn) {
            nextBtn.addEventListener("click", () => {
                const itemsPerView = getItemsPerView();
                const maxIndex = Math.max(0, slides.length - itemsPerView);
                if (currentIndex < maxIndex) {
                    currentIndex++;
                } else {
                    currentIndex = 0; // wrap around
                }
                updateSlider();
            });
            
            prevBtn.addEventListener("click", () => {
                const itemsPerView = getItemsPerView();
                const maxIndex = Math.max(0, slides.length - itemsPerView);
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = maxIndex; // wrap around to end
                }
                updateSlider();
            });
        }
        
        // Handle window resizing
        window.addEventListener("resize", updateSlider);
        
        // Auto-play slider every 8 seconds
        setInterval(() => {
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, slides.length - itemsPerView);
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, 8000);
        
        // Initial setup
        updateSlider();
    }

    // 7d. INFRASTRUCTURE & FACILITIES SLIDER
    const facilitiesSlider = document.querySelector(".facilities-track");
    if (facilitiesSlider) {
        const slides = document.querySelectorAll(".facility-slide");
        const prevBtn = document.querySelector(".fac-btn-prev");
        const nextBtn = document.querySelector(".fac-btn-next");
        let currentIndex = 0;
        
        const getItemsPerView = () => {
            if (window.innerWidth > 1024) return 3;
            if (window.innerWidth > 768) return 2;
            return 1;
        };
        
        const updateSlider = () => {
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, slides.length - itemsPerView);
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            const slideWidthPercent = 100 / itemsPerView;
            facilitiesSlider.style.transform = `translateX(-${currentIndex * slideWidthPercent}%)`;
        };
        
        if (nextBtn && prevBtn) {
            nextBtn.addEventListener("click", () => {
                const itemsPerView = getItemsPerView();
                const maxIndex = Math.max(0, slides.length - itemsPerView);
                if (currentIndex < maxIndex) {
                    currentIndex++;
                } else {
                    currentIndex = 0; // wrap around
                }
                updateSlider();
            });
            
            prevBtn.addEventListener("click", () => {
                const itemsPerView = getItemsPerView();
                const maxIndex = Math.max(0, slides.length - itemsPerView);
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = maxIndex; // wrap around to end
                }
                updateSlider();
            });
        }
        
        // Handle window resizing
        window.addEventListener("resize", updateSlider);
        
        // Auto-play slider every 8 seconds
        setInterval(() => {
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, slides.length - itemsPerView);
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, 8000);
        
        // Initial setup
        updateSlider();
    }

    // 8. TOAST NOTIFICATION HELPERS
    window.showToast = (title, message, type = "success") => {
        let container = document.querySelector(".toast-container");
        if (!container) {
            container = document.createElement("div");
            container.className = "toast-container";
            document.body.appendChild(container);
        }
        
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        
        const iconClass = type === "success" ? "fa-solid fa-circle-check" : "fa-solid fa-circle-exclamation";
        
        toast.innerHTML = `
            <div class="toast-icon"><i class="${iconClass}"></i></div>
            <div class="toast-content">
                <span class="toast-title">${title}</span>
                <span class="toast-message">${message}</span>
            </div>
        `;
        
        container.appendChild(toast);
        
        // Trigger show class
        setTimeout(() => toast.classList.add("show"), 10);
        
        // Remove toast after 4s
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    };

    // GSAP PAGE ENTRY ANIMATION ROUTINE
    function triggerEntryAnimations() {
        if (typeof gsap === "undefined") return;
        
        // Register ScrollTrigger if available
        if (typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        // Animate Hero Header Elements
        gsap.from(".hero-content > *", {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
        
        gsap.from(".hero-badge-container", {
            x: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
        
        // Scroll trigger reveals for normal section items
        const revealElements = document.querySelectorAll(".scroll-reveal");
        revealElements.forEach(elem => {
            gsap.from(elem, {
                scrollTrigger: {
                    trigger: elem,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });
        
        // Stagger grid reveal triggers
        const gridReveals = document.querySelectorAll(".grid-reveal");
        gridReveals.forEach(grid => {
            const items = grid.children;
            gsap.from(items, {
                scrollTrigger: {
                    trigger: grid,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out"
            });
        });
    }
});
