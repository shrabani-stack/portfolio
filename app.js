/**
 * Shrabani Neogi Portfolio — Core Interactive Application
 * Features:
 * - Constellation / Neural Interactive Particle Canvas
 * - Real-time Project Filtering & Dynamic Modals
 * - Orbivia SegFormer-B0 Terrain Simulator (GO / SLOW / STOP)
 * - ORCA-X Multilingual Geospatial Query Simulator
 * - Interactive Cyber CLI Terminal
 * - One-click Clipboard Actions with Toasts
 * - Form Validation & Navigation Spy
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initNavbar();
  initHeroHUD();
  initProjectFilters();
  initProjectModals();
  initTerminalCLI();
  initContactForm();
  initResumeModal();
  initCopyButtons();
});

/* ==========================================================================
   1. AMBIENT INTERACTIVE CANVAS (Neural Network / Constellation)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
  const mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.8 + 0.8;
      this.baseColor = Math.random() > 0.4 ? 'rgba(56, 189, 248,' : 'rgba(99, 102, 241,';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse proximity interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor + ' 0.8)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.18 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.75;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. NAVBAR & SCROLL SPY
   ========================================================================== */
function initNavbar() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinkItems.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // Scroll Spy
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinkItems.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   3. HERO HUD DYNAMIC TEXT
   ========================================================================== */
function initHeroHUD() {
  const typingElem = document.getElementById('hud-typing');
  if (!typingElem) return;

  const messages = [
    'initializing agentic decision engine...',
    'Qdrant vector cluster: 100% healthy',
    'SegFormer-B0 inferring terrain @ 38ms',
    'ORCA-X INCOIS PFZ telemetry synchronized',
    'Sarvam AI multilingual planner active'
  ];

  let msgIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentMsg = messages[msgIndex];
    if (isDeleting) {
      typingElem.textContent = currentMsg.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElem.textContent = currentMsg.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === currentMsg.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      msgIndex = (msgIndex + 1) % messages.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 1000);
}

/* ==========================================================================
   4. PROJECT FILTERING
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'grid';
          card.style.animation = 'fadeUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. PROJECT MODALS & LIVE SIMULATORS
   ========================================================================== */
