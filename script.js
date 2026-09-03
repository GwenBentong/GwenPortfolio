
const headerEl = document.querySelector('header');
const navLinks = document.querySelectorAll('.nav-header a');

const HEADER_ZONES = [
    { id: 'intro',        theme: 'default', nav: '#name' },
    { id: 'platforms',    theme: 'default', nav: '#platforms' },
    { id: 'projects',     theme: 'default', nav: '#projects' },
    { id: 'n8n-work',     theme: 'n8n',     nav: '#projects' },
    { id: 'make-work',    theme: 'make',    nav: '#projects' },
    { id: 'zapier-work',  theme: 'zapier',  nav: '#projects' },
    { id: 'certificates', theme: 'certificates', nav: '#certificates' },
    { id: 'testimonials', theme: 'default', nav: '#testimonials' },
    { id: 'booking',      theme: 'default', nav: '#booking' },
    { id: 'contact',      theme: 'default', nav: '#contact' }
].map((zone) => ({ ...zone, el: document.getElementById(zone.id) }))
 .filter((zone) => zone.el);

if (headerEl && HEADER_ZONES.length) {
    const ALL_THEME_CLASSES = ['theme-n8n', 'theme-make', 'theme-zapier', 'theme-certificates'];
    let currentZone = null;
    let ticking = false;

    function getActiveZone() {
    
     
        const center = window.scrollY + window.innerHeight / 2;
        let active = HEADER_ZONES[0];
        for (const zone of HEADER_ZONES) {
            if (center >= zone.el.offsetTop) active = zone;
            else break;
        }
        return active;
    }

    function applyHeaderTheme(zone) {
        if (zone === currentZone) return;
        currentZone = zone;

        headerEl.classList.remove(...ALL_THEME_CLASSES);
        if (zone.theme !== 'default') headerEl.classList.add(`theme-${zone.theme}`);

        navLinks.forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === zone.nav);
        });
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            applyHeaderTheme(getActiveZone());
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    applyHeaderTheme(getActiveZone());
}

// TESTIMONIALS — magic cursor trail
// Tiny dots (and the occasional ✦ sparkle) spawn at the cursor as it
// moves inside the testimonials section, then fade and rise slightly
// before removing themselves. Throttled so it stays light — not every
// mousemove event spawns a particle.
const testimonialsSection = document.getElementById('testimonials');
const trailContainer = document.getElementById('testimonialTrail');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (testimonialsSection && trailContainer && !prefersReducedMotion) {
    let lastTrailTime = 0;
    const TRAIL_INTERVAL = 60; // ms between spawns

    testimonialsSection.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (now - lastTrailTime < TRAIL_INTERVAL) return;
        lastTrailTime = now;

        const rect = testimonialsSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dot = document.createElement('span');
        const isSparkle = Math.random() < 0.25;

        if (isSparkle) {
            dot.className = 'trail-dot sparkle';
            dot.textContent = '✦';
            dot.style.marginLeft = '-7px';
            dot.style.marginTop = '-8px';
        } else {
            dot.className = 'trail-dot';
            const size = 4 + Math.random() * 4;
            dot.style.width = size + 'px';
            dot.style.height = size + 'px';
            dot.style.marginLeft = (-size / 2) + 'px';
            dot.style.marginTop = (-size / 2) + 'px';
        }

        dot.style.left = x + 'px';
        dot.style.top = y + 'px';

        trailContainer.appendChild(dot);
        dot.addEventListener('animationend', () => dot.remove());
    });
}

// MOBILE NAV — hamburger toggle for narrow screens. The nav list
// itself doesn't change; CSS just turns it into a collapsible panel
// below ~860px and this shows/hides it.
const navToggle = document.getElementById('navToggle');
const navHeader = document.getElementById('navHeader');

if (navToggle && navHeader) {
    function closeMobileNav() {
        navToggle.classList.remove('open');
        navHeader.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    navToggle.addEventListener('click', () => {
        const isOpen = navHeader.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Tapping a link should navigate and close the menu, not leave it open.
    navHeader.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileNav));

    // Resizing past the mobile breakpoint (e.g. rotating a tablet) shouldn't
    // leave a stale open panel sitting there.
    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) closeMobileNav();
    });
}

// FOOTER — keep the copyright year current automatically
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

var typed = new Typed('#text', {
    strings: ['Workflow Automation Specialist', 'AI Automation Specialist'],
    typeSpeed: 100,
    backSpeed: 100,
    loop: true,
});

//SPOTLIGHT EFFECT 
const intro       = document.getElementById('intro');
const binaryLayer = document.getElementById('binary-layer');
const cursorGlow  = document.getElementById('cursor-glow');
const SPOTLIGHT_R = 200;

function updateMask(x, y) {
    const mask = `radial-gradient(circle ${SPOTLIGHT_R}px at ${x}px ${y}px, black 40%, transparent 100%)`;
    binaryLayer.style.webkitMaskImage = mask;
    binaryLayer.style.maskImage = mask;
}

intro.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
});
intro.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
    binaryLayer.style.webkitMaskImage = 'radial-gradient(circle 0px at -999px -999px, black 60%, transparent 100%)';
    binaryLayer.style.maskImage = 'radial-gradient(circle 0px at -999px -999px, black 60%, transparent 100%)';
});
intro.addEventListener('mousemove', (e) => {
    const rect = intro.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cursorGlow.style.left = x + 'px';
    cursorGlow.style.top  = y + 'px';
    updateMask(x, y);
});

function generateBinary() {
    let rows = '';
    const w = Math.floor(window.innerWidth  / 6);
    const h = Math.floor(window.innerHeight / 18);
    for (let i = 0; i < h; i++) {
        let line = '';
        for (let j = 0; j < w; j++) line += Math.random() > 0.5 ? '1' : '0';
        rows += line + '\n';
    }
    binaryLayer.textContent = rows;
}
setInterval(generateBinary, 100);
generateBinary();
binaryLayer.style.webkitMaskImage = 'radial-gradient(circle 0px at -999px -999px, black 60%, transparent 100%)';
binaryLayer.style.maskImage = 'radial-gradient(circle 0px at -999px -999px, black 60%, transparent 100%)';

//LIQUID BLOB BORDER
const profileWrapper = document.getElementById('profile-wrapper');
const blobPathEl     = document.getElementById('blob-path');
const profileImg     = document.querySelector('.profile-img');

const NUM_POINTS = 24;

let angles   = [];
let radii    = [];
let vels     = [];
let mouseX   = -9999;
let mouseY   = -9999;
let isInside = false;

// Blob dimensions — read from actual rendered image size
let RADIUS = 0;
let CX = 0;
let CY = 0;

