/**
 * TAMILAGA VETTRI KAZHAGAM (TVK) - GRAND LAUNCH CEREMONY SCRIPT
 * Key Updates:
 * 1. 10 completely UNIQUE, distinct portraits of CM Thalapathy Vijay (NO REPETITION).
 * 2. Stage Card with fixed dimensions: ambient background blur + unclipped full-view Vijay photo + Count Number & Dial on top.
 * 3. 1.25 seconds (1250ms) interval per countdown tick for maximum suspense.
 * 4. Post-countdown reveal shows ONLY the 2 launched portal links: nammakathiravan.org & manavaimla.com.
 * 5. Web Audio API Fanfare & Countdown Beeps (100% self-contained).
 * 6. Dynamic Silk Flag Wave Canvas & Fullscreen / QR Modals.
 */

// Global State
const state = {
  countdownTime: 10,
  currentCount: 10,
  stepDurationMs: 1250, // 1.25 seconds per tick
  timerId: null,
  isLaunched: false,
  soundEnabled: true,
  currentLang: 'ta', // 'ta' or 'en'
  audioCtx: null
};

// 10 COMPLETELY UNIQUE, NON-REPEATING IMAGES OF CM THALAPATHY VIJAY
const CM_VIJAY_DATA = {
  10: {
    img: 'assets/images/count_10.jpg',
    tag_ta: 'மாண்புமிகு முதலமைச்சர்',
    tag_en: "Hon'ble Chief Minister",
    quote_ta: '10: மாற்றத்திற்கான புதிய விடியல் - மக்கள் முதல்வர் தளபதி விஜய்',
    quote_en: "10: The Dawn of Transformation - People's CM Thalapathy Vijay"
  },
  9: {
    img: 'assets/images/count_9.jpg',
    tag_ta: 'மக்கள் தலைவர் விஜய்',
    tag_en: 'Leader of the People',
    quote_ta: '9: மக்களின் உரிமைக் குரல் ஒலிக்கும் வரலாற்றுத் தருணம்...',
    quote_en: '9: The Historic Resonant Voice of the People...'
  },
  8: {
    img: 'assets/images/count_8.jpg',
    tag_ta: 'மாண்புமிகு முதலமைச்சர்',
    tag_en: "Hon'ble Chief Minister",
    quote_ta: '8: மணவை தொகுதிக்கு பெருமை சேர்க்கும் பொற்காலம் ஆரம்பம்...',
    quote_en: '8: A Golden Milestone for Manapparai Constituency...'
  },
  7: {
    img: 'assets/images/count_7.jpg',
    tag_ta: 'மக்கள் முதல்வர்',
    tag_en: "People's CM",
    quote_ta: '7: அதிநவீன டிஜிட்டல் தொழில்நுட்ப புரட்சி...',
    quote_en: '7: Next-Generation Digital Governance Revolution...'
  },
  6: {
    img: 'assets/images/count_6.jpg',
    tag_ta: 'மாண்புமிகு முதலமைச்சர்',
    tag_en: "Hon'ble Chief Minister",
    quote_ta: '6: மக்களுக்காக... மக்களோடு... என்றும் எப்போதும்...',
    quote_en: '6: Always With the People, For the People...'
  },
  5: {
    img: 'assets/images/count_5.jpg',
    tag_ta: 'மக்கள் தலைவர் விஜய்',
    tag_en: 'Thalapathy Vijay',
    quote_ta: '5: ஒரு குறை... ஒரு பதிவு... உடனடி தீர்வு!',
    quote_en: '5: One Issue... One Registration... Swift Solution!'
  },
  4: {
    img: 'assets/images/count_4.jpg',
    tag_ta: 'மாண்புமிகு முதலமைச்சர்',
    tag_en: "Hon'ble Chief Minister",
    quote_ta: '4: ஒளிவுமறைவற்ற வெளிப்படையான மக்கள் நல்லாட்சி...',
    quote_en: '4: Transparent & Accountable Citizen Governance...'
  },
  3: {
    img: 'assets/images/count_3.jpg',
    tag_ta: 'மக்கள் முதல்வர்',
    tag_en: "People's CM",
    quote_ta: '3: மக்கள் சக்தியின் புதிய வரலாற்று அத்தியாயம்...',
    quote_en: "3: A Glorious Chapter in People's Empowerment..."
  },
  2: {
    img: 'assets/images/count_2.jpg',
    tag_ta: 'மாண்புமிகு முதலமைச்சர்',
    tag_en: "Hon'ble Chief Minister",
    quote_ta: '2: வெற்றி நமதே! புதிய வரலாறு படைப்போம்...',
    quote_en: '2: Victory is Certain! A New History Begins...'
  },
  1: {
    img: 'assets/images/count_1.jpg',
    tag_ta: 'மக்கள் தலைவர் விஜய்',
    tag_en: 'Thalapathy Vijay',
    quote_ta: '1: தயாராகுங்கள்! இதோ அதிகாரப்பூர்வ நேரடி துவக்கம்!...',
    quote_en: '1: Stand By! Official Launch Happening Now!...'
  },
  0: {
    img: 'assets/images/cm_vijay.jpg',
    tag_ta: 'மாண்புமிகு முதலமைச்சர்',
    tag_en: "Hon'ble Chief Minister",
    quote_ta: '🎉 வாழ்த்துகள்! தளங்கள் வெற்றிகரமாக துவங்கப்பட்டது! 🎉',
    quote_en: '🎉 Congratulations! Portals Dedicated to the People! 🎉'
  }
};