const projectData = {
  orca: {
    title: 'ORCA-X: Ocean Reasoning & Collaborative AI',
    subtitle: 'Agentic Marine Decision-Support Platform with Geospatial Intelligence',
    tags: ['React', 'TypeScript', 'FastAPI', 'Python', 'Qdrant Vector DB', 'Leaflet.js', 'Capacitor', 'Sarvam AI'],
    summary: `
      ORCA-X addresses the severe safety and economic vulnerabilities of small-scale artisanal and commercial fishermen. 
      It combines multilingual voice querying in Indian regional languages with real-time geospatial risk modeling.
    `,
    architecture: [
      { step: '1. Multilingual Audio Intake', desc: 'Fisherman speaks in Bengali, Hindi, or Tamil. Sarvam AI models speech detection and transcription.' },
      { step: '2. LLM Planner Orchestrator', desc: 'Deconstructs natural language queries into geo-queries and parameter bounds.' },
      { step: '3. Geospatial & Satellite Fusion', desc: 'Pulls real-time Open-Meteo ocean currents, INCOIS Potential Fishing Zones (PFZ), and Copernicus ocean temperature.' },
      { step: '4. Hybrid RAG Synthesis', desc: 'Qdrant vector similarity search + BM25 keyword matching retrieve grounded maritime regulatory laws and hazard safety advice.' },
      { step: '5. Offline Transponder Sync', desc: 'Works with satellite transponders through Capacitor mobile offline caching for zero-network conditions at high sea.' }
    ],
    simulator: 'orca'
  },
  orbivia: {
    title: 'Orbivia: AI-Powered Terrain Intelligence System',
    subtitle: 'Real-Time Semantic Segmentation & Autonomous Rover Controls (GO / SLOW / STOP)',
    tags: ['SegFormer-B0', 'PyTorch', 'Python', 'Digital Twins', 'Synthetic Data', 'Robotics'],
    summary: `
      Built during a high-intensity 12-hour hackathon, Orbivia fine-tunes a SegFormer-B0 vision transformer on synthetic digital twin environments. 
      It classifies 10 outdoor terrain textures (rocks, mud, gravel, vegetation, sand, puddle) and converts segmentation distributions into instant autonomous vehicle movement primitives.
    `,
    architecture: [
      { step: '1. Synthetic Data Pipeline', desc: 'Generated 10,000+ photo-realistic synthetic terrain frames with zero manual polygon annotation.' },
      { step: '2. SegFormer-B0 Fine-Tuning', desc: 'Optimized attention heads for edge devices achieving 74.8% mIoU at ~38 FPS inference.' },
      { step: '3. Hazard Density Calculus', desc: 'Computes pixel risk density across forward travel trajectories.' },
      { step: '4. Decision Arbiter', desc: 'Triggers instant autonomous control codes: GO (clear path), SLOW (loose gravel/mud), STOP (boulder/crevasse).' }
    ],
    simulator: 'orbivia'
  },
  mindbloom: {
    title: 'MindBloom + Sehat Saarthi Dual Health Suite',
    subtitle: 'Automated Mental Wellness & 24/7 AI-Powered Medical Triage',
    tags: ['HTML5/CSS3', 'JavaScript', 'Django', 'MySQL', 'Rasa NLU', 'Leaflet API'],
    summary: `
      A cohesive two-part healthcare platform: MindBloom delivers stigma-free mental health self-assessment, guided reflection, and curated mindfulness; 
      Sehat Saarthi powers round-the-clock conversational triage with automated doctor appointment booking and live ambulance routing via Leaflet.js.
    `,
    architecture: [
      { step: '1. Conversational Triaging', desc: 'Rasa conversational AI parses medical symptoms and categorizes severity.' },
      { step: '2. Emergency GIS Dispatch', desc: 'Leaflet routing API computes the fastest emergency vehicle navigation path based on localized traffic.' },
      { step: '3. Mental Health Modules', desc: 'Interactive reflection tools, self-guided meditation, and encrypted progress journaling in Django.' }
    ],
    simulator: 'mindbloom'
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalBody = document.getElementById('modal-dynamic-body');
  const triggers = document.querySelectorAll('.project-modal-trigger');

  if (!modal || !modalBody) return;

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const pKey = trigger.getAttribute('data-project');
      const data = projectData[pKey];
      if (!data) return;

      modalBody.innerHTML = `
        <h2 style="font-family: var(--font-display); font-size: 1.8rem; margin-bottom: 6px; color: #fff;">${data.title}</h2>
        <p style="color: var(--accent-cyan); font-family: var(--font-mono); font-size: 0.85rem; margin-bottom: 16px;">${data.subtitle}</p>
        
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px;">
          ${data.tags.map((t) => `<span class="tech-tag">${t}</span>`).join('')}
        </div>

        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px;">${data.summary}</p>

        <h4 style="font-family: var(--font-display); font-size: 1.15rem; color: #fff; margin-bottom: 12px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
          System Architecture & Pipeline
        </h4>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
          ${data.architecture
            .map(
              (a) => `
            <div style="background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: 8px; border-left: 3px solid var(--accent-cyan);">
              <strong style="color: #fff; font-size: 0.9rem; font-family: var(--font-mono);">${a.step}</strong>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 2px;">${a.desc}</p>
            </div>
          `
            )
            .join('')}
        </div>

        <!-- Interactive Simulator Widget based on project -->
        <div class="interactive-demo-box">
          ${getProjectDemoHTML(data.simulator)}
        </div>
      `;

      attachSimulatorEvents(data.simulator);

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    });
  });
}

