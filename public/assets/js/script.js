document.addEventListener("DOMContentLoaded", () => {
    // Sidebar Toggle
    const menuToggle = document.getElementById("menu-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    const closeNav = document.getElementById("close-nav");
    const themeToggle = document.getElementById("theme-toggle");

    const openSidebar = () => {
        if (mobileNav) mobileNav.classList.remove("-translate-x-full");
    };

    const closeSidebar = () => {
        if (mobileNav) mobileNav.classList.add("-translate-x-full");
    };

    if (menuToggle) {
        menuToggle.addEventListener("click", openSidebar);
    }

    if (closeNav) {
        closeNav.addEventListener("click", closeSidebar);
    }

    if (mobileNav) {
        const navLinks = mobileNav.querySelectorAll("a");
        navLinks.forEach(link => {
            link.addEventListener("click", closeSidebar);
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            themeToggle.classList.toggle("active");
        });
    }

    // Load More Articles
    const loadMoreButton = document.getElementById("load-more");
    loadMoreButton.addEventListener("click", () => {
        loadMoreButton.disabled = true;
        loadMoreButton.textContent = "Loading...";

        setTimeout(() => {
            const newCard = `
                <article class="bg-white shadow-md rounded-lg overflow-hidden">
                    <img src="https://via.placeholder.com/300x200" alt="Headline" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h3 class="text-xl font-semibold mb-2">New Headline</h3>
                        <p class="text-sm text-gray-600 mb-4">A brief description of the news article...</p>
                        <a href="#" class="text-blue-700 hover:underline">Read More</a>
                    </div>
                </article>`;
            
            const featuredContainer = document.getElementById("featured-container");
            featuredContainer.insertAdjacentHTML('beforeend', newCard);

            loadMoreButton.disabled = false;
            loadMoreButton.textContent = "Load More";
        }, 1500);
    });

    // Trending News Carousel
    const carousel = document.getElementById("carousel");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");

    const cardWidth = 300; // Card width including margin
    const cardsToScroll = 3; // Number of cards to scroll at a time
    const scrollStep = cardWidth * cardsToScroll; // Total scroll amount per click
    const totalCards = carousel.children.length;
    const visibleCards = 3; // Number of visible cards at a time
    const maxScroll = cardWidth * (totalCards - visibleCards);

    let scrollAmount = 0;

    // Scroll to the left
    prevBtn.addEventListener("click", () => {
        scrollAmount = Math.max(0, scrollAmount - scrollStep);
        carousel.style.transform = `translateX(-${scrollAmount}px)`;
    });

    // Scroll to the right
    nextBtn.addEventListener("click", () => {
        scrollAmount = Math.min(maxScroll, scrollAmount + scrollStep);
        carousel.style.transform = `translateX(-${scrollAmount}px)`;
    });

    // Ensure responsive behavior for visible cards on resize
    window.addEventListener("resize", () => {
        scrollAmount = Math.min(scrollAmount, maxScroll);
        carousel.style.transform = `translateX(-${scrollAmount}px)`;
    });

});
