
function getCartItems() {
    db.collection("cart-items").onSnapshot((snapshot) => {
        let cartItems = [];
        snapshot.docs.forEach((doc) => {
            cartItems.push({
                id: doc.id,
                ...doc.data()
            })
        })
        getTotalCost(cartItems);
        generateCartItems(cartItems);
     })
}

function decreaseCount(itemId) {
    let cartItem = db.collection("cart-items").doc(itemId);
    cartItem.get().then((doc) => {
        if (doc.exists) {
            if (doc.data().quantity > 1) {
                cartItem.update({
                    quantity: doc.data().quantity - 1
                })
            }
        }
    } )
}

function increaseCount(itemId) {
    let cartItem = db.collection("cart-items").doc(itemId);
    cartItem.get().then((doc) => {
        if (doc.exists) {
            if (doc.data().quantity >= 1) {
                cartItem.update({
                    quantity: doc.data().quantity + 1
                })
            }
        }
    })
}

function getTotalCost(items) {
    let totalCost = 0;
    items.forEach((item) => {
        totalCost += (item.price * item.quantity);
    })
    document.querySelector(".total-cost-number").innerHTML = numeral(totalCost).format('$0,0.00')
}

function deleteItem(itemId){
    db.collection("cart-items").doc(itemId).delete();
}
function checkoutItem(itemId) {
    db.collection('cart-items').get().then(querySnapshot => {
        querySnapshot.docs.forEach(snapshot => {
            snapshot.ref.delete();
        })
    })
    Swal.fire({
        title: '<span style="color:#A5DC86">Your order has been completed!</span>',
        imageUrl: 'https://www.mabaya.com/wp-content/uploads/2019/10/amazon_PNG25.png',
  imageWidth: 220,
  imageHeight: 100,
        icon: 'success',
        width: 400,
        showConfirmButton: true,
        confirmButtonColor: '#000',
        allowOutsideClick: false,
        confirmButtonText:'<a href="/index.html"><span style="color:#F59E0B; padding:10px 20px 10px 20px;">Go back to shopping</span></a>',
        padding: '3em',
        background: 'url("https://wallpapershome.com/images/pages/pic_v/288.jpg")',
        backdrop: `
          url("https://i.pinimg.com/originals/49/ea/f8/49eaf828d3039e13527aa08bc651ce8d.png")
        `
      })
}
function generateCartItems(cartItems) {
    let itemsHTML = "";
    cartItems.forEach((item) => {
        itemsHTML += `
        <div class="cart-item flex items-center pb-4 border-b bg-white p-5 rounded-lg shadow-md transition transform duration-150  mt-5">
                <div class="cart-item-image w-24 h-24 bg-white  rounded-lg">
                    <img class="w-full h-full object-contain border rounded-xl shadow p-2" src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details flex-grow ml-2">
                    <div class="cart-item-title font-bold text-sm text-gray-600 ml-2">
                        ${item.name}
                    </div>
                    <div class="cart-item-brand text-sm text-gray-400 font-bold ml-2">
                        ${item.make}
                    </div>
                </div>
                <div class="cart-item-counter w-48 flex items-center">
                    <div data-id="${item.id}" class="cart-item-decrease cursor-pointer text-gray-400 bg-gray-100 rounded h-6 w-6 flex items-center justify-center hover:bg-gray-200 mr-2">
                        <i class="fas fa-minus fa-xs"></i>
                    </div>
                      <div class="text-gray-400"> ${item.quantity} </div>
                      <div data-id="${item.id}" class="cart-item-increase cursor-pointer text-gray-400 bg-gray-100 rounded h-6 w-6 flex items-center justify-center ml-2 hover:bg-gray-200">
                        <i class="fas fa-plus fa-xs"></i>
                    </div>
                </div>
                <div class="cart-item-cost w-48 font-bold text-gray-400">
                    ${numeral(item.price * item.quantity).format('$0,0.00')}
                </div>
                <div data-id="${item.id}" class="cart-item-delete text-gray-300 cursor-pointer w-10 font-bold hover:text-gray-400">
                    <i class="fas fa-times"></i>
            </div>
            </div>
            `
            checkout = `
            <div data-id="${item.id}" class="complete-order-button w-56 flex items-center justify-center bg-yellow-500 rounded text-white font-bold cursor-pointer hover:bg-yellow-600 h-16 whitespace-nowrap">
                Complete Order
            </div>
            `
    })
    document.querySelector(".cart-items").innerHTML = itemsHTML;
    createEventListeners();
    document.querySelector(".checkout-button").innerHTML = checkout;
}

function createEventListeners() {
    let decreaseButton = document.querySelectorAll(".cart-item-decrease");
    let increaseButton = document.querySelectorAll(".cart-item-increase");
    let deleteButtons = document.querySelectorAll(".cart-item-delete");
    let checkoutButtons = document.querySelectorAll(".checkout-button");

    decreaseButton.forEach((button) => {
        button.addEventListener("click", function () {
            decreaseCount(button.dataset.id);
        })
    })
    increaseButton.forEach((button) => {
        button.addEventListener("click", function () {
            increaseCount(button.dataset.id);
        }
        )
    })
    deleteButtons.forEach((button) => {
        button.addEventListener("click", function () {
            deleteItem(button.dataset.id)
        })
    })
    checkoutButtons.forEach((button) => {
        button.addEventListener("click", function () {
            checkoutItem(button.dataset.id)
        })
    })
}

getCartItems()