function getProjectDemoHTML(simType) {
  if (simType === 'orbivia') {
    return `
      <div class="demo-title"><i class="fa-solid fa-microchip"></i> Live SegFormer-B0 Autonomous Decision Simulator</div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">Select an outdoor terrain to evaluate real-time segmentation and vehicle control response:</p>
      
      <div class="terrain-selector">
        <button class="terrain-btn active" data-type="trail">Paved Trail</button>
        <button class="terrain-btn" data-type="mud">Deep Mud & Puddles</button>
        <button class="terrain-btn" data-type="boulders">Massive Boulders</button>
        <button class="terrain-btn" data-type="brush">Dense Vegetation</button>
      </div>

      <div id="sim-output" class="sim-output-box">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: var(--accent-emerald); font-weight: 700;">COMMAND: GO (Normal Cruise)</span>
          <span style="color: var(--text-dim);">Latency: 36ms</span>
        </div>
        <div>Detected: 88% Flat Hardpack Ground, 12% Sparse Grass. Hazard Score: 0.08 / 1.0. Safe velocity: 25 km/h.</div>
      </div>
    `;
  } else if (simType === 'orca') {
    return `
      <div class="demo-title"><i class="fa-solid fa-satellite-dish"></i> ORCA-X Multilingual RAG Query Simulator</div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">Simulate fisherman voice/text query ingestion through Sarvam AI & Qdrant vector retrieval:</p>
      
      <div class="terrain-selector">
        <button class="terrain-btn active" data-lang="bn">বাংলা (Bengali): "আজ কি দিঘার সমুদ্রে যাওয়া নিরাপদ?"</button>
        <button class="terrain-btn" data-lang="hi">हिंदी (Hindi): "अगले 12 घंटे में चक्रवात की स्थिति क्या है?"</button>
        <button class="terrain-btn" data-lang="en">English: "Show high PFZ yield near coordinates 21.6°N, 87.5°E"</button>
      </div>

      <div id="orca-sim-output" class="sim-output-box">
        <div style="color: var(--accent-cyan); font-weight: 700; margin-bottom: 6px;">[Sarvam AI ASR & LangID: Bengali] -> [FastAPI Core] -> [Qdrant RAG]</div>
        <div>Safety Advisory: Cyclone Alert Level 2 active in Bay of Bengal. INCOIS reports wave heights exceeding 3.8m. Safe harbor recommended at Digha Ghat.</div>
      </div>
    `;
  } else {
    return `
      <div class="demo-title"><i class="fa-solid fa-heart-pulse"></i> Sehat Saarthi 24/7 AI Triage Simulator</div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">Simulate patient triage and emergency route calculation:</p>
      
      <div class="terrain-selector">
        <button class="terrain-btn active" data-triage="urgent">Emergency: Acute Chest Pain</button>
        <button class="terrain-btn" data-triage="routine">Consult: Chronic Migraine</button>
        <button class="terrain-btn" data-triage="mind">MindBloom: Anxiety Reflection Session</button>
      </div>

      <div id="health-sim-output" class="sim-output-box">
        <div style="color: var(--accent-rose); font-weight: 700; margin-bottom: 6px;">TRIAGE LEVEL: RED (Immediate Dispatch)</div>
        <div>Leaflet GPS Ambulance Assigned: Amb-04 (ETA: 6.2 mins). Nearest cardiac emergency center: Kolkata Medical Hub notified.</div>
      </div>
    `;
  }
}

