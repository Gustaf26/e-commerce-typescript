// let qtyProd1 = document.getElementById("qty-1").innerHTML
// let qtyProd2 = document.getElementById("qty-2").innerHTML
// let prelPriceEl = document.getElementById("prel-price")
// let totalPriceEl = document.getElementById("total-price")
// let deliveryEl = document.getElementById("transport-price")

// CART FUNCTIONS

const changeQty = (id, action) => {
  let cartProds = JSON.parse(localStorage.getItem("cart_products"));
  let chosenProd;
  if (cartProds && cartProds.length > 0) {
    chosenProd = cartProds.filter((cartProd) => cartProd.id == id);
    console.log(chosenProd);
    if (chosenProd && action == "plus") {
      chosenProd[0].qty += 1;
    } else if (chosenProd && action == "minus") {
      chosenProd[0].qty -= 1;
    }
    cartProds.map((cartProd, ind) => {
      if (cartProd.id == chosenProd[0].id) {
        cartProd = chosenProd[0];
        if (cartProd.qty == 0) {
          document.getElementById(`product-${cartProd.id}`).remove();
          cartProds.splice(ind, 1);
        } else {
          document.getElementById(`qty-${id}`).innerHTML = chosenProd[0].qty;
        }
      }
    });

    localStorage.setItem("cart_products", JSON.stringify(cartProds));
  }
};

// for (i = 0; i < allIcons.length; i++) {
//   allIcons[i].addEventListener("click", function myfunc(e) {
//     let id = e.target.id
//     let action = id.slice(0, id.indexOf("-"))
//     let prodNr = id.slice(id.indexOf("-") + 1)
//     rakna(action, prodNr)
//   })
// }

const showProdsInCart = (cartProds) => {
  let prodsContainer = document.getElementById("products-container");
  cartProds.map((prod) => {
    let prodContainer = document.createElement("div");
    prodContainer.id = `product-${prod.id}`;
    prodContainer.innerHTML = `<h3 id="heading-prod1" class="proditem">Kott & Chark</h3>
    <div class="product proditem" id="prod1">
        <img src="${prod.main_img}"/>
        <div class="product-info">
            <div class="product-specifics">
                <p>${prod.description}</p>
                <p><span class="price">${prod.discount}:-</span> <span class="discounted-prod-price">69.95</span></p>
            </div>
            <div class="qty-container">
                <i id="${prod.id}-qty-minus" class="qtybutton fas fa-solid fa-minus"></i>
                <b class="qty" id="qty-${prod.id}">${prod.qty}</b>
                <i id="${prod.id}-qty-plus"  class="qtybutton fas fa-solid fa-plus"></i>
            </div>
        </div>
    </div>
    <hr class="proditem">`;
    prodsContainer.prepend(prodContainer);
  });
  setTimeout(() => {
    let allQtyButtons = document.getElementsByClassName("qtybutton");
    allQtyButtons = [...allQtyButtons];
    allQtyButtons.map((but) => {
      but.addEventListener("click", (e) => {
        let prodId = e.target.id.slice(0, e.target.id.indexOf("-"));
        let action = e.target.id.slice(e.target.id.lastIndexOf("-") + 1);
        changeQty(prodId, action);
      });
    });
  }, 2000);
};

function rakna(action, prod) {
  let prelPrice = prelPriceEl.innerHTML.slice(
    0,
    prelPriceEl.innerHTML.indexOf(" ")
  );

  let allQtys = document.getElementsByClassName("qty");
  allQtys = [...allQtys];

  for (i = 0; i < allQtys.length; i++) {
    if (allQtys[i].id.slice(allQtys[i].id.indexOf("-") + 1) == prod) {
      console.log(prod);
      let prodQty = Number(document.getElementById(`qty-${prod}`).innerHTML);
      if (action == "plus") {
        document.getElementById(`qty-${prod}`).innerHTML = prodQty + 1;
      } else {
        document.getElementById(`qty-${prod}`).innerHTML = prodQty - 1;
      }
    }
  }
}

const showEmptyCart = () => {
  let cartContainer = document.getElementById("products-container");
  let emptyCartMsg = document.createElement("div");
  emptyCartMsg.id = "empty-cart-msg";

  emptyCartMsg.innerHTML = `<img src="/assets/tom-varukorg.png">
                      <h3>Oj, din varukorg ar tom.</h3>
                      <p>Borja handla, sa kommer varukorgen borja fyllas upp har</p>
                      `;

  cartContainer.prepend(emptyCartMsg);
};

let cartShowing = false;

const toggleCart = () => {
  if (!cartShowing) {
    let cartProds = JSON.parse(localStorage.getItem("cart_products"));
    document.getElementById("cart").style.display = "block";
    if (cartProds) {
      showProdsInCart(cartProds);
      document.getElementById("empty-cart-msg").innerHTML = "";
    } else {
      showEmptyCart();
    }
  } else {
    document.getElementById("cart").style.display = "none";
    let allCartProds = document.getElementsByClassName("proditem");
    if (allCartProds.length > 0) {
      allCartProds = [...allCartProds];
      allCartProds.map((cartElement) => {
        cartElement.remove();
      });
    }
  }
  cartShowing = !cartShowing;
};

document.getElementById("varukorg-bild").addEventListener("click", () => {
  toggleCart();
});

document.getElementById("Fortsatt-handla").addEventListener("click", () => {
  toggleCart();
});
