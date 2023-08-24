// Constants - Classes for html elements
const GALLERY_CLASS_NAME = "gallery";
const HERO_CLASS_NAME = "hero";
const SUBMIT_CLASS_NAME = "submit";
const DIALOG_CLASS_NAME = "dialog";
const DRAG_CLASS_NAME = "dragging";
const CARD_CLASS_NAME = "card";
const BACKGROUND_PATH_CLASS_NAME = "background-path";
const NO_TRANSTION_CLASS_NAME = "no-transition";
const MENU_BUTTON_CLASS_NAME = "menu-icon";
const CLOSE_BUTTON_CLASS_NAME = "close";
const MENU_OVERLAY_CLASS_NAME = "menu-overlay";
const MENU_CLASS_NAME = "menu";

// Constants - Class Extensions for accessing certain elements from a base class
const BACK_CLASS_APPENDIX = "back";
const NEXT_CLASS_APPENDIX = "next";
const TEXT_CLASS_APPENDIX = "text";
const BUTTON_CLASS_APPENDIX = "button";

// Constants - Actions used in the SPA
const ACTION_MOUSE_UP = "mouseup";
const ACTION_MOUSE_DOWN = "mousedown";
const ACTION_MOUSE_MOVE = "mousemove";
const ACTION_CLICK = "click";
const ACTION_AFTER_BEGIN = "afterbegin";
const ACTION_BEFORE_END = "beforeend";
const ACTION_SCROLL = "scroll";

// Page Components
const submitDialog = document.querySelector(
    `.${DIALOG_CLASS_NAME}-${SUBMIT_CLASS_NAME}`
);
const submitButton = document.querySelector(
    `.${SUBMIT_CLASS_NAME}-${BUTTON_CLASS_APPENDIX}`
);
const heroText = document.querySelector(
    `.${HERO_CLASS_NAME}-${TEXT_CLASS_APPENDIX}`
);
const gallery = document.querySelector(`.${GALLERY_CLASS_NAME}`);
const galleryNextButton = document.querySelector(
    `.${GALLERY_CLASS_NAME}-${NEXT_CLASS_APPENDIX}`
);
const galleryBackButton = document.querySelector(
    `.${GALLERY_CLASS_NAME}-${BACK_CLASS_APPENDIX}`
);
const menu = document.querySelector(`.${MENU_CLASS_NAME}`);
const menuButton = document.querySelector(`.${MENU_BUTTON_CLASS_NAME}`);
const galleryCard = document.querySelector(`.${CARD_CLASS_NAME}`);
const path = document.querySelector(`.${BACKGROUND_PATH_CLASS_NAME}`);
const lenis = new Lenis();
const pageLength = path.getTotalLength();
const galleryCards = [...gallery.children];

// Timelines for features on the page
const timelines = [
    { trigger: ".animated-first", start: "-60% center", end: "50% 70%" },
    { trigger: ".animated-second", start: "-60% center", end: "50% 70%" },
    { trigger: ".animated-third", start: "-60% center", end: "40% 70%" },
    { trigger: ".animated-fourth", start: "-60% center", end: "30% 70%" },
    { trigger: ".animated-fifth", start: "-60% center", end: "30% center" },
    { trigger: ".animated-sixth", start: "-60% center", end: "20% center" },
    { trigger: ".animated-seventh", start: "-60% center", end: "top center" },
];

// Variables used in calculations for gallery scrolling
var startX;
var startScrollLeft;
let isDragging = false;
let cardsPerView = Math.round(gallery.offsetWidth / galleryCard.offsetWidth);

// Function and callback definitions for the SPA
path.style.strokeDasharray = pageLength + " " + pageLength;
path.style.strokeDashoffset = pageLength;
window.addEventListener(ACTION_SCROLL, () => {
    // Calculate scroll pecentage based position on the page
    var scrollPercentage =
        (document.documentElement.scrollTop + document.body.scrollTop) /
        (document.documentElement.scrollHeight +
            document.documentElement.clientHeight);

    //Calculate draw length of SVG using scroll percentage
    var drawLength = pageLength * scrollPercentage;

    // Draw SVG
    path.style.strokeDashoffset = pageLength - drawLength;
});

