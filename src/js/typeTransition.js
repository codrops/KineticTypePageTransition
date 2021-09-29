import { gsap } from 'gsap';

// .type__line CSS opacity value (CSS variable)
const TYPE_LINE_OPACITY = getComputedStyle(document.body).getPropertyValue('--type-line-opacity');

export class TypeTransition {
    // DOM elements
    DOM = {};

    constructor(DOM_el) {
        this.DOM.el = DOM_el;
        // lines of text
        this.DOM.lines = [...document.querySelectorAll('.type__line')];
    }
    // "in" transition (total time: 2.5s)
    in() {
        return gsap.timeline({paused: true})
        .to(this.DOM.el, {
            duration: 1.4,
            ease: 'power2.inOut',
            scale: 2.7,
            rotate: -90
        })
        .to(this.DOM.lines, {
            keyframes: [
                { x: '20%', duration: 1, ease: 'power1.inOut' },
                { x: '-200%', duration: 1.5, ease: 'power1.in' }
            ],
            stagger: 0.04
        }, 0)
        .to(this.DOM.lines, {
            keyframes: [
                { opacity: 1, duration: 1, ease: 'power1.in' },
                { opacity: 0, duration: 1.5, ease: 'power1.in' }
            ]
        }, 0)
    }
    out() {
        return gsap.timeline({paused: true})
        .to(this.DOM.el, {
            duration: 1.4,
            ease: 'power2.inOut',
            scale: 1,
            rotate: 0
        }, 1.2)
        .to(this.DOM.lines, {
            duration: 2.3, 
            ease: 'back',
            x: '0%',
            stagger: -0.04
        }, 0)
        .to(this.DOM.lines, {
            keyframes: [
                { opacity: 1, duration: 1, ease: 'power1.in' },
                { opacity: TYPE_LINE_OPACITY, duration: 1.5, ease: 'power1.in' }
            ]
        }, 0);
    }
}