// Preload all countdown images so they render instantly without flickering
function preloadCountdownImages() {
  for (let i = 1; i <= 10; i++) {
    const img = new Image();
    img.src = `assets/images/count_${i}.jpg`;
  }
  const mainImg = new Image();
  mainImg.src = 'assets/images/cm_vijay.jpg';
}

/* ==========================================================================
   WEB AUDIO API SOUND ENGINE
   ========================================================================== */

function getAudioContext() {
  if (!state.audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      state.audioCtx = new AudioContext();
    }
  }
  if (state.audioCtx && state.audioCtx.state === 'suspended') {
    state.audioCtx.resume();
  }
  return state.audioCtx;
}

// Play Cinematic Stadium Countdown Tick (Deep Sub-Bass Heartbeat + Acoustic Click + Tension Chime)
function playCountdownTick(sec) {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. CINEMATIC SUB-BASS HEARTBEAT THUMP ("DHOOM / THUD")
    // Visceral low-end punch: rapid drop from 135Hz to 36Hz
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(135, now);
    subOsc.frequency.exponentialRampToValueAtTime(36, now + 0.28);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.85, now + 0.012);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.4);

    // 2. MID-BODY PUNCH (Triangle oscillator for speaker warmth)
    const midOsc = ctx.createOscillator();
    const midGain = ctx.createGain();
    midOsc.type = 'triangle';
    midOsc.frequency.setValueAtTime(95, now);
    midOsc.frequency.exponentialRampToValueAtTime(45, now + 0.22);

    midGain.gain.setValueAtTime(0.001, now);
    midGain.gain.linearRampToValueAtTime(0.45, now + 0.01);
    midGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    midOsc.connect(midGain);
    midGain.connect(ctx.destination);
    midOsc.start(now);
    midOsc.stop(now + 0.28);

    // 3. CRISP ACOUSTIC TICK TRANSIENT (Stadium stopwatch / impact click)
    const clickLen = 0.018;
    const clickBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * clickLen), ctx.sampleRate);
    const cData = clickBuf.getChannelData(0);
    for (let i = 0; i < cData.length; i++) {
      cData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (cData.length * 0.28));
    }
    const clickSrc = ctx.createBufferSource();
    clickSrc.buffer = clickBuf;

    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = 'bandpass';
    clickFilter.frequency.setValueAtTime(2800, now);
    clickFilter.Q.setValueAtTime(2.2, now);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.4, now);

    clickSrc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickSrc.start(now);

    // 4. METALLIC RESONANT TENSION CHIME (Ascending harmonic pitches building suspense)
    const scaleNotes = {
      10: 440.00, // A4
      9:  493.88, // B4
      8:  523.25, // C5
      7:  587.33, // D5
      6:  659.25, // E5
      5:  698.46, // F5
      4:  783.99, // G5
      3:  880.00, // A5
      2:  987.77, // B5
      1: 1046.50  // C6
    };
    const bellFreq = scaleNotes[sec] || 660;

    const bellOsc1 = ctx.createOscillator();
    const bellOsc2 = ctx.createOscillator();
    const bellGain = ctx.createGain();

    bellOsc1.type = 'sine';
    bellOsc2.type = 'sine';
    bellOsc1.frequency.setValueAtTime(bellFreq, now);
    bellOsc2.frequency.setValueAtTime(bellFreq * 2.008, now); // Shimmering harmonic overtone

    bellGain.gain.setValueAtTime(0.001, now);
    bellGain.gain.linearRampToValueAtTime(0.3, now + 0.015);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

    bellOsc1.connect(bellGain);
    bellOsc2.connect(bellGain);
    bellGain.connect(ctx.destination);

    bellOsc1.start(now);
    bellOsc2.start(now);
    bellOsc1.stop(now + 0.45);
    bellOsc2.stop(now + 0.45);

    // 5. INTENSIFIED DOUBLE-HEARTBEAT ON FINAL 3 SECONDS (3, 2, 1)
    // Produces a dramatic syncopated second thud (thump... THUMP!)
    if (sec <= 3 && sec > 0) {
      const subDelay = now + 0.22;
      const pulse2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      pulse2.type = 'sine';
      pulse2.frequency.setValueAtTime(145, subDelay);
      pulse2.frequency.exponentialRampToValueAtTime(38, subDelay + 0.22);

      gain2.gain.setValueAtTime(0.001, subDelay);
      gain2.gain.linearRampToValueAtTime(0.7, subDelay + 0.01);
      gain2.gain.exponentialRampToValueAtTime(0.001, subDelay + 0.28);

      pulse2.connect(gain2);
      gain2.connect(ctx.destination);
      pulse2.start(subDelay);
      pulse2.stop(subDelay + 0.3);
    }

  } catch (err) {
    console.warn('Audio tick error:', err);
  }
}

