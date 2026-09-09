document.addEventListener('DOMContentLoaded', () => {
    const btnOpen = document.getElementById('btn-open');
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const guestNameEl = document.getElementById('guest-name');
    const bgMusic = document.getElementById('bg-music');
    
    // Parse Guest Name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to') || urlParams.get('kepada') || urlParams.get('u');
    
    if (guestName) {
        guestNameEl.textContent = guestName;
    } else {
        guestNameEl.textContent = "Tamu Undangan";
    }

    // Open Invitation Handler
    btnOpen.addEventListener('click', () => {
        // Request Fullscreen
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => console.log("Fullscreen error:", err));
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen().catch(err => console.log("Fullscreen error:", err));
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen().catch(err => console.log("Fullscreen error:", err));
        }

        // Slide up the cover
        cover.classList.add('slide-up');
        
        // Show main content
        mainContent.classList.remove('hidden');
        
        // Play background music
        // Note: For actual deployment, you need a valid audio src in index.html
        if (bgMusic.src && bgMusic.src !== window.location.href) {
            bgMusic.play().catch(e => console.log("Autoplay prevented:", e));
        }

        // Trigger animations for the hero section
        setTimeout(() => {
            document.querySelectorAll('.hero-content .animate-up').forEach(el => {
                el.classList.add('visible');
            });
        }, 800);
        
        // Hide cover completely after transition
        setTimeout(() => {
            cover.style.display = 'none';
        }, 1200);
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements in the couple section
    document.querySelectorAll('.couple-card, .section-title, .section-desc').forEach(el => {
        el.classList.add('animate-up');
        observer.observe(el);
    });
});
