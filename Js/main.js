<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Moderne</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://kit.fontawesome.com/your-code.js" crossorigin="anonymous"></script>
</head>
<script>
  // --- SÉLECTEURS ---
const navContainer = document.querySelector(".nav-container");
const navLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section");
const changingText = document.querySelector(".changing-text");
const preLoad = document.querySelector(".pre-load");

// --- 1. GESTION DU THÈME & COULEURS ---
const updateMode = (mode) => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("mode", mode);
};

document.querySelectorAll(".mode").forEach(btn => {
    btn.addEventListener("click", () => updateMode(btn.id));
});

document.querySelectorAll(".colors span").forEach(span => {
    span.addEventListener("click", () => {
        const color = span.dataset.color;
        document.documentElement.style.setProperty('--main-color', color);
        localStorage.setItem("main-color", color);
    });
});

// --- 2. ANIMATION DU TEXTE (Typewriter) ---
const texts = {
    EN: ["Full-Stack Developer", "Web Designer", "Freelancer"],
    AR: ["مبرمج ويب", "مصمم مواقع", "مستقل"]
};
let lang = localStorage.getItem("lang") || "EN";
let charIdx = 0, textIdx = 0, isDeleting = false;

function typeEffect() {
    const currentText = texts[lang][textIdx];
    changingText.textContent = isDeleting 
        ? currentText.substring(0, charIdx--) 
        : currentText.substring(0, charIdx++);

    let speed = isDeleting ? 50 : 150;
    if (!isDeleting && charIdx === currentText.length + 1) {
        isDeleting = true; speed = 2000; // Pause à la fin
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false; textIdx = (textIdx + 1) % texts[lang].length;
    }
    setTimeout(typeEffect, speed);
}

// --- 3. SCROLL INTELLIGENT (Intersection Observer) ---
const observerOptions = { threshold: 0.6 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Activer le lien menu
            navLinks.forEach(link => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
            // Animer les skills si visible
            if (entry.target.id === "skills") {
                document.querySelectorAll(".percent").forEach(p => p.style.width = p.dataset.percent + "%");
            }
        }
    });
}, observerOptions);

sections.forEach(sec => observer.observe(sec));

// --- 4. INITIALISATION ---
window.addEventListener("DOMContentLoaded", () => {
    // Restaurer préférences
    if (localStorage.getItem("mode")) updateMode(localStorage.getItem("mode"));
    if (localStorage.getItem("main-color")) {
        document.documentElement.style.setProperty('--main-color', localStorage.getItem("main-color"));
    }
    
    // Lancer Typewriter
    typeEffect();

    // Cacher Loader
    setTimeout(() => {
        preLoad.style.opacity = "0";
        setTimeout(() => preLoad.style.display = "none", 500);
    }, 1500);

    // Cookies
    if (!localStorage.getItem("cookies-accepted")) {
        setTimeout(() => document.querySelector(".cookies").classList.add("showCookies"), 3000);
    }
});

// Toggle Mobile Menu
document.querySelector(".show-navBar").addEventListener("click", () => {
    navContainer.classList.toggle("showNavBar");
});

// Accept Cookies
document.querySelector(".btn-accept").addEventListener("click", () => {
    localStorage.setItem("cookies-accepted", "true");
    document.querySelector(".cookies").classList.remove("showCookies");
});
</script>
<body>

    <div class="pre-load">
        <div class="loader"></div>
    </div>

    <header>
        <div class="nav-mobile-trigger show-navBar">
            <i class="fas fa-bars"></i>
        </div>
        <nav class="nav-container">
            <a href="#home" class="active" data-en="Home" data-ar="الرئيسية">Home</a>
            <a href="#about" data-en="About" data-ar="من أنا">About</a>
            <a href="#skills" data-en="Skills" data-ar="مهاراتي">Skills</a>
            <a href="#projects" data-en="Projects" data-ar="أعمالي">Projects</a>
            <a href="#contact" data-en="Contact" data-ar="اتصل بي">Contact</a>
        </nav>

        <div class="parameters">
            <div class="show-parameters"><i class="fas fa-cog"></i></div>
            <div class="options">
                <h4>Colors</h4>
                <div class="colors">
                    <span style="background:#3DB2FF" data-color="#3DB2FF"></span>
                    <span style="background:#FF2442" data-color="#FF2442"></span>
                    <span style="background:#FFB830" data-color="#FFB830"></span>
                </div>
                <h4>Mode</h4>
                <div class="mode-toggle">
                    <button id="light" class="mode">Light</button>
                    <button id="dark" class="mode">Dark</button>
                </div>
                <h4>Language</h4>
                <select class="language">
                    <option value="EN">English</option>
                    <option value="AR">Arabic</option>
                </select>
            </div>
        </div>
    </header>

    <main>
        <section id="home" class="hero">
            <h1>Hello, I'm <span class="changing-text"></span></h1>
            <button class="scroll-down">Explore <i class="fas fa-arrow-down"></i></button>
        </section>

        <section id="about" class="container">
            <h2 data-en="About Me" data-ar="نبذة عني">About Me</h2>
            <p>Full-Stack Developer passionate about clean code.</p>
        </section>

        <section id="skills" class="skills container">
            <h2 data-en="My Skills" data-ar="مهاراتي">My Skills</h2>
            <div class="skills-grid">
                <div class="skill">
                    <span>HTML/CSS</span>
                    <div class="progress"><div class="percent" data-percent="90"></div></div>
                </div>
                <div class="skill">
                    <span>JavaScript</span>
                    <div class="progress"><div class="percent" data-percent="85"></div></div>
                </div>
            </div>
        </section>
    </main>

    <div class="cookies">
        <p>We use cookies to improve your experience.</p>
        <div class="actions">
            <button class="btn-accept">Accept</button>
            <i class="fas fa-times close-cookies"></i>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
