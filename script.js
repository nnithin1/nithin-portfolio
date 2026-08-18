// ===== Audio Engine =====
const AudioEngine = {
  ctx: null,
  enabled: false,
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },
  playTone(freq, type, duration, vol) {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },
  click() { this.playTone(600, 'sine', 0.05, 0.1); },
  hover() { this.playTone(300, 'sine', 0.05, 0.02); },
  type() { this.playTone(800 + Math.random()*200, 'square', 0.03, 0.01); },
  themeSwitch() { this.playTone(400, 'triangle', 0.2, 0.1); this.playTone(600, 'triangle', 0.3, 0.1); },
  error() { this.playTone(150, 'sawtooth', 0.3, 0.1); },
  alarm() { 
    if(!this.enabled || !this.ctx) return;
    for(let i=0; i<3; i++) {
      setTimeout(() => this.playTone(800, 'sawtooth', 0.1, 0.2), i*200);
      setTimeout(() => this.playTone(1000, 'sawtooth', 0.1, 0.2), i*200 + 100);
    }
  }
};

const soundToggle = document.getElementById('soundToggle');
soundToggle.addEventListener('click', () => {
  AudioEngine.init();
  AudioEngine.enabled = !AudioEngine.enabled;
  if(AudioEngine.enabled) AudioEngine.click();
  soundToggle.querySelector('.sound-icon-on').style.display = AudioEngine.enabled ? 'block' : 'none';
  soundToggle.querySelector('.sound-icon-off').style.display = AudioEngine.enabled ? 'none' : 'block';
});
// Attach sounds to standard interactives after short delay to let DOM load
setTimeout(() => {
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => AudioEngine.hover());
    if(el.id !== 'soundToggle' && el.id !== 'themeToggle') {
      el.addEventListener('click', () => AudioEngine.click());
    }
  });
}, 500);

// ===== Theme Toggle (Blue/Red Team) =====
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

themeToggle.addEventListener('click', () => {
  AudioEngine.click();
  const current = htmlEl.getAttribute('data-theme');
  const next = current === 'red' ? 'blue' : 'red';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('cyber_theme', next);
});

const savedTheme = localStorage.getItem('cyber_theme');
if(savedTheme) htmlEl.setAttribute('data-theme', savedTheme);

// ===== Mode Toggle (Light/Dark) =====
const modeToggle = document.getElementById('modeToggle');
modeToggle.addEventListener('click', () => {
  AudioEngine.click();
  const current = htmlEl.getAttribute('data-mode') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-mode', next);
  localStorage.setItem('cyber_mode', next);
});

const savedMode = localStorage.getItem('cyber_mode');
if(savedMode) htmlEl.setAttribute('data-mode', savedMode);


// 3D Globe removed per user request


// ===== Typing Animation =====
const roles = [
  'Cyber Defence Engineer',
  'EDR & Endpoint Security',
  'SOC Engineering & Automation',
  'Vulnerability Management',
  'Email & WAF Security',
  'MITRE ATT&CK / Threat Hunting',
  'Incident Response'
];
const typedText = document.getElementById('typedText');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 60;

function typeRole() {
  if(!typedText) return;
  const currentRole = roles[roleIndex];
  if (isDeleting) {
    typedText.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 30;
  } else {
    typedText.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 60 + Math.random() * 40;
  }
  if (!isDeleting && charIndex === currentRole.length) {
    typeSpeed = 2500;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typeSpeed = 400;
  }
  setTimeout(typeRole, typeSpeed);
}
setTimeout(typeRole, 1000);


// ===== Navigation & Scroll =====
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navOverlay.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

function closeMenu() {
  navLinks.classList.remove('open');
  navToggle.classList.remove('active');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}
navOverlay.addEventListener('click', closeMenu);
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

// ===== Scroll Reveal =====
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
reveals.forEach(el => revealObserver.observe(el));

// ===== Stat Counters =====
const statValues = document.querySelectorAll('.metric__value[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statValues.forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const current = Math.round((1 - Math.pow(2, -10 * progress)) * target);
    el.textContent = `${prefix}${current}${progress >= 1 ? suffix : ''}`;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}


