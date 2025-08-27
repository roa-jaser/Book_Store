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
//////////////////////////////////////////////////////////////////////////////////////////////
// تغير الوضع من النهاري الي الليلي  والعكس صحيح
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// عند تحميل الصفحة، نشيك إذا فيه وضع محفوظ
if (localStorage.getItem("theme") === "dark") {
body.classList.add("dark-mode");
}

themeToggle.addEventListener("click", () => {
body.classList.toggle("dark-mode");

  // حفظ الوضع في localStorage
    if (body.classList.contains("dark-mode")) 
    {
    localStorage.setItem("theme", "dark");
    } 
    else {
    localStorage.setItem("theme", "light");
        }
});

//  change the main color to the chosen color

// const colorIcon = document.getElementById('colorIcon');
//     const colorPicker = document.getElementById('colorPicker');

//     colorIcon.addEventListener('click', () => {
//         colorPicker.click();
//     });

//     colorPicker.addEventListener('input', (e) => {
//         const color = e.target.value;
//         document.documentElement.style.setProperty('--main-color', color);
//         document.documentElement.style.setProperty('--hover-color', color);
//         });

  const colorIcon = document.getElementById('colorIcon');
    const colorPicker = document.getElementById('colorPicker');

    // لما اضغط على الايقونة يفتح color picker
    colorIcon.addEventListener('click', () => {
        colorPicker.click();
    });

    // لما اختار لون جديد
    colorPicker.addEventListener('input', (e) => {
        const color = e.target.value;
        // غيّر القيم
        document.documentElement.style.setProperty('--main-color', color);
        document.documentElement.style.setProperty('--hover-color', color);

        // خزّن اللون بالـ localStorage
        localStorage.setItem('themeColor', color);
    });

    // عند تحميل الصفحة استرجع اللون إذا كان محفوظ
    window.addEventListener('load', () => {
        const savedColor = localStorage.getItem('themeColor');
        if (savedColor) {
            document.documentElement.style.setProperty('--main-color', savedColor);
            document.documentElement.style.setProperty('--hover-color', savedColor);
            colorPicker.value = savedColor; // عشان يبين نفس اللون في الـ picker
        }
    });