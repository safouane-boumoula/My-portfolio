let show_navBar = document.querySelector(".show-navBar"),
  nav_container = document.querySelector(".nav-container"),
  changing_text = document.querySelector(".changing-text"),
  parameter_container = document.querySelector(".parameters"),
  show_parameters = document.querySelector(".show-parameters"),
  scroll_down = document.querySelector(".scroll-down"),
  theme_color = Array.from(
    document.querySelectorAll(".parameters .colors span")
  ),
  cookies_container = document.querySelector(".cookies"),
  nav_mobile = document.querySelector(".nav-mobile"),
  containers = Array.from(document.querySelectorAll(".container")),
  layout_buttons = document.querySelectorAll(".layout"),
  break_section_image = document.querySelectorAll(
    ".break-section .background img"
  ),
  navbar_items = Array.from(document.querySelectorAll("nav a")),
  mode_buttons = Array.from(document.querySelectorAll(".mode")),
  select_language = document.querySelector(".language"),
  pre_load = document.querySelector(".pre-load"),
  projects = document.querySelectorAll(".project");

// Scroll To section from NavBar
navbar_items.forEach((nav) => {
  nav.addEventListener("click", () => {
    let order = nav.dataset.order;
    if (window.innerWidth >= 768) {
      switch (order) {
        case "0":
          break;
        case "1":
          window.scrollTo(0, 663);
          break;
        case "2":
          window.scrollTo(0, 1686);
          break;
        case "3":
          window.scrollTo(0, 2840);
          break;
        case "4":
          window.scrollTo(0, 3872);
          break;
      }
    } else {
      switch (order) {
        case "0":
          break;
        case "1":
          window.scrollTo(0, 560);
          break;
        case "2":
          window.scrollTo(0, 1588);
          break;
        case "3":
          window.scrollTo(0, 2828);
          break;
        case "4":
          window.scrollTo(0, 3706);
          break;
      }
    }
    navbar_items.forEach((nav) => {
      nav.classList.remove("active");
    });
    nav.classList.add("active");
  });
});

// Check Layout Function
const checkLayout = () => {
  if (localStorage.getItem("layout") === "wide") {
    containers.forEach((cont) => {
      cont.classList.add("wide");
    });
  } else {
    containers.forEach((cont) => {
      cont.classList.remove("wide");
    });
  }
};

// Check Language Function
// We Check if The Current Page is Compatible With
//Lang to Stop The Exucution if Redirect To The Other Page
function checkLang() {
  if (
    localStorage.getItem("lang") === "EN" &&
    window.location.pathname !== "/index.html"
  ) {
    window.location.pathname = "/index.html";
  }
  if (
    localStorage.getItem("lang") === "AR" &&
    window.location.pathname !== "/index-rtl.html"
  ) {
    window.location.pathname = "/index-rtl.html";
  }
}

checkLang();

// Check Mode Function
const checkMode = () => {
  if (localStorage.getItem("mode") === "dark") {
    document.documentElement.style.setProperty(`--heading-color`, `#f6f6f6`);
    document.documentElement.style.setProperty(`--paragraph-color`, `#ccc`);
    document.documentElement.style.setProperty(`--background-color`, `#383737`);
    document.documentElement.style.setProperty(`--button-color`, `#DDD`);
  } else {
    document.documentElement.style.setProperty(`--heading-color`, `#212121`);
    document.documentElement.style.setProperty(`--paragraph-color`, `#8f8f8f`);
    document.documentElement.style.setProperty(`--background-color`, `#fff`);
  }
};

// Showing The NavBar
show_navBar.addEventListener("click", () => {
  nav_container.classList.toggle("showNavBar");
  window.innerWidth < 567
    ? nav_mobile.classList.toggle("navBarShowed-small")
    : nav_mobile.classList.toggle("navBarShowed-meduim");

  show_navBar.firstElementChild.classList.toggle("fa-times");
});

// Showing The Inroduction text
const text_en = [
  "Full-Stack Developer ",
  "Website Creation",
  "Web Design",
];
const text_ar = [
  "مبرمج ويب ",
  "إنشاء صفحات الويب",
  "تصميم المواقع",
];

const colors = ["#3DB2FF", "#FF2442", "#FFB830"];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 1500;
let textIndex = 0;
let charIndex = 0;
let colorIndex = 0;
const text = localStorage.getItem("lang") === "EN" ? text_en : text_ar;