// ===== Download Resume (Print) =====
document.getElementById('downloadResume')?.addEventListener('click', () => {
  window.print();
});


// ===== Custom SVG Radar Chart =====
function renderRadarChart() {
  const container = document.getElementById('radarChart');
  if(!container) return;
  container.innerHTML = '';
  
  const data = [
    { label: 'EDR & Endpoint', value: 0.95 },
    { label: 'Vuln Mgmt', value: 0.90 },
    { label: 'SIEM & SOC', value: 0.95 },
    { label: 'WAF & Web', value: 0.85 },
    { label: 'Cloud Sec', value: 0.80 },
    { label: 'Automation', value: 0.85 },
    { label: 'Gov & Compliance', value: 0.75 }
  ];
  
  const size = 400;
  const center = size / 2;
  const radius = size / 2 - 60;
  const sides = data.length;
  const angleStep = (Math.PI * 2) / sides;
  
  let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Grid circles
  [0.25, 0.5, 0.75, 1].forEach(scale => {
    let points = '';
    for(let i=0; i<sides; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + Math.cos(angle) * (radius * scale);
      const y = center + Math.sin(angle) * (radius * scale);
      points += `${x},${y} `;
    }
    svg += `<polygon points="${points}" fill="none" stroke="currentColor" stroke-opacity="0.1" stroke-width="1"/>`;
  });
  
  // Axes & Labels
  for(let i=0; i<sides; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    
    // Axis line
    svg += `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="currentColor" stroke-opacity="0.2" stroke-width="1"/>`;
    
    // Label
    const labelX = center + Math.cos(angle) * (radius + 25);
    const labelY = center + Math.sin(angle) * (radius + 25);
    let anchor = "middle";
    if (Math.cos(angle) > 0.1) anchor = "start";
    else if (Math.cos(angle) < -0.1) anchor = "end";
    
    svg += `<text x="${labelX}" y="${labelY}" fill="currentColor" opacity="0.7" font-size="11" font-family="monospace" text-anchor="${anchor}" dominant-baseline="middle">${data[i].label}</text>`;
  }
  
  // Data Polygon
  let dataPoints = '';
  for(let i=0; i<sides; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const val = data[i].value;
    const x = center + Math.cos(angle) * (radius * val);
    const y = center + Math.sin(angle) * (radius * val);
    dataPoints += `${x},${y} `;
  }
  
  svg += `<polygon points="${dataPoints}" fill="var(--accent-glow)" stroke="var(--accent)" stroke-width="2" />`;
  
  // Data points dots
  for(let i=0; i<sides; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const val = data[i].value;
    const x = center + Math.cos(angle) * (radius * val);
    const y = center + Math.sin(angle) * (radius * val);
    svg += `<circle cx="${x}" cy="${y}" r="4" fill="var(--bg-primary)" stroke="var(--accent)" stroke-width="2"><title>${data[i].label}: ${Math.round(val*100)}%</title></circle>`;
  }
  
  svg += `</svg>`;
  container.innerHTML = svg;
}
renderRadarChart();
// Re-render chart if window resizes slightly or theme changes
window.addEventListener('resize', renderRadarChart);
document.getElementById('themeToggle').addEventListener('click', () => setTimeout(renderRadarChart, 50));


// ===== Interactive Terminal =====
const termInput = document.getElementById('terminalInput');
const termOutput = document.getElementById('terminalOutput');

