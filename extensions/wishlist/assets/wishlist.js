const wishlistOpen = document.querySelector(".wishlist-open")
const addToWishlistButton = document.querySelector(".wishlist-add")
const wishlist = document.querySelector(".wishlist")
const wishlistClose = document.querySelector(".wishlist-container__header--close")

const handleRetrieveWishlist = (user) => {
    /*for (let product = 0; product < user.wishlist.length; product++) {
        const productID = user.wishlist[product]*/
    //fetch call to /wishlist?
    console.log("retrieving wishlist...")

}
const retrieveUserId = (session) => {
    const client = new shopify.api.clients.Graphql({ session });
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "userId": localStorage.getItem("userId")
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://erik-wishlist-app.fly.dev/userId", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            return result
        })
        .catch(error => console.log('error', error.message));
}

if (wishlistOpen !== null && wishlist !== null) {
    wishlistOpen.addEventListener("click", function (e) {
        wishlist.classList.remove("hidden")
        handleRetrieveWishlist(localStorage.getItem("userId"))
        //retrieve user info from shopify with graphQL sending user email by UTM and post it on BBDD with an endpoint and iterate all user info in the app, in case it already exists retrieve and render his actual wishlisted products.
    })
}

if (wishlistClose !== null && wishlist !== null) {
    wishlistClose.addEventListener("click", function (e) {
        wishlist.classList.add("hidden")
    })
}

//wishlist icon on product block click, then retrieve customer info, create it on BBDD and addToWishlist func retrieving product info with graphQL, sending product id by UTM.
if (addToWishlistButton !== null && wishlist !== null) {
    addToWishlistButton.addEventListener("click", function (e) {
        //check if customer logged
        //if logged retrieve user, then retrieve product id with graphQL and add it to BBDD.
        // * annotation: may be better to just add the product id to the BBDD and retrieve all the products by id before rendering with graphQL.
        //redirect to wishlist anyways, in case that logged render all the products, if not logged will be shown the 'please login' message.
    })
}