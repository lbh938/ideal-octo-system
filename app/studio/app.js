// Gestion des slides avec défilement
document.addEventListener('DOMContentLoaded', function() {
    const slidesContainer = document.querySelector('.slides-container');
    const slides = document.querySelectorAll('.feature-section, .hero-section');
    let currentSlide = 0;
    let isScrolling = false;

    // Navigation mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('#nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navOverlay = document.querySelector('.nav-overlay');

    // Debug - Vérifier que les éléments existent
    console.log('navToggle:', navToggle);
    console.log('navMenu:', navMenu);
    console.log('navOverlay:', navOverlay);
    console.log('navLinks:', navLinks);

    // Fonction pour fermer le menu
    function closeMenu() {
        console.log('Fermeture du menu');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Fonction pour ouvrir le menu
    function openMenu() {
        console.log('Ouverture du menu');
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        navMenu.classList.add('active');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Toggle menu mobile
    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Clic sur navToggle');
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    } else {
        console.error('navToggle non trouvé');
    }

    // Fermer le menu quand on clique sur l'overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', (e) => {
            console.log('Clic sur overlay');
            closeMenu();
        });
    } else {
        console.error('navOverlay non trouvé');
    }

    // Fermer le menu quand on clique sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target && slidesContainer) {
                    e.preventDefault();
                    slidesContainer.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
                }
            }
            console.log('Clic sur lien:', link.textContent);
            closeMenu();
        });
    });

    // Gestion de la rétraction de la navigation au scroll (sur le conteneur des slides)
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    function handleNavbarScroll() {
        if (!slidesContainer || !navbar) return;
        const scrollTop = slidesContainer.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scroll vers le bas - cacher la navbar
            navbar.classList.add('navbar-hidden');
        } else {
            // Scroll vers le haut - montrer la navbar
            navbar.classList.remove('navbar-hidden');
        }

        lastScrollTop = scrollTop;
    }

    // Throttle pour le scroll de la navbar
    let navbarScrollTimeout;
    if (slidesContainer) {
        slidesContainer.addEventListener('scroll', () => {
            if (navbarScrollTimeout) clearTimeout(navbarScrollTimeout);
            navbarScrollTimeout = setTimeout(handleNavbarScroll, 10);
        });
    }

    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
            return;
        }
        
        // Navigation au clavier pour les slides
        if (isScrolling) return;
        
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                // Si on est sur la première section, aller directement à la troisième
                if (currentSlide === 0) {
                    goToSlide(2);
                } else {
                    goToSlide(currentSlide + 1);
                }
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                // Si on est sur la troisième section, revenir à la première
                if (currentSlide === 2) {
                    goToSlide(0);
                } else {
                    goToSlide(currentSlide - 1);
                }
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(slides.length - 1);
                break;
        }
    });

    // Animation du titre sur trois lignes
    const titleLines = document.querySelectorAll('.title-line');
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                titleLines.forEach((line, index) => {
                    setTimeout(() => {
                        line.classList.add('visible');
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.5 });

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        titleObserver.observe(heroTitle);
    }

    // Animation dynamique des problèmes et images
    function initDynamicProblems() {
        const problemsContainer = document.querySelector('.dynamic-problems');
        if (!problemsContainer) return;

        const problemItems = problemsContainer.querySelectorAll('.problem-item');
        const dynamicImages = document.querySelectorAll('.dynamic-image');
        
        // Debug - vérifier que les éléments sont trouvés
        console.log('problemItems:', problemItems.length);
        console.log('dynamicImages:', dynamicImages.length);
        
        let currentIndex = 0;
        let isAnimating = false;

        function showNextProblem() {
            if (isAnimating) return;
            isAnimating = true;

            // Masquer l'élément actuel (texte et image)
            if (problemItems[currentIndex]) {
                problemItems[currentIndex].classList.remove('active');
                problemItems[currentIndex].classList.add('fade-out');
            }
            if (dynamicImages[currentIndex]) {
                console.log('Masquer image:', currentIndex);
                dynamicImages[currentIndex].classList.remove('active');
            }

            setTimeout(() => {
                // Passer au suivant
                currentIndex = (currentIndex + 1) % problemItems.length;
                
                // Afficher le nouvel élément (texte et image)
                if (problemItems[currentIndex]) {
                    problemItems[currentIndex].classList.remove('fade-out');
                    problemItems[currentIndex].classList.add('active');
                }
                if (dynamicImages[currentIndex]) {
                    console.log('Afficher image:', currentIndex);
                    dynamicImages[currentIndex].classList.add('active');
                }

                isAnimating = false;
            }, 600);
        }

        // Observer pour démarrer l'animation quand la section est visible
        const problemsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Démarrer avec le premier élément
                    if (problemItems[0]) {
                        problemItems[0].classList.add('active');
                    }
                    if (dynamicImages[0]) {
                        dynamicImages[0].classList.add('active');
                    }
                    
                    // Démarrer la rotation
                    const interval = setInterval(showNextProblem, 3000);
                    
                    // Arrêter l'observation après le démarrage
                    problemsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const problemsSection = document.querySelector('#probleme');
        if (problemsSection) {
            problemsObserver.observe(problemsSection);
        }
    }

    // Initialiser l'animation des problèmes
    initDynamicProblems();

    // Aller à un slide spécifique
    function goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= slides.length) return;
        
        currentSlide = slideIndex;
        const targetSlide = slides[slideIndex];
        
        slidesContainer.scrollTo({
            top: targetSlide.offsetTop,
            behavior: 'smooth'
        });
    }

    // Détection du slide actuel au scroll
    function handleScroll() {
        if (isScrolling) return;
        
        const scrollTop = slidesContainer.scrollTop;
        const windowHeight = window.innerHeight;
        
        for (let i = 0; i < slides.length; i++) {
            // Ignorer la deuxième section (index 1)
            if (i === 1) continue;
            
            const slideTop = slides[i].offsetTop;
            const slideBottom = slideTop + slides[i].offsetHeight;
            
            if (scrollTop >= slideTop - windowHeight / 2 && scrollTop < slideBottom - windowHeight / 2) {
                if (currentSlide !== i) {
                    currentSlide = i;
                }
                break;
            }
        }
    }

    // Throttle pour le scroll
    let scrollTimeout;
    slidesContainer.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 100);
    });





    // Animation des éléments au scroll avec Intersection Observer
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observer les éléments à animer avec délais d'animation
    const elementsToAnimate = document.querySelectorAll('.feature-content, .feature-image, .feature-video, .hero-content, .hero-title, .hero-description, .requirements-title, .requirements-table, #solution .feature-title, #solution .feature-text, #solution .diff');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });

    // Animation séquentielle pour les éléments de contenu
    function animateContentSequentially(section) {
        const content = section.querySelector('.feature-content, .hero-content');
        const title = section.querySelector('.feature-title, .hero-title, .requirements-title');
        const description = section.querySelector('.feature-text, .hero-description');
        const image = section.querySelector('.feature-image, .feature-video, .requirements-table');
        
        if (content) {
            setTimeout(() => content.classList.add('visible'), 100);
        }
        if (title) {
            setTimeout(() => title.classList.add('visible'), 300);
        }
        if (description) {
            setTimeout(() => description.classList.add('visible'), 500);
        }
        if (image) {
            setTimeout(() => image.classList.add('visible'), 700);
        }
    }

    // Observer les sections pour l'animation séquentielle
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateContentSequentially(entry.target);
            }
        });
    }, observerOptions);

    // Observer toutes les sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Titre dynamique avec exemples
    function initDynamicTitle() {
        const dynamicExample = document.getElementById('dynamic-example');
        const images = document.querySelectorAll('.dynamic-problem-image');
        
        if (!dynamicExample) return;
        
        const examples = [
            "trier vos emails",
            "ressaisir des données", 
            "relancer devis/factures",
            "chercher des infos",
            "créer factures/docs"
        ];
        
        let currentIndex = 0;
        
        function updateExample() {
            // Faire disparaître l'exemple actuel
            dynamicExample.classList.add('fade-out');
            
            setTimeout(() => {
                // Changer le texte
                dynamicExample.textContent = examples[currentIndex];
                dynamicExample.classList.remove('fade-out');
                dynamicExample.classList.add('fade-in');
                
                // Changer l'image
                images.forEach((img, index) => {
                    img.classList.remove('active');
                });
                images[currentIndex].classList.add('active');
                
                setTimeout(() => {
                    dynamicExample.classList.remove('fade-in');
                }, 500);
            }, 300);
        }
        
        // Changer toutes les 3 secondes
        setInterval(() => {
            currentIndex = (currentIndex + 1) % examples.length;
            updateExample();
        }, 3000);
    }

    // Initialiser le titre dynamique
    initDynamicTitle();

    // Carousel functionality
    function initCarousel() {
        const carousels = document.querySelectorAll('.carousel-container');
        carousels.forEach(container => {
            const carousel = container.querySelector('.carousel-wrapper');
            const slides = container.querySelectorAll('.carousel-slide');
            const prevBtn = container.querySelector('.carousel-prev');
            const nextBtn = container.querySelector('.carousel-next');
            const dots = container.querySelectorAll('.carousel-dot');
        
            if (!carousel || !slides.length) return;
            let currentSlide = 0;
            const totalSlides = slides.length;

            function updateCarousel() {
                const percent = 100;
                carousel.style.transform = `translateX(-${currentSlide * percent}%)`;
                slides.forEach((slide, index) => {
                    slide.classList.toggle('active', index === currentSlide);
                });
                if (dots.length) {
                    dots.forEach((d, i) => {
                        d.classList.toggle('active', i === currentSlide);
                        d.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
                    });
                }
            }

            function nextSlide() {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateCarousel();
            }

            function prevSlide() {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateCarousel();
            }

            function goToSlide(index) {
                currentSlide = index;
                updateCarousel();
            }

            // Event listeners
            if (prevBtn) prevBtn.addEventListener('click', prevSlide);
            if (nextBtn) nextBtn.addEventListener('click', nextSlide);

            // Auto-play
            let autoPlayInterval = setInterval(nextSlide, 4500);

            // Pause auto-play on hover
            container.addEventListener('mouseenter', () => {
                clearInterval(autoPlayInterval);
            });
            container.addEventListener('mouseleave', () => {
                autoPlayInterval = setInterval(nextSlide, 4000);
            });

            // Dots click
            if (dots.length) {
                dots.forEach((d, i) => d.addEventListener('click', () => {
                    currentSlide = i;
                    updateCarousel();
                }));
            }

            // Initialisation
            updateCarousel();
        });
    }

    // Initialiser le carousel quand le DOM est chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { initCarousel(); initCardIcons(); });
    } else {
        initCarousel();
        initCardIcons();
    }

    // Lazy loading des images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });

    // Footer year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Compteurs animés (impact + autres)
    function animateCounter(el, duration = 1500) {
        // Préserver le préfixe/suffixe (ex: "+" et " heures …") si le compteur est dans un h3 complet
        const originalText = (el.textContent || '').trim();
        const textMatch = originalText.match(/^(.*?)([-+]?\d[\d\s.,]*)(.*)$/);
        const dataTarget = el.getAttribute('data-count');
        const target = parseInt((dataTarget || (textMatch ? textMatch[2] : '0')).replace(/[^\d]/g, '') || '0', 10);
        const hadPlus = !!(textMatch && textMatch[2] && textMatch[2].trim().startsWith('+'));
        const prefix = el.getAttribute('data-prefix') ?? (textMatch ? (hadPlus ? `${textMatch[1]}+` : textMatch[1]) : '');
        const suffix = el.getAttribute('data-suffix') ?? (textMatch ? textMatch[3] : '');
        const start = 0;
        const startTime = performance.now();

        function step(now) {
            const progress = Math.min(1, (now - startTime) / duration);
            const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            const value = Math.floor(start + (target - start) * eased);
            el.textContent = `${prefix}${value.toLocaleString('fr-FR')}${suffix}`.trim();
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    const counters = document.querySelectorAll('.counter, .metric-value');
    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25, root: slidesContainer || null });
        counters.forEach(c => counterObserver.observe(c));
    }

    // Remplacer dynamiquement les icônes via data-icon-url
    function initCardIcons() {
        const iconHolders = document.querySelectorAll('.card .icon');
        iconHolders.forEach(holder => {
            const url = holder.getAttribute('data-icon-url');
            if (!url) return;
            // Utiliser background-image pour pouvoir remplacer facilement (pas besoin de balise img)
            holder.style.backgroundImage = `url('${url}')`;
        });
    }


});

// Styles CSS pour les animations améliorées
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }



    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }

    .lazy.loaded {
        opacity: 1;
    }

    /* Amélioration du défilement en slides */
    html {
        scroll-behavior: smooth;
    }

    body {
        overflow-x: hidden;
        overflow-y: hidden;
    }

    .slides-container {
        scroll-snap-type: y mandatory;
        scroll-behavior: smooth;
    }

    /* Effet de parallaxe léger */
    .feature-image img,
    .feature-video video {
        transition: transform 0.3s ease;
    }

    .feature-section:hover .feature-image img,
    .feature-section:hover .feature-video video {
        transform: scale(1.02);
    }
`;
document.head.appendChild(style);

 