const commands = {
  help: () => `
<div class="term-line">Available commands:</div>
<div class="term-line"><span class="term-accent">whoami</span>    - Display summary</div>
<div class="term-line"><span class="term-accent">skills</span>    - List core competencies</div>
<div class="term-line"><span class="term-accent">experience</span>- Show work history summary</div>
<div class="term-line"><span class="term-accent">contact</span>   - Show contact info</div>
<div class="term-line"><span class="term-accent">clear</span>     - Clear terminal output</div>
  `,
  whoami: () => `
<div class="term-line">Name: Nithin N</div>
<div class="term-line">Role: Cyber Defence Engineer</div>
<div class="term-line">Status: <span class="term-accent">Active & Defending</span></div>
<div class="term-line">Location: Mysuru, India</div>
  `,
  skills: () => `
<div class="term-line">[+] EDR & Endpoint (CrowdStrike, Carbon Black, Trend Micro)</div>
<div class="term-line">[+] Vulnerability Management (Tenable, Rapid7, NVD)</div>
<div class="term-line">[+] Email & WAF Security (Proofpoint, F5, Azure/AWS WAF)</div>
<div class="term-line">[+] SIEM & SOC Automation (QRadar, SOAR, Python)</div>
  `,
  experience: () => `
<div class="term-line">2024 - Present : <span class="term-accent">Lead Information Security Engineer</span> (Enterprise Cyber Defence)</div>
<div class="term-line">2022 - 2023    : <span class="term-accent">Senior Information Security Engineer</span></div>
<div class="term-line">2019 - 2021    : <span class="term-accent">Information Security Engineer</span></div>
<div class="term-line">2019           : <span class="term-accent">Infrastructure Intern</span> (Microfocus)</div>
  `,
  contact: () => `
<div class="term-line">Email: <a href="mailto:n.nithin1993@gmail.com" class="term-val">n.nithin1993@gmail.com</a></div>
<div class="term-line">Phone: <a href="tel:+918861658888" class="term-val">+91 886-165-8888</a></div>
<div class="term-line">LinkedIn: <a href="https://www.linkedin.com/in/nithin-n-4316027b/" class="term-val">linkedin.com/in/nithin-n-4316027b/</a></div>
  `,
  clear: () => {
    termOutput.innerHTML = '';
    return '';
  },
  sudo: () => `<div class="term-line term-error">Access Denied: Incident logged and reported.</div>`
};

if(termInput) {
  termInput.addEventListener('keydown', (e) => {
    AudioEngine.type();
    if (e.key === 'Enter') {
      const val = termInput.value.trim().toLowerCase();
      termInput.value = '';
      
      if (!val) return;
      
      const prevCmd = `<div class="term-line"><span class="term-prompt">visitor@nithin.sec:~$</span> <span class="term-cmd">${val}</span></div>`;
      let outputStr = '';
      
      if (commands[val]) {
        outputStr = commands[val]();
      } else {
        outputStr = `<div class="term-line term-warn">Command not found: ${val}. Type 'help' for available commands.</div>`;
      }
      
      termOutput.innerHTML += prevCmd + outputStr;
      
      const termBody = document.getElementById('terminalBody');
      termBody.scrollTop = termBody.scrollHeight;
    }
  });
}

// ===== Easter Eggs =====
// 1. Profile Breach on 5 Clicks
let profileClicks = 0;
const profileFrame = document.getElementById('profileFrame');
const breachOverlay = document.getElementById('breachOverlay');
const breachResolve = document.getElementById('breachResolve');
const heroBubble = document.getElementById('heroBubble');
const bubbleMessages = ["Hey! 🛡️", "System Secure.", "Scanning...", "Welcome!"];

if(profileFrame) {
  profileFrame.addEventListener('click', () => {
    profileClicks++;
    if(profileClicks >= 5) {
      triggerBreach();
      profileClicks = 0;
    } else {
      if(heroBubble) {
        heroBubble.textContent = bubbleMessages[(profileClicks - 1) % bubbleMessages.length];
        heroBubble.classList.remove('show');
        void heroBubble.offsetWidth; // trigger reflow
        heroBubble.classList.add('show');
        AudioEngine.type(); // Play a short beep sound
        setTimeout(() => heroBubble.classList.remove('show'), 2000);
      }
    }
  });
}

function triggerBreach() {
  // force Red Theme
  htmlEl.setAttribute('data-theme', 'red');
  AudioEngine.alarm();
  breachOverlay.classList.add('active');
  setTimeout(() => {
    breachResolve.classList.add('show');
    setTimeout(() => {
      breachOverlay.classList.remove('active');
      breachResolve.classList.remove('show');
      htmlEl.setAttribute('data-theme', 'blue'); // return to normal
    }, 2500);
  }, 2000);
}


// 2. Konami Code -> Matrix
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

