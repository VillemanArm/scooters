const scrollButton = () => {
    const buyBlock = document.querySelector('.buy')
    const upperButton = document.querySelector('.hero .button')
    let buyBlockTop = buyBlock.offsetTop

    upperButton.addEventListener('click', (e) => {
        buyBlock.scrollIntoView({ behavior: "smooth" })
    })

    if (window.innerWidth <= 768) {
        window.addEventListener('scroll', (e) => {
            if (window.pageYOffset > buyBlockTop - 25) {
                upperButton.style.display = 'none'
            } else {
                upperButton.style.display = 'block'
            }
        })
    }
}

export default scrollButton