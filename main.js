// CART FUNCTIONS

const otherSumQtysInCart = () => {
  let cartProds = JSON.parse(localStorage.getItem("cart_products")) || []

  let allCartprodsQtys = 0
  if (cartProds.length > 0) {
    cartProds.map(prod => {
      allCartprodsQtys += prod.qty
    })
  }
  document.getElementById("total-qty-in-cart").innerHTML = allCartprodsQtys
}

const changeQty = (id, action) => {
  let cartProds = JSON.parse(localStorage.getItem("cart_products"))
  let allProds = JSON.parse(localStorage.getItem("products"))
  let chosenProd
  if (cartProds && cartProds.length > 0) {
    chosenProd = cartProds.filter(cartProd => cartProd.id == id)
    console.log(chosenProd)
    if (chosenProd && action == "plus") {
      chosenProd[0].qty += 1
    } else if (chosenProd && action == "minus") {
      chosenProd[0].qty -= 1
    }
    cartProds.map((cartProd, ind) => {
      if (cartProd.id == chosenProd[0].id) {
        cartProd = chosenProd[0]
        if (cartProd.qty == 0) {
          document.getElementById(`product-${cartProd.id}`).remove()
          cartProds.splice(ind, 1)
        } else {
          document.getElementById(`qty-${id}`).innerHTML = chosenProd[0].qty
          document.getElementById(`${id}-qty`).value = chosenProd[0].qty
        }
      }
    })

    allProds.map((prod, ind) => {
      if (ind == chosenProd[0].id) {
        prod.qty = chosenProd[0].qty
        console.log(prod.qty)
        if (prod.qty == 0) {
          prod.qty = 1
        }
      }
    })
    console.log(allProds)

    localStorage.setItem("cart_products", JSON.stringify(cartProds))
    localStorage.setItem("products", JSON.stringify(allProds))
  }
  otherSumQtysInCart()
  showPricesInCart()
}

const showPricesInCart = () => {
  let cartProds = JSON.parse(localStorage.getItem("cart_products"))
  let totalSumma = 0
  let rawPrice = 0
  let transportPrice = 0
  cartProds.map(prod => {
    prodPrice = prod.discount * prod.qty
    rawPrice += prodPrice
    transportPrice = rawPrice * 0.1
    totalSumma += rawPrice + transportPrice.toFixed()
  })
  document.getElementById("prel-price").innerHTML = rawPrice + " kr"
  document.getElementById("transport-price").innerHTML = transportPrice + " kr"
  document.getElementById("total-price").innerHTML =
    totalSumma.toFixed() + " kr"
}

const showProdsInCart = cartProds => {
  let prodsContainer = document.getElementById("products-container")
  cartProds.map(prod => {
    let prodContainer = document.createElement("div")
    prodContainer.id = `product-${prod.id}`
    prodContainer.innerHTML = `<h3 id="heading-prod1" class="proditem">Kott & Chark</h3>
    <div class="product proditem" id="prod1">
        <img src="${prod.main_img}"/>
        <div class="product-info">
            <div class="product-specifics">
                <p>${prod.description}</p>
                <p><span id="${prod.id}-price" class="price">${prod.discount}:-</span> <span class="discounted-prod-price">69.95</span></p>
            </div>
            <div class="qty-container">
                <i id="${prod.id}-qty-minus" class="qtybutton fas fa-solid fa-minus"></i>
                <b class="qty" id="qty-${prod.id}">${prod.qty}</b>
                <i id="${prod.id}-qty-plus"  class="qtybutton fas fa-solid fa-plus"></i>
            </div>
        </div>
    </div>
    <hr class="proditem">`
    prodsContainer.prepend(prodContainer)
  })
  showPricesInCart()
  setTimeout(() => {
    let allQtyButtons = document.getElementsByClassName("qtybutton")
    allQtyButtons = [...allQtyButtons]
    allQtyButtons.map(but => {
      but.addEventListener("click", e => {
        let prodId = e.target.id.slice(0, e.target.id.indexOf("-"))
        let action = e.target.id.slice(e.target.id.lastIndexOf("-") + 1)
        changeQty(prodId, action)
        sumQtysInCart()
      })
    })
  }, 2000)
}

const showEmptyCart = () => {
  let cartContainer = document.getElementById("products-container")
  let emptyCartMsg = document.createElement("div")
  emptyCartMsg.id = "empty-cart-msg"

  emptyCartMsg.innerHTML = `<img src="/assets/tom-varukorg.png">
                      <h3>Oj, din varukorg ar tom.</h3>
                      <p>Borja handla, sa kommer varukorgen borja fyllas upp har</p>
                      `

  cartContainer.prepend(emptyCartMsg)
}

const toggleCart = () => {
  if (document.getElementById("cart").style.display == "none") {
    let cartProds = JSON.parse(localStorage.getItem("cart_products"))
    document.getElementById("cart").style.display = "block"
    if (cartProds) {
      showProdsInCart(cartProds)
      if (document.getElementById("empty-cart-msg")) {
        document.getElementById("empty-cart-msg").innerHTML = ""
      }
    } else {
      showEmptyCart()
    }
  } else {
    document.getElementById("cart").style.display = "none"
    let allCartProds = document.getElementsByClassName("proditem")
    if (allCartProds.length > 0) {
      allCartProds = [...allCartProds]
      allCartProds.map(cartElement => {
        cartElement.remove()
      })
    }
  }
}

document.getElementById("varukorg-bild").addEventListener("click", () => {
  toggleCart()
})

document.getElementById("Fortsatt-handla").addEventListener("click", () => {
  toggleCart()
})