window.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      triggerMatrix();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function triggerMatrix() {
  const overlay = document.getElementById('matrixOverlay');
  overlay.classList.add('active');
  
  const mCanvas = document.getElementById('matrixCanvas');
  const mCtx = mCanvas.getContext('2d');
  
  mCanvas.width = window.innerWidth;
  mCanvas.height = window.innerHeight;
  
  const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン';
  const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  const alphabet = katakana + latin + nums;
  
  const fontSize = 16;
  const columns = mCanvas.width / fontSize;
  const drops = [];
  
  for (let x = 0; x < columns; x++) drops[x] = 1;
  
  const drawMatrix = () => {
    mCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);
    
    // Get current theme color
    const style = getComputedStyle(document.documentElement);
    mCtx.fillStyle = `hsl(${style.getPropertyValue('--accent-h')}, 100%, 50%)`;
    mCtx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
      const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > mCanvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  };
  
  const matrixInterval = setInterval(drawMatrix, 30);
  
  // Close after 8 seconds
  setTimeout(() => {
    clearInterval(matrixInterval);
    overlay.classList.remove('active');
  }, 8000);
}

// ===== Custom Cyber Cursor =====
const cursor = document.getElementById('cyberCursor');
const trail = document.getElementById('cyberCursorTrail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

if(cursor && trail) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateCursor() {
    trailX += (mouseX - trailX) * 0.2;
    trailY += (mouseY - trailY) * 0.2;
    trail.style.left = trailX + 'px';
    trail.style.top = trailY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mousedown', e => {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    if(AudioEngine && AudioEngine.enabled) AudioEngine.playTone(300, 'sine', 0.1, 0.05);
    setTimeout(() => ripple.remove(), 600);
  });

  document.querySelectorAll('a, button, input, .skill-card, .achievement-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// ===== Decryption Text Effect =====
const decryptChars = '!<>-_\\\\/[]{}—=+*^?#_';
function scrambleText(element) {
  const original = element.getAttribute('data-original') || element.innerText;
  element.setAttribute('data-original', original);
  let iteration = 0;
  clearInterval(element.scrambleInterval);
  
  element.scrambleInterval = setInterval(() => {
    element.innerText = original.split('').map((char, index) => {
      if(index < iteration || char === ' ') return original[index];
      return decryptChars[Math.floor(Math.random() * decryptChars.length)];
    }).join('');
    
    if(iteration >= original.length) clearInterval(element.scrambleInterval);
    iteration += 1/3;
  }, 30);
}

const decryptObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      scrambleText(entry.target);
      decryptObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-decrypt="true"]').forEach(el => decryptObserver.observe(el));

// ===== Threat Feed Ticker =====
const tickerInner = document.getElementById('threatTicker');
async function loadThreatFeed() {
  if(!tickerInner) return;
  const fallbacks = [
    "CVE-2024-3094: XZ Utils backdoor discovered in SSH deployments",
    "APT29 observed using new credential dumping techniques via Azure AD",
    "CISA adds 3 new vulnerabilities to Known Exploited Vulnerabilities catalog",
    "Critical zero-day (CVSS 9.8) patched in widely used VPN appliance",
    "Ransomware group 'LockBit' infrastructure seized in Operation Cronos",
    "Major spike in info-stealer malware targeting browser session cookies",
    "Active exploitation of Ivanti Connect Secure vulnerabilities detected globally"
  ];
  
  try {
    const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/TheHackersNews');
    const data = await response.json();
    if(data.items && data.items.length > 0) {
      const items = data.items.slice(0, 8);
      tickerInner.innerHTML = items.map(item => `<a href="${item.link}" target="_blank" style="color:inherit;text-decoration:none;"><span>${item.title.toUpperCase()}</span></a>`).join('');
      return;
    }
  } catch(e) {
    console.warn("Could not fetch live threat feed, falling back to simulated data.");
  }
  
  // Fallback
  tickerInner.innerHTML = fallbacks.map(t => `<a href="#" target="_blank" style="color:inherit;text-decoration:none;"><span>${t.toUpperCase()}</span></a>`).join('');
}
loadThreatFeed();