// Play Grand Stadium Victory Fanfare & Sub-Boom at count 0
function playVictoryFanfare() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. MASSIVE STADIUM SUB-BASS BOOM (150Hz -> 28Hz)
    const boomOsc = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(150, now);
    boomOsc.frequency.exponentialRampToValueAtTime(28, now + 0.9);

    boomGain.gain.setValueAtTime(0.001, now);
    boomGain.gain.linearRampToValueAtTime(0.9, now + 0.02);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    boomOsc.connect(boomGain);
    boomGain.connect(ctx.destination);
    boomOsc.start(now);
    boomOsc.stop(now + 1.3);

    // 2. GRAND ROYAL BRASS FANFARE CHORDS
    const chords = [
      { f: 523.25, time: 0.0, dur: 0.32 },  // C5
      { f: 659.25, time: 0.24, dur: 0.32 }, // E5
      { f: 783.99, time: 0.48, dur: 0.42 }, // G5
      { f: 1046.5, time: 0.82, dur: 2.8 },  // High C6
      { f: 523.25, time: 0.82, dur: 2.8 },  // C5 Support
      { f: 261.63, time: 0.82, dur: 2.8 }   // Low C4 Bass
    ];

    chords.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, now + note.time);

      gain.gain.setValueAtTime(0.001, now + note.time);
      gain.gain.exponentialRampToValueAtTime(0.35, now + note.time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now + note.time);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + note.time);
      osc.stop(now + note.time + note.dur);
    });

    // 3. CELEBRATION FIREWORKS CRACKLE & SPARKLE NOISE
    const bufferSize = ctx.sampleRate * 2.0;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin(i * 0.02);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(3800, now + 0.82);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, now + 0.82);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now + 0.82);
    noise.stop(now + 2.6);

  } catch (err) {
    console.warn('Fanfare error:', err);
  }
}

