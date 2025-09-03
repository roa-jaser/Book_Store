const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("nav ul");
const closeMenu = document.querySelector(".close-menu");

//open the humburger menu and add the active class
hamburger.addEventListener("click", () => {
navMenu.classList.add("active");
});

// on click on the x icone we remove the class active and close the menu
closeMenu.addEventListener("click", () => {
navMenu.classList.remove("active");
});
///////////////////////////////////////////////////////////
//change between the dark mode and ligth mode 
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// on load the page check if we save a previes mode ?
if (localStorage.getItem("theme") === "dark") {
body.classList.add("dark-mode");
}

themeToggle.addEventListener("click", () => {
body.classList.toggle("dark-mode");
  // save on localStorage
    if (body.classList.contains("dark-mode")) 
    {
    localStorage.setItem("theme", "dark");
    } 
    else {
    localStorage.setItem("theme", "light");
        }
                                            });

/////////////////////////////////////////////////////

const colorIcon = document.getElementById('colorIcon');
    const colorPicker = document.getElementById('colorPicker');

    // on click on icon open color picker
    colorIcon.addEventListener('click', () => {
        colorPicker.click();
    });
// on choose a color
    colorPicker.addEventListener('input', (e) => {
        const color = e.target.value;
         // change the color 
        document.documentElement.style.setProperty('--main-color', color);
        document.documentElement.style.setProperty('--hover-color', color);

        //save on localStorage
        localStorage.setItem('themeColor', color);
    });

// When the page loads, restore the color if it is saved.
window.addEventListener('load', () => {
        const savedColor = localStorage.getItem('themeColor');
        if (savedColor) {
            document.documentElement.style.setProperty('--main-color', savedColor);
            document.documentElement.style.setProperty('--hover-color', savedColor);
            colorPicker.value = savedColor;
        }
    });




//////////////////////////////////////// البحث
// ===== Setup: Find/Create Search Elements =====
(function initSearchUI() {
    const iconsBar = document.querySelector(".icons");
    if (!iconsBar) return;

    // Find search icon by ID or first .fa-search inside .icons
    let searchIcon = document.getElementById("search-icon") || iconsBar.querySelector(".fa-search, .fas.fa-search");
    if (!searchIcon) {
        // If not found, create one
        searchIcon = document.createElement("i");
        searchIcon.className = "fas fa-search";
        iconsBar.prepend(searchIcon);
    }

    // Find search box or create one if not exist
    let searchBox = document.getElementById("search-box");
    if (!searchBox) {
        const container = document.createElement("div");
        container.className = "search-container";

        searchBox = document.createElement("input");
        searchBox.type = "text";
        searchBox.id = "search-box";
        searchBox.placeholder = "search here ...";
        searchBox.style.display = "none"; // hidden by default

        container.appendChild(searchBox);
        searchIcon.insertAdjacentElement("afterend", container);
    }

    // Attach events
    setupSearchLogic(searchIcon, searchBox);
})();

