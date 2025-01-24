document.addEventListener("DOMContentLoaded", () => {
    // Global Variables
    const API_BASE_URL =
        window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
            ? "http://localhost:5502/api/news" // Local backend
            : "https://global-insight.onrender.com/api/news"; // Production backend

    let currentPage = 1; // Declare currentPage as a global variable

    // Sidebar Toggle
    const menuToggle = document.getElementById("menu-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    const closeNav = document.getElementById("close-nav");

    const openSidebar = () => mobileNav?.classList.remove("-translate-x-full");
    const closeSidebar = () => mobileNav?.classList.add("-translate-x-full");

    menuToggle?.addEventListener("click", openSidebar);
    closeNav?.addEventListener("click", closeSidebar);

    // Scroll-to-Top Button
    const scrollToTopButton = createScrollToTopButton();
    document.body.appendChild(scrollToTopButton);

    // Event Listeners
    scrollToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", debounce(() => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            fetchNews("latest", latestNewsContainer, true);
            fetchNews("breaking", breakingNewsContainer, true);
            fetchNews("trending", trendingNewsContainer, true);
        }

        if (window.scrollY > 200) {
            scrollToTopButton.classList.remove("hidden");
            scrollToTopButton.classList.add("fade-in");
            scrollToTopButton.classList.remove("fade-out");
        } else {
            scrollToTopButton.classList.add("fade-out");
            scrollToTopButton.classList.remove("fade-in");
        }
    }, 100));

    // Dark Mode Toggle
    const themeToggle = document.getElementById("theme-toggle");
    const themeToggleDot = document.getElementById("theme-toggle-dot");
    const themeLabelLight = document.getElementById("theme-label-light");
    const themeLabelDark = document.getElementById("theme-label-dark");

    if (themeToggle && themeToggleDot && themeLabelLight && themeLabelDark) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            const isDarkMode = document.body.classList.contains("dark");
            localStorage.setItem("theme", isDarkMode ? "dark" : "light");
            updateThemeToggle(isDarkMode);
        });

        // Check saved theme preference
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.body.classList.add("dark");
            updateThemeToggle(true);
        }
    }

    // News Containers
    const latestNewsContainer = document.getElementById("latest-news-container");
    const breakingNewsContainer = document.getElementById("breaking-news-container");
    const trendingNewsContainer = document.getElementById("trending-news-container");

    // Initial Calls to Fetch News
    fetchNews("latest", latestNewsContainer);
    fetchNews("breaking", breakingNewsContainer);
    fetchNews("trending", trendingNewsContainer);

    // Newsletter Popup
    const newsletterPopup = document.getElementById("newsletter-popup");
    const closePopupButton = document.getElementById("close-popup");

    if (newsletterPopup && closePopupButton) {
        // Show popup after 5 seconds
        setTimeout(() => {
            newsletterPopup.classList.remove("hidden");
        }, 5000);

        // Close popup
        closePopupButton.addEventListener("click", () => {
            newsletterPopup.classList.add("hidden");
        });
    }

    // Utility Functions
    function createScrollToTopButton() {
        const button = document.createElement("button");
        button.className = "fixed bottom-6 right-6 bg-blue-700 text-white px-4 py-2 rounded shadow hidden";
        button.textContent = "↑ Top";
        button.setAttribute("aria-label", "Scroll to top");
        return button;
    }

    async function fetchNews(type, container, loadMore = false) {
        if (!loadMore) {
            container.innerHTML = "";
            currentPage = 1;
        }

        const loadingSpinner = document.getElementById("loading-spinner");
        loadingSpinner.classList.remove("hidden");

        try {
            const response = await fetch(`${API_BASE_URL}?type=${type}&page=${currentPage}`);
            if (!response.ok) throw new Error(`Failed to fetch ${type} news.`);
            const articles = await response.json();

            if (articles.length === 0 && !loadMore) {
                container.innerHTML = `<p class="text-center text-gray-500">No ${type} news found.</p>`;
                return;
            }

            articles.forEach(article => {
                container.insertAdjacentHTML("beforeend", createArticleCard(article));
            });

            currentPage++;
        } catch (error) {
            console.error(`Error fetching ${type} news:`, error.message);
            container.innerHTML = `<p class="text-center text-red-500">Failed to load ${type} news. Please try again later.</p>`;
        } finally {
            loadingSpinner.classList.add("hidden");
        }
    }

    function createArticleCard(article) {
        const truncatedBody = article.body?.length > 100 ? article.body.slice(0, 100) + "..." : article.body;
        return `
            <article class="bg-white shadow-md rounded-lg overflow-hidden news-card">
                <img src="${article.imageUrl || 'https://via.placeholder.com/300x200'}" 
                     alt="${sanitizeHTML(article.title || 'No headline')}" 
                     class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-xl font-semibold mb-2">${sanitizeHTML(article.title || 'Untitled')}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        ${sanitizeHTML(truncatedBody || 'No content available.')}
                        ${article.body?.length > 100 ? `<span class="text-blue-700 cursor-pointer" onclick="this.parentElement.innerHTML = '${sanitizeHTML(article.body)}'">Read More</span>` : ''}
                    </p>
                    <a href="${article.url || '#'}" class="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">Read More</a>
                </div>
            </article>`;
    }

    function updateThemeToggle(isDarkMode) {
        const themeToggleDot = document.getElementById("theme-toggle-dot");
        if (!themeToggleDot) return; // Exit if the element doesn't exist

        themeToggleDot.style.transform = isDarkMode ? "translateX(24px)" : "translateX(0)";
        themeLabelLight.classList.toggle("text-gray-900", !isDarkMode);
        themeLabelLight.classList.toggle("text-gray-400", isDarkMode);
        themeLabelDark.classList.toggle("text-gray-400", !isDarkMode);
        themeLabelDark.classList.toggle("text-gray-900", isDarkMode);
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function sanitizeHTML(str) {
        const temp = document.createElement("div");
        temp.textContent = str;
        return temp.innerHTML;
    }
});