const swiper = new Swiper('.swiper', {
    speed: 400,
    loop: true,
    spaceBetween: 30,

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

export default swiper