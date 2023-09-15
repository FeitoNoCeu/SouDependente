(function ($) {
    "use strict";

    // Carregamento
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    /* 
    // Initiate the wowjs
    new WOW().init();
    
    
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    
    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });
    
    
    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: false,
        loop: true,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });
    
    
})(jQuery);

$('.colaboradores').slick({
    centerMode: true,
    centerPadding: '60px',
    slidesToShow: 3,
    responsive: [
        {
            breakpoint: 768,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 3
            }
        },
        {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
            }
        }
    ]
    */
  });
  
const wrapper = document.querySelector(".wrapper");
const carrossel = document.querySelector(".carrossel");
const firstCarddWidth = carrossel.querySelector(".cardd").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carrosselChildrens = [...carrossel.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the carousel at once
let carddPerView = Math.round(carrossel.offsetWidth / firstCarddWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carrosselChildrens.slice(-carddPerView).reverse().forEach(cardd => {
    carrossel.insertAdjacentHTML("afterbegin", cardd.outerHTML);
});

// Insert copies of the first few cards to end of carousel for infinite scrolling
carrosselChildrens.slice(0, carddPerView).forEach(cardd => {
    carrossel.insertAdjacentHTML("beforeend", cardd.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carrossel.classList.add("no-transition");
carrossel.scrollLeft = carrossel.offsetWidth;
carrossel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carrossel.scrollLeft += btn.id == "left" ? -firstCarddWidth : firstCarddWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carrossel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carrossel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carrossel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carrossel.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if(carrossel.scrollLeft === 0) {
        carrossel.classList.add("no-transition");
        carrossel.scrollLeft = carrosssel.scrollWidth - (2 * carrosssel.offsetWidth);
        carrossel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if(Math.ceil(carrossel.scrollLeft) === carrossel.scrollWidth - carrossel.offsetWidth) {
        carrossel.classList.add("no-transition");
        carrossel.scrollLeft = carrossel.offsetWidth;
        carrossel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carrossel.scrollLeft += firstCarddWidth, 2500);
}
autoPlay();

carrossel.addEventListener("mousedown", dragStart);
carrossel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carrossel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);