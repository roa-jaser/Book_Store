const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("nav ul");
const closeMenu = document.querySelector(".close-menu");

// فتح القائمة
hamburger.addEventListener("click", () => {
    navMenu.classList.add("active");
});

// إغلاق القائمة عند الضغط على أيقونة X
closeMenu.addEventListener("click", () => {
    navMenu.classList.remove("active");
});
