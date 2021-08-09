function getItems(){
    db.collection("items").get().then((querySnapshot) => {
        let items = [];
        querySnapshot.forEach((doc) => {
            items.push({
                id: doc.id,
                image: doc.data().image,
                name: doc.data().name,
                make: doc.data().make,
                rating: doc.data().rating,
                price: doc.data().price
            })
        });
        generateItems(items)
    });
}


function addToCart(item) {
    let cartItem = db.collection("cart-items").doc(item.id);
    cartItem.get()
        .then(function (doc) {
            if (doc.exists) {
                cartItem.update({
                    quantity: doc.data().quantity + 1
                })
            }
            else {
                    cartItem .set({
                        image: item.image,
                        name: item.name,
                        make: item.make,
                        rating: item.rating,
                        price: item.price,
                        quantity: 1
                    })
                }
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}

function generateItems(items) {
    let itemsHTML = "";
    items.forEach((item) => {
        let doc = document.createElement("div");
        doc.classList.add("main-product", "shadow", "rounded-2xl", "mr-7");
        doc.innerHTML = `
            <div class="product-image w-42 h-52 bg-white rounded-lg select-none pointer-events-none">
                <img src="${item.image}" draggable="false" onmousedown="return false" style="user-drag: none" class="w-full h-full object-contain p-4" alt="product-image">
            </div>
            <div class="product-name text-center text-gray-700 font-bold mt-2 text-sm">
                ${item.name} 
            </div>
            <div class="product-make text-center text-green-700 font-bold"> 
                ${item.make}
            </div>
            <div class="product-rating text-center text-yellow-300 font-bold my-1 select-none">
                ⭐⭐⭐⭐⭐ ${item.rating}
            </div>
            <div class="product-price text-center font-bold text-gray-700 text-lg">
                ${numeral(item.price).format('$0,0.00')}
            </div>
        `

        let addToCartEl = document.createElement("div");
        addToCartEl.classList.add("add-to-cart", "ml-10", "duration-150", "shadow-md", "h-8", "w-28", "bg-yellow-500", "flex", "items-center", "justify-center", "mt-5", "mb-3", "rounded", "font-bold", "text-white", "cursor-pointer", "hover:bg-yellow-600", "hover:text-gray-200", "select-none", "text-center");
        addToCartEl.innerText = "Add to Cart";
        addToCartEl.addEventListener("click", function () {
            addToCart(item)
        })
        doc.appendChild(addToCartEl);
        document.querySelector(".main-section-products").appendChild(doc);
    })
}

getItems();