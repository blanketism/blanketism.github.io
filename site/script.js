// ---- Content for each tab ----
const CONTENT = {
    math: {
        theme: 'theme-math',
        kicker: 'Mathematics',
        headline: 'My Mathematical Journey',
        blurb: 'Basic blurb text about the math section. This is a placeholder for now, but it will be replaced with something more meaningful later.',
        cards: [
            { tag: 'Readings', title: 'Book list', body: 'Books I\'ve read, am reading, or plan to read.' },
            { tag: 'Courses', title: 'Course list', body: 'Courses I\'ve taken during my time in school.' },
        ],
    },
    trading: {
        theme: 'theme-trading',
        kicker: 'Trading',
        headline: 'Some trading stuff',
        blurb: 'I don\'t really know what to put here yet, but I\'ll figure it out eventually. For now, this is just a placeholder.',
        cards: [
            { tag: 'Market Basics', title: 'Financial derivatives', body: 'A brief overview of financial derivatives and their role in the market.' },
            { tag: 'Trading Strategies', title: 'My trading strategies', body: 'A collection of my personal trading strategies and insights.' },
        ],
    },
};

const body = document.body;
const main = document.getElementById('main');
const tabs = Array.from(document.querySelectorAll('.tab'));
const pill = document.querySelector('.tab-pill');

let current = null;

function renderContent(key) {
    const c = CONTENT[key];
    const cards = c.cards.map((card, i) => `
        <div class="card" style="animation-delay: ${0.08 + i * 0.07}s">
            <div class="card-tag">${card.tag}</div>
            <div class="card-title">${card.title}</div>
            <div class="card-body">${card.body}</div>
        </div>`).join('');

    main.innerHTML = `
        <div class="kicker">${c.kicker}</div>
        <h1 class="headline">${c.headline}</h1>
        <p class="blurb">${c.blurb}</p>
        <div class="cards">${cards}</div>`;
}

function movePill(activeTab) {
    pill.style.width = activeTab.offsetWidth + 'px';
    pill.style.transform = `translateX(${activeTab.offsetLeft - 5}px)`;
}

function switchTo(key, instant) {
    if (key === current) return;

    // update theme + tab states
    body.classList.remove('theme-math', 'theme-trading');
    body.classList.add(CONTENT[key].theme);

    const activeTab = tabs.find((t) => t.dataset.tab === key);
    tabs.forEach((t) => t.classList.toggle('is-active', t === activeTab));
    movePill(activeTab);

    if (instant) {
        renderContent(key);
        current = key;
        return;
    }

    // animate out, swap, animate in
    main.classList.add('is-leaving');
    setTimeout(() => {
        renderContent(key);
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
    const start = tabs.find((t) => t.classList.contains('is-active')) || tabs[0];
    movePill(start);
    switchTo(start.dataset.tab, true);
});

// keep pill aligned on resize
window.addEventListener('resize', () => {
    const active = tabs.find((t) => t.classList.contains('is-active'));
    if (active) movePill(active);
});