function initBlob() {
    // Get actual rendered size of the image
    const imgRect     = profileImg.getBoundingClientRect();
    const wrapRect    = profileWrapper.getBoundingClientRect();

    // The path coordinates below are computed in real CSS pixels relative
    // to the wrapper. The SVG's viewBox has to match the SVG element's own
    // rendered pixel size exactly (1 unit = 1 px) for those coordinates to
    // land in the right place — otherwise, at any screen size other than
    // the original desktop one, the browser silently rescales the whole
    // path and the ring drifts away from the photo (the "gap" bug). So
    // this keeps the viewBox locked to the SVG's actual size every time —
    // including on resize, since initBlob() re-runs then too.
    const blobSvgEl = document.querySelector('.blob-svg');
    if (blobSvgEl) {
        const svgRect = blobSvgEl.getBoundingClientRect();
        blobSvgEl.setAttribute('viewBox', `-50 -50 ${svgRect.width} ${svgRect.height}`);
    }

    // Center of image relative to wrapper
    CX = imgRect.left - wrapRect.left + imgRect.width  / 2;
    CY = imgRect.top  - wrapRect.top  + imgRect.height / 2;

    // Radius = half image width + small gap for the border
    RADIUS = imgRect.width / 2 + 8;

    angles = [];
    radii  = [];
    vels   = [];

    for (let i = 0; i < NUM_POINTS; i++) {
        angles.push((i / NUM_POINTS) * Math.PI * 2);
        radii.push(RADIUS);
        vels.push(0);
    }
}