const type = () => {
  if (charIndex < text[textIndex].length) {
    changing_text.style.color = colors[colorIndex];
    changing_text.textContent += text[textIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } else {
    setTimeout(erase, newTextDelay);
  }
};
const erase = () => {
  if (charIndex > 0) {
    changing_text.textContent = text[textIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  } else {
    textIndex++;
    colorIndex++;
    if (textIndex >= text.length) {
      textIndex = 0;
      colorIndex = 0;
    }
    setTimeout(type, typingDelay);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  type();
  // Show Cookies
  if (!localStorage.getItem("acceptCookies")) {
    let showCookies = setTimeout(() => {
      cookies_container.classList.add("showCookies");
    }, 2000);
  }

  // Changing Select Language
  if (localStorage.getItem("lang") !== null) {
    localStorage.getItem("lang") === "EN"
      ? (select_language.value = "EN")
      : (select_language.value = "AR");
  }

  // Remove PreLoad
  let timeWait = setTimeout(() => {
    pre_load.style.opacity = "0";
    pre_load.style.display = "none";
  }, 2000);
});

document.addEventListener("scroll", () => {
  // Parallax image of break section in width > 991
  let subtleOffset;
  if (window.innerWidth > 991) {
    subtleOffset = window.scrollY / 4;
    break_section_image.forEach((image) => {
      image.style.transform = `translateY(-${subtleOffset}px)`;
    });
  } else {
    break_section_image.forEach((image) => {
      image.parentElement.remove();
    });
    let break_container = Array.from(
      document.querySelectorAll(".break-section")
    );
    for (let i = 1; i <= break_container.length; i++) {
      break_container[
        i - 1
      ].style.backgroundImage = `url("Images/break-0${i}_comp.jpg")`;
      break_container[i - 1].style.backgroundSize = "cover";
      break_container[i - 1].style.backgroundPosition = "center";
    }
  }

  // Make The Percentage Of Skills Grow
  if (window.scrollY >= 1800) {
    let skills = document.querySelectorAll(".skill .percent");
    skills.forEach((skill) => {
      skill.style.width = skill.dataset.percent + "%";
    });
  }

  // Check Scroll To change Style Of NavBar
  const checkScroll = (scroll) => {
    navbar_items.forEach((nav) => {
      nav.classList.remove("active");
    });
    if (window.innerWidth >= 768) {
      if (scroll >= 0 && scroll < 663) {
        navbar_items[0].classList.add("active");
      } else if (scroll >= 663 && scroll < 1586) {
        navbar_items[1].classList.add("active");
      } else if (scroll >= 1586 && scroll < 2840) {
        navbar_items[2].classList.add("active");
      } else if (scroll >= 2840 && scroll < 3872) {
        navbar_items[3].classList.add("active");
      } else {
        navbar_items[4].classList.add("active");
      }
    } else {
      if (scroll >= 0 && scroll < 560) {
        navbar_items[0].classList.add("active");
      } else if (scroll >= 560 && scroll < 1588) {
        navbar_items[1].classList.add("active");
      } else if (scroll >= 1588 && scroll < 2828) {
        navbar_items[2].classList.add("active");
      } else if (scroll >= 2828 && scroll < 3706) {
        navbar_items[3].classList.add("active");
      } else {
        navbar_items[4].classList.add("active");
      }
    }
  };
  checkScroll(window.scrollY);
});

// Showing The Parameters
show_parameters.addEventListener("click", () => {
  parameter_container.classList.toggle("showParameters");
});

// Scroll Button
scroll_down.addEventListener("click", () => {
  window.scrollTo({
    top: window.innerHeight,
    left: 0,
    behavior: "smooth",
  });
});

// Make The NavBar Dark
window.addEventListener("scroll", () => {
  // Check For Mobile
  if (window.innerWidth > "768") {
    if (window.scrollY >= window.innerHeight) {
      nav_container.style.backgroundColor = "#212121";
    } else {
      nav_container.style.backgroundColor = "rgba(192, 189, 189, 0.7)";
    }
  } else {
    // Make The NavBar In Mobile Have Color and Fixed
    if (window.scrollY >= window.innerHeight - nav_mobile.offsetHeight) {
      nav_mobile.style.backgroundColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--main-color");
    } else {
      nav_mobile.style.backgroundColor = "transparent";
    }
  }
});
// Save Starting Theme Color in LocalStorage
if (localStorage.getItem("text-hover-color") === null) {
  let startColor = getComputedStyle(document.documentElement).getPropertyValue(
    "--hover-text-color"
  );
  localStorage.setItem("text-hover-color", startColor);
} else {
  document.documentElement.style.cssText = `--hover-text-color : ${localStorage.getItem(
    "text-hover-color"
  )}`;
}

// Save The Layout in LocalStorage
if (localStorage.getItem("layout") === null) {
  localStorage.setItem("layout", "boxed");
} else {
  checkLayout();
}

// Save Mode in LocalStorage
if (localStorage.getItem("mode") === null) {
  localStorage.setItem("mode", "light");
} else {
  checkMode();
}

// Save Language in LocalStorage
if (localStorage.getItem("lang") === null) {
  localStorage.setItem("lang", "EN");
}

// Changing Theme Color
theme_color.forEach((color) => {
  color.addEventListener("click", () => {
    let selectColor = color.getAttribute("data-color");
    document.documentElement.style.cssText = `--hover-text-color : ${selectColor.toString()}`;
    localStorage.setItem("text-hover-color", selectColor);

    checkMode();
  });
});

// Changing Layout
layout_buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (event.target.classList.contains("wide")) {
      localStorage.setItem("layout", "wide");
    } else {
      localStorage.setItem("layout", "boxed");
    }
    checkLayout();
  });
});

// Changing Mode
mode_buttons.forEach((mode) => {
  mode.addEventListener("click", () => {
    if (mode.id === "dark") {
      localStorage.setItem("mode", "dark");
    } else {
      localStorage.setItem("mode", "light");
    }
    checkMode();
  });
});

// Changing Language
select_language.addEventListener("change", () => {
  if (select_language.value === "AR") {
    localStorage.setItem("lang", "AR");
  } else {
    localStorage.setItem("lang", "EN");
  }
  checkLang();
});

// Accepting Cookies
cookies_container.querySelector("button").addEventListener("click", () => {
  localStorage.setItem("acceptCookies", "true");
  cookies_container.classList.remove("showCookies");
});

// Close the Cookies window
cookies_container.querySelector("i").addEventListener("click", () => {
  cookies_container.classList.remove("showCookies");
});

//UPDATE 15/03/2021