/* ==========================================================================
   DYNAMIC 3D SILK TVK FLAG WAVE CANVAS
   ========================================================================== */

const flagCanvas = document.getElementById('flag-wave-canvas');
const flagCtx = flagCanvas.getContext('2d');
let flagWaveAngle = 0;

function initFlagCanvas() {
  function resize() {
    flagCanvas.width = window.innerWidth;
    flagCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();
}

function renderFlagWave() {
  const w = flagCanvas.width;
  const h = flagCanvas.height;

  flagCtx.clearRect(0, 0, w, h);
  flagWaveAngle += 0.022;

  const stripeH = h / 3;

  for (let s = 0; s < 3; s++) {
    flagCtx.save();
    flagCtx.beginPath();
    flagCtx.moveTo(0, s * stripeH);

    for (let x = 0; x <= w; x += 30) {
      const wave1 = Math.sin(x * 0.004 + flagWaveAngle + s * 0.8) * 28;
      const wave2 = Math.cos(x * 0.008 - flagWaveAngle * 0.7) * 14;
      const y = s * stripeH + wave1 + wave2;
      flagCtx.lineTo(x, y);
    }

    flagCtx.lineTo(w, (s + 1) * stripeH + 40);
    flagCtx.lineTo(0, (s + 1) * stripeH + 40);
    flagCtx.closePath();

    if (s === 1) {
      const grad = flagCtx.createLinearGradient(0, stripeH, w, stripeH * 2);
      grad.addColorStop(0, 'rgba(255, 199, 44, 0.28)');
      grad.addColorStop(0.5, 'rgba(255, 225, 120, 0.42)');
      grad.addColorStop(1, 'rgba(218, 165, 32, 0.28)');
      flagCtx.fillStyle = grad;
    } else {
      const grad = flagCtx.createLinearGradient(0, s * stripeH, w, (s + 1) * stripeH);
      grad.addColorStop(0, 'rgba(163, 8, 30, 0.25)');
      grad.addColorStop(0.5, 'rgba(217, 4, 41, 0.38)');
      grad.addColorStop(1, 'rgba(110, 5, 15, 0.25)');
      flagCtx.fillStyle = grad;
    }

    flagCtx.fill();
    flagCtx.restore();
  }

  requestAnimationFrame(renderFlagWave);
}

/* ==========================================================================
   AMBIENT GOLDEN PARTICLES
   ========================================================================== */

const ambientCanvas = document.getElementById('ambient-canvas');
const ambientCtx = ambientCanvas.getContext('2d');
let ambientParticles = [];

function initAmbientCanvas() {
  function resize() {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  ambientParticles = [];
  const particleCount = Math.min(window.innerWidth / 20, 70);

  for (let i = 0; i < particleCount; i++) {
    ambientParticles.push({
      x: Math.random() * ambientCanvas.width,
      y: Math.random() * ambientCanvas.height,
      radius: Math.random() * 2.8 + 1,
      speedY: -(Math.random() * 0.48 + 0.18),
      speedX: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.35 ? '#FFD700' : '#FF6B6B'
    });
  }
}

function renderAmbientParticles() {
  ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);

  for (let p of ambientParticles) {
    p.y += p.speedY;
    p.x += p.speedX;

    if (p.y < -10) {
      p.y = ambientCanvas.height + 10;
      p.x = Math.random() * ambientCanvas.width;
    }

    ambientCtx.beginPath();
    ambientCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ambientCtx.fillStyle = p.color;
    ambientCtx.globalAlpha = Math.max(0.1, Math.min(0.85, p.alpha));
    ambientCtx.shadowColor = p.color;
    ambientCtx.shadowBlur = 10;
    ambientCtx.fill();
    ambientCtx.shadowBlur = 0;
  }
  ambientCtx.globalAlpha = 1;

  requestAnimationFrame(renderAmbientParticles);
}

/* ==========================================================================
   CELEBRATION FIREWORKS & CONFETTI ENGINE
   ========================================================================== */

const celebCanvas = document.getElementById('celebration-canvas');
const celebCtx = celebCanvas.getContext('2d');
let celebParticles = [];
let celebAnimRunning = false;
let celebEndTime = 0;

function initCelebCanvas() {
  function resize() {
    celebCanvas.width = window.innerWidth;
    celebCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();
}

function triggerCelebration(durationMs = 9000) {
  celebEndTime = Date.now() + durationMs;
  if (!celebAnimRunning) {
    celebAnimRunning = true;
    requestAnimationFrame(renderCelebration);
  }

  burstFireworks(window.innerWidth * 0.25, window.innerHeight * 0.35);
  burstFireworks(window.innerWidth * 0.75, window.innerHeight * 0.35);
  burstFireworks(window.innerWidth * 0.5, window.innerHeight * 0.25);
  spawnConfettiRibbons(180);

  const burstInterval = setInterval(() => {
    if (Date.now() > celebEndTime) {
      clearInterval(burstInterval);
      return;
    }
    const x = Math.random() * (window.innerWidth * 0.8) + (window.innerWidth * 0.1);
    const y = Math.random() * (window.innerHeight * 0.5) + 100;
    burstFireworks(x, y);
    spawnConfettiRibbons(45);
  }, 900);
}

function burstFireworks(x, y) {
  const colors = ['#FFD700', '#FFC72C', '#D90429', '#FFFFFF', '#FF8C00', '#FFE57F', '#60A5FA'];
  const count = 80;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.2;
    const speed = Math.random() * 8.5 + 3.5;
    celebParticles.push({
      type: 'firework',
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      decay: Math.random() * 0.015 + 0.012,
      color: colors[Math.floor(Math.random() * colors.length)],
      radius: Math.random() * 2.8 + 1.5,
      gravity: 0.12
    });
  }
}

function spawnConfettiRibbons(count) {
  const colors = ['#FFC72C', '#FFD700', '#B31917', '#D90429', '#FFFFFF', '#F59E0B', '#38BDF8'];
  for (let i = 0; i < count; i++) {
    celebParticles.push({
      type: 'confetti',
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 100,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 2.5,
      width: Math.random() * 12 + 6,
      height: Math.random() * 7 + 4,
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 12,
      alpha: 1,
      decay: 0.003,
      color: colors[Math.floor(Math.random() * colors.length)],
      flutter: Math.random() * 0.1
    });
  }
}

function renderCelebration() {
  celebCtx.clearRect(0, 0, celebCanvas.width, celebCanvas.height);

  for (let i = celebParticles.length - 1; i >= 0; i--) {
    const p = celebParticles[i];

    if (p.type === 'firework') {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        celebParticles.splice(i, 1);
        continue;
      }

      celebCtx.save();
      celebCtx.beginPath();
      celebCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      celebCtx.fillStyle = p.color;
      celebCtx.globalAlpha = p.alpha;
      celebCtx.shadowColor = p.color;
      celebCtx.shadowBlur = 10;
      celebCtx.fill();
      celebCtx.restore();

    } else if (p.type === 'confetti') {
      p.x += p.vx + Math.sin(p.y * p.flutter) * 1.5;
      p.y += p.vy;
      p.rotation += p.vRotation;
      p.alpha -= p.decay;

      if (p.y > window.innerHeight + 50 || p.alpha <= 0) {
        celebParticles.splice(i, 1);
        continue;
      }

      celebCtx.save();
      celebCtx.translate(p.x, p.y);
      celebCtx.rotate((p.rotation * Math.PI) / 180);
      celebCtx.fillStyle = p.color;
      celebCtx.globalAlpha = p.alpha;
      celebCtx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      celebCtx.restore();
    }
  }

  if (celebParticles.length > 0 || Date.now() < celebEndTime) {
    requestAnimationFrame(renderCelebration);
  } else {
    celebAnimRunning = false;
    celebCtx.clearRect(0, 0, celebCanvas.width, celebCanvas.height);
  }
}

