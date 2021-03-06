import { gsap } from 'gsap';
import { setInitialStyles, gsapEffect, debounce } from './utils';
import DotsAnimation from './DotsAnimation';

const RevealAnimation = {
  init() {
    this.animElements;
    this.getElements();

    if (this.pill) {
      this.bindEvents();
      this.setup();
    }
    this.THRESHOLD = 0.33;
    this.isMobile;
  },

  bindEvents() {
    window.addEventListener('load', () => {
      this.setup();
      this.createObserver();
    });
    window.addEventListener(
      'resize',
      debounce(() => {
        this.resizePill();
        this.handleResize();
      }, 300),
      false,
    );
  },

  setupElementsStyles() {
    setInitialStyles([...this.revealElements, ...this.revealStaggerItems]);
    gsap.set([this.pill, this.revealStaggerScale], { autoAlpha: 0 });
    gsap.set(this.revealStaggerScale, { scale: 0.5 });

    this.isMobile = true;
  },

  setup() {
    this.getElements();
    this.setupElementsStyles();

    gsapEffect();
    this.resizePill();
    this.handleResize();
    DotsAnimation.init();
    gsap.config({ nullTargetWarn: false });

    this.on = true;
  },

  createObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: this.THRESHOLD,
    };
    const observer = new IntersectionObserver(this.handleIntersect, options);
    this.revealElements.forEach(revealElement => observer.observe(revealElement));
  },

  handleIntersect(entries, observer) {
    const tl = gsap.timeline();

    entries.forEach(entry => {
      const staggerItems = entry.target.querySelectorAll('.js-reveal-stagger-item');
      const staggerScale = entry.target.querySelectorAll('.js-reveal-stagger-scale');
      const entryPill = entry.target.querySelector('.js-pill');
      const entryPillBg = entry.target.querySelector('.js-pill-bg');

      if (entry.isIntersecting) {
        gsap.effects.fadeIn(entry.target).delay(0.1);
        gsap.effects.fadeIn(staggerItems);
        gsap.to(staggerScale, {
          scale: 1,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.6,
          stagger: index => index * 0.1,
        });

        tl.to(entryPillBg, { width: '100%', ease: 'power3.out', duration: 0.6 }).to(entryPill, {
          autoAlpha: 1,
          duration: 0.3,
        });

        observer.unobserve(entry.target);
      }
    });
  },

  resizePill() {
    this.pillHeight = this.pill.getBoundingClientRect().height;
    gsap.set(this.pillBg, { width: this.pillHeight, height: '100%' });
  },

  handleResize() {
    if (window.innerWidth <= 960) {
      this.THRESHOLD = 0;
      this.isMobile = true;
    } else {
      this.THRESHOLD = 0.33;
      this.isMobile = false;
    }
  },

  getElements() {
    this.revealElements = document.querySelectorAll('.js-reveal');
    this.revealStaggerItems = document.querySelectorAll('.js-reveal-stagger-item');
    this.revealStaggerScale = document.querySelectorAll('.js-reveal-stagger-scale');
    this.pill = document.querySelector('.js-pill');
    this.pillBg = document.querySelector('.js-pill-bg');

    if (this.pill) {
      this.pillHeight = this.pill.getBoundingClientRect().height;
    }
  },
};

export default RevealAnimation;
