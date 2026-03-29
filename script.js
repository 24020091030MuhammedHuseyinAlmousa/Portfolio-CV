document.addEventListener('DOMContentLoaded', () => {
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");
const indicator = document.getElementById("indicator");
const nav = document.querySelector("nav");

function moveIndicator(link) {
    if (!link) {
        indicator.style.width = "0";
        return;
    }
    const offsetLeft = link.offsetLeft;
    const width = link.offsetWidth;
    indicator.style.width = width + "px";
    indicator.style.left = offsetLeft + "px";
}

window.addEventListener("scroll", () => {
    let current = "";
    const scrollPos = window.scrollY;

    if (scrollPos > 100) {
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 350; 
            const isAtBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50);

            if (scrollPos >= sectionTop || isAtBottom) {
                current = section.getAttribute("id");
            }
        });
    }

    const nav = document.querySelector("nav");
    nav.style.background = scrollPos > 50 ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.6)";

    let activeFound = false;
    navLinks.forEach(link => {
        link.classList.remove("active");
        link.style.color = "white";

        if (current !== "" && link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
            link.style.color = "#4cc9f0";
            moveIndicator(link);
            activeFound = true;
        }
    });

    if (!activeFound || current === "") {
        moveIndicator(null);
    }
});

// 2. Observer (Animasyonlar için)
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});
document.querySelectorAll(".hidden").forEach(el => observer.observe(el));

// 4. İletişim Popup
const popupForm = document.getElementById("popupForm");
const contactBtn = document.getElementById("contactBtn");
const closeBtn = document.getElementById("closeBtn");
const bodyElement = document.body;

contactBtn.addEventListener("click", function() {
    popupForm.style.display = "flex";
    bodyElement.style.overflow = "hidden";
    nav.style.pointerEvents = "none";
});

closeBtn.addEventListener("click", function() {
    popupForm.style.display = "none";
    bodyElement.style.overflow = "auto";
    nav.style.pointerEvents = "auto";
});

// 5. EmailJS
(function() {
    emailjs.init("Y9qqg59ZSScmL9eUE");
})();

document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.innerText = "Gönderiliyor...";
    submitBtn.disabled = true;

    emailjs.sendForm('service_f5fw5km', 'template_g77qrf5', this)
        .then(() => {
            alert("Mesajın başarıyla ulaştı.");
            this.reset();
            document.getElementById("popupForm").style.display = "none";
            bodyElement.style.overflow = "auto";
            nav.style.pointerEvents = "auto";
        })
        .catch((err) => {
            alert("Aksilik çıktı: " + JSON.stringify(err));
        })
        .finally(() => {
            submitBtn.innerText = "Gönder";
            submitBtn.disabled = false;
        });
});

// CAROUSEL
const carousel = document.getElementById("carousel");
const slides = carousel.querySelectorAll("img");

const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let slideIndex = 0;
let auto;
let isTransitioning = false;

function showSlide(index) {
    carousel.style.transition = "transform 0.8s ease";
    slideIndex = index;
    carousel.style.transform = `translateX(${-slideIndex * 100}%)`;
}

function nextSlide() {
    if (isTransitioning) return;

    if (slideIndex === slides.length - 1) {
        carousel.style.transition = "none";
        slideIndex = 0;
        carousel.style.transform = `translateX(0%)`;
        carousel.offsetHeight; 
        showSlide(1);
    } else {
        showSlide(slideIndex + 1);
    }
}

function prevSlide() {
    if (isTransitioning) return;

    if (slideIndex === 0) {
        carousel.style.transition = "none";
        slideIndex = slides.length - 1;
        carousel.style.transform = `translateX(${-slideIndex * 100}%)`;
        carousel.offsetHeight; 
        showSlide(slideIndex - 1);
    } else {
        showSlide(slideIndex - 1);
    }
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

carousel.addEventListener('transitionstart', () => { isTransitioning = true; });
carousel.addEventListener('transitionend', () => { isTransitioning = false; });

function startAuto() { auto = setInterval(nextSlide, 3000); }
function stopAuto() { clearInterval(auto); }

carousel.addEventListener("mouseenter", stopAuto);
carousel.addEventListener("mouseleave", startAuto);

showSlide(0);
startAuto();

let startX = 0;

carousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    stopAuto();
});

carousel.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) nextSlide();
    if (endX - startX > 50) prevSlide();
    startAuto();
});

// LIGHTBOX
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

slides.forEach(img => {
    img.addEventListener("click", () => {
        lightbox.style.display = "flex";
        lightboxImg.src = img.src;
    });
});

lightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
});

// GITHUB PROJECTS
// GÜVENLİK: XSS önlemi — repo adı ve açıklaması textContent ile ekleniyor,
// innerHTML'e ham veri verilmiyor.
const githubContainer = document.getElementById("github-projects");

// Güvenli metin sanitizasyonu
function sanitizeText(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

if (githubContainer) {
    fetch("https://api.github.com/users/24020091030MuhammedHuseyinAlmousa/repos")
        .then(res => res.json())
        .then(repos => {
            repos
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 6)
                .forEach(repo => {
                    const card = document.createElement("div");
                    card.classList.add("card");

                    // GÜVENLİK: href sadece gerçek GitHub URL'si ise kullanılıyor
                    const safeUrl = (typeof repo.html_url === "string" && repo.html_url.startsWith("https://github.com/"))
                        ? repo.html_url
                        : "#";

                    const img = document.createElement("img");
                    img.src = "images/github.jpg";
                    img.alt = "project";

                    const content = document.createElement("div");
                    content.classList.add("card-content");

                    const title = document.createElement("h3");
                    title.textContent = repo.name; // textContent → XSS yok

                    const desc = document.createElement("p");
                    desc.textContent = repo.description ?? "Açıklama bulunmuyor."; // textContent → XSS yok

                    const br = document.createElement("br");

                    const link = document.createElement("a");
                    link.href = safeUrl;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer"; // GÜVENLİK: tabnapping önlemi
                    link.textContent = "GitHub'da Gör";

                    content.appendChild(title);
                    content.appendChild(desc);
                    content.appendChild(br);
                    content.appendChild(link);
                    card.appendChild(img);
                    card.appendChild(content);
                    githubContainer.appendChild(card);
                });
        })
        .catch(err => {
            githubContainer.innerHTML = "<p>Projeler yüklenemedi bağlantınızı kontrol ediniz veya sayfayı yenileyiniz.</p>";
            console.error(err);
        });
}

// PROGRESS BARS
const progressBars = document.querySelectorAll(".progress");
const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const target = bar.style.width;
            bar.style.transition = "none";
            bar.style.width = "0%";
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    bar.style.transition = "width 3s ease";
                    bar.style.width = target;
                });
            });
            barObserver.unobserve(bar);
        }
    });
});
progressBars.forEach(bar => barObserver.observe(bar));

// HAMBURGER
const navMenu = document.getElementById("navMenu");
const hamburger = document.getElementById("hamburger");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    
    if (navMenu.classList.contains("open")) {
        indicator.style.opacity = "0";
        indicator.style.display = "none";
    } else {
        indicator.style.opacity = "1";
        indicator.style.display = "block";
    }
});

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        indicator.style.opacity = "1";
        indicator.style.display = "block";
    });
});

});