/* ==========================================================================
   10-SECOND COUNTDOWN CONTROLLER (1.25 SECONDS PER TICK)
   ========================================================================== */

const btnMasterLaunch = document.getElementById('btn-master-launch');
const countdownOverlay = document.getElementById('countdown-overlay');
const countdownDigits = document.getElementById('countdown-digits');
const countdownSlogan = document.getElementById('countdown-dynamic-slogan');
const cmVijayPhoto = document.getElementById('cm-vijay-countdown-img');
const cmVijayAmbientBlur = document.getElementById('cm-vijay-ambient-blur');
const cmTagText = document.getElementById('cm-tag-text');
const ringProgress = document.getElementById('ring-progress');
const btnSkip = document.getElementById('btn-skip-countdown');
const preLaunchSection = document.getElementById('pre-launch-section');
const postLaunchSection = document.getElementById('post-launch-section');

const RING_CIRCUMFERENCE = 660;

function startLaunchCountdown() {
  getAudioContext();

  state.currentCount = state.countdownTime;
  countdownOverlay.style.display = 'flex';
  countdownOverlay.setAttribute('aria-hidden', 'false');

  updateCountdownDisplay(state.currentCount);
  playCountdownTick(state.currentCount);

  if (state.timerId) clearInterval(state.timerId);

  // 1.25 seconds per tick (1250ms)
  state.timerId = setInterval(() => {
    state.currentCount--;

    if (state.currentCount > 0) {
      updateCountdownDisplay(state.currentCount);
      playCountdownTick(state.currentCount);
    } else {
      clearInterval(state.timerId);
      updateCountdownDisplay(0);
      playCountdownTick(0);

      setTimeout(() => {
        completeLaunch();
      }, 900);
    }
  }, state.stepDurationMs);
}

