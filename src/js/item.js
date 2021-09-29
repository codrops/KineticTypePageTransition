import gsap from 'gsap/gsap-core';
import { Article } from './article';

export class Item {
    // DOM elements
    DOM = {
        el: null,
        image: null,
        title: null,
        description: null,
        article: null
    };
    // the Item's Article instance
    article;

    constructor(DOM_el) {
        this.DOM.el = DOM_el;
        // image, title and description
        this.DOM.image = this.DOM.el.querySelector('.item__img');
        this.DOM.title = this.DOM.el.querySelector('.item__caption-title');
        this.DOM.description = this.DOM.el.querySelector('.item__caption-description');
        // article element for this item
        this.DOM.article = document.getElementById(this.DOM.el.dataset.article);
        // Article instance
        this.article = new Article(this.DOM.article);
        // mouseenter/mouseleave events: translate all elements
        const hoverTimelineDefaults = {duration: 1, ease: 'expo'};
        this.DOM.el.addEventListener('mouseenter', () => {
            gsap.timeline({defaults: hoverTimelineDefaults})
            .to([this.DOM.image, this.DOM.title, this.DOM.description], {
                y: pos => pos*8-4
            });
        });
        this.DOM.el.addEventListener('mouseleave', () => {
            gsap.timeline({defaults: hoverTimelineDefaults})
            .to([this.DOM.image, this.DOM.title, this.DOM.description], {
                y: 0
            });
        });
    }
}