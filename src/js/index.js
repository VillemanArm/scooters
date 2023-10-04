'use strict';

// import openBlock from "./modules/open_block";

// import Swiper from './libraries/swiper-bundle';
// import { Navigation, Pagination } from './libraries/swiper-bundle';

const swiper = new Swiper('.slider', {
    // Optional parameters
    // direction: 'vertical',
    loop: true,

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