function updateCountdownDisplay(sec) {
  // Update number with beat pulse
  countdownDigits.textContent = sec;
  countdownDigits.style.animation = 'none';
  void countdownDigits.offsetWidth;
  countdownDigits.style.animation = 'numberBeat 0.8s ease-out';

  // Update circular SVG progress ring smoothly
  const progressRatio = (state.countdownTime - sec) / state.countdownTime;
  const offset = RING_CIRCUMFERENCE * progressRatio;
  ringProgress.style.strokeDashoffset = offset;

  // DYNAMIC CM VIJAY IMAGE UPDATE ON EVERY SECOND (NO REPETITION)
  const item = CM_VIJAY_DATA[sec] || CM_VIJAY_DATA[0];
  if (item) {
    if (cmVijayPhoto) {
      cmVijayPhoto.classList.remove('photo-zoom');
      void cmVijayPhoto.offsetWidth;
      cmVijayPhoto.src = item.img;
      cmVijayPhoto.classList.add('photo-zoom');
    }
    if (cmVijayAmbientBlur) {
      cmVijayAmbientBlur.src = item.img;
    }
    if (cmTagText) cmTagText.textContent = state.currentLang === 'ta' ? item.tag_ta : item.tag_en;
    if (countdownSlogan) countdownSlogan.textContent = state.currentLang === 'ta' ? item.quote_ta : item.quote_en;
  }

  // Update track dots
  const dots = document.querySelectorAll('.c-dot');
  dots.forEach(dot => {
    const dotSec = parseInt(dot.getAttribute('data-sec'), 10);
    if (dotSec > sec) {
      dot.className = 'c-dot passed';
    } else {
      dot.className = 'c-dot active';
    }
  });
}

