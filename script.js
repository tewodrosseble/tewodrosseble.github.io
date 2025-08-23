document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .achievement-card, .experience-card, .publication-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const skillItems = document.querySelectorAll('.skill-items span');
    skillItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.style.animation = 'fadeInUp 0.6s ease forwards';
    });

    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        item.style.animation = 'slideInLeft 0.6s ease forwards';
    });

    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
        link.style.animationDelay = `${index * 0.1}s`;
        link.style.animation = 'bounceIn 0.6s ease forwards';
    });

    // Add smooth scrolling for projects
    const projectsScroll = document.querySelector('.projects-scroll');
    if (projectsScroll) {
        let isScrolling = false;
        
        projectsScroll.addEventListener('wheel', function(e) {
            e.preventDefault();
            if (!isScrolling) {
                isScrolling = true;
                const scrollAmount = e.deltaY > 0 ? 320 : -320;
                projectsScroll.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
                setTimeout(() => {
                    isScrolling = false;
                }, 500);
            }
        });

        // Touch scrolling for mobile
        let startX = 0;
        let scrollLeft = 0;

        projectsScroll.addEventListener('touchstart', function(e) {
            startX = e.touches[0].pageX - projectsScroll.offsetLeft;
            scrollLeft = projectsScroll.scrollLeft;
        });

        projectsScroll.addEventListener('touchmove', function(e) {
            if (!startX) return;
            const x = e.touches[0].pageX - projectsScroll.offsetLeft;
            const walk = (x - startX) * 2;
            projectsScroll.scrollLeft = scrollLeft - walk;
        });

        projectsScroll.addEventListener('touchend', function() {
            startX = 0;
        });

        // Auto-scroll animation for projects
        let autoScrollProjects = true;
        
        function autoScrollProjectsFunc() {
            if (!autoScrollProjects) return;
            
            const maxScroll = projectsScroll.scrollWidth - projectsScroll.clientWidth;
            const currentScroll = projectsScroll.scrollLeft;
            
            if (currentScroll >= maxScroll) {
                // Jump back to beginning for seamless loop
                projectsScroll.scrollLeft = 0;
            } else {
                projectsScroll.scrollLeft += 1;
            }
        }
        
        // Pause auto-scroll on hover
        projectsScroll.addEventListener('mouseenter', () => {
            autoScrollProjects = false;
        });
        
        projectsScroll.addEventListener('mouseleave', () => {
            autoScrollProjects = true;
        });
        
        // Start auto-scroll
        setInterval(autoScrollProjectsFunc, 30);
    }

    // Add smooth scrolling for experience
    const experienceScroll = document.querySelector('.experience-scroll');
    if (experienceScroll) {
        let isScrollingExp = false;
        
        experienceScroll.addEventListener('wheel', function(e) {
            e.preventDefault();
            if (!isScrollingExp) {
                isScrollingExp = true;
                const scrollAmount = e.deltaY > 0 ? 370 : -370;
                experienceScroll.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
                setTimeout(() => {
                    isScrollingExp = false;
                }, 500);
            }
        });

        // Touch scrolling for mobile
        let startXExp = 0;
        let scrollLeftExp = 0;

        experienceScroll.addEventListener('touchstart', function(e) {
            startXExp = e.touches[0].pageX - experienceScroll.offsetLeft;
            scrollLeftExp = experienceScroll.scrollLeft;
        });

        experienceScroll.addEventListener('touchmove', function(e) {
            if (!startXExp) return;
            const x = e.touches[0].pageX - experienceScroll.offsetLeft;
            const walk = (x - startXExp) * 2;
            experienceScroll.scrollLeft = scrollLeftExp - walk;
        });

        experienceScroll.addEventListener('touchend', function() {
            startXExp = 0;
        });

        // Auto-scroll animation for experience
        let autoScrollExperience = true;
        
        function autoScrollExperienceFunc() {
            if (!autoScrollExperience) return;
            
            const maxScroll = experienceScroll.scrollWidth - experienceScroll.clientWidth;
            const currentScroll = experienceScroll.scrollLeft;
            
            if (currentScroll >= maxScroll) {
                // Jump back to beginning for seamless loop
                experienceScroll.scrollLeft = 0;
            } else {
                experienceScroll.scrollLeft += 1;
            }
        }
        
        // Pause auto-scroll on hover
        experienceScroll.addEventListener('mouseenter', () => {
            autoScrollExperience = false;
        });
        
        experienceScroll.addEventListener('mouseleave', () => {
            autoScrollExperience = true;
        });
        
        // Start auto-scroll
        setInterval(autoScrollExperienceFunc, 30);
    }

    // Add smooth scrolling for publications
    const publicationsScroll = document.querySelector('.publications-scroll');
    if (publicationsScroll) {
        let isScrollingPub = false;
        
        publicationsScroll.addEventListener('wheel', function(e) {
            e.preventDefault();
            if (!isScrollingPub) {
                isScrollingPub = true;
                const scrollAmount = e.deltaY > 0 ? 420 : -420;
                publicationsScroll.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
                setTimeout(() => {
                    isScrollingPub = false;
                }, 500);
            }
        });

        // Touch scrolling for mobile
        let startXPub = 0;
        let scrollLeftPub = 0;

        publicationsScroll.addEventListener('touchstart', function(e) {
            startXPub = e.touches[0].pageX - publicationsScroll.offsetLeft;
            scrollLeftPub = publicationsScroll.scrollLeft;
        });

        publicationsScroll.addEventListener('touchmove', function(e) {
            if (!startXPub) return;
            const x = e.touches[0].pageX - publicationsScroll.offsetLeft;
            const walk = (x - startXPub) * 2;
            publicationsScroll.scrollLeft = scrollLeftPub - walk;
        });

        publicationsScroll.addEventListener('touchend', function() {
            startXPub = 0;
        });
    }

    // Enhanced hover effects with staggered animations
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.05}s`;
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.zIndex = '1';
        });
    });

    const experienceCards = document.querySelectorAll('.experience-card');
    experienceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.05}s`;
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.zIndex = '1';
        });
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 1;
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .skill-items span {
        opacity: 0;
        animation-fill-mode: forwards;
    }
    
    .contact-item {
        opacity: 0;
        animation-fill-mode: forwards;
    }
    
    .social-link {
        opacity: 0;
        animation-fill-mode: forwards;
    }
`;

document.head.appendChild(style);

// Navigation arrow functions
function scrollProjects(direction) {
    const projectsScroll = document.querySelector('.projects-scroll');
    if (projectsScroll) {
        const scrollAmount = direction === 'left' ? -320 : 320;
        projectsScroll.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

function scrollExperience(direction) {
    const experienceScroll = document.querySelector('.experience-scroll');
    if (experienceScroll) {
        const scrollAmount = direction === 'left' ? -370 : 370;
        experienceScroll.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

function scrollPublications(direction) {
    const publicationsScroll = document.querySelector('.publications-scroll');
    if (publicationsScroll) {
        const scrollAmount = direction === 'left' ? -420 : 420;
        publicationsScroll.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}
