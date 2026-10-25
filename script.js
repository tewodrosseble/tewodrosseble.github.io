document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    /* Current year */

    const yearElement = $("#current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    /* Scroll progress and header */

    const header = $(".site-header");
    const progressBar = $(".page-progress");
    const backToTop = $(".back-to-top");

    let scrollTicking = false;

    function updateScrollUI() {
        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const scrollPercent = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }

        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 20);
        }

        if (backToTop) {
            backToTop.classList.toggle("visible", window.scrollY > 600);
        }

        scrollTicking = false;
    }

    window.addEventListener("scroll", () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(updateScrollUI);
            scrollTicking = true;
        }
    }, { passive: true });

    updateScrollUI();

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: reducedMotion ? "auto" : "smooth"
            });
        });
    }

    /* Custom cursor glow */

    const cursorGlow = $(".cursor-glow");

    if (cursorGlow && finePointer && !reducedMotion) {
        let cursorFrame = false;

        window.addEventListener("pointermove", event => {
            if (cursorFrame) return;

            cursorFrame = true;

            window.requestAnimationFrame(() => {
                cursorGlow.style.left = `${event.clientX}px`;
                cursorGlow.style.top = `${event.clientY}px`;
                cursorFrame = false;
            });
        }, { passive: true });
    }

    /* Mobile navigation */

    const menuToggle = $(".menu-toggle");
    const navMenu = $(".nav-menu");
    const navLinks = $$(".nav-link");

    function closeMenu() {
        if (!menuToggle || !navMenu) return;

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        navMenu.classList.remove("open");
        document.body.classList.remove("menu-open");
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Open navigation" : "Close navigation"
            );

            navMenu.classList.toggle("open", !isOpen);
            document.body.classList.toggle("menu-open", !isOpen);
        });

        navLinks.forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 780) {
                closeMenu();
            }
        });
    }

    /* Smooth in-page navigation */

    $$('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });

            if (window.location.hash !== targetId) {
                history.replaceState(null, "", targetId);
            }
        });
    });

    /* Reveal sections as they enter the viewport */

    const revealElements = $$(".reveal");

    if ("IntersectionObserver" in window && !reducedMotion) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        });

        revealElements.forEach((element, index) => {
            const siblingIndex = Math.min(index % 4, 3);

            element.style.transitionDelay =
                `${siblingIndex * 65}ms`;

            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add("is-visible");
        });
    }

    /* Highlight the current navigation section */

    const sections = $$("main section[id]");

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                navLinks.forEach(link => {
                    const isCurrent =
                        link.getAttribute("href") ===
                        `#${entry.target.id}`;

                    link.classList.toggle("active", isCurrent);
                });
            });
        }, {
            rootMargin: "-30% 0px -60% 0px",
            threshold: 0
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    /* Typing effect */

    const typedElement = $(".typed-text");

    if (typedElement) {
        const phrases = [
            "production-ready AI systems",
            "LLM applications and RAG pipelines",
            "computer vision solutions",
            "reliable ML deployment workflows",
            "software that connects with hardware"
        ];

        if (reducedMotion) {
            typedElement.textContent = phrases[0];
        } else {
            let phraseIndex = 0;
            let characterIndex = phrases[0].length;
            let deleting = true;

            typedElement.textContent = phrases[0];

            function typeNextCharacter() {
                const phrase = phrases[phraseIndex];

                if (deleting) {
                    characterIndex--;
                } else {
                    characterIndex++;
                }

                typedElement.textContent =
                    phrase.substring(0, characterIndex);

                let delay = deleting ? 28 : 48;

                if (deleting && characterIndex <= 0) {
                    deleting = false;

                    phraseIndex =
                        (phraseIndex + 1) % phrases.length;

                    delay = 350;
                } else if (!deleting && characterIndex >= phrase.length) {
                    deleting = true;
                    delay = 1500;
                }

                window.setTimeout(typeNextCharacter, delay);
            }

            window.setTimeout(typeNextCharacter, 1800);
        }
    }

    /* Project image fallback */

    const artwork = {
        brand: {
            title: "BRAND INTELLIGENCE",
            subtitle: "Sentiment analysis and AI agents",
            icon: "◉"
        },
        agri: {
            title: "AGRIPREDICT",
            subtitle: "Agricultural intelligence",
            icon: "✳"
        },
        meret: {
            title: "MERETMIND",
            subtitle: "Data driven agriculture",
            icon: "⌘"
        },
        vision: {
            title: "EDGE VISION AI",
            subtitle: "Computer vision and privacy",
            icon: "◎"
        },
        tensorrt: {
            title: "TENSORRT RECOVERY",
            subtitle: "ML infrastructure and reliability",
            icon: "⬡"
        },
        crop: {
            title: "CROP VISION",
            subtitle: "Offline agricultural AI",
            icon: "✳"
        },
        radar: {
            title: "RADAR SIGNAL AI",
            subtitle: "Sensing and signal processing",
            icon: "◉"
        },
        voice: {
            title: "CONVERSATIONAL AI",
            subtitle: "Speech, retrieval and language models",
            icon: "♫"
        },
        career: {
            title: "CAREER INTELLIGENCE",
            subtitle: "Personalized recommendations",
            icon: "⌁"
        },
        ocr: {
            title: "VISION OCR",
            subtitle: "Image processing and recognition",
            icon: "▤"
        },
        secure: {
            title: "SECURE COMMUNICATIONS",
            subtitle: "Real time encrypted media",
            icon: "⬡"
        },
        resume: {
            title: "NLP RESUME PARSER",
            subtitle: "Structured information extraction",
            icon: "▤"
        }
    };

    function makeArtworkData(key) {
        const item = artwork[key] || {
            title: "ENGINEERING PROJECT",
            subtitle: "Applied AI and software systems",
            icon: "⬡"
        };

        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 800 460"
                 role="img"
                 aria-label="${item.title}">
                <defs>
                    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#152c47"/>
                        <stop offset="100%" stop-color="#080e1b"/>
                    </linearGradient>
                    <radialGradient id="glow">
                        <stop offset="0%" stop-color="#55e6e0" stop-opacity=".28"/>
                        <stop offset="100%" stop-color="#55e6e0" stop-opacity="0"/>
                    </radialGradient>
                    <pattern id="grid" width="35" height="35" patternUnits="userSpaceOnUse">
                        <path d="M 35 0 L 0 0 0 35"
                              fill="none"
                              stroke="#8fb5d9"
                              stroke-opacity=".12"
                              stroke-width="1"/>
                    </pattern>
                </defs>
                <rect width="800" height="460" fill="url(#bg)"/>
                <rect width="800" height="460" fill="url(#grid)"/>
                <circle cx="575" cy="175" r="225" fill="url(#glow)"/>
                <g fill="none" stroke="#55e6e0" stroke-opacity=".45">
                    <circle cx="580" cy="175" r="105" stroke-width="1.5"/>
                    <circle cx="580" cy="175" r="75" stroke-width="1.5"/>
                    <circle cx="580" cy="175" r="42" stroke-width="1.5"/>
                    <path d="M475 175 H685 M580 70 V280"/>
                    <path d="M505 100 L655 250 M655 100 L505 250"/>
                </g>
                <g fill="#55e6e0">
                    <circle cx="580" cy="70" r="5"/>
                    <circle cx="685" cy="175" r="5"/>
                    <circle cx="580" cy="280" r="5"/>
                    <circle cx="475" cy="175" r="5"/>
                </g>
                <text x="54" y="85"
                      fill="#55e6e0"
                      font-family="monospace"
                      font-size="14"
                      letter-spacing="4">PROJECT SYSTEM</text>
                <text x="54" y="230"
                      fill="#eff7ff"
                      font-family="Arial, sans-serif"
                      font-weight="700"
                      font-size="35">${item.title}</text>
                <text x="56" y="272"
                      fill="#a3b8d0"
                      font-family="Arial, sans-serif"
                      font-size="18">${item.subtitle}</text>
                <path d="M56 305 H330"
                      stroke="#55e6e0"
                      stroke-opacity=".65"
                      stroke-width="2"/>
                <text x="55" y="345"
                      fill="#91a9c4"
                      font-family="monospace"
                      font-size="13">AI  /  SOFTWARE  /  SYSTEMS</text>
                <text x="680" y="420"
                      fill="#55e6e0"
                      font-family="Arial, sans-serif"
                      font-size="42">${item.icon}</text>
            </svg>
        `;

        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    }

    $$("img[data-art]").forEach(img => {
        let fallbackApplied = false;

        function applyFallback() {
            if (fallbackApplied) return;

            fallbackApplied = true;
            img.src = makeArtworkData(img.dataset.art);
            img.classList.add("generated-artwork");
            img.alt = `${artwork[img.dataset.art]?.title || "Project"} illustration`;
        }

        img.addEventListener("error", applyFallback);

        if (img.complete && img.naturalWidth === 0) {
            applyFallback();
        }
    });

    /* Project filtering */

    const filterButtons = $$(".filter-button");
    const projectCards = $$(".project-card[data-category]");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedFilter = button.dataset.filter;

            filterButtons.forEach(otherButton => {
                const selected = otherButton === button;

                otherButton.classList.toggle("active", selected);
                otherButton.setAttribute(
                    "aria-pressed",
                    String(selected)
                );
            });

            projectCards.forEach(card => {
                const categories = card.dataset.category || "";
                const shouldShow =
                    selectedFilter === "all" ||
                    categories.split(/\s+/).includes(selectedFilter);

                card.classList.toggle("is-filtered", !shouldShow);
                card.setAttribute("aria-hidden", String(!shouldShow));
            });
        });
    });

    filterButtons.forEach(button => {
        button.setAttribute(
            "aria-pressed",
            String(button.classList.contains("active"))
        );
    });

    /* Subtle 3D movement on project cards */

    if (finePointer && !reducedMotion) {
        $$(".project-card").forEach(card => {
            let framePending = false;

            card.addEventListener("pointermove", event => {
                if (framePending) return;

                framePending = true;

                window.requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();

                    const x = (event.clientX - rect.left) / rect.width;
                    const y = (event.clientY - rect.top) / rect.height;

                    const rotateY = (x - 0.5) * 5;
                    const rotateX = (0.5 - y) * 4;

                    card.style.transform =
                        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;

                    framePending = false;
                });
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }

    /* Three.js animated background */

    function initThreeScene() {
        const host = $("#three-scene");

        if (
            !host ||
            reducedMotion ||
            typeof THREE === "undefined"
        ) {
            return;
        }

        let scene;
        let camera;
        let renderer;
        let particlePoints;
        let networkLines;
        let geometry;
        let animationFrame = 0;

        try {
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(
                55,
                window.innerWidth / window.innerHeight,
                0.1,
                100
            );

            camera.position.z = 16;

            renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
                powerPreference: "low-power"
            });

            renderer.setPixelRatio(
                Math.min(window.devicePixelRatio || 1, 1.6)
            );

            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );

            host.appendChild(renderer.domElement);

            const particleCount = window.innerWidth < 700 ? 250 : 520;
            const positions = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 34;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
            }

            geometry = new THREE.BufferGeometry();

            geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(positions, 3)
            );

            const particleMaterial = new THREE.PointsMaterial({
                color: 0x69dcd9,
                size: 0.045,
                transparent: true,
                opacity: 0.72,
                sizeAttenuation: true,
                depthWrite: false
            });

            particlePoints = new THREE.Points(
                geometry,
                particleMaterial
            );

            scene.add(particlePoints);

            const linePositions = [];
            const connectionDistance = 3.1;
            const maxConnections = 170;

            for (let i = 0; i < particleCount; i++) {
                for (
                    let j = i + 1;
                    j < particleCount && linePositions.length / 6 < maxConnections;
                    j++
                ) {
                    const ax = positions[i * 3];
                    const ay = positions[i * 3 + 1];
                    const az = positions[i * 3 + 2];

                    const bx = positions[j * 3];
                    const by = positions[j * 3 + 1];
                    const bz = positions[j * 3 + 2];

                    const dx = ax - bx;
                    const dy = ay - by;
                    const dz = az - bz;

                    const distance = Math.sqrt(
                        dx * dx + dy * dy + dz * dz
                    );

                    if (distance < connectionDistance) {
                        linePositions.push(ax, ay, az, bx, by, bz);
                    }
                }
            }

            const lineGeometry = new THREE.BufferGeometry();

            lineGeometry.setAttribute(
                "position",
                new THREE.Float32BufferAttribute(linePositions, 3)
            );

            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x3e8eb7,
                transparent: true,
                opacity: 0.14,
                depthWrite: false
            });

            networkLines = new THREE.LineSegments(
                lineGeometry,
                lineMaterial
            );

            scene.add(networkLines);

            let mouseX = 0;
            let mouseY = 0;
            let targetX = 0;
            let targetY = 0;

            window.addEventListener("pointermove", event => {
                targetX = (event.clientX / window.innerWidth - 0.5) * 0.7;
                targetY = (event.clientY / window.innerHeight - 0.5) * 0.5;
            }, { passive: true });

            function resizeScene() {
                if (!renderer || !camera) return;

                camera.aspect =
                    window.innerWidth / window.innerHeight;

                camera.updateProjectionMatrix();

                renderer.setSize(
                    window.innerWidth,
                    window.innerHeight
                );

                renderer.setPixelRatio(
                    Math.min(window.devicePixelRatio || 1, 1.6)
                );
            }

            window.addEventListener("resize", resizeScene, {
                passive: true
            });

            const clock = new THREE.Clock();

            function animate() {
                animationFrame = window.requestAnimationFrame(animate);

                const elapsed = clock.getElapsedTime();

                mouseX += (targetX - mouseX) * 0.025;
                mouseY += (targetY - mouseY) * 0.025;

                particlePoints.rotation.y = elapsed * 0.012 + mouseX * 0.15;
                particlePoints.rotation.x = Math.sin(elapsed * 0.12) * 0.025 + mouseY * 0.1;

                networkLines.rotation.y = particlePoints.rotation.y;
                networkLines.rotation.x = particlePoints.rotation.x;

                camera.position.x = mouseX;
                camera.position.y = -mouseY;

                renderer.render(scene, camera);
            }

            animate();

            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    window.cancelAnimationFrame(animationFrame);
                } else {
                    animate();
                }
            });

            window.addEventListener("pagehide", () => {
                window.cancelAnimationFrame(animationFrame);

                geometry?.dispose();
                networkLines?.geometry?.dispose();
                networkLines?.material?.dispose();
                particlePoints?.material?.dispose();
                renderer?.dispose();
            }, { once: true });

        } catch (error) {
            console.warn("The 3D background could not be initialized.", error);
            host.style.display = "none";
        }
    }

    initThreeScene();
});