function completeLaunch() {
  countdownOverlay.style.display = 'none';
  countdownOverlay.setAttribute('aria-hidden', 'true');

  // Hide pre-launch hero and display reveal section with ONLY the 2 portal links!
  preLaunchSection.style.display = 'none';
  postLaunchSection.style.display = 'flex';
  state.isLaunched = true;

  // Audio Fanfare + Fireworks & Confetti
  playVictoryFanfare();
  triggerCelebration(10000);

  // Smooth scroll to launched portal links
  window.scrollTo({ top: 80, behavior: 'smooth' });

  showToast("🎉 இணையதளங்கள் அதிகாரப்பூர்வமாக மக்கள் பயன்பாட்டிற்கு துவங்கப்பட்டது!");
}

function skipCountdown() {
  if (state.timerId) clearInterval(state.timerId);
  completeLaunch();
}

function replayCountdown() {
  postLaunchSection.style.display = 'none';
  preLaunchSection.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  startLaunchCountdown();
}

/* ==========================================================================
   QR CODE & MODAL CONTROLLERS
   ========================================================================== */

function showQrModal(url, title, domain) {
  const modal = document.getElementById('modal-qr');
  const qrTitle = document.getElementById('modal-qr-title');
  const qrUrl = document.getElementById('modal-qr-url');
  const qrImage = document.getElementById('qr-image');
  const directLink = document.getElementById('qr-direct-link');

  qrTitle.textContent = title + " - QR குறியீடு";
  qrUrl.textContent = url;
  directLink.href = url;

  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(url)}`;
  modal.style.display = 'flex';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

function closeModalOnBackdrop(event, modalId) {
  if (event.target.id === modalId) {
    closeModal(modalId);
  }
}

/* ==========================================================================
   UTILITY ACTIONS (SHARE, COPY, TOAST, FULLSCREEN, SOUND, LANGUAGE)
   ========================================================================== */

function copySiteLink(url, btnElement) {
  navigator.clipboard.writeText(url).then(() => {
    showToast("📋 இணைப்பு நகலெடுக்கப்பட்டது: " + url);
    if (btnElement) {
      const origText = btnElement.innerHTML;
      btnElement.innerHTML = "<span>✓ நகலானது</span>";
      setTimeout(() => { btnElement.innerHTML = origText; }, 2000);
    }
  }).catch(() => {
    prompt("இணைப்பை நகலெடுக்கவும்:", url);
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast-notify');
  const toastText = document.getElementById('toast-text');
  toastText.textContent = msg;
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 3200);
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  const icon = document.getElementById('sound-icon');
  const label = document.getElementById('sound-label');

  if (state.soundEnabled) {
    icon.textContent = '🔊';
    label.textContent = state.currentLang === 'ta' ? 'ஒலி: ஆன்' : 'Sound: ON';
    showToast('ஒலி இயக்கப்பட்டது 🔊');
  } else {
    icon.textContent = '🔇';
    label.textContent = state.currentLang === 'ta' ? 'ஒலி: ஆப்' : 'Sound: OFF';
    showToast('ஒலி முடக்கப்பட்டது 🔇');
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn("Fullscreen request error:", err);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function toggleLanguage() {
  state.currentLang = state.currentLang === 'ta' ? 'en' : 'ta';
  const label = document.getElementById('lang-label');
  label.textContent = state.currentLang === 'ta' ? 'English' : 'தமிழ்';

  const translatableElements = document.querySelectorAll('[data-ta][data-en]');
  translatableElements.forEach(el => {
    el.textContent = el.getAttribute(`data-${state.currentLang}`);
  });

  const soundLabel = document.getElementById('sound-label');
  soundLabel.textContent = state.soundEnabled 
    ? (state.currentLang === 'ta' ? 'ஒலி: ஆன்' : 'Sound: ON') 
    : (state.currentLang === 'ta' ? 'ஒலி: ஆப்' : 'Sound: OFF');

  const soundTestLabel = document.getElementById('sound-test-label');
  if (soundTestLabel) {
    soundTestLabel.textContent = state.currentLang === 'ta' ? 'ஒலி டெஸ்ட்' : 'Test Sound';
  }
}

function shareOnWhatsApp() {
  const shareText = encodeURIComponent(
    `🎉 *தமிழக வெற்றிக் கழகம் - மணவை சட்டமன்றத் தொகுதி*\n\n` +
    `மாண்புமிகு தமிழ்நாடு முதலமைச்சர் தளபதி விஜய் மற்றும் மாண்புமிகு நீர்வளத்துறை அமைச்சர் என். ஆனந்த் அவர்களின் வழிகாட்டுதலில் மக்கள் நல இணையதளங்கள் அதிகாரப்பூர்வமாக மக்கள் பயன்பாட்டிற்கு துவங்கப்பட்டது!\n\n` +
    `1️⃣ *நம்ம கதிரவன் மக்கள் நலத் தளம்:* https://nammakathiravan.org\n` +
    `2️⃣ *மணவை MLA தொகுதி சேவை தளம்:* https://manavaimla.com\n\n` +
    `இப்போதே பார்வையிடுங்கள்! #TVK #CMVijay #Manavai #DigitalRevolution`
  );
  window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
}

