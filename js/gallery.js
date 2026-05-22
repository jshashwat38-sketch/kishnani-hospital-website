document.addEventListener("DOMContentLoaded", () => {
    // 1. DYNAMIC GALLERY FILTERING
    const filterButtons = document.querySelectorAll(".gallery-filter-tabs .filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-grid .gallery-item");

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                // Change active tab
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                const filterValue = button.getAttribute("data-filter");

                // GSAP filter animation if available, else standard CSS fade
                if (typeof gsap !== "undefined") {
                    const itemsToHide = [];
                    const itemsToShow = [];

                    galleryItems.forEach(item => {
                        const itemCategory = item.getAttribute("data-category");
                        if (filterValue === "all" || itemCategory === filterValue) {
                            itemsToShow.push(item);
                        } else {
                            itemsToHide.push(item);
                        }
                    });

                    // Hide mismatched items
                    if (itemsToHide.length > 0) {
                        gsap.to(itemsToHide, {
                            scale: 0.8,
                            opacity: 0,
                            duration: 0.3,
                            stagger: 0.05,
                            onComplete: () => {
                                itemsToHide.forEach(item => item.style.display = "none");
                            }
                        });
                    }

                    // Show matched items
                    itemsToShow.forEach(item => item.style.display = "block");
                    gsap.fromTo(itemsToShow, 
                        { scale: 0.8, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.1 }
                    );
                } else {
                    // Fallback filtering
                    galleryItems.forEach(item => {
                        const itemCategory = item.getAttribute("data-category");
                        if (filterValue === "all" || itemCategory === filterValue) {
                            item.style.display = "block";
                            setTimeout(() => item.style.opacity = "1", 10);
                        } else {
                            item.style.opacity = "0";
                            setTimeout(() => item.style.display = "none", 300);
                        }
                    });
                }
            });
        });
    }

    // 2. DYNAMIC LIGHTBOX OVERLAY
    let lightbox = document.querySelector(".lightbox");
    if (!lightbox) {
        // Create lightbox HTML dynamically if not in file
        lightbox = document.createElement("div");
        lightbox.className = "lightbox";
        lightbox.innerHTML = `
            <div class="lightbox-content-wrapper">
                <span class="lightbox-close"><i class="fa-solid fa-xmark"></i></span>
                <img src="" alt="" class="lightbox-img">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector(".lightbox-img");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    const lightboxClose = lightbox.querySelector(".lightbox-close");

    // Open Lightbox
    const triggerLightbox = (item) => {
        const img = item.querySelector("img");
        const captionText = item.querySelector(".gallery-item-title")?.textContent || img.getAttribute("alt");
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = captionText;
        
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent background scroll
    };

    // Event Delegation for gallery items (handles filter updates perfectly)
    const galleryGrid = document.querySelector(".gallery-grid");
    if (galleryGrid) {
        galleryGrid.addEventListener("click", (e) => {
            const item = e.target.closest(".gallery-item");
            if (item) {
                triggerLightbox(item);
            }
        });
    }

    // Close Lightbox Actions
    const closeLightbox = () => {
        lightbox.classList.remove("active");
        document.body.style.overflow = ""; // Enable scroll
    };

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox || e.target.classList.contains("lightbox-content-wrapper")) {
            closeLightbox();
        }
    });

    // Escape Key Support for closing lightbox
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.classList.contains("active")) {
            closeLightbox();
        }
    });
});
