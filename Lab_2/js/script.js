document.addEventListener('DOMContentLoaded', function() {
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');
    const pauseButton = document.getElementById('pause');
    const toggleAnimButton = document.getElementById('toggle-anim');
    const anim = document.getElementById('anim');
    const slides = anim.getElementsByClassName('slide');
    const totalSlides = slides.length;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxVideo = document.querySelector('.lightbox-video');
    const close = document.querySelector('.close');
    let index = 0;
    let intervalId;
    let animationType = 'slide';

    nextButton.addEventListener('click', showNextSlide);
    prevButton.addEventListener('click', showPrevSlide);
    pauseButton.addEventListener('click', togglePause);
    toggleAnimButton.addEventListener('click', toggleAnimation);
    close.addEventListener('click', closeLightbox);

    Array.from(slides).forEach(slide => {
        slide.addEventListener('click', openLightbox);
    });

    function showNextSlide() {
        updateIndex(1);
        updateSlider();
    }

    function showPrevSlide() {
        updateIndex(-1);
        updateSlider();
    }

    function updateIndex(step) {
        index = (index + step + totalSlides) % totalSlides;
    }

    function updateSlider() {
        if (animationType === 'slide') {
            anim.style.transform = `translateX(${-index * 1000}px)`;
        } else {
            Array.from(slides).forEach((slide, idx) => {
                slide.classList.toggle('active', idx === index);
            });
        }
    }

    function startSlider() {
        intervalId = setInterval(showNextSlide, 3000);
    }

    function stopSlider() {
        clearInterval(intervalId);
    }

    function togglePause() {
        if (pauseButton.textContent === 'Pause') {
            stopSlider();
            pauseButton.textContent = 'Resume';
        } else {
            startSlider();
            pauseButton.textContent = 'Pause';
        }
    }

    function toggleAnimation() {
        if (animationType === 'slide') {
            animationType = 'fade';
            Array.from(slides).forEach(slide => {
                slide.classList.add('fade');
                slide.classList.remove('active');
            });
            anim.style.transform = 'none';
            slides[index].classList.add('active');
        } else {
            animationType = 'slide';
            Array.from(slides).forEach(slide => {
                slide.classList.remove('fade', 'active');
                slide.style.opacity = 1;
                slide.style.position = 'relative';
            });
            anim.style.transform = `translateX(${-index * 1000}px)`;
        }
    }

    function openLightbox(event) {
        const target = event.target;
        if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
            stopSlider();
            if (target.tagName === 'IMG') {
                lightboxImage.src = target.src;
                lightboxImage.style.display = 'block';
                lightboxVideo.style.display = 'none';
            } else if (target.tagName === 'VIDEO') {
                lightboxVideo.src = target.src;
                lightboxVideo.style.display = 'block';
                lightboxImage.style.display = 'none';
            }
            lightbox.style.display = 'block';
        }
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        lightboxImage.style.display = 'none';
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
        startSlider();
    }

    updateSlider();
    startSlider();
});