function copyAllLinks() {
  const text = `TVK மணவை மக்கள் சேவை இணையதளங்கள்:\n1. https://nammakathiravan.org\n2. https://manavaimla.com`;
  navigator.clipboard.writeText(text).then(() => {
    showToast("🎉 அனைத்து இணையதள இணைப்புகளும் நகலெடுக்கப்பட்டது!");
  });
}

/* ==========================================================================
   EVENT LISTENERS INITIALIZATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  preloadCountdownImages();

  initFlagCanvas();
  renderFlagWave();

  initAmbientCanvas();
  renderAmbientParticles();

  initCelebCanvas();

  if (btnMasterLaunch) btnMasterLaunch.addEventListener('click', startLaunchCountdown);
  if (btnSkip) btnSkip.addEventListener('click', skipCountdown);

  const btnReplay = document.getElementById('btn-replay-countdown');
  if (btnReplay) btnReplay.addEventListener('click', replayCountdown);

  const btnFireworksAgain = document.getElementById('btn-fireworks-again');
  if (btnFireworksAgain) btnFireworksAgain.addEventListener('click', () => {
    playVictoryFanfare();
    triggerCelebration(6000);
    showToast("🎆 வெடி கொண்டாட்டம் துவங்கியது!");
  });

  const btnSoundTest = document.getElementById('btn-sound-test');
  if (btnSoundTest) {
    btnSoundTest.addEventListener('click', () => {
      getAudioContext();
      // Play high-energy preview (tick at count 3 with tension heartbeat)
      playCountdownTick(3);
      showToast("🎵 புதிய சினிமாட்டிக் கவுண்ட்டவுன் ஒலி ஒலிக்கிறது! (Cinematic Heartbeat Sound)");
    });
  }

  document.getElementById('btn-sound-toggle').addEventListener('click', toggleSound);
  document.getElementById('btn-fullscreen-toggle').addEventListener('click', toggleFullscreen);
  document.getElementById('btn-lang-toggle').addEventListener('click', toggleLanguage);

  document.getElementById('btn-share-whatsapp').addEventListener('click', shareOnWhatsApp);
  document.getElementById('btn-copy-all').addEventListener('click', copyAllLinks);

  window.addEventListener('click', () => {
    getAudioContext();
  }, { once: true });
});
