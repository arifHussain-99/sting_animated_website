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
    
    // Text animation (blur out after 30% scroll)
    if (scrollFraction > 0.3) {
        heroText.style.opacity = '0';
        heroText.style.filter = 'blur(10px)';
        heroText.style.transform = 'translateY(-10px)';
    } else {
        heroText.style.opacity = '1';
        heroText.style.filter = 'blur(0px)';
        heroText.style.transform = 'translateY(0)';
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
    currentFrameIndex += (targetFrameIndex - currentFrameIndex) * 0.08; // 0.08 is the easing factor
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
