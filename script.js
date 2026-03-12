const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");
const indicator = document.getElementById("indicator");

function moveIndicator(link){
  const offsetLeft = link.offsetLeft;
  const width = link.offsetWidth;
  indicator.style.width = width + "px";
  indicator.style.left = offsetLeft + "px";
}

window.addEventListener("scroll", () => {

let current = "";

sections.forEach(section => {

const sectionTop = section.offsetTop - 300;

const isAtBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50);

if(scrollY >= sectionTop || isAtBottom){
    current = section.getAttribute("id");
}

});

navLinks.forEach(link => {

link.classList.remove("active");
link.style.color = "white";

if(link.getAttribute("href") === "#" + current){

link.classList.add("active");
link.style.color = "#4cc9f0";
moveIndicator(link);

}

});

});


const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

document.querySelectorAll(".hidden").forEach(el=>observer.observe(el));



window.addEventListener("scroll",function(){

if(window.scrollY>50){
document.querySelector("nav").style.background="rgba(0,0,0,0.9)";
}else{
document.querySelector("nav").style.background="rgba(0,0,0,0.6)";
}

});

const popup = document.getElementById("popupForm");
document.getElementById("contactBtn").onclick = () => popup.style.display = "flex";
document.getElementById("closeBtn").onclick = () => popup.style.display = "none";


(function() {
    emailjs.init("Y9qqg59ZSScmL9eUE");
})();


document.getElementById("contactForm").addEventListener("submit", function(e){
  e.preventDefault();
  
  const submitBtn = this.querySelector('button[type="submit"]');
  submitBtn.innerText = "Gönderiliyor...";
  submitBtn.disabled = true;


  emailjs.sendForm('service_f5fw5km', 'template_g77qrf5', this)
    .then(() => {
        alert("Mesajın başarıyla ulaştı.");
        this.reset();
        document.getElementById("popupForm").style.display = "none";
    })
    .catch((err) => {
        alert("Aksilik çıktı: " + JSON.stringify(err));
    })
    .finally(() => {
        submitBtn.innerText = "Gönder";
        submitBtn.disabled = false;
    });
});