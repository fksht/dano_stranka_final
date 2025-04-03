const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const slides = document.querySelectorAll('.slider img');
let slideIndex = 0;
let autoSlideInterval;
let slideWidth; // Declared but not initialized

//Update the width of the slider container
function updateSlideWidth(){
    slideWidth = slider.offsetWidth;
}


function updateSlider() {
    slider.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
}

function startAutoSlide() {
    updateSlideWidth(); // Update slideWidth before starting auto slide
    autoSlideInterval = setInterval(() => {
        slideIndex = (slideIndex + 1) % slides.length;
        updateSlider();
    }, 3000); // Transition every 3 seconds (can be changed)
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}


prevBtn.addEventListener('click', () => {
    stopAutoSlide();
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    updateSlider();
    startAutoSlide();
});

nextBtn.addEventListener('click', () => {
    stopAutoSlide();
    slideIndex = (slideIndex + 1) % slides.length;
    updateSlider();
    startAutoSlide();
});

// Update the slider width on window resize
window.addEventListener('resize', () => {
    updateSlideWidth(); // Updates the slideWidth value to the new slider width
    updateSlider(); // update the slider in case the new slideWidth is bigger
});


startAutoSlide();