import { preloadImages } from './utils';
import { gsap } from 'gsap';
import { TypeTransition } from './typeTransition';
import { Item } from './item';
import gsap from 'gsap/gsap-core';

// preload images then remove loader (loading class) 
preloadImages('.item__img, .article__img').then(() => document.body.classList.remove('loading'));

// text transition
const typeT = new TypeTransition(document.querySelector('[data-type-transition]'));

// true if there's an animation running
let isAnimating = false;

// frame element
const frameEl = document.querySelector('.frame');


/**** Items ****/

// items array
let itemsInstanceArr = [];
// current item's index
let currentItem = -1;
// Items wrap 
const itemsWrap = document.querySelector('.item-wrap');

[...itemsWrap.querySelectorAll('.item')].forEach(itemEl => {
    // create a new Item
    const item = new Item(itemEl);
    // add it to the array of Item's indexes
    itemsInstanceArr.push(item);
    
    // on click action
    item.DOM.el.addEventListener('click', () => openItem(item));
});

const openItem = item => {
    if ( isAnimating ) return;
    isAnimating = true;

    // update currentItem index
    currentItem = itemsInstanceArr.indexOf(item);
    
    // gsap timeline
    const openTimeline = gsap.timeline({
        onComplete: () => isAnimating = false
    });
    
    // labels
    openTimeline.addLabel('start', 0)
    // type transition starts a bit after the items animation
    .addLabel('typeTransition', 0.3)
    // the article will show a bit before the text transition ends
    .addLabel('articleOpening', typeT.in().totalDuration()*.75 + openTimeline.labels.typeTransition)

    // fade out the items
    .to(itemsInstanceArr.map(item => item.DOM.el), {
        duration: 0.8,
        ease: 'power2.inOut',
        opacity: 0,
        y: (pos) => pos%2 ? '25%' : '-25%'
    }, 'start')
    // fade out the page frame
    .to(frameEl, {
        duration: 0.8,
        ease: 'power3',
        opacity: 0,
        onComplete: () => gsap.set(frameEl, {pointerEvents: 'none'})
    }, 'start')
    
    // text transition starts here
    .add(typeT.in().play(), 'typeTransition')

    // add current class to the item's article and set the pointer events
    .add(() => {
        gsap.set(backCtrl, {pointerEvents: 'auto'})
        gsap.set(itemsWrap, { pointerEvents: 'none' });
        itemsInstanceArr[currentItem].DOM.article.classList.add('article--current');
    }, 'articleOpening')
    // show the back button
    .to(backCtrl, {
        duration: 0.7,
        opacity: 1
    }, 'articleOpening')
    // initially hide all the article elements so we can animate them in
    .set([item.article.DOM.title, item.article.DOM.number, item.article.DOM.intro, item.article.DOM.description], {
        opacity: 0,
        y: '50%'
    }, 'articleOpening')
    // the image wrap and image elements will have opposite translate values (reveal/unreveal effect)
    .set(item.article.DOM.imageWrap, {y: '100%'}, 2)
    .set(item.article.DOM.image, {y: '-100%'}, 2)
    // now fade in and translate the article's elements
    .to([item.article.DOM.title, item.article.DOM.number, item.article.DOM.intro, item.article.DOM.description], {
        duration: 1,
        ease: 'expo',
        opacity: 1,
        y: '0%',
        stagger: 0.04
    }, 'articleOpening')
    // and reveal the image
    .to([item.article.DOM.imageWrap, item.article.DOM.image], {
        duration: 1,
        ease: 'expo',
        y: '0%'
    }, 'articleOpening');
}


/**** Back action ****/

// back button
const backCtrl = document.querySelector('.back');

const closeItem = () => {
    if ( isAnimating ) return;
    isAnimating = true;

    // current open item
    const item = itemsInstanceArr[currentItem];

    // gsap timeline
    const closeTimeline = gsap.timeline({
        onComplete: () => isAnimating = false
    });

    // labels
    closeTimeline.addLabel('start', 0)
    .addLabel('typeTransition', 0.5)
    .addLabel('showItems', typeT.out().totalDuration()*0.7 + closeTimeline.labels.typeTransition)

    .to(backCtrl, {
        duration: 0.7,
        ease: 'power1',
        opacity: 0
    }, 'start')
    .to([item.article.DOM.title, item.article.DOM.number, item.article.DOM.intro, item.article.DOM.description], {
        duration: 1,
        ease: 'power4.in',
        opacity: 0,
        y: '50%',
        stagger: -0.04
    }, 'start')
    .to(item.article.DOM.imageWrap, {
        duration: 1,
        ease: 'power4.in',
        y: '100%'
    }, 'start')
    .to(item.article.DOM.image, {
        duration: 1,
        ease: 'power4.in',
        y: '-100%'
    }, 'start')

    // remove current class from the item's article and set the pointer events
    .add(() => {
        gsap.set(backCtrl, {pointerEvents: 'none'})
        gsap.set(itemsWrap, { pointerEvents: 'auto' });
        item.DOM.article.classList.remove('article--current');
    })

    // text transition starts here
    .add(typeT.out().play(), 'typeTransition')

    .to(frameEl, {
        duration: 0.8,
        ease: 'power3',
        opacity: 1,
        onStart: () => gsap.set(frameEl, {pointerEvents: 'auto'})
    }, 'showItems')
    .to(itemsInstanceArr.map(item => item.DOM.el), {
        duration: 1,
        ease: 'power3.inOut',
        opacity: 1,
        y: '0%'
    }, 'showItems');
}

backCtrl.addEventListener('click', () => closeItem());