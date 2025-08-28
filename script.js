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
//////////////////////////////////////////////////////////////////////////////////////////////
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
             // عشان يبين نفس اللون في الـ picker
        }
    });