const createTimelines = () => {
    // Add each timeline in the array above sequentially
    timelines.forEach((timeline, index) => {
        var timeline;
        var featureTimeline = gsap.timeline({
            scrollTrigger: {
                scrub: true,
                //   markers: true,
                ...timeline,
            },
        });

        // if index of the timeline is odd offset feature to the right else offset to the left
        featureTimeline.from(timeline.trigger, {
            x: index % 2 === 0 ? 400 : -400,
            border: "none",
        });

        // set desired feature end state for the animation
        featureTimeline.to(timeline.trigger, {
            x: 0,
            border: "2px solid #66FCF1",
        });
    });
};

// Helper function to setup the infinite scrolling of the gallery
const setupGalleryInfiniteScroll = () => {
    // add last few cards to start of gallery
    galleryCards
        .slice(-cardsPerView)
        .reverse()
        .forEach((card) => {
            gallery.insertAdjacentHTML(ACTION_AFTER_BEGIN, card.outerHTML);
        });
    // add first few cards to end of gallery
    galleryCards.slice(0, cardsPerView).forEach((card) => {
        gallery.insertAdjacentHTML(ACTION_BEFORE_END, card.outerHTML);
    });
};

// infinite scrolling call back for the scroll container of the gallery
const infiniteScroll = () => {
    let { scrollWidth, offsetWidth } = gallery;

    gallery.classList.add(NO_TRANSTION_CLASS_NAME);
    // if the scoll container is to the far left
    if (gallery.scrollLeft - 16 === 0) {
        gallery.scrollLeft = scrollWidth - 2 * offsetWidth;
    } 
    // if the scoll container is to the far right (desktop)
    else if (
        Math.ceil(gallery.scrollLeft) ===
        gallery.scrollWidth - gallery.offsetWidth
    ) {
        gallery.scrollLeft = gallery.offsetWidth;
    } 
    // if the scoll container is to the far right (tablet)
    else if (
        Math.ceil(gallery.scrollLeft) ===
        gallery.scrollWidth - gallery.offsetWidth + 1
    ) {
        gallery.scrollLeft = gallery.offsetWidth;
    }
    gallery.classList.remove(NO_TRANSTION_CLASS_NAME);
};

// drag callback function for a mouse down event inside the gallery scroll container to start dragging
const startDrag = (e) => {
    isDragging = true;
    gallery.classList.add(DRAG_CLASS_NAME);
    startX = e.pageX;
    startScrollLeft = gallery.scrollLeft;
};

// drag callback function for a mouse up event globally to stop dragging
const stopDrag = (e) => {
    isDragging = false;
    gallery.classList.remove(DRAG_CLASS_NAME);
};

// drag callback function for dragging action
const dragging = (e) => {
    if (!isDragging) return;
    gallery.scrollLeft = startScrollLeft - (e.pageX - startX);
};

// callback for dialog opening
const showDialog = (e) => {
    submitDialog.show();
};

// callback for opening and closing the menu
const menuToggleHandler = () => {
    menuButton.classList.toggle(CLOSE_BUTTON_CLASS_NAME);
    menu.classList.toggle(MENU_OVERLAY_CLASS_NAME);
};

// curried callback function for handling a click event on the nav buttons in the gallery based on parsed direction
const handleScrollButtonClick = (direction) => () => {
    let offset = galleryCard.offsetWidth;
    console.log({ direction, offset });
    if (direction === BACK_CLASS_APPENDIX)
        gallery.scrollLeft -= galleryCard.offsetWidth;
    else if (direction === NEXT_CLASS_APPENDIX)
        gallery.scrollLeft += galleryCard.offsetWidth;
};

// for lenis scrolling library
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

// setting up component listeners for the SPA
galleryBackButton.addEventListener(ACTION_CLICK, handleScrollButtonClick(BACK_CLASS_APPENDIX));
galleryNextButton.addEventListener(ACTION_CLICK, handleScrollButtonClick(NEXT_CLASS_APPENDIX));
submitButton.addEventListener(ACTION_CLICK, showDialog);
gallery.addEventListener(ACTION_MOUSE_MOVE, dragging);
gallery.addEventListener(ACTION_MOUSE_DOWN, startDrag);
document.addEventListener(ACTION_MOUSE_UP, stopDrag);
gallery.addEventListener(ACTION_SCROLL, infiniteScroll);
menuButton.addEventListener(ACTION_CLICK, menuToggleHandler);

// Executing setup helper functions on the completion of the script
setupGalleryInfiniteScroll();
requestAnimationFrame(raf);
let mediaQuery = gsap.matchMedia();
mediaQuery.add("(min-width: 414px)", () => createTimelines());
