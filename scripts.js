// Constants - Classes
const GALLERY_CLASS_NAME = "gallery";
const HERO_CLASS_NAME = "hero";
const SUBMIT_CLASS_NAME = "submit";
const DIALOG_CLASS_NAME = "dialog";
const DRAG_CLASS_NAME = "dragging";
const CARD_CLASS_NAME = "card";
const BACKGROUND_PATH_CLASS_NAME = "background-path";
const NO_TRANSTION_CLASS_NAME = "no-transition";

// Constants - Class Extensions
const BACK_CLASS_APPENDIX = "back";
const NEXT_CLASS_APPENDIX = "next";
const TEXT_CLASS_APPENDIX = "text";
const BUTTON_CLASS_APPENDIX = "button";

// Constants - Actions
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
const galleryCard = document.querySelector(`.${CARD_CLASS_NAME}`);
const path = document.querySelector(`.${BACKGROUND_PATH_CLASS_NAME}`);
const pageLength = path.getTotalLength();
const galleryCards = [...gallery.children];

// Timelines
const timelines = [
    { trigger: ".animated-first", start: "-60% center", end: "50% 70%" },
    { trigger: ".animated-second", start: "-60% center", end: "50% 70%" },
    { trigger: ".animated-third", start: "-60% center", end: "40% 70%" },
    { trigger: ".animated-fourth", start: "-60% center", end: "30% 70%" },
    { trigger: ".animated-fifth", start: "-60% center", end: "30% center" },
    { trigger: ".animated-sixth", start: "-60% center", end: "20% center" },
    { trigger: ".animated-seventh", start: "-60% center", end: "top center" },
];

// Variables
var startX;
var startScrollLeft;
let isDragging = false;
let cardsPerView = Math.round(gallery.offsetWidth / galleryCard.offsetWidth);

// Functions

path.style.strokeDasharray = pageLength + " " + pageLength;
path.style.strokeDashoffset = pageLength;
window.addEventListener(ACTION_SCROLL, () => {
  var scrollPercentage =
    (document.documentElement.scrollTop + document.body.scrollTop) /
    (document.documentElement.scrollHeight +
      document.documentElement.clientHeight);

  var drawLength = pageLength * scrollPercentage;

  path.style.strokeDashoffset = pageLength - drawLength;
});

const createTimelines = () =>
{
    timelines.forEach((timeline, index) => {
        var timeline
        var featureTimeline = gsap.timeline({
            scrollTrigger: {
              scrub: true,
            //   markers: true,
              ...timeline
            },
          });
          
          featureTimeline.from(timeline.trigger, {
            x: index % 2 === 0 ? 400 : -300 ,
            border: "none",
          });
          
          featureTimeline.to(timeline.trigger, {
            x: 0,
            border: "2px solid #66FCF1",
          });
    });
    
}

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

const infiniteScroll = () => {
  let { scrollWidth, offsetWidth } = gallery;
  gallery.classList.add(NO_TRANSTION_CLASS_NAME);
  if (gallery.scrollLeft - 16 === 0) {
    gallery.scrollLeft = scrollWidth - 2 * offsetWidth;
  } else if (
    Math.ceil(gallery.scrollLeft) ===
    gallery.scrollWidth - gallery.offsetWidth
  ) {
    gallery.scrollLeft = gallery.offsetWidth;
  }
  gallery.classList.remove(NO_TRANSTION_CLASS_NAME);
};

const startDrag = (e) => {
  isDragging = true;
  gallery.classList.add(DRAG_CLASS_NAME);
  startX = e.pageX;
  startScrollLeft = gallery.scrollLeft;
};

const stopDrag = (e) => {
  isDragging = false;
  gallery.classList.remove(DRAG_CLASS_NAME);
};

const dragging = (e) => {
  if (!isDragging) return;
  gallery.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const showDialog = (e) => {
  submitDialog.show();
};

const handleScrollButtonClick = (direction) => () => {
  let offset = galleryCard.offsetWidth;
  console.log({ direction, offset });
  if (direction === BACK_CLASS_APPENDIX)
    gallery.scrollLeft += -galleryCard.offsetWidth;
  else if (direction === NEXT_CLASS_APPENDIX)
    gallery.scrollLeft += galleryCard.offsetWidth;
};

// Component Listeners
galleryBackButton.addEventListener(
  ACTION_CLICK,
  handleScrollButtonClick(BACK_CLASS_APPENDIX)
);
galleryNextButton.addEventListener(
  ACTION_CLICK,
  handleScrollButtonClick(NEXT_CLASS_APPENDIX)
);
submitButton.addEventListener(ACTION_CLICK, showDialog);
gallery.addEventListener(ACTION_MOUSE_MOVE, dragging);
gallery.addEventListener(ACTION_MOUSE_DOWN, startDrag);
document.addEventListener(ACTION_MOUSE_UP, stopDrag);
gallery.addEventListener(ACTION_SCROLL, infiniteScroll);

// Scripts to execute on load
setupGalleryInfiniteScroll();

const lenis = new Lenis();

lenis.on("scroll", (e) => {
  console.log(e);
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
createTimelines();