function getInfluence(pAngle) {
    const heroRect    = intro.getBoundingClientRect();
    const profileRect = profileWrapper.getBoundingClientRect();
    const lx = (mouseX + heroRect.left) - profileRect.left - CX;
    const ly = (mouseY + heroRect.top)  - profileRect.top  - CY;
    const mAngle = Math.atan2(ly, lx);
    const mDist  = Math.sqrt(lx * lx + ly * ly);
    let diff = mAngle - pAngle;
    while (diff >  Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    return Math.exp(-diff * diff * 1.5) * Math.min(mDist / 200, 1) * 14;
}

function animateBlob() {
    for (let i = 0; i < NUM_POINTS; i++) {
        const target = RADIUS + (isInside ? getInfluence(angles[i]) : 0);
        const spring = (target - radii[i]) * 0.1;
        vels[i] = vels[i] * 0.75 + spring;
        radii[i] += vels[i];
    }

    const pts = angles.map((a, i) => ({
        x: CX + Math.cos(a) * radii[i],
        y: CY + Math.sin(a) * radii[i],
    }));

    let d = '';
    for (let i = 0; i < pts.length; i++) {
        const p0 = pts[(i - 1 + pts.length) % pts.length];
        const p1 = pts[i];
        const p2 = pts[(i + 1) % pts.length];
        const p3 = pts[(i + 2) % pts.length];

        if (i === 0) d += `M ${p1.x} ${p1.y} `;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += `C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y} `;
    }
    d += 'Z';

    blobPathEl.setAttribute('d', d);
    requestAnimationFrame(animateBlob);
}

intro.addEventListener('mouseenter', () => { isInside = true;  });
intro.addEventListener('mouseleave', () => { isInside = false; });
intro.addEventListener('mousemove',  (e) => {
    const rect = intro.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

// Wait for image to load so getBoundingClientRect is accurate
window.addEventListener('load', () => {
    initBlob();
    animateBlob();
});

// The profile picture resizes at several breakpoints (tablet/phone/small
// phone) — recompute the blob's center/radius whenever the viewport
// changes so it still traces the picture instead of its old size.
let blobResizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(blobResizeTimer);
    blobResizeTimer = setTimeout(initBlob, 150);
});

// PROJECTS — DATA-DRIVEN CARDS + DETAIL MODAL
// Everything the Projects section shows comes from this one array.
// To add a future project: push another object here with the same
// shape (unused fields can be left out or null) — the card grid and
// the detail modal both render from it automatically, nothing else
// needs to change.
//
// Field reference:
//   name, thumbnail, workflowImage, outputImage, description, whatIsThis,
//   whatDoesItDo, steps, tools, benefits, status, client, clientLogo,
//   clientDescription, externalUrl, externalUrlLabel
//
// `tools` accepts either plain strings (shown as badges only) or
// `{ name, icon, role }` objects — the `icon` is a Font Awesome class
// and `role` is a short phrase shown in the "Tools & Integrations"
// section. `workflowImage` should point to a real screenshot/export of
// the actual workflow — when it's null the image block simply doesn't
// render (never swapped for a generated placeholder).
const projectsData = [
        {
        id: 'n8n-dawa-sain-facebook-agent',
        name: 'Dawa Sain Facebook Agent',
        category: 'n8n',
        thumbnail: null,
        workflowImage: 'dawasain.png',
        outputImage: 'outputdawa.png',
        description: 'AI Facebook Messenger assistant for Dawa Sain that answers customer questions from company policy — and steps aside the moment a human agent takes over.',
        whatIsThis: 'An AI-powered Facebook Messenger assistant built for Dawa Sain, a car transport company, running live on their Facebook Page.',
        whatDoesItDo: 'It automatically answers customer questions using the business\'s own policies, while checking whether a human agent or employee is already handling that conversation — so the bot never replies twice or talks over a real person.',
        steps: [
            'Facebook sends the message (or a webhook verification handshake) to the workflow',
            'On verification, the workflow checks the password and completes the Facebook handshake',
            'On a real message, the workflow checks Google Sheets to see if a human agent is already handling that customer',
            'If an agent is already handling it, the bot stays silent and skips replying entirely',
            'If not, the AI Agent reads the company\'s policy document and drafts a reply using Google Gemini, with memory of the conversation so far',
            'The reply is sent back to the customer through the Facebook Graph API',
            'The conversation\'s handling status is logged and updated in Google Sheets for next time'
        ],
        tools: [
            { name: 'n8n', icon: 'fa-solid fa-diagram-project', role: 'Workflow orchestration' },
            { name: 'Facebook Messenger', icon: 'fa-brands fa-facebook-messenger', role: 'Customer chat channel + webhook handshake' },
            { name: 'AI Agent', icon: 'fa-solid fa-robot', role: 'Reads policy and drafts replies' },
            { name: 'Google Gemini', icon: 'fa-solid fa-wand-magic-sparkles', role: 'Chat model powering the AI Agent' },
            { name: 'Simple Memory', icon: 'fa-solid fa-database', role: 'Remembers the conversation so far' },
            { name: 'Google Sheets', icon: 'fa-solid fa-table', role: 'Tracks whether a human agent is already handling the chat' },
            { name: 'Facebook Graph API', icon: 'fa-solid fa-globe', role: 'Sends the reply back to the customer' }
        ],
        benefits: [
            'Answers customer questions instantly, any time of day',
            'Never replies over a human agent already handling the conversation',
            'Always answers from the business\'s real policies, not guesses',
            'Fully customizable — policies, tone, and behavior can be updated anytime',
            'Frees up staff time otherwise spent on repetitive Messenger replies'
        ],
        status: 'LIVE',
        client: 'Dawa Sain',
        clientLogo: 'cars.jpg',
        clientDescription: 'Car transport service using this agent to handle customer questions on their Facebook Page.',
        externalUrl: null,
        externalUrlLabel: 'Message the Page →'
    },
{
    id: 'n8n-client-intelligence',
    name: 'AI Client Intelligence Assistant',
    category: 'n8n',
    thumbnail: null,
    workflowImage: 'AskAI.png',
    outputImage: 'outputagent.png',

    description: 'A read-only AI decision-support assistant that turns scattered CRM records into a complete client story and recommends the next best action based on evidence, company SOPs, and similar past cases.',

    whatIsThis: 'An AI-powered Client 360 assistant that works alongside a CRM such as GoHighLevel. It investigates a client’s records, organizes their history into a timeline, and helps employees understand what is happening before deciding what to do next.',

    whatDoesItDo: 'Searches client records across the CRM, conversations, emails, opportunities, appointments, notes, and other available data. It builds a unified client timeline, identifies relevant facts and missing or conflicting information, explains why the client is contacting the company, checks company SOPs and similar historical cases, and provides an evidence-based recommendation. The assistant is read-only and does not make CRM changes or take actions on behalf of the employee.',

    steps: [
        'Employee searches for a client using their name, phone, email, or client ID',
        'n8n retrieves the relevant client records from the CRM and connected data sources',
        'The workflow normalizes and organizes the records into a unified Client 360 profile and timeline',
        'AI investigates the client history and identifies the reason for the current request',
        'AI separates known facts from interpretation and identifies missing or conflicting information',
        'Relevant company SOPs, policies, and similar historical cases are retrieved for context',
        'AI evaluates the available evidence and recommends the appropriate next action',
        'Employee reviews the evidence and recommendation before making the final decision'
    ],

    tools: [
        {
            name: 'n8n',
            icon: 'fa-solid fa-diagram-project',
            role: 'Workflow orchestration and data processing'
        },
        {
            name: 'CRM',
            icon: 'fa-solid fa-users',
            role: 'Client records, conversations, opportunities, appointments, and notes'
        },
        {
            name: 'AI Agent',
            icon: 'fa-solid fa-robot',
            role: 'Client investigation, summarization, reasoning, and recommendations'
        },
        {
            name: 'Company SOPs',
            icon: 'fa-solid fa-file-lines',
            role: 'Policy and procedure reference'
        },
        {
            name: 'Historical Cases',
            icon: 'fa-solid fa-clock-rotate-left',
            role: 'Similar past cases and previous outcomes'
        }
    ],

    benefits: [
        'Gives employees a complete Client 360 view instead of forcing them to search through multiple records',
        'Turns scattered client records into an understandable timeline and story',
        'Reduces time spent investigating client history',
        'Detects missing, inconsistent, or conflicting information',
        'Grounds recommendations in company SOPs and relevant historical cases',
        'Provides evidence behind recommendations instead of unexplained AI answers',
        'Clearly distinguishes facts from AI interpretation',
        'Remains read-only so employees retain control over the final decision'
    ],

    status: 'Ready to set up',
    client: null,
    clientLogo: null,
    clientDescription: null,
    externalUrl: null,
    externalUrlLabel: 'View Project →'
},{
    id: 'n8n-testimonials',
    name: 'Testimonials Wall',
    category: 'n8n',
    thumbnail: null,
    workflowImage: 'testimonials.png',
    outputImage: null,
    description: 'A live testimonials wall on this portfolio — visitors read past reviews and leave their own, no database or backend code needed.',
    whatIsThis: 'Two small n8n workflows behind the "Testimonials" section of this site, backed by a Google Sheet as the storage layer.',
    whatDoesItDo: 'When the page loads, it pulls every testimonial from a Google Sheet and displays it as a card. When a visitor submits the form, their name and message are appended as a new row in that same sheet — and show up instantly for the next visitor.',
    steps: [
        'Page loads — the site calls the Load webhook (GET)',
        'n8n reads every row from the Google Sheet',
        'The rows are sent back and rendered as testimonial cards',
        'A visitor fills out the form and submits it',
        'The site calls the Submit webhook (POST) with their name and message',
        'n8n appends that as a new row in the same Google Sheet',
        'The new testimonial appears on the wall immediately, no reload needed'
    ],
    tools: [
        { name: 'n8n', icon: 'fa-solid fa-diagram-project', role: 'Workflow orchestration' },
        { name: 'Webhook', icon: 'fa-solid fa-bolt', role: 'Receives load/submit requests from the site' },
        { name: 'Google Sheets', icon: 'fa-solid fa-table', role: 'Stores every testimonial as a row' }
    ],
    benefits: [
        'No database or backend server required',
        'New testimonials appear on the site instantly',
        'Easy to moderate — just edit the Google Sheet directly',
        'Reusable pattern for any "load + submit" feature on the site'
    ],
    status: 'LIVE',
    client: null,
    clientLogo: null,
    clientDescription: null,
    externalUrl: null,
    externalUrlLabel: 'View Project →'
},
 {
    id: 'make-asana-xero-integration',
    name: 'Asana + Xero Integration',
    category: 'make',
    thumbnail: null,
    workflowImage: 'xero.png',
    outputImage: null,
    description: 'A Make.com scenario that pulls invoice data from Xero when an Asana task is completed, logs it into Google Sheets, then compiles it into a single document and attaches it back to the task.',
    whatIsThis: 'An integration between Asana, Xero, and Google Sheets built on Make.com, triggered whenever a task is marked complete.',
    whatDoesItDo: 'When a task is completed in Asana, the scenario calls the Xero API for the relevant data, then routes it down two paths: one iterates through the result and logs each item as a row in Google Sheets; the other waits, pulls those logged rows back out, aggregates them into a single block of text, uploads that as an attachment on the original Asana task, and clears the sheet so it\'s ready for the next run.',
    steps: [
        'Asana watch trigger fires when a task is marked completed',
        'Xero is called to fetch the relevant invoice/record data',
        'A Router splits the scenario into two parallel paths',
        'Path 1: an Iterator loops through the data and adds each item as a row in Google Sheets',
        'Path 2: waits briefly, then reads those rows back with Get Range Values',
        'A Text Aggregator combines all the rows into a single text block',
        'That text is uploaded to the Asana task as an attachment',
        'The Google Sheet rows are cleared, resetting it for the next completed task'
    ],
    tools: [
        { name: 'Make.com', icon: 'fa-solid fa-diagram-project', role: 'Workflow orchestration' },
        { name: 'Asana', icon: 'fa-brands fa-asana', role: 'Trigger + receives the final attachment' },
        { name: 'Xero', icon: 'fa-solid fa-file-invoice-dollar', role: 'Source of invoice/record data' },
        { name: 'Google Sheets', icon: 'fa-solid fa-table', role: 'Temporary storage while data is aggregated' },
        { name: 'Router', icon: 'fa-solid fa-code-branch', role: 'Splits into two parallel paths' },
        { name: 'Text Aggregator', icon: 'fa-solid fa-align-left', role: 'Combines rows into one document' }
    ],
    benefits: [
        'Invoice data moves from Xero to Asana with no manual copy-paste',
        'Each completed task ends up with a ready-made summary attached',
        'Google Sheets is used as scratch storage and auto-clears itself',
        'Runs automatically the moment a task is marked done'
    ],
    status: 'DEMO',
    client: null,
    clientLogo: null,
    clientDescription: null,
    externalUrl: null,
    externalUrlLabel: 'View Project →'
},
{
    id: 'n8n-booking-submit',
    name: 'Booking — Submit',
    category: 'n8n',
    thumbnail: null,
    workflowImage: 'booking.png',
    outputImage: null,
    description: 'The second half of the "Book a Call" system on this portfolio — takes a submitted booking, double-checks the slot, and creates the actual event and confirmation emails. Pairs with the Booking — Availability workflow above.',
    whatIsThis: 'An n8n workflow that handles what happens after a visitor picks a slot shown by the Availability workflow and submits the booking form.',
    whatDoesItDo: 'It validates the submitted details, re-checks the exact requested slot against Google Calendar one more time (in case someone else booked it in the meantime), then either creates the calendar event and emails both sides a confirmation, or responds with an error so the site can tell the visitor the slot\'s gone.',
    steps: [
        'Visitor submits the booking form — it calls this workflow\'s webhook',
        'The submitted fields are validated',
        'Google Calendar is checked once more for conflicts on that exact slot',
        'If free: the event is created, and confirmation emails are sent to the client and me',
        'If taken: the workflow responds with an error instead of double-booking'
    ],
    tools: [
        { name: 'n8n', icon: 'fa-solid fa-diagram-project', role: 'Workflow orchestration' },
        { name: 'Webhook', icon: 'fa-solid fa-bolt', role: 'Receives the booking submission' },
        { name: 'Google Calendar', icon: 'fa-solid fa-calendar-days', role: 'Final conflict check + event creation' },
        { name: 'Gmail', icon: 'fa-solid fa-envelope', role: 'Sends confirmation emails to both sides' }
    ],
    benefits: [
        'Impossible to double-book a slot, even if two people book at once',
        'Instant confirmation for both sides, no manual follow-up',
        'Runs live on this site right now'
    ],
    status: 'LIVE',
    client: null,
    clientLogo: null,
    clientDescription: null,
    externalUrl: null,
    externalUrlLabel: 'Test/Visit →'
},
{
    id: 'n8n-booking-availability',
    name: 'Booking — Availability Check',
    category: 'n8n',
    thumbnail: null,
    workflowImage: 'available.png',
    outputImage: null,
    description: 'The first half of the "Book a Call" system on this portfolio — checks real Google Calendar availability so visitors only ever see slots that are actually free. Pairs with the Booking — Submit workflow below.',
    whatIsThis: 'An n8n workflow that powers the live availability grid on the Book a Call form of this site.',
    whatDoesItDo: 'When a visitor picks a date, this workflow pulls that day\'s events from Google Calendar, builds out every possible 9am–5pm Manila time slot, and removes any that overlap a busy event — so the site only ever shows real, open times.',
    steps: [
        'Visitor picks a date on the site — it calls this workflow\'s webhook',
        'Google Calendar\'s events for that day are fetched',
        'A Code node builds 9am–5pm Manila slots in 30-minute blocks',
        'Any slot overlapping a busy event, or already in the past, is filtered out',
        'The remaining open slots are sent back and shown on the site'
    ],
    tools: [
        { name: 'n8n', icon: 'fa-solid fa-diagram-project', role: 'Workflow orchestration' },
        { name: 'Webhook', icon: 'fa-solid fa-bolt', role: 'Receives the date from the site' },
        { name: 'Google Calendar', icon: 'fa-solid fa-calendar-days', role: 'Source of existing busy times' }
    ],
    benefits: [
        'Visitors never see a slot that\'s actually already taken',
        'No manual calendar checking on my end',
        'Runs live on this site right now'
    ],
    status: 'LIVE',
    client: null,
    clientLogo: null,
    clientDescription: null,
    externalUrl: null,
    externalUrlLabel: 'Test/Visit →'
},
{
    id: 'make-gmail-attachment-ai',
    name: 'AI Email Attachment Processor',
    category: 'make',
    thumbnail: null,
    workflowImage: 'gem.png',
    outputImage: null,
    description: 'A Make.com scenario that watches an inbox for incoming emails, has Google Gemini read and analyze any attachments, archives them to Google Drive, logs the result in a spreadsheet, and sends a reply — all without anyone opening the email.',
    whatIsThis: 'A Gmail-triggered automation on Make.com that uses Google Gemini AI to process email attachments as they arrive.',
    whatDoesItDo: 'When a matching email arrives, the scenario pulls out its attachments, uploads them to Google Gemini, and has the AI generate a response based on the file\'s content. The original attachment is archived to Google Drive, the result is logged as a new row in Google Sheets, and a reply email is sent back automatically.',
    steps: [
        'Gmail watches the inbox and filters for matching incoming emails',
        'The email\'s attachments and media are listed',
        'Each attachment is uploaded to Google Gemini AI',
        'Gemini generates a response based on the attachment\'s content',
        'The original attachment is uploaded and archived to Google Drive',
        'The result is logged as a new row in Google Sheets',
        'A reply email is sent back through Gmail'
    ],
    tools: [
        { name: 'Make.com', icon: 'fa-solid fa-diagram-project', role: 'Workflow orchestration' },
        { name: 'Gmail', icon: 'fa-solid fa-envelope', role: 'Trigger, attachment source, and reply channel' },
        { name: 'Google Gemini AI', icon: 'fa-solid fa-wand-magic-sparkles', role: 'Reads and analyzes the attachment' },
        { name: 'Google Drive', icon: 'fa-brands fa-google-drive', role: 'Archives the original attachment' },
        { name: 'Google Sheets', icon: 'fa-solid fa-table', role: 'Logs each processed email' }
    ],
    benefits: [
        'Attachments get read and acted on the moment they arrive',
        'Nothing needs to be manually opened, saved, or filed',
        'Every processed email leaves a record in the spreadsheet',
        'Sender gets an automatic reply without anyone lifting a finger'
    ],
    status: 'DEMO',
    client: null,
    clientLogo: null,
    clientDescription: null,
    externalUrl: null,
    externalUrlLabel: 'View Project →'
},
  {
    id: 'zapier-lead-management',
    name: 'Lead Management Pipeline',
    category: 'zapier',
    thumbnail: null,
    workflowImage: 'lead.png',
    outputImage: null,
    description: 'An Asana-driven lead pipeline that automatically creates client folders, sends acknowledgement and follow-up emails, checks for replies, and re-escalates unresponsive leads — branching differently depending on where each lead is in the sales process.',
    whatIsThis: 'A Zapier automation triggered from Asana task status changes, built to manage leads all the way from "Ready to Start" through to "Paid and Closed" without manual follow-up.',
    whatDoesItDo: 'Every time a lead\'s status changes in Asana, the workflow splits into one of five paths based on that status and runs a different sequence. For leads that haven\'t responded or are still at the quote stage, it sends spaced-out follow-up emails, checks whether a reply came in, and automatically creates a new Asana task so the sales team knows to step in personally.',
    steps: [
        'A new or updated Asana task triggers the workflow',
        'Paths splits the lead into one of five branches based on its status tag',
        'Ready to Start: creates a personalized Google Drive folder and sends an acknowledgement email',
        'No Response / Quoted: sends a follow-up email, waits a day, sends a second follow-up, then waits several more days',
        'It then searches for a reply email and filters based on whether the lead responded',
        'If still no reply, a new Asana task is created so the sales team can follow up manually',
        'Approved: finds the relevant file in Google Drive, uses AI to personalize the next message, then sends a follow-up email',
        'Paid and Closed: uses AI to draft a closing message and sends a final follow-up email'
    ],
    tools: [
        { name: 'Zapier', icon: 'fa-solid fa-bolt', role: 'Workflow orchestration' },
        { name: 'Asana', icon: 'fa-brands fa-asana', role: 'Trigger and task creation for follow-up' },
        { name: 'Paths by Zapier', icon: 'fa-solid fa-code-branch', role: 'Branches by lead status' },
        { name: 'Google Drive', icon: 'fa-brands fa-google-drive', role: 'Creates and finds client folders/files' },
        { name: 'Gmail', icon: 'fa-solid fa-envelope', role: 'Follow-up emails and reply detection' },
        { name: 'Filter by Zapier', icon: 'fa-solid fa-filter', role: 'Checks whether the lead has replied' },
        { name: 'AI by Zapier', icon: 'fa-solid fa-robot', role: 'Personalizes follow-up and closing messages' },
        { name: 'Delay by Zapier', icon: 'fa-solid fa-clock', role: 'Spaces out follow-ups over days' }
    ],
    benefits: [
        'No lead sits without a follow-up, even without manual effort',
        'Unresponsive leads automatically get escalated back to the sales team',
        'Each stage gets a tailored sequence instead of one generic email',
        'AI personalizes messages instead of sending the same template to everyone'
    ],
    status: 'Ready to Setup',
    client: null,
    clientLogo: null,
    clientDescription: null,
    externalUrl: null,
    externalUrlLabel: 'View Project →'
},
{
    id: 'zapier-lead-qualification',
    name: 'Lead Qualification',
    category: 'zapier',
    thumbnail: null,
    workflowImage: 'new.png',
    outputImage: null,
    description: 'A lead-scoring automation that enriches every incoming lead with company data, splits them into low- and high-priority tracks, and sends each one a personalized outreach email — pinging Slack the moment a high-priority lead comes in.',
    whatIsThis: 'A Zapier automation that catches new leads via webhook, enriches them with Apollo, and routes them differently based on priority.',
    whatDoesItDo: 'Every new lead is caught by a webhook, cleaned up, and enriched with company/contact data from Apollo. Paths then splits the lead into Low or High Priority. Both tracks log the lead to a Google Sheet and use AI to draft a personalized, friendly email — but High Priority leads also trigger an instant Slack notification so the team knows to jump on it.',
    steps: [
        'A new lead comes in through a webhook (Catch Hook)',
        'Formatter cleans up the incoming text/data',
        'Apollo enriches the lead with company and contact details',
        'Paths splits the lead into Low Priority or High Priority',
        'Both paths log the lead into a Google Sheet acting as a database',
        'AI drafts a personalized, friendly outreach email for the lead',
        'The email is sent via Gmail',
        'High Priority leads also trigger a Slack message to the team'
    ],
    tools: [
        { name: 'Zapier', icon: 'fa-solid fa-bolt', role: 'Workflow orchestration' },
        { name: 'Webhooks by Zapier', icon: 'fa-solid fa-bolt', role: 'Catches incoming leads' },
        { name: 'Formatter by Zapier', icon: 'fa-solid fa-wand-magic-sparkles', role: 'Cleans up lead data' },
        { name: 'Apollo', icon: 'fa-solid fa-database', role: 'Enriches leads with company/contact info' },
        { name: 'Paths by Zapier', icon: 'fa-solid fa-code-branch', role: 'Splits leads by priority' },
        { name: 'Google Sheets', icon: 'fa-solid fa-table', role: 'Acts as the lead database' },
        { name: 'AI by Zapier', icon: 'fa-solid fa-robot', role: 'Writes personalized outreach emails' },
        { name: 'Gmail', icon: 'fa-solid fa-envelope', role: 'Sends the outreach email' },
        { name: 'Slack', icon: 'fa-brands fa-slack', role: 'Alerts the team on high-priority leads' }
    ],
    benefits: [
        'Every lead gets enriched and logged automatically, no manual research',
        'High-priority leads get the team\'s attention instantly via Slack',
        'Outreach emails are personalized instead of generic templates',
        'Nothing depends on someone remembering to check a form inbox'
    ],
    status: 'Ready to Setup',
    client: null,
    clientLogo: null,
    clientDescription: null,
    externalUrl: null,
    externalUrlLabel: 'View Project →'
},
];


function defaultCardIcon() {
    return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
        <circle cx="14" cy="48" r="6"/><circle cx="50" cy="48" r="6"/><circle cx="32" cy="16" r="6"/>
        <line x1="19" y1="44" x2="27" y2="21"/><line x1="45" y1="44" x2="37" y2="21"/><line x1="20" y1="48" x2="44" y2="48"/>
    </svg>`;
}

function toolMeta(tool) {
    if (typeof tool === 'string') return { name: tool, icon: 'fa-solid fa-plug', role: '' };
    return { name: tool.name, icon: tool.icon || 'fa-solid fa-plug', role: tool.role || '' };
}

function renderProjectCards() {
    ['n8n', 'make', 'zapier'].forEach((category) => {
        const container = document.getElementById(`${category}-projects`);
        if (!container) return;

        const items = projectsData.filter((p) => p.category === category);

        container.innerHTML = items.map((project) => `
            <div class="project-card terminal-card" tabindex="0" role="button" aria-haspopup="dialog" data-id="${escapeHtml(project.id)}">
                <div class="card-top-row">
                    <div class="card-thumb">${project.thumbnail ? `<img src="${escapeHtml(project.thumbnail)}" alt="" width="44" height="44">` : defaultCardIcon()}</div>
                    <span class="card-status">${escapeHtml(project.status || 'DEMO')}</span>
                </div>
                <h4 class="card-name">${escapeHtml(project.name)}</h4>
                <p class="card-description">${escapeHtml(project.description)}</p>
                <div class="card-tools">${project.tools.map((tool) => `<span class="tool-badge">${escapeHtml(toolMeta(tool).name)}</span>`).join('')}</div>
                <span class="card-cta">View Project →</span>
            </div>
        `).join('');

        container.querySelectorAll('.project-card').forEach((cardEl) => {
            const project = projectsData.find((p) => p.id === cardEl.dataset.id);
            if (!project) return;
            cardEl.addEventListener('click', () => openProjectModal(project));
            cardEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openProjectModal(project);
                }
            });
        });
    });
}

const projectModal = document.getElementById('projectModal');
const projectModalBackdrop = document.getElementById('projectModalBackdrop');
const projectModalClose = document.getElementById('projectModalClose');
const projectModalBody = document.getElementById('projectModalBody');
const projectModalPath = document.getElementById('projectModalPath');

const workflowLightbox = document.getElementById('workflowLightbox');
const workflowLightboxImg = document.getElementById('workflowLightboxImg');
const workflowLightboxClose = document.getElementById('workflowLightboxClose');

function openWorkflowLightbox(src, alt) {
    if (!workflowLightbox || !workflowLightboxImg || !src) return;
    workflowLightboxImg.src = src;
    workflowLightboxImg.alt = alt || '';
    const caption = document.getElementById('workflowLightboxCaption');
    if (caption) caption.textContent = alt || '';
    workflowLightbox.classList.add('open');
    workflowLightbox.setAttribute('aria-hidden', 'false');
}

function closeWorkflowLightbox() {
    if (!workflowLightbox) return;
    workflowLightbox.classList.remove('open');
    workflowLightbox.setAttribute('aria-hidden', 'true');
}

if (workflowLightbox) {
    workflowLightboxClose.addEventListener('click', closeWorkflowLightbox);
    workflowLightbox.addEventListener('click', (e) => {
        if (e.target === workflowLightbox || e.target === workflowLightboxImg) closeWorkflowLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && workflowLightbox.classList.contains('open')) closeWorkflowLightbox();
    });
}

function openProjectModal(project) {
    if (!project || !projectModal) return;

    projectModal.dataset.category = project.category;
    projectModalPath.textContent = `~/automations/${project.category}/${project.id}`;

    const textSection = (title, text) => (text
        ? `<div class="modal-section"><h4>${title}</h4><p>${escapeHtml(text)}</p></div>`
        : '');
    const stepsSection = (title, list) => (list && list.length
        ? `<div class="modal-section"><h4>${title}</h4><ol>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol></div>`
        : '');
    const listSection = (title, list) => (list && list.length
        ? `<div class="modal-section"><h4>${title}</h4><ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>`
        : '');
    const integrationsSection = (list) => (list && list.length
        ? `<div class="modal-section"><h4>Tools &amp; Integrations</h4><div class="modal-integrations">${list.map((tool) => {
            const t = toolMeta(tool);
            return `<div class="integration-row"><div class="integration-icon"><i class="${escapeHtml(t.icon)}"></i></div><div class="integration-text"><div class="integration-name">${escapeHtml(t.name)}</div>${t.role ? `<div class="integration-role">${escapeHtml(t.role)}</div>` : ''}</div></div>`;
        }).join('')}</div></div>`
        : '');

    const workflowImageBlock = project.workflowImage
        ? `<div class="modal-workflow-wrap"><img src="${escapeHtml(project.workflowImage)}" alt="${escapeHtml(project.name)} workflow" id="modalWorkflowImg"></div>`
        : '';

    const outputImageBlock = project.outputImage
        ? `<div class="modal-section"><h4>Sample Output</h4><div class="modal-workflow-wrap"><img src="${escapeHtml(project.outputImage)}" alt="${escapeHtml(project.name)} sample output" id="modalOutputImg"></div></div>`
        : '';

    const clientSection = project.client
        ? `<div class="modal-section"><h4>Who's Currently Using This Workflow?</h4>
            <div class="modal-client">
                ${project.clientLogo ? `<img src="${escapeHtml(project.clientLogo)}" alt="">` : ''}
                <div>
                    <div class="modal-client-head">
                        <div class="modal-client-name">${escapeHtml(project.client)}</div>
                        <span class="modal-client-status">${escapeHtml(project.status || 'DEMO')}</span>
                    </div>
                    ${project.clientDescription ? `<div class="modal-client-desc">${escapeHtml(project.clientDescription)}</div>` : ''}
                    ${project.externalUrl ? `<a class="modal-client-cta" href="${escapeHtml(project.externalUrl)}" target="_blank" rel="noopener">${escapeHtml(project.externalUrlLabel || 'Test/Visit →')}</a>` : ''}
                </div>
            </div>
        </div>`
        : '';

    projectModalBody.innerHTML = `
        <span class="modal-status">${escapeHtml(project.status || 'DEMO')}</span>
        <h3 class="modal-title" id="projectModalTitle">${escapeHtml(project.name)}</h3>
        <p class="modal-tagline">${escapeHtml(project.description)}</p>
        ${project.tools && project.tools.length ? `<div class="modal-tools" style="margin-bottom:22px;">${project.tools.map((tool) => `<span class="tool-badge">${escapeHtml(toolMeta(tool).name)}</span>`).join('')}</div>` : ''}
        ${workflowImageBlock}
        ${outputImageBlock}
        ${textSection('What is this?', project.whatIsThis)}
        ${textSection('What does it do?', project.whatDoesItDo)}
        ${stepsSection('How it works', project.steps)}
        ${integrationsSection(project.tools)}
        ${listSection('Benefits', project.benefits)}
        ${clientSection}
        <button type="button" class="modal-final-cta" id="modalFinalCta">Want an automation like this? →</button>
    `;

    const workflowImgEl = document.getElementById('modalWorkflowImg');
    if (workflowImgEl) {
        workflowImgEl.addEventListener('click', () => openWorkflowLightbox(project.workflowImage, project.name));
    }

    const outputImgEl = document.getElementById('modalOutputImg');
    if (outputImgEl) {
        outputImgEl.addEventListener('click', () => openWorkflowLightbox(project.outputImage, `${project.name} — sample output`));
    }

    const finalCtaBtn = document.getElementById('modalFinalCta');
    if (finalCtaBtn) {
        finalCtaBtn.addEventListener('click', () => {
            closeProjectModal();
            const bookingSection = document.getElementById('booking');
            if (bookingSection) {
                setTimeout(() => bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
            }
        });
    }

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    projectModal.querySelector('.project-modal-card').focus();
}

function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

if (projectModal) {
    projectModalClose.addEventListener('click', closeProjectModal);
    projectModalBackdrop.addEventListener('click', closeProjectModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('open')) closeProjectModal();
    });
}

renderProjectCards();

// PROJECT SECTIONS — SCROLL REVEAL
const projectBlocks = document.querySelectorAll('.project-content');

if (projectBlocks.length) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    projectBlocks.forEach(block => revealObserver.observe(block));
}



const certificatesData = [
    { id: 'cert-1', title: 'Zapier Certification', issuer: 'Kuya RJ', date: '2026', image: 'zapier.png' },
    { id: 'cert-2', title: 'Responsive Web Design — coded and understood, not vibe-coded', issuer: '', date: '2026', image: 'responsive.jpg' },
    { id: 'cert-3', title: 'Make Certification', issuer: 'Kuya RJ', date: '2026', image: 'make.png' },
    { id: 'cert-4', title: 'N8N Certification', issuer: 'Kuya RJ', date: '2026', image: 'n8n.png' },
];


const CERT_CARD_HEIGHT = 300;  
const CERT_CARD_GAP = 60;       

function buildCertCard(cert, indexInColumn) {
    const hasImage = Boolean(cert.image);
    const top = indexInColumn * (CERT_CARD_HEIGHT + CERT_CARD_GAP);
    const rotationPattern = [-5, 4, -3, 6, -4, 3];
    const rotate = rotationPattern[indexInColumn % rotationPattern.length];

    const card = document.createElement(hasImage ? 'button' : 'div');
    card.className = `cert-card${hasImage ? ' has-image' : ''}`;
    card.style.top = `${top}px`;
   
    card.style.setProperty('--tilt', `${rotate}deg`);
    if (hasImage) {
        card.type = 'button';
        card.setAttribute('aria-label', `Open larger view: ${cert.title}`);
    }

    card.innerHTML = hasImage
        ? `<img src="${escapeHtml(cert.image)}" alt="${escapeHtml(cert.title)}" loading="lazy">`
        : `
            <div class="cert-card-placeholder">
                <div class="cert-card-title">${escapeHtml(cert.title)}</div>
                <div class="cert-card-meta">${escapeHtml(cert.issuer)} · ${escapeHtml(cert.date)}</div>
                <div class="cert-card-hint">Certificate image coming soon</div>
            </div>
        `;

    if (hasImage) {
        card.addEventListener('click', () => openWorkflowLightbox(cert.image, cert.title));
    }

    return card;
}


function setCertPlaygroundHeight(playground, count) {
    const rows = Math.max(1, Math.ceil(count / 2));
    const vh = Math.min(200, Math.max(150, 130 + rows * 16));
    playground.style.minHeight = `${vh}vh`;
}

function renderCertificates() {
    const playground = document.getElementById('certPlayground');
    const leftCol = document.getElementById('certColLeft');
    const rightCol = document.getElementById('certColRight');
    if (!playground || !leftCol || !rightCol) return;

    leftCol.innerHTML = '';
    rightCol.innerHTML = '';

    let leftCount = 0;
    let rightCount = 0;

    certificatesData.forEach((cert, i) => {
        const goesLeft = i % 2 === 0;
        const card = buildCertCard(cert, goesLeft ? leftCount : rightCount);
        (goesLeft ? leftCol : rightCol).appendChild(card);
        if (goesLeft) leftCount += 1; else rightCount += 1;
    });

    setCertPlaygroundHeight(playground, certificatesData.length);
    initCertParallax(playground, leftCol, rightCol);
}

renderCertificates();


function initCertParallax(playground, leftCol, rightCol) {
    const cards = [...leftCol.children, ...rightCol.children];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof IntersectionObserver !== 'undefined') {
        if (prefersReducedMotion) {
            cards.forEach((card) => card.classList.add('visible'));
        } else {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
            cards.forEach((card) => revealObserver.observe(card));
        }
    } else {
        cards.forEach((card) => card.classList.add('visible'));
    }

    if (prefersReducedMotion) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
        {
            isDesktop: '(min-width: 1024px)',
            isTablet: '(min-width: 761px) and (max-width: 1023px)',
            isMobile: '(max-width: 760px)',
        },
        (context) => {
            const { isMobile, isTablet } = context.conditions;
            const drift = isMobile ? 24 : isTablet ? 45 : 70;
            const trigger = { trigger: playground, start: 'top bottom', end: 'bottom top', scrub: 1.2 };

            gsap.fromTo(leftCol, { y: drift }, { y: -drift, ease: 'none', scrollTrigger: { ...trigger } });
            gsap.fromTo(rightCol, { y: -drift * 0.6 }, { y: drift * 0.6, ease: 'none', scrollTrigger: { ...trigger } });
        },
    );
}


const TESTIMONIALS_LOAD_URL = "https://goldsmith-steadfast-playlist.ngrok-free.dev/webhook/testimonials-load";
const TESTIMONIALS_SUBMIT_URL = "https://goldsmith-steadfast-playlist.ngrok-free.dev/webhook/testimonials-submit";

function escapeHtml(str) {
    if (str === undefined || str === null) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

const testimonialForm = document.getElementById('testimonialForm');
const testimonialGrid = document.getElementById('testimonialGrid');
const testimonialEmpty = document.getElementById('testimonialEmpty');

function renderTestimonial(name, message, prepend) {
   
    const emptyState = document.getElementById('testimonialEmpty');
    if (emptyState) emptyState.remove();

    
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
        <p class="testimonial-text">"${escapeHtml(message)}"</p>
        <span class="testimonial-author">— ${escapeHtml(name)}</span>
    `;

    if (prepend) {
        testimonialGrid.prepend(card);
    } else {
        testimonialGrid.appendChild(card);
    }
}


if (TESTIMONIALS_LOAD_URL) {
    fetch(TESTIMONIALS_LOAD_URL)
        .then((res) => res.json())
        .then((entries) => {
            if (Array.isArray(entries)) {
                entries.forEach((entry) => renderTestimonial(entry.name, entry.message, false));
            }
        })
        .catch((err) => console.error('Could not load testimonials:', err));
}

if (testimonialForm) {
    testimonialForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('testimonialName');
        const messageInput = document.getElementById('testimonialMessage');
        const submitButton = document.getElementById('testimonialSubmit');

        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !message) return;

        submitButton.disabled = true;

        renderTestimonial(name, message, true);

     
        if (TESTIMONIALS_SUBMIT_URL) {
            fetch(TESTIMONIALS_SUBMIT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, message })
            }).catch((err) => console.error('Could not save testimonial:', err));
        }

        nameInput.value = '';
        messageInput.value = '';
        submitButton.disabled = false;
    });
}


