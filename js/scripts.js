// ================= NAV + SCROLL + DROPDOWN =================

// ELEMEK
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const dropdown = document.querySelector(".dropdown");
const dropbtn = document.querySelector(".dropbtn");

/**
 * KÖZÖS SCROLL FUNKCIÓ - Javított verzió
 * @param {HTMLElement} element - A célelem
 */

/**
 * KÖZÖS SCROLL FUNKCIÓ - Mobilra optimalizált offsettel
 */
function smoothScrollTo(element) {
    if (!element) return; /*ha nem létezik az elem álljon le*/

    const navbar = document.querySelector("nav"); //nav sávot keressük
    const navbarHeight = navbar ? navbar.offsetHeight : 0; //le kérjük a navbar magasságt (egyébként alapjáraton nulla)
    
    const rect = element.getBoundingClientRect(); //célellem pozíciója 
    const sectionTop = rect.top + window.pageYOffset; // absz pozició a oldal tetejétől (görgetést is nézve)
    
    // DINAMIKUS OFFSET:
    // Ha mobilon vagyunk (768px alatt), legyen  15px a plusz hely, 
    // különben marad a neked tetsző 85px.
    const isMobile = window.innerWidth <= 768;
    const extraPadding = isMobile ? 15 : 85; 

    const scrollTo = sectionTop - navbarHeight - extraPadding;//poz képlete: elem teteje - menü magassága  - kért extra táv

    window.scrollTo({ //görgetés
        top: scrollTo,
        behavior: "smooth"
    });

    // Mobil menü bezárása, bezárjuk a mobil menüt (active osztály meghal)
    if (navLinks && hamburger) {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
    }
}

// ================= GÖRDÜLÉKENY SCROLL ESEMÉNYEK =================
// Minden olyan linket figyelünk, aminek van data-target attribútuma
const allScrollLinks = document.querySelectorAll('[data-target]');
//foreach végig megy minden linken
allScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) { //kiolvasuk a css class neveket és ha üres classt talál ne csináljon semmit  
        const targetClass = this.dataset.target;
        if (!targetClass) return;

        // Ha mobilon vagyunk és a fő dropdown gombra kattintunk,
        // akkor is görgetünk a dropdown nyitása helyett
        if (window.innerWidth <= 768 && this.classList.contains('dropbtn')) {
            e.preventDefault(); // ne legyen alapértelmezett jump
            const targetSection = document.querySelector('.osztalyok'); //keresés és görgetés
            smoothScrollTo(targetSection);
            return; //kilép , hogy ne fusson mégegyszer végig
        }

        // Minden egyéb linknél (dropdown elemeknél is!)
        e.preventDefault(); // alap jump tiltva
        const targetSection = document.querySelector(`.${targetClass}`); //htmlben való elem keresés
        smoothScrollTo(targetSection);//fgv hívás
    });
});

// ================= HAMBURGER =================
if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        //Ki - be kapcsoljuk az a menün és az ikonon 
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });
}

// ================= DROPDOWN (Csak Desktopon nyílik) =================
if (dropdown && dropbtn) {
    dropbtn.addEventListener("click", (e) => {
        if (window.innerWidth > 768) {
            e.preventDefault();
            dropdown.classList.toggle("open"); //ki be kapcsoljuk a lenyíló osztályt
        }
    });
}

// ================= NAVBAR SCROLL EFFECT =================
window.addEventListener("scroll", function() {
    const navbar = document.querySelector("nav");
    if (!navbar) return;
    navbar.classList.toggle("nav-scrolled", window.scrollY > 20); //HA 20 pixelnél többet görgettünk lefelé, hozzáadja a 'nav-scrolled' osztályt
 });

// ================= GALÉRIA MODAL (Változatlan) =================
document.addEventListener("DOMContentLoaded", function() {
    //modal ablak elemeinek lekérése
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("img01");
    const modalVid = document.getElementById("vid01");
    const captionText = document.getElementById("caption");
    const closeBtn = document.querySelector(".close");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    //kigyűjtjük az összes képet és videót a .galeria osztályon belül, kivéve ami a modalban van
    const mediaElements = Array.from(
        document.querySelectorAll('.galeria img, .galeria video')
    ).filter(el => !el.closest('.modal'));

    let currentIndex = 0; //tárolja a current element indexét 

    //fgv: megjelenités index alapján
    window.showMedia = function(index) {
      //KÖRFORGÓ, ha túl megyünk az elejére ugrik
        if (index >= mediaElements.length) index = 0;
        if (index < 0) index = mediaElements.length - 1;

        currentIndex = index;
        //data-full attribútumot(nagy felbontású fájl útvonala)
        const element = mediaElements[currentIndex];
        const fullRes = element.getAttribute('data-full');

        if (!modal) return;
        modal.style.display = "block";//megjelenítés
        captionText.innerHTML = element.alt || element.title || "";//alt és title megjelenjtése szöveg alatt

        //ha az elem kép  akkor: videókat elrejtük|| leállítjuk a vidit || képet mutatjuk és betöltjük a forrást
        if (element.tagName === "IMG") {
            modalVid.style.display = "none";
            modalVid.pause();
            modalImg.style.display = "block";
            modalImg.src = fullRes;
        } else {
          //ha az elem videó  akkor: képeket elrejtük|| videót mutatjuk és betöltjük a forrást
            modalImg.style.display = "none";
            modalVid.style.display = "block";
            modalVid.src = fullRes;
            modalVid.play();
        }
    }
    //kattintásras nyiljon meg
    mediaElements.forEach((media, index) => {
        media.onclick = () => showMedia(index);
    });
    //lapozó gombok
    if (prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); showMedia(currentIndex - 1); };
    if (nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); showMedia(currentIndex + 1); };
    //ablak zárása
    function closeModal() {
        if (modal) {
            modal.style.display = "none";
            if(modalVid) {
                modalVid.pause();
                modalVid.src = "";
            }
        }
    }
    // X gomb bezár
    if (closeBtn) closeBtn.onclick = closeModal;
    //háttére kattintva szintén bezár
    if (modal) {
        modal.onclick = function(event) {
            if (event.target === modal) closeModal();
        }
    }
    //billentyűzet kezelés
    document.onkeydown = function(e) {
        if (modal && modal.style.display === "block") {
            if (e.key === "ArrowLeft") showMedia(currentIndex - 1);
            if (e.key === "ArrowRight") showMedia(currentIndex + 1);
            if (e.key === "Escape") closeModal();
        }
    };
});