function attachSimulatorEvents(simType) {
  if (simType === 'orbivia') {
    const btns = document.querySelectorAll('.terrain-btn');
    const output = document.getElementById('sim-output');

    const responses = {
      trail: {
        cmd: 'COMMAND: GO (Normal Cruise)',
        color: 'var(--accent-emerald)',
        latency: '36ms',
        desc: 'Detected: 88% Flat Hardpack Ground, 12% Sparse Grass. Hazard Score: 0.08 / 1.0. Safe velocity: 25 km/h.'
      },
      mud: {
        cmd: 'COMMAND: SLOW (Traction Low - 4WD Engaged)',
        color: 'var(--accent-amber)',
        latency: '41ms',
        desc: 'Detected: 64% Mud / Saturated Soil, 22% Water Puddle. Slippage risk high. Throttle reduced to 30%, torque vectoring active.'
      },
      boulders: {
        cmd: 'COMMAND: EMERGENCY STOP (Path Obstructed)',
        color: 'var(--accent-rose)',
        latency: '34ms',
        desc: 'Detected: 78% High-Relief Rock Boulders exceeding vehicle ground clearance (45cm). Immediate braking engaged.'
      },
      brush: {
        cmd: 'COMMAND: SLOW (Obstacle Proximity Caution)',
        color: 'var(--accent-amber)',
        latency: '39ms',
        desc: 'Detected: 55% Dense Scrub & Brambles. Ultrasonic proximity confirms passable shrubbery. Proceed at 8 km/h.'
      }
    };

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-type');
        const r = responses[key];
        if (r && output) {
          output.style.borderLeftColor = r.color;
          output.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: ${r.color}; font-weight: 700;">${r.cmd}</span>
              <span style="color: var(--text-dim);">Latency: ${r.latency}</span>
            </div>
            <div>${r.desc}</div>
          `;
        }
      });
    });
  } else if (simType === 'orca') {
    const btns = document.querySelectorAll('.terrain-btn');
    const output = document.getElementById('orca-sim-output');

    const orcaResponses = {
      bn: {
        title: '[Sarvam AI ASR & LangID: Bengali] -> [FastAPI Core] -> [Qdrant RAG]',
        body: 'Safety Advisory: Cyclone Alert Level 2 active in Bay of Bengal. INCOIS reports wave heights exceeding 3.8m. Safe harbor recommended at Digha Ghat.'
      },
      hi: {
        title: '[Sarvam AI ASR & LangID: Hindi] -> [FastAPI Core] -> [Open-Meteo]',
        body: 'चक्रवात ट्रैकिंग: गहरा दबाव क्षेत्र उत्तर-पश्चिम की ओर 18 किमी/घंटा की गति से बढ़ रहा है। तटवर्ती मछुआरों को समुद्र में न जाने की सख्त सलाह।'
      },
      en: {
        title: '[Sarvam AI ASR & LangID: English] -> [FastAPI Core] -> [Copernicus SST]',
        body: 'High PFZ Identified: Thermal front and chlorophyll bloom at (21.58°N, 87.52°E). Predicted pelagic fish concentration: High. Wind speed: 12 knots (Safe).'
      }
    };

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-lang');
        const r = orcaResponses[key];
        if (r && output) {
          output.innerHTML = `
            <div style="color: var(--accent-cyan); font-weight: 700; margin-bottom: 6px;">${r.title}</div>
            <div>${r.body}</div>
          `;
        }
      });
    });
  } else if (simType === 'mindbloom') {
    const btns = document.querySelectorAll('.terrain-btn');
    const output = document.getElementById('health-sim-output');

    const healthResponses = {
      urgent: {
        badge: 'TRIAGE LEVEL: RED (Immediate Dispatch)',
        color: 'var(--accent-rose)',
        desc: 'Leaflet GPS Ambulance Assigned: Amb-04 (ETA: 6.2 mins). Nearest cardiac emergency center: Kolkata Medical Hub notified.'
      },
      routine: {
        badge: 'TRIAGE LEVEL: GREEN (Outpatient Teleconsult)',
        color: 'var(--accent-emerald)',
        desc: 'Automated slot booked with Neurologist Dr. S. Sen via Django Appointment Engine for tomorrow 11:30 AM IST.'
      },
      mind: {
        badge: 'MINDBLOOM WORKSPACE: GUIDED CALM ACTIVE',
        color: 'var(--accent-purple)',
        desc: 'Loaded 10-minute 4-7-8 breathing exercise. Heart rate recovery graph active. Interactive journaling unlocked.'
      }
    };

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-triage');
        const r = healthResponses[key];
        if (r && output) {
          output.style.borderLeftColor = r.color;
          output.innerHTML = `
            <div style="color: ${r.color}; font-weight: 700; margin-bottom: 6px;">${r.badge}</div>
            <div>${r.desc}</div>
          `;
        }
      });
    });
  }
}

/* ==========================================================================
   6. INTERACTIVE TERMINAL CLI
   ========================================================================== */
function initTerminalCLI() {
  const cliInput = document.getElementById('cli-input');
  const cliOutput = document.getElementById('cli-output');
  const cliRunBtn = document.getElementById('cli-run-btn');
  const quickBtns = document.querySelectorAll('.cli-btn');

  if (!cliInput || !cliOutput) return;

  const history = [];
  let historyIdx = -1;

  const commands = {
    help: `Available commands:
  • <span class="cli-highlight">skills</span>       - List full technical capabilities
  • <span class="cli-highlight">projects</span>     - Detailed breakdown of flagship systems
  • <span class="cli-highlight">education</span>    - Academics, YGPA & competitive standing
  • <span class="cli-highlight">metrics</span>      - High-level engineering numbers
  • <span class="cli-highlight">contact</span>      - Direct communication channels
  • <span class="cli-highlight">hire</span>         - Internship availability & fit
  • <span class="cli-highlight">whoami</span>       - Shrabani Neogi profile
  • <span class="cli-highlight">cat resume</span>   - View ASCII formatted resume summary
  • <span class="cli-highlight">clear</span>        - Clear terminal screen`,

    skills: `Technical Skills Matrix:
  Languages:           Java, Python, C/C++, JavaScript, TypeScript, HTML/CSS, SQL
  AI & Deep Learning:  SegFormer-B0, Qdrant Vector DB, RAG Pipelines, BM25, Sarvam AI, Rasa
  Frameworks & Web:    React, Node.js, Next.js, FastAPI, Express, Django, Capacitor
  Databases & Tools:   MongoDB, MySQL, PostgreSQL, Git/GitHub, Leaflet.js, VS Code`,

    projects: `Flagship Projects:
  1. <strong style="color:#38bdf8">ORCA-X</strong>: Ocean Reasoning & Collaborative AI
     - Multilingual Sarvam AI voice query + Qdrant vector RAG + INCOIS PFZ / Copernicus.
  2. <strong style="color:#10b981">Orbivia</strong>: AI-Powered Terrain Intelligence System
     - Fine-tuned SegFormer-B0 vision transformer on synthetic digital twins (GO/SLOW/STOP).
  3. <strong style="color:#8b5cf6">MindBloom + Sehat Saarthi</strong>:
     - Mental health platform + 24/7 automated ambulance navigation & triage bot.`,

    education: `Education & Academic Credentials:
  • <strong style="color:#fff">Heritage Institute of Technology, Kolkata</strong>: B.Tech in CSE (YGPA: 9.28) [2024-2028]
  • <strong style="color:#f59e0b">JEE Mains 2024</strong>: 94.78 Percentile (All India Rank: 78,639)
  • <strong style="color:#fff">BSF Senior Secondary Residential School</strong>: AISSCE (77.6%) [2021-2023]
  • <strong style="color:#fff">St. Joseph's High School</strong>: CICSE (91.2% Distinction) [2009-2021]`,

    metrics: `Key Engineering Metrics:
  • Academic YGPA: 9.28 / 10.0
  • Vision Transformer Inference Latency: <40ms (SegFormer-B0)
  • National JEE Rank: Top ~5% percentile out of 1.4M candidates
  • Geospatial coverage: Indian Ocean EEZ + Coastal Maritime Zones`,

    contact: `Contact Shrabani Neogi:
  • Email:    <a href="mailto:shrabanineogi2005@gmail.com" style="color:#38bdf8">shrabanineogi2005@gmail.com</a>
  • Phone:    +91 85977 04518
  • LinkedIn: <a href="https://linkedin.com/in/shrabani-neogi" target="_blank" style="color:#38bdf8">linkedin.com/in/shrabani-neogi</a>
  • GitHub:   <a href="https://github.com/shrabani-stack" target="_blank" style="color:#38bdf8">github.com/shrabani-stack</a>`,

    hire: `<span style="color:#10b981; font-weight:700;">🟢 STATUS: AVAILABLE FOR INTERNSHIPS</span>
  Seeking Summer 2026/27 Software Engineering, AI/ML, or Computer Vision internships.
  Fast learner with proven ability to deliver production-grade systems under tight hackathon sprints.`,

    whoami: `Shrabani Neogi — Computer Science Undergrad @ Heritage Institute of Technology.
Passionate about Agentic AI, Autonomous Systems, and Full-Stack Engineering.`,

    'cat resume': `==========================================================
SHRABANI NEOGI — RESUME SUMMARY
==========================================================
Email: shrabanineogi2005@gmail.com | Phone: +91 85977 04518
Degree: B.Tech CSE @ Heritage Institute of Tech (YGPA: 9.28)
Focus: AI/ML, SegFormer-B0, Qdrant Vector DB, FastAPI, React
Status: Ready for immediate engineering impact.
==========================================================`
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    history.push(rawCmd);
    historyIdx = history.length;

    // Append user input line
    const userLine = document.createElement('div');
    userLine.className = 'cli-line';
    userLine.innerHTML = `<span class="cli-prompt">shrabani@core:~$</span> ${escapeHTML(rawCmd)}`;
    cliOutput.appendChild(userLine);

    if (cmd === 'clear') {
      cliOutput.innerHTML = '';
      return;
    }

    const respLine = document.createElement('div');
    respLine.className = 'cli-line';

    if (commands[cmd]) {
      respLine.innerHTML = commands[cmd];
    } else if (cmd.startsWith('eval ')) {
      try {
        const mathExpr = cmd.substring(5);
        // Safe evaluation of basic math only
        if (/^[\d+\-*/().\s]+$/.test(mathExpr)) {
          const res = Function(`'use strict'; return (${mathExpr})`)();
          respLine.innerHTML = `<span style="color:var(--accent-emerald)">= ${res}</span>`;
        } else {
          respLine.innerHTML = `<span style="color:var(--accent-rose)">Security notice: Only arithmetic expressions permitted.</span>`;
        }
      } catch (err) {
        respLine.innerHTML = `<span style="color:var(--accent-rose)">Math eval error: ${err.message}</span>`;
      }
    } else {
      respLine.innerHTML = `Command not found: <code class="cmd-chip">${escapeHTML(cmd)}</code>. Type <code class="cmd-chip">help</code> to see available commands.`;
    }

    cliOutput.appendChild(respLine);
    cliOutput.scrollTop = cliOutput.scrollHeight;
  }

  cliInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = cliInput.value;
      cliInput.value = '';
      executeCommand(val);
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0 && historyIdx > 0) {
        historyIdx--;
        cliInput.value = history[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < history.length - 1) {
        historyIdx++;
        cliInput.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        cliInput.value = '';
      }
    }
  });

  cliRunBtn?.addEventListener('click', () => {
    const val = cliInput.value;
    cliInput.value = '';
    executeCommand(val);
  });

  quickBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ==========================================================================
   7. CONTACT FORM & SIMULATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Transmission...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;

      status.className = 'form-status success';
      status.innerHTML = `
        <i class="fa-solid fa-check-circle"></i> 
        Thank you, <strong>${escapeHTML(name)}</strong>! Your message regarding "<em>${escapeHTML(subject)}</em>" has been logged. Shrabani will reply to <strong>${escapeHTML(email)}</strong> shortly.
      `;

      form.reset();
      showToast('Message sent successfully!', 'success');
    }, 1200);
  });
}

