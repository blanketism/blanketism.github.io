const THEMES = {
    about: 'theme-about',
    math: 'theme-math',
    trading: 'theme-trading',
    random: 'theme-random',
};

const body = document.body;
const main = document.getElementById('main');
const tabs = Array.from(document.querySelectorAll('.tab'));
const sections = Array.from(document.querySelectorAll('.section-content'));
const pill = document.querySelector('.tab-pill');

let current = null;

function showSection(key) {
    sections.forEach((section) => {
        section.classList.toggle('is-active', section.dataset.section === key);
    });

    const activeSection = sections.find((section) => section.dataset.section === key);
    if (!activeSection) return;

    // restart card entrance animation for the newly active section
    activeSection.querySelectorAll('.card').forEach((card, i) => {
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = '';
        card.style.animationDelay = `${0.08 + i * 0.07}s`;
    });

    // typeset math in the visible section
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([activeSection]).catch(() => {});
    }
}

function movePill(activeTab) {
    pill.style.width = activeTab.offsetWidth + 'px';
    pill.style.transform = `translateX(${activeTab.offsetLeft - 5}px)`;
}

function switchTo(key, instant) {
    if (key === current) return;
    if (!THEMES[key]) return;

    // reflect the active section in the URL so detail pages can return here
    if (history.replaceState) {
        history.replaceState(null, '', '#' + key);
    }

    // update theme + tab states
    body.classList.remove('theme-math', 'theme-trading', 'theme-about', 'theme-random');
    body.classList.add(THEMES[key]);

    const activeTab = tabs.find((t) => t.dataset.tab === key);
    tabs.forEach((t) => t.classList.toggle('is-active', t === activeTab));
    movePill(activeTab);

    if (instant) {
        showSection(key);
        current = key;
        return;
    }

    // animate out, swap, animate in
    main.classList.add('is-leaving');
    setTimeout(() => {
        showSection(key);
        main.classList.remove('is-leaving');
        main.classList.add('is-entering');
        // next frame: release to enter
        requestAnimationFrame(() => requestAnimationFrame(() => {
            main.classList.remove('is-entering');
        }));
        current = key;
    }, 320);
}

tabs.forEach((tab) => {
    tab.addEventListener('click', () => switchTo(tab.dataset.tab));
});

// initial render
window.addEventListener('load', () => {
    const fromHash = (location.hash || '').replace('#', '');
    const startKey = THEMES[fromHash] ? fromHash : null;
    const start = startKey
        ? tabs.find((t) => t.dataset.tab === startKey)
        : (tabs.find((t) => t.classList.contains('is-active')) || tabs[0]);
    movePill(start);
    switchTo(start.dataset.tab, true);
});

// keep pill aligned on resize
window.addEventListener('resize', () => {
    const active = tabs.find((t) => t.classList.contains('is-active'));
    if (active) movePill(active);
});