const BOOKING_AVAILABILITY_URL = "https://goldsmith-steadfast-playlist.ngrok-free.dev/webhook/321e6091-ad85-4368-a04b-5969740d5706";
const BOOKING_SUBMIT_URL = "https://goldsmith-steadfast-playlist.ngrok-free.dev/webhook/75213de3-b7e0-41cd-9446-6e88fe8dfa8b";

const MEETING_DURATION_MINUTES = 30;
const PH_TIMEZONE = 'Asia/Manila';

const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    const timezoneSelect = document.getElementById('bookTimezone');
    const dateInput = document.getElementById('bookDate');
    const slotsContainer = document.getElementById('bookingSlots');
    const durationNote = document.getElementById('bookingDurationNote');
    const timePreview = document.getElementById('bookingTimePreview');
    const previewLocalTime = document.getElementById('previewLocalTime');
    const previewPhTime = document.getElementById('previewPhTime');
    const previewTimezone = document.getElementById('previewTimezone');
    const errorBox = document.getElementById('bookingError');
    const submitButton = document.getElementById('bookingSubmit');
    const successPanel = document.getElementById('bookingSuccess');
    const successGrid = document.getElementById('bookingSuccessGrid');
    const bookAgainButton = document.getElementById('bookingAgain');

    let selectedSlotUTC = null;

    durationNote.textContent = `(${MEETING_DURATION_MINUTES} min)`;

 
    const FALLBACK_TIMEZONES = [
        'Pacific/Honolulu', 'America/Anchorage', 'America/Los_Angeles', 'America/Denver',
        'America/Chicago', 'America/New_York', 'America/Sao_Paulo', 'UTC',
        'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow',
        'Africa/Cairo', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Bangkok',
        'Asia/Singapore', 'Asia/Manila', 'Asia/Tokyo', 'Asia/Seoul',
        'Australia/Sydney', 'Pacific/Auckland'
    ];

    function getTimezoneList() {
        try {
            if (typeof Intl.supportedValuesOf === 'function') {
                return Intl.supportedValuesOf('timeZone');
            }
        } catch (e) { }
        return FALLBACK_TIMEZONES;
    }

    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const timezoneList = Array.from(new Set([detectedTimezone, ...getTimezoneList()]));

    timezoneSelect.innerHTML = timezoneList
        .map((tz) => `<option value="${escapeHtml(tz)}"${tz === detectedTimezone ? ' selected' : ''}>${escapeHtml(tz.replace(/_/g, ' '))}</option>`)
        .join('');


    const today = new Date();
    dateInput.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;


    function getOffsetMinutes(date, timeZone) {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone, hourCycle: 'h23',
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        }).formatToParts(date).reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {});
        const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
        return (asUTC - date.getTime()) / 60000;
    }

    function zonedTimeToUtc(dateStr, timeStr, timeZone) {
        const naiveUTC = new Date(`${dateStr}T${timeStr}:00Z`);
        const offset1 = getOffsetMinutes(naiveUTC, timeZone);
        let utc = new Date(naiveUTC.getTime() - offset1 * 60000);
        const offset2 = getOffsetMinutes(utc, timeZone);
        if (offset2 !== offset1) utc = new Date(naiveUTC.getTime() - offset2 * 60000);
        return utc;
    }

    function formatInZone(isoOrDate, timeZone, opts) {
        const date = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
        return new Intl.DateTimeFormat('en-US', {
            timeZone, weekday: 'short', month: 'short', day: 'numeric',
            hour: 'numeric', minute: '2-digit', ...opts
        }).format(date);
    }

    function getDemoSlots(dateStr) {
        const slots = [];
        for (let hour = 9; hour < 17; hour++) {
            for (const minute of [0, 30]) {
                const utc = zonedTimeToUtc(dateStr, `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`, PH_TIMEZONE);
                if (utc.getTime() > Date.now()) slots.push(utc.toISOString());
            }
        }
        return slots;
    }

    async function fetchAvailableSlots(dateStr, timezone) {
        if (!BOOKING_AVAILABILITY_URL) {
            return getDemoSlots(dateStr);
        }
        const res = await fetch(BOOKING_AVAILABILITY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
            body: JSON.stringify({ date: dateStr, timezone, durationMinutes: MEETING_DURATION_MINUTES })
        });
        if (!res.ok) throw new Error('availability_request_failed');
        const data = await res.json();
        if (!data || !Array.isArray(data.slots)) throw new Error('availability_bad_response');
        return data.slots;
    }

    function clearSelection() {
        selectedSlotUTC = null;
        timePreview.hidden = true;
    }

    async function renderSlots() {  
        clearSelection();
        const dateStr = dateInput.value;
        const timezone = timezoneSelect.value;

        if (!dateStr) {
            slotsContainer.innerHTML = '<p class="booking-slots-hint">Pick a date to see available times.</p>';
            return;
        }

        slotsContainer.innerHTML = '<p class="booking-slots-hint">Checking availability…</p>';

        try {
            const slots = await fetchAvailableSlots(dateStr, timezone);

            if (!slots.length) {
                slotsContainer.innerHTML = '<p class="booking-slots-hint">No open times that day — try another date.</p>';
                return;
            }

            slotsContainer.innerHTML = '';
            slots.forEach((iso) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'slot-btn';
                btn.textContent = formatInZone(iso, timezone, { weekday: undefined, month: undefined, day: undefined });
                btn.dataset.iso = iso;
                btn.addEventListener('click', () => selectSlot(iso, btn));
                slotsContainer.appendChild(btn);
            });
        } catch (err) {
            console.error('Could not load availability:', err);
            slotsContainer.innerHTML = '<p class="booking-slots-hint">Couldn\'t load available times right now — try again in a moment.</p>';
        }
    }

    function selectSlot(iso, btn) {
        selectedSlotUTC = iso;
        slotsContainer.querySelectorAll('.slot-btn').forEach((b) => b.classList.toggle('selected', b === btn));

        const timezone = timezoneSelect.value;
        previewLocalTime.textContent = formatInZone(iso, timezone);
        previewPhTime.textContent = formatInZone(iso, PH_TIMEZONE);
        previewTimezone.textContent = timezone.replace(/_/g, ' ');
        timePreview.hidden = false;
    }

    let slotDebounce;
    function scheduleSlotRefresh() {
        clearTimeout(slotDebounce);
        slotDebounce = setTimeout(renderSlots, 150);
    }

    dateInput.addEventListener('change', scheduleSlotRefresh);
    timezoneSelect.addEventListener('change', scheduleSlotRefresh);

    // ── Errors ──────────────────────────────────────────────
    // Anything shown to the visitor is plain language — raw n8n/backend
    // error text never reaches this box.
    const FRIENDLY_ERRORS = {
        invalid_data: 'Please double-check the form — something doesn\'t look right.',
        past_date: 'That date has already passed — pick an upcoming one.',
        slot_unavailable: 'That time was just booked by someone else. Pick another slot below.',
        availability_request_failed: 'Couldn\'t reach the booking system — please try again shortly.',
        server_error: 'Something went wrong on our end — please try again in a moment.'
    };

    function showError(code) {
        errorBox.textContent = FRIENDLY_ERRORS[code] || FRIENDLY_ERRORS.server_error;
        errorBox.hidden = false;
    }

    function clearError() {
        errorBox.hidden = true;
        errorBox.textContent = '';
    }

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateForm(data) {
        if (!data.name || !data.email || !data.message || !data.timezone || !data.date) return 'invalid_data';
        if (!EMAIL_RE.test(data.email)) return 'invalid_data';
        if (new Date(`${data.date}T00:00:00`) < new Date(dateInput.min + 'T00:00:00')) return 'past_date';
        if (!selectedSlotUTC) return 'invalid_data';
        if (new Date(selectedSlotUTC).getTime() <= Date.now()) return 'past_date';
        return null;
    }

    function showSuccess(result) {
        bookingForm.hidden = true;

        const timezone = timezoneSelect.value;
        const rows = [
            ['Date & time', formatInZone(result.startUTC, timezone)],
            ['Philippines time', formatInZone(result.startUTC, PH_TIMEZONE)],
            ['Timezone', timezone.replace(/_/g, ' ')],
            ['Duration', `${result.durationMinutes || MEETING_DURATION_MINUTES} min`]
        ];
        if (result.meetingLink) rows.push(['Meeting link', result.meetingLink]);

        successGrid.innerHTML = rows.map(([label, value]) => `
            <div>
                <span class="preview-label">${escapeHtml(label)}</span>
                <span class="preview-value">${label === 'Meeting link'
                    ? `<a href="${escapeHtml(value)}" target="_blank" rel="noopener" style="color:var(--prime-color)">${escapeHtml(value)}</a>`
                    : escapeHtml(value)}</span>
            </div>
        `).join('');

        successPanel.hidden = false;
        successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    async function submitBooking(payload) {
        if (!BOOKING_SUBMIT_URL) {
            // Demo mode: no backend wired up yet, so just simulate success
            // locally. Nothing is actually saved anywhere.
            await new Promise((resolve) => setTimeout(resolve, 500));
            return { success: true, startUTC: payload.startUTC, durationMinutes: payload.durationMinutes, meetingLink: null };
        }

        const res = await fetch(BOOKING_SUBMIT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
            body: JSON.stringify(payload)
        });

        let data;
        try {
            data = await res.json();
        } catch (e) {
            throw new Error('server_error');
        }

        if (!res.ok || !data || data.success !== true) {
            throw new Error((data && data.error) || 'server_error');
        }
        return data;
    }

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearError();

        const formData = {
            name: document.getElementById('bookName').value.trim(),
            email: document.getElementById('bookEmail').value.trim(),
            company: document.getElementById('bookCompany').value.trim(),
            position: document.getElementById('bookPosition').value.trim(),
            timezone: timezoneSelect.value,
            industry: document.getElementById('bookIndustry').value.trim(),
            message: document.getElementById('bookMessage').value.trim(),
            date: dateInput.value
        };

        const validationError = validateForm(formData);
        if (validationError) {
            showError(validationError);
            return;
        }

        const payload = {
            name: formData.name,
            email: formData.email,
            company: formData.company,
            position: formData.position,
            timezone: formData.timezone,
            industry: formData.industry,
            message: formData.message,
            startUTC: selectedSlotUTC,
            durationMinutes: MEETING_DURATION_MINUTES
        };

        submitButton.disabled = true;
        submitButton.textContent = 'Booking…';

        try {
            const result = await submitBooking(payload);
            showSuccess(result);
        } catch (err) {
            showError(err.message);
            // A slot that's no longer available needs a fresh list.
            if (err.message === 'slot_unavailable') renderSlots();
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Confirm Booking';
        }
    });

    bookAgainButton.addEventListener('click', () => {
        bookingForm.reset();
        timezoneSelect.value = detectedTimezone;
        clearSelection();
        clearError();
        slotsContainer.innerHTML = '<p class="booking-slots-hint">Pick a date to see available times.</p>';
        successPanel.hidden = true;
        bookingForm.hidden = false;
    });
}
