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

    // SİNYAL: Eğer sayfa tepesine 100px'den daha yakınsak, "current" boş kalsın.
    // Bu, Hero kısmında olduğumuzun en net sinyalidir.
    if (scrollPos > 100) {
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 350; 
            const isAtBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50);

            if (scrollPos >= sectionTop || isAtBottom) {
                current = section.getAttribute("id");
            }
        });
    }

    // Navbar arka plan değişimi (bu aynı kalabilir)
    const nav = document.querySelector("nav");
    nav.style.background = scrollPos > 50 ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.6)";

    // Linkleri ve çizgiyi güncelle
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

    // Eğer sinyal "tepedeyiz" diyorsa veya aktif bölüm yoksa çizgiyi yok et
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
// popup ve diğer elementleri seçelim
const popupForm = document.getElementById("popupForm");
const contactBtn = document.getElementById("contactBtn");
const closeBtn = document.getElementById("closeBtn");
const bodyElement = document.body;


// Formu Aç
contactBtn.addEventListener("click", function() {
    popupForm.style.display = "flex";
    bodyElement.style.overflow = "hidden"; // Kaydırmayı kapat
    nav.style.pointerEvents = "none"; // Navbara tıklamayı kapat
});

// Formu Kapat
closeBtn.addEventListener("click", function() {
    popupForm.style.display = "none";
    bodyElement.style.overflow = "auto"; // Kaydırmayı aç
    nav.style.pointerEvents = "auto"; // Navbara tıklamayı aç
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
            bodyElement.style.overflow = "auto"; // Kaydırmayı aç
            nav.style.pointerEvents = "auto"; // Navbara tıklamayı aç
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
const slides = carousel.querySelectorAll("img"); // 4 resim bekliyoruz (1, 2, 3, ve 1'in kopyası)

const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let slideIndex = 0;
let auto;
let isTransitioning = false; // Spam tıklamaları önleyip animasyonun bozulmasını engellemek için

function showSlide(index) {
    // Animasyonu aktif et ve hedefe kaydır
    carousel.style.transition = "transform 0.8s ease";
    slideIndex = index;
    carousel.style.transform = `translateX(${-slideIndex * 100}%)`;
}

function nextSlide() {
    if (isTransitioning) return; // Geçiş sürerken tıklamayı yoksay

    // Eğer 4. resimde (1. resmin kopyası) isek ve SAĞA gitme emri aldıysak
    if (slideIndex === slides.length - 1) {
        // 1. Animasyonu tamamen kapat
        carousel.style.transition = "none";
        
        // 2. Çaktırmadan gerçek 1. resme (index 0) atla
        slideIndex = 0;
        carousel.style.transform = `translateX(0%)`;
        
        // 3. Tarayıcıyı zorla yenile (Reflow). Bu satır atlamanın görünmez olmasını sağlar!
        carousel.offsetHeight; 
        
        // 4. Animasyonu geri aç ve 2. resme kaydır
        showSlide(1);
    } else {
        showSlide(slideIndex + 1);
    }
}

function prevSlide() {
    if (isTransitioning) return; // Geçiş sürerken tıklamayı yoksay

    // Eğer gerçek 1. resimde isek ve SOLA (geri) gitme emri aldıysak
    if (slideIndex === 0) {
        // 1. Animasyonu tamamen kapat
        carousel.style.transition = "none";
        
        // 2. Çaktırmadan 4. resme (1'in kopyası olan index 3) atla
        slideIndex = slides.length - 1;
        carousel.style.transform = `translateX(${-slideIndex * 100}%)`;
        
        // 3. Tarayıcıyı zorla yenile
        carousel.offsetHeight; 
        
        // 4. Animasyonu geri aç ve 3. resme kaydır
        showSlide(slideIndex - 1);
    } else {
        showSlide(slideIndex - 1);
    }
}

// BUTON OLAYLARI
nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

// Animasyon sürerken butona art arda basılıp döngünün kırılmasını engelleme
carousel.addEventListener('transitionstart', () => {
    isTransitioning = true;
});
carousel.addEventListener('transitionend', () => {
    isTransitioning = false;
});

// OTOMATİK KAYDIRMA
function startAuto() {
    auto = setInterval(nextSlide, 3000);
}

function stopAuto() {
    clearInterval(auto);
}

carousel.addEventListener("mouseenter", stopAuto);
carousel.addEventListener("mouseleave", startAuto);

// Başlangıçta carousel'i göster
showSlide(0);

startAuto();

// MOBİL KAYDIRMA (SWIPE)
let startX = 0;

carousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    stopAuto(); // Dokunulduğunda otomatik kaymayı durdur
});

carousel.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) {
        nextSlide();
    }

    if (endX - startX > 50) {
        prevSlide();
    }
    
    startAuto(); // Bırakıldığında tekrar başlat
});

// LIGHTBOX
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

// Klon resim tıklandığında da çalışması için tüm slide'lara event ekliyoruz
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

const githubContainer = document.getElementById("github-projects");

if(githubContainer){

fetch("https://api.github.com/users/24020091030MuhammedHuseyinAlmousa/repos")
.then(res => res.json())
.then(repos => {

repos
.sort((a,b)=> new Date(b.created_at) - new Date(a.created_at))
.slice(0,6)
.forEach(repo => {

const card = document.createElement("div");
card.classList.add("card");

card.innerHTML = `
<img src="images/github.jpg" alt="project">

<div class="card-content">
<h3>${repo.name}</h3>
<p>${repo.description ?? "Açıklama bulunmuyor."}</p>

<br>

<a href="${repo.html_url}" target="_blank">
GitHub'da Gör
</a>
</div>
`;

githubContainer.appendChild(card);

});

})
.catch(err => {
githubContainer.innerHTML = "<p>Projeler yüklenemedi bağlantınızı kontrol ediniz veya sayfayı yenileyiniz.</p>";
console.error(err);
});

}

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

// --- YENİ HAMBURGER VE ÇİZGİ KONTROLÜ ---
const navMenu = document.getElementById("navMenu");
const hamburger = document.getElementById("hamburger");

// Hamburger menüye tıklandığında
hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    
    // Menü açıldığında mavi çizgiyi (indicator) gizle, kapandığında göster
    if (navMenu.classList.contains("open")) {
        indicator.style.opacity = "0";
        indicator.style.display = "none"; // Garantiye almak için tamamen gizle
    } else {
        indicator.style.opacity = "1";
        indicator.style.display = "block";
    }
});

// Menüdeki bir linke tıklandığında menüyü kapat ve çizgiyi geri getir
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        indicator.style.opacity = "1";
        indicator.style.display = "block";
    });
});

});