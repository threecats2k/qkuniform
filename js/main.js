document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('[data-header]');
    const hero = document.querySelector('#top');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('#mobile-menu');
    const year = document.querySelector('[data-year]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    const closeMenu = (restoreFocus = false) => {
        if (!menuToggle || !mobileMenu) {
            return;
        }

        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
        mobileMenu.hidden = true;
        document.body.classList.remove('menu-open');

        if (restoreFocus) {
            menuToggle.focus();
        }
    };

    const openMenu = () => {
        if (!menuToggle || !mobileMenu) {
            return;
        }

        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Close navigation');
        mobileMenu.hidden = false;
        document.body.classList.add('menu-open');
        mobileMenu.querySelector('a')?.focus();
    };

    menuToggle?.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    mobileMenu?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
            closeMenu(true);
        }
    });

    document.addEventListener('click', (event) => {
        if (
            menuToggle?.getAttribute('aria-expanded') === 'true' &&
            !header?.contains(event.target)
        ) {
            closeMenu();
        }
    });

    const desktopQuery = window.matchMedia('(min-width: 768px)');
    desktopQuery.addEventListener('change', (event) => {
        if (event.matches) {
            closeMenu();
        }
    });

    if (header && hero && 'IntersectionObserver' in window) {
        const headerObserver = new IntersectionObserver(
            ([entry]) => header.classList.toggle('is-scrolled', entry.intersectionRatio < 0.98),
            { threshold: [0.98] }
        );

        headerObserver.observe(hero);
    }

    const revealItems = document.querySelectorAll('.reveal');

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            {
                rootMargin: '0px 0px -8% 0px',
                threshold: 0.14
            }
        );

        revealItems.forEach((item, index) => {
            item.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
            revealObserver.observe(item);
        });
    }

    document.querySelectorAll('img').forEach((image) => {
        image.addEventListener('error', () => {
            image.classList.add('image-error');
            image.closest('.app-card, .value-card, .hero-visual')?.classList.add('image-error');
        });
    });
});

