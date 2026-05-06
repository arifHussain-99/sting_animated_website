// Setup Canvas and Context
const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

const frameCount = 234;
const currentFrame = index => (
    `images/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

// Preload Images for Performance
const images = [];
const preloadImages = () => {
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }
};
preloadImages();

// Init first frame
images[0].onload = function(){
    canvas.width = images[0].width;
    canvas.height = images[0].height;
    context.drawImage(images[0], 0, 0);
}

// Animation variables
let targetFrameIndex = 0;
let currentFrameIndex = 0;

// DOM Elements for animation
const heroSection = document.getElementById("hero-scroll-section");
const heroText = document.getElementById("hero-text");
const navbar = document.getElementById("main-nav");
const scrollIndicator = document.getElementById("scroll-indicator");

const updateImage = index => {
    if (images[index] && images[index].complete) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[index], 0, 0);
    }
}

// Scroll Handler
window.addEventListener('scroll', () => {  
    const rect = heroSection.getBoundingClientRect();
    
    // Calculate scroll fraction ONLY when inside the hero section
    let scrollFraction = 0;
    if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        scrollFraction = -rect.top / (rect.height - window.innerHeight);
    } else if (rect.bottom < window.innerHeight) {
        scrollFraction = 1; // Passed the section
    }
    
    // Clamp between 0 and 1
    scrollFraction = Math.max(0, Math.min(1, scrollFraction));
    
    // Update target frame
    targetFrameIndex = Math.floor(scrollFraction * (frameCount - 1));
    
    // Smooth, continuous Text & Indicator animation (Fade completely out by 30% scroll)
    const textFadeLimit = 0.3;
    const fadeFraction = Math.max(0, 1 - (scrollFraction / textFadeLimit));
    
    // Apply dynamic inline styles
    heroText.style.opacity = fadeFraction;
    heroText.style.filter = `blur(${(1 - fadeFraction) * 20}px)`;
    heroText.style.transform = `translateY(-${(1 - fadeFraction) * 40}px)`;
    
    if (scrollIndicator) {
        scrollIndicator.style.opacity = fadeFraction * 0.7; // Base opacity was 0.7
        scrollIndicator.style.filter = `blur(${(1 - fadeFraction) * 10}px)`;
        scrollIndicator.style.transform = `translate(-50%, ${(1 - fadeFraction) * 20}px)`;
    }
    
    // Navbar glass effect gets stronger on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('bg-black/60', 'backdrop-blur-2xl', 'border-white/20', 'shadow-[0_4px_40px_rgba(230,0,0,0.15)]');
        navbar.classList.remove('bg-white/[0.02]', 'backdrop-blur-xl', 'border-white/10');
    } else {
        navbar.classList.add('bg-white/[0.02]', 'backdrop-blur-xl', 'border-white/10');
        navbar.classList.remove('bg-black/60', 'backdrop-blur-2xl', 'border-white/20', 'shadow-[0_4px_40px_rgba(230,0,0,0.15)]');
    }
});

// Smooth Lerp Loop
const loop = () => {
    currentFrameIndex += (targetFrameIndex - currentFrameIndex) * 0.15; // 0.15 makes it snappier
    updateImage(Math.round(currentFrameIndex));
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Add floating electric particles
const particleContainer = document.getElementById('particles-container');
function createParticle() {
    if(particleContainer.childElementCount > 30) return; // Prevent too many particles
    
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Randomize size, position and duration
    const size = Math.random() * 4 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${window.innerHeight}px`; // Start from bottom
    particle.style.animationDuration = `${Math.random() * 2 + 2}s`;
    particle.style.animationDelay = `${Math.random() * 2}s`;
    
    particleContainer.appendChild(particle);
    
    // Clean up
    setTimeout(() => {
        particle.remove();
    }, 5000);
}

// Generate particles periodically
setInterval(createParticle, 150);

// Sector Map Logic
const locationInput = document.getElementById('location-input');
const locationBtn = document.getElementById('location-btn');
const locationResults = document.getElementById('location-results');
const mainMapNode = document.getElementById('main-map-node');

const dummyNodes = [
    { name: "CYBER-MART SECTOR 4", dist: "0.2 MI", top: "40%", left: "30%" },
    { name: "NEON FUEL STATION", dist: "0.8 MI", top: "60%", left: "70%" },
    { name: "GRIDRUNNER OUTPOST", dist: "1.5 MI", top: "20%", left: "80%" },
    { name: "STING REPLENISH HUB", dist: "2.1 MI", top: "70%", left: "20%" },
    { name: "NIGHT CITY VEND", dist: "3.4 MI", top: "50%", left: "50%" }
];

const performSearch = () => {
    const val = locationInput.value.trim();
    if (!val) return;
    
    // Simulate loading
    locationBtn.innerHTML = 'refresh';
    locationBtn.classList.add('animate-spin');
    locationResults.innerHTML = '<div class="text-center py-8 text-primary-container font-label-caps tracking-widest text-[11px] animate-pulse">SCANNING GRID...</div>';
    
    setTimeout(() => {
        // Generate 2-3 random results
        const resultCount = Math.floor(Math.random() * 2) + 2;
        const shuffled = [...dummyNodes].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, resultCount);
        
        // Update Results List
        locationResults.innerHTML = selected.map(node => `
            <div class="flex justify-between items-center p-5 premium-glass hover:border-primary-container/30 transition-all cursor-pointer group hover:bg-white/[0.03]" onclick="moveNode('${node.top}', '${node.left}')">
                <div class="flex items-center gap-4">
                    <div class="w-2 h-2 rounded-full bg-white/20 group-hover:bg-primary-container transition-colors group-hover:shadow-[0_0_10px_#ff0000]"></div>
                    <span class="font-label-caps text-[11px] text-white group-hover:text-primary-container transition-colors tracking-widest font-bold">${node.name}</span>
                </div>
                <span class="text-[12px] font-label-caps text-on-surface-variant tracking-widest">${node.dist}</span>
            </div>
        `).join('');
        
        // Reset button
        locationBtn.classList.remove('animate-spin');
        locationBtn.innerHTML = 'near_me';
        
        // Move main map node to the first result
        if (selected.length > 0) {
            moveNode(selected[0].top, selected[0].left);
        }
        
    }, 1200);
};

window.moveNode = (top, left) => {
    if (mainMapNode) {
        mainMapNode.style.top = top;
        mainMapNode.style.left = left;
        // Add ping effect by re-triggering class
        mainMapNode.classList.remove('animate-pulse');
        void mainMapNode.offsetWidth; // trigger reflow
        mainMapNode.classList.add('animate-pulse');
    }
};

if (locationBtn && locationInput) {
    locationBtn.addEventListener('click', performSearch);
    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}
