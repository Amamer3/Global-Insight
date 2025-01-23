document.addEventListener("DOMContentLoaded", () => {
    // Helper function to sanitize HTML
    // const sanitizeHTML = (str) => {
    //     const div = document.createElement("div");
    //     div.textContent = str;
    //     return div.innerHTML;
    // };

    // Sidebar Toggle
    const menuToggle = document.getElementById("menu-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    const closeNav = document.getElementById("close-nav");

    const openSidebar = () => mobileNav?.classList.remove("-translate-x-full");
    const closeSidebar = () => mobileNav?.classList.add("-translate-x-full");

    menuToggle?.addEventListener("click", openSidebar);
    closeNav?.addEventListener("click", closeSidebar);

   // Global Variables
const API_BASE_URL =
window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5502/api/news"
    : "https://global-insight.onrender.com/api/news";

// News Containers
const latestNewsContainer = document.getElementById("latest-news-container");
const breakingNewsContainer = document.getElementById("breaking-news-container");
const trendingNewsContainer = document.getElementById("trending-news-container");

// Scroll-to-Top Button
const scrollToTopButton = document.createElement("button");
scrollToTopButton.className =
"fixed bottom-6 right-6 bg-blue-700 text-white px-4 py-2 rounded shadow hidden";
scrollToTopButton.textContent = "↑ Top";
document.body.appendChild(scrollToTopButton);

scrollToTopButton.addEventListener("click", () => {
window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
if (window.scrollY > 200) {
    scrollToTopButton.classList.remove("hidden");
} else {
    scrollToTopButton.classList.add("hidden");
}
});

// Fetch Latest Headlines
const fetchLatestHeadlines = async () => {
latestNewsContainer.innerHTML = "";
addSkeletonLoaders(latestNewsContainer);

try {
    const response = await fetch(`${API_BASE_URL}?type=latest`);
    if (!response.ok) throw new Error("Failed to fetch latest headlines.");
    const articles = await response.json();

    removeSkeletonLoaders(latestNewsContainer);

    if (articles.length === 0) {
        latestNewsContainer.innerHTML = '<p class="text-center text-gray-500">No latest headlines found.</p>';
        return;
    }

    articles.forEach(article => {
        const newCard = createArticleCard(article);
        latestNewsContainer.insertAdjacentHTML('beforeend', newCard);
    });
} catch (error) {
    console.error(error.message);
    latestNewsContainer.innerHTML = '<p class="text-center text-red-500">Failed to load latest headlines. Please try again later.</p>';
}
};

// Fetch Breaking News
const fetchBreakingNews = async () => {
breakingNewsContainer.innerHTML = "";
addSkeletonLoaders(breakingNewsContainer);

try {
    const response = await fetch(`${API_BASE_URL}?type=breaking`);
    if (!response.ok) throw new Error("Failed to fetch breaking news.");
    const articles = await response.json();

    removeSkeletonLoaders(breakingNewsContainer);

    if (articles.length === 0) {
        breakingNewsContainer.innerHTML = '<p class="text-center text-gray-500">No breaking news found.</p>';
        return;
    }

    articles.forEach(article => {
        const newCard = createArticleCard(article);
        breakingNewsContainer.insertAdjacentHTML('beforeend', newCard);
    });
} catch (error) {
    console.error(error.message);
    breakingNewsContainer.innerHTML = '<p class="text-center text-red-500">Failed to load breaking news. Please try again later.</p>';
}
};

// Fetch Trending News
const fetchTrendingNews = async () => {
trendingNewsContainer.innerHTML = "";
addSkeletonLoaders(trendingNewsContainer);

try {
    const response = await fetch(`${API_BASE_URL}?type=trending`);
    if (!response.ok) throw new Error("Failed to fetch trending news.");
    const articles = await response.json();

    removeSkeletonLoaders(trendingNewsContainer);

    if (!articles || articles.length === 0) {
        trendingNewsContainer.innerHTML = '<p class="text-center text-gray-500">No trending news found.</p>';
        return;
    }

    articles.forEach(article => {
        const newCard = createArticleCard(article);
        trendingNewsContainer.insertAdjacentHTML('beforeend', newCard);
    });
} catch (error) {
    console.error("Error fetching trending news:", error);
    trendingNewsContainer.innerHTML = `
        <p class="text-center text-red-500">
            Failed to load trending news. Please try again later.
        </p>`;
}
};

// Utility Functions
const createArticleCard = (article) => {
return `
    <article class="bg-white shadow-md rounded-lg overflow-hidden">
        <img src="${article.imageUrl || 'https://via.placeholder.com/300x200'}" 
             alt="${sanitizeHTML(article.title || 'No headline')}" 
             class="w-full h-48 object-cover">
        <div class="p-4">
            <h3 class="text-xl font-semibold mb-2">${sanitizeHTML(article.title || 'Untitled')}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${sanitizeHTML(article.body || 'No content available.')}</p>
            <a href="${article.url || '#'}" class="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">Read More</a>
        </div>
    </article>`;
};

const addSkeletonLoaders = (container) => {
for (let i = 0; i < 3; i++) {
    const skeleton = `
        <div class="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg h-48 mb-6"></div>`;
    container.insertAdjacentHTML("beforeend", skeleton);
}
};

const removeSkeletonLoaders = (container) => {
const loaders = container.querySelectorAll(".animate-pulse");
loaders.forEach(loader => loader.remove());
};

const sanitizeHTML = (str) => {
const temp = document.createElement("div");
temp.textContent = str;
return temp.innerHTML;
};

// Initial Calls to Fetch News
fetchLatestHeadlines();
fetchBreakingNews();
fetchTrendingNews();

});