// ===== Search and Highlight Logic =====
function setupSearchLogic(searchIcon, searchBox) {
    let matches = [];
    let currentIndex = -1;

    // Show/hide search box on icon click
    searchIcon.addEventListener("click", () => {
        const visible = searchBox.style.display !== "none";
        if (visible) {
            searchBox.style.display = "none";
            searchBox.value = "";
            clearHighlights();
            matches = [];
            currentIndex = -1;
        } else {
            searchBox.style.display = "inline-block";
            searchBox.focus();
        }
    });

    // On input
    searchBox.addEventListener("input", () => {
        const raw = searchBox.value;

        // If text ends with space, clear highlights only
        if (/\s$/.test(raw)) {
            clearHighlights();
            matches = [];
            currentIndex = -1;
            return;
        }

        const term = raw.split(/\s+/).pop().trim();
        clearHighlights();
        matches = [];
        currentIndex = -1;

        if (term.length > 0) {
            matches = highlightTermEverywhere(term);
        }
    });

    // Navigate matches
    searchBox.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && matches.length > 0) {
            e.preventDefault();

            // Remove previous highlight
            matches.forEach(el => el.classList.remove("current-highlight"));

            // Move to next match
            currentIndex = (currentIndex + 1) % matches.length;
            const cur = matches[currentIndex];
            cur.classList.add("current-highlight");
            cur.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        if (e.key === "Escape") {
            searchBox.style.display = "none";
            searchBox.value = "";
            clearHighlights();
            matches = [];
            currentIndex = -1;
        }
    });

    // ===== Helper Functions =====

    // Highlight all matches of term in the page
    function highlightTermEverywhere(term) {
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        if (!escaped) return [];
        const re = new RegExp(escaped, "gi");

        const textNodes = collectTextNodes(document.body, (node) => {
            const p = node.parentElement;
            if (!p) return false;

            const tag = p.tagName ? p.tagName.toLowerCase() : "";
            if (["script","style","noscript","svg","canvas","textarea","input","select"].includes(tag)) return false;
            if (p.closest(".search-container")) return false;
            if (!node.nodeValue || !node.nodeValue.trim()) return false;

            return node.nodeValue.search(re) !== -1;
        });

        textNodes.forEach(node => wrapMatchesInNode(node, re));

        return Array.from(document.querySelectorAll(".highlight"));
    }

    // Collect text nodes using TreeWalker
    function collectTextNodes(root, predicate) {
        const out = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                try {
                    return predicate(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                } catch {
                    return NodeFilter.FILTER_REJECT;
                }
            }
        });

        let n = walker.nextNode();
        while (n) {
            out.push(n);
            n = walker.nextNode();
        }

        return out;
    }

    // Wrap matches in <span class="highlight">
    function wrapMatchesInNode(textNode, re) {
        const text = textNode.nodeValue;
        let lastIndex = 0;
        let m;
        const frag = document.createDocumentFragment();

        while ((m = re.exec(text)) !== null) {
            const start = m.index;
            const end = start + m[0].length;

            if (start > lastIndex) {
                frag.appendChild(document.createTextNode(text.slice(lastIndex, start)));
            }

            const span = document.createElement("span");
            span.className = "highlight";
            span.textContent = m[0];
            frag.appendChild(span);

            lastIndex = end;
        }

        if (lastIndex < text.length) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        if (frag.childNodes.length > 0) {
            textNode.parentNode.replaceChild(frag, textNode);
        }
    }

    // Clear all highlights
    function clearHighlights() {
        const highlighted = document.querySelectorAll(".highlight, .current-highlight");
        highlighted.forEach(span => {
            const text = document.createTextNode(span.textContent);
            span.parentNode.replaceChild(text, span);
            mergeAdjacentTextNodes(text);
        });
    }

    // Merge adjacent text nodes to reduce fragmentation
    function mergeAdjacentTextNodes(node) {
        const prev = node.previousSibling;
        const next = node.nextSibling;

        if (prev && prev.nodeType === 3) {
            prev.nodeValue += node.nodeValue;
            node.parentNode.removeChild(node);
            node = prev;
        }

        if (next && next.nodeType === 3) {
            node.nodeValue += next.nodeValue;
            next.parentNode.removeChild(next);
        }
    }
}

// Arrival Books Section
const arrivalsContainer = document.getElementById("arrivalsContainer");

const arrivals = [
    "arrival_1.jpg",
    "arrival_2.jpg",
    "arrival_3.jpg",
    "arrival_4.jpg",
    "arrival_5.jpg",
    "arrival_6.jpg",
    "arrival_7.jpg",
    "arrival_8.webp",
    "arrival_9.jpg",
    "arrival_10.jpg"
];

    arrivals.forEach((file, i) => {
    arrivalsContainer.innerHTML += `
        <div class="arrivals_cards">
        <img src="image/${file}" alt="arrival_${i+1}">
        <p>New Arrivals</p>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <span class="half-star">
            <i class="fa-regular fa-star"></i>
            <i class="fa-solid fa-star"></i>
        </span>
        <br>
        <button>Learn More</button>
        </div>
    `;
    });

    //  Featured Books Section
    const container = document.getElementById("booksContainer");

    const books = [
    "book_1.jpg",
    "book_2.jpg",
    "book_3.jpg",
    "book_4.jpg",
    "book_5.jpg",
    "book_6.jpg",
    "book_7.png",
    "book_8.png",
    "book_9.jpg",
    "book_10.png",
    "book_11.jpg",
    "book_12.png",
    "book_13.png",
    "book_14.png",
    "book_15.png",
    ];

    books.forEach((file, i) => {
    container.innerHTML += `
        <div class="bok_card" id="book-${i + 1}">
        <div class="book_img"><img src="image/${file}" alt="Book ${i + 1}"></div>
        <div class="book_tag">
            <h2>Featured Book</h2>
            <p class="write">John Deo</p>
            <div class="type">Thriller, Horror, Romance</div>
            <p class="price">25.50$ <sub><del>$28.06</del></sub></p>
            <a href="#" class="b_btn">Learn More</a>
        </div>
        </div>
    `;
    });