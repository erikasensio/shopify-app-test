const wishlistOpen = document.querySelector(".wishlist-open")
const wishlist = document.querySelector(".wishlist")
const wishlistClose = document.querySelector(".wishlist-container__header--close")
wishlistOpen.addEventListener("click", function (e) {
    wishlist.classList.remove("hidden")
})

wishlistClose.addEventListener("click", function (e) {
    wishlist.classList.add("hidden")
})