/* ==========================================================================
   8. RESUME MODAL
   ========================================================================== */
function initResumeModal() {
  const openBtn = document.getElementById('resume-modal-btn');
  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('resume-close-btn');

  if (!modal) return;

  function openResume() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeResume() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  openBtn?.addEventListener('click', openResume);
  closeBtn?.addEventListener('click', closeResume);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeResume();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeResume();
  });
}

/* ==========================================================================
   9. ONE-CLICK CLIPBOARD COPY & TOASTS
   ========================================================================== */
function initCopyButtons() {
  const heroCopyBtn = document.getElementById('copy-email-hero-btn');
  const contactCopyBtn = document.getElementById('copy-email-btn');
  const email = 'shrabanineogi2005@gmail.com';

  function copyAction() {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        showToast('Email copied to clipboard: ' + email, 'success');
      })
      .catch(() => {
        showToast('Direct email: ' + email, 'info');
      });
  }

  heroCopyBtn?.addEventListener('click', copyAction);
  contactCopyBtn?.addEventListener('click', copyAction);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  const icon =
    type === 'success'
      ? '<i class="fa-solid fa-circle-check" style="color:var(--accent-emerald)"></i>'
      : type === 'error'
      ? '<i class="fa-solid fa-triangle-exclamation" style="color:var(--accent-rose)"></i>'
      : '<i class="fa-solid fa-circle-info" style="color:var(--accent-cyan)"></i>';

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}
