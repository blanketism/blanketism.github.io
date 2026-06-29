const THEMES = {
    about: 'theme-about',
    math: 'theme-math',
    trading: 'theme-trading',
    random: 'theme-random',
};

function initHomeTabs() {
    const body = document.body;
    const main = document.getElementById('main');
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const sections = Array.from(document.querySelectorAll('.section-content[data-section]'));
    const pill = document.querySelector('.tab-pill');

    if (!body || !main || !pill || tabs.length === 0 || sections.length === 0) {
        return;
    }

    let current = null;

    function showSection(key) {
        sections.forEach((section) => {
            section.classList.toggle('is-active', section.dataset.section === key);
        });

        const activeSection = sections.find((section) => section.dataset.section === key);
        if (!activeSection) return;

        activeSection.querySelectorAll('.card').forEach((card, i) => {
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = '';
            card.style.animationDelay = `${0.08 + i * 0.07}s`;
        });

        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([activeSection]).catch(() => {});
        }
    }

    function movePill(activeTab) {
        if (!activeTab) return;
        pill.style.width = activeTab.offsetWidth + 'px';
        pill.style.transform = `translateX(${activeTab.offsetLeft - 5}px)`;
    }

    function switchTo(key, instant) {
        if (key === current || !THEMES[key]) return;

        if (history.replaceState) {
            history.replaceState(null, '', '#' + key);
        }

        body.classList.remove('theme-math', 'theme-trading', 'theme-about', 'theme-random');
        body.classList.add(THEMES[key]);

        const activeTab = tabs.find((tab) => tab.dataset.tab === key);
        tabs.forEach((tab) => tab.classList.toggle('is-active', tab === activeTab));
        movePill(activeTab);

        if (instant) {
            showSection(key);
            current = key;
            return;
        }

        main.classList.add('is-leaving');
        setTimeout(() => {
            showSection(key);
            main.classList.remove('is-leaving');
            main.classList.add('is-entering');
            requestAnimationFrame(() => requestAnimationFrame(() => {
                main.classList.remove('is-entering');
            }));
            current = key;
        }, 320);
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => switchTo(tab.dataset.tab));
    });

    window.addEventListener('load', () => {
        const fromHash = (location.hash || '').replace('#', '');
        const startKey = THEMES[fromHash] ? fromHash : null;
        const start = startKey
            ? tabs.find((tab) => tab.dataset.tab === startKey)
            : (tabs.find((tab) => tab.classList.contains('is-active')) || tabs[0]);
        movePill(start);
        if (start) {
            switchTo(start.dataset.tab, true);
        }
    });

    window.addEventListener('resize', () => {
        const active = tabs.find((tab) => tab.classList.contains('is-active'));
        movePill(active);
    });
}

function initTheoremAccordions() {
    const theoremCards = document.querySelectorAll('.theorem-card');
    if (theoremCards.length === 0) {
        return;
    }

    theoremCards.forEach((card) => {
        const button = card.querySelector('.theorem-toggle');
        const panel = card.querySelector('.theorem-panel');

        if (!button || !panel || button.dataset.bound === 'true') {
            return;
        }

        button.dataset.bound = 'true';
        button.addEventListener('click', () => {
            const isOpen = card.classList.contains('is-open');

            if (isOpen) {
                card.classList.remove('is-open');
                button.setAttribute('aria-expanded', 'false');
                panel.setAttribute('aria-hidden', 'true');
                panel.style.maxHeight = '0px';
                return;
            }

            card.classList.add('is-open');
            button.setAttribute('aria-expanded', 'true');
            panel.setAttribute('aria-hidden', 'false');
            panel.style.maxHeight = panel.scrollHeight + 'px';

            if (window.MathJax && window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise([panel]).catch(() => {});
            }
        });
    });
}

initHomeTabs();
initTheoremAccordions();
