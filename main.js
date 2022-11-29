// PRODUCT FUNCTIONS

let allProds

// Hämtar produkterna från db
const getProds = () => {
  fetch("./db/products.json")
    .then(res => res.json())
    .then(res => showProds(res))
}

getProds()

// CART FUNCTIONS

const emptyCart = () => {
  let cartProds = []
  localStorage.setItem("cart_products", JSON.stringify(cartProds))

  // Visar empty cart meddelande
  showEmptyCart()
  // Uppdaterar varukorg i header element
  document.getElementById("cart-price").style.display = "none"
  document.getElementById("varukorg-i-header").style.display = "flex"
  document.getElementById("total-qty-in-cart").style.display = "none"

  // Uppdaterar pris i varukorg i header
  showPricesInCart()

  // Nollställa alla produkters inputs
  let allProds = localStorage.getItem("products")
  allProds = JSON.parse(allProds)
  allProds.map(prod => {
    if (document.getElementById(`${prod.id}-qty`)) {
      document.getElementById(`${prod.id}-qty`).value = 0
    }
  })
}

// Funktion för att visa total antal produkter i carten
const otherSumQtysInCart = () => {
  let cartProds = JSON.parse(localStorage.getItem("cart_products")) || []

  let allCartprodsQtys = 0
  if (cartProds.length > 0) {
    cartProds.map(prod => {
      allCartprodsQtys += prod.qty
    })
  } else {
    // Visar tom carts meddelande om cartProds == 0
    showEmptyCart()
  }
  document.getElementById("total-qty-in-cart").innerHTML = allCartprodsQtys
}

// Denna ändrar produkternas qty i carten och även på sidan
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
          document.getElementById(`${id}-qty`).value = 0
        } else {
          document.getElementById(`qty-${id}`).innerHTML = chosenProd[0].qty
          document.getElementById(`${id}-qty`).value = chosenProd[0].qty
        }
      }
    })

    // Uppdaterar även allProds med den valda produktens qty
    allProds.map((prod, ind) => {
      if (ind == chosenProd[0].id) {
        prod.qty = chosenProd[0].qty
      }
    })

    localStorage.setItem("cart_products", JSON.stringify(cartProds))
    localStorage.setItem("products", JSON.stringify(allProds))
  }

  // Uppdaterar antal produkter i carten + priserna nedan i carten
  otherSumQtysInCart()
  showPricesInCart()
}

// Updaterar priserna nedan i carten
const showPricesInCart = () => {
  let cartProds = JSON.parse(localStorage.getItem("cart_products"))
  let totalSumma = 0
  let rawPrice = 0
  let transportPrice = 0
  cartProds.map(prod => {
    prodPrice = prod.discount * prod.qty
    rawPrice += prodPrice
  })

  transportPrice = rawPrice * 0.1
  transportPrice = Math.round(transportPrice)
  totalSumma = Number(totalSumma)
  totalSumma = Number(rawPrice) + Math.round(transportPrice)
  totalSumma = Number(totalSumma).toFixed(0)

  document.getElementById("prel-price").innerHTML = rawPrice + " kr"
  document.getElementById("transport-price").innerHTML = transportPrice + " kr"
  document.getElementById("total-price").innerHTML = totalSumma + " kr"
}

// Visar alla produkter i carten och skapar en HTML element för varje produkt
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

  // Visa priserna i carten
  showPricesInCart()
  // Lyssna på klick event för att uppdatera prod.qtys i carten
  setTimeout(() => {
    let allQtyButtons = document.getElementsByClassName("qtybutton")
    allQtyButtons = [...allQtyButtons]
    allQtyButtons.map(but => {
      but.addEventListener("click", e => {
        let prodId = e.target.id.slice(0, e.target.id.indexOf("-"))
        let action = e.target.id.slice(e.target.id.lastIndexOf("-") + 1)
        changeQty(prodId, action)

        // Funktionen från den andra filen för att uppdatera
        // total-qtys-in-cart
        sumQtysInCart()
      })
    })
  }, 2000)
}

// Visar tom carts meddelande och bild
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

// Ändrar synlighet för carten när man klickar
const toggleCart = () => {
  if (document.getElementById("cart").style.display == "none") {
    let cartProds = JSON.parse(localStorage.getItem("cart_products"))
    document.getElementById("cart").style.display = "block"
    if (cartProds.length > 0) {
      showProdsInCart(cartProds)
      if (document.getElementById("empty-cart-msg")) {
        document.getElementById("empty-cart-msg").remove()
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

// Event listeners för att toggla carten
document.getElementById("varukorg-bild").addEventListener("click", () => {
  toggleCart()
})

document.getElementById("Fortsatt-handla").addEventListener("click", () => {
  toggleCart()
})

// Ändrar value på inputen för den valda produkten
const changeProdQty = (id, action) => {
  if (document.getElementById(`${id}-qty`)) {
    let prodQty = document.getElementById(`${id}-qty`).value
    if (action == "plus") {
      prodQty = Number(prodQty) + 1
    } else {
      if (prodQty == 0) {
        return
      }
      prodQty = Number(prodQty) - 1
    }
    document.getElementById(`${id}-qty`).value = prodQty
    // } else {
    //   let leftControl = document.createElement("button")
    //   leftControl.id = `${id}-minus`
    //   leftControl.classList.add("product__card_quantity_button")
    //   leftControl.innerHTML = `<i  id="" class="fa-solid fa-minus"></i>`
    //   let controlInput = document.createElement("input")
    //   controlInput.id = `${id}-qty`
    //   controlInput.classList.add("quantity__input")
    //   controlInput.value = 1
    //   controlInput.type = "number"
    //     `<button id= class="product__card_quantity_button">
    //     <i  id="" class="fa-solid fa-minus"></i>
    // </button>
    // <input id="${i}-qty" type="text" value=${
    // data.veckans[i].qty
    // } class="quantity__input" max="99">`
    // document.getElementById(`${id}-controls-container`).prepend(controlInput)
    // document.getElementById(`${id}-controls-container`).prepend(leftControl)
    // setTimeout(() => {
    //   leftControl.addEventListener("click", () => {
    //     addToCart(id, "minus")
    //     changeProdQty(id, "minus")
    //   })
    // }, 2000)
  }
}

// Från alla produktern i db uppvisar en card
const showProds = data => {
  allProds = data.veckans
  localStorage.setItem("products", JSON.stringify(allProds))
  let prodContainer = document.getElementById("prodCat1")

  for (i = 0; i < data.veckans.length; i++) {
    let prodEl = document.createElement("div")
    prodEl.classList.add("product__list_single")

    prodEl.innerHTML = `
            <div class="product__card">
                <div class="product__card_splash ">
                    <div class="product__card_splash_inner product-overlay">
                        <span>${data.veckans[i].discount.toFixed(0)}:-</span>
                    </div>
                </div>
                <div class="product__card_image">
                    
                    <figure>
                        <img src=${
                          data.veckans[i].main_img
                        } alt="Taco kryddmix" />
                    </figure>
                </div>
                <div class="product__card_content">
                    <div class="product__card_brand">
                        <a href="#" class="product__card_brand_value">
                            <span>${data.veckans[i].brand}</span>
                        </a>
                        <div class="product__card_badges">
                            <span class="product__card_badges_tooltips" data-hover="Ekologiskt">
                                <img src=${data.veckans[i].badge1} alt="Eko">
                            </span>
                            <span class="product__card_badges_tooltips" data-hover="Svenskt ursprung">
                                <img src=${
                                  data.veckans[i].badge2
                                } alt="Svenskt ursprung">
                            </span>
                        </div>
                    </div>
                    <div class="product__card_title_holder">
                        <span>${data.veckans[i].description}</span>
                    </div>
                    <div class="product__card_subtitle">
                        <div class="product__card_size">
                            <span>${data.veckans[i].qty}st</span>
                        </div>
                        <div class="product__card_origin">
                            <span class="aria-label">${
                              data.veckans[i].origin
                            }</span>
                        </div>
                    </div>
                    <div class="product__card_bottom">
                        <div class="product__card_price">
                            <span class="price price__discount">${
                              data.veckans[i].discount
                            }:-</span>
                            <span class="price__compare">${
                              data.veckans[i].kilopris
                            } /kg</span>
                            <div class="divider"></div>
                            <span class="price_orginal">${
                              data.veckans[i].original_price
                            }</span>
                        </div>
                        <div class="product__card_quantity">
                            <div class="product__card_quantity_inner ">
                                <div id="${i}-controls-container" class="product__card_controls">
                                <button id="${i}-minus" class="product__card_quantity_button button--primary">
                                    <i id="${i}-icon-minus" class="fa-solid fa-minus"></i>
                                </button>
                                <input id="${i}-qty" type="text" value=${
      data.veckans[i].qty
    } class="quantity__input" max="99">    
                                <button id="${i}-plus" class="product__card_quantity_button button--primary">
                                        <i id="${i}-icon-plus" class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`

    prodContainer.append(prodEl)
  }
}

// Event listeners på produkterna för att kunna ändra qtys och lägga till i carten
setTimeout(() => {
  let allQtyButtons = document.getElementsByClassName(
    "product__card_quantity_button"
  )
  allQtyButtons = [...allQtyButtons]
  allQtyButtons.map(but => {
    but.addEventListener("click", e => {
      if (e.target.id.slice(e.target.id.lastIndexOf("-") + 1) == "plus") {
        addToCart(e.target.id.slice(0, e.target.id.indexOf("-")), "plus")
        changeProdQty(e.target.id.slice(0, e.target.id.indexOf("-")), "plus")
      } else {
        addToCart(e.target.id.slice(0, e.target.id.indexOf("-")), "minus")
        changeProdQty(e.target.id.slice(0, e.target.id.indexOf("-")), "minus")
      }
    })
  })
}, 3000)

// Uppdaterar total antal prods i carten och antal prods symbolen
const sumQtysInCart = () => {
  let cartProds = JSON.parse(localStorage.getItem("cart_products")) || []
  let allCartprodsQtys = 0

  let rawPrice = 0
  let transportPrice = 0
  let totalSumma = 0
  if (cartProds.length > 0) {
    let prodPrice = 0
    cartProds.map(prod => {
      allCartprodsQtys += prod.qty
      prodPrice = prod.discount * prod.qty
      rawPrice += prodPrice
    })
    transportPrice = rawPrice * 0.1
    transportPrice = Math.round(transportPrice)
    totalSumma = Number(totalSumma)
    totalSumma = Number(rawPrice) + Math.round(transportPrice)
    totalSumma = Number(totalSumma).toFixed(0)
  }

  // OM det inte finns produkter i carten vill jag visa
  // den tomma varukorg symbolen
  if (totalSumma == 0) {
    document.getElementById("cart-price").style.display = "none"
    document.getElementById("varukorg-i-header").style.display = "flex"
    document.getElementById("total-qty-in-cart").style.display = "none"
  }
  // ANNARS visar jag den totala summan i varukorg elementet + antal varor
  else {
    document.getElementById("cart-price").style.display = "flex"
    document.getElementById("varukorg-i-header").style.display = "none"
    document.getElementById("cart-price").innerHTML = totalSumma + ":-"
    document.getElementById("cart-price").addEventListener("click", toggleCart)
    let totalPriceEl = document.createElement("span")
    totalPriceEl.innerHTML = allCartprodsQtys
    totalPriceEl.id = "total-qty-in-cart"
    document.getElementById("cart-price").append(totalPriceEl)
  }
}

// Lägger till produkt i carten och uppdaterar cart_product i localStorage
const addToCart = (i, action) => {
  let cartProds = JSON.parse(localStorage.getItem("cart_products")) || []
  allProds = JSON.parse(localStorage.getItem("products")) || []
  if (cartProds) {
    let prodInCart = cartProds.filter(cartProd => cartProd.id == i)
    if (prodInCart.length > 0) {
      if (action == "plus") {
        prodInCart[0].qty += 1
      } else {
        prodInCart[0].qty -= 1
      }
      if (prodInCart[0].qty == 0) {
        cartProds.splice(cartProds.indexOf(prodInCart[0]), 1)
      }
    } else if (action == "plus") {
      allProds.map((prod, ind) => {
        if (ind == i) {
          prod.qty += 1
          cartProds.push(prod)
        }
      })
    }
  } else if (action == "plus") {
    allProds.map((prod, ind) => {
      if (ind == i) {
        cartProds.push(prod)
      }
    })
  }
  localStorage.setItem("cart_products", JSON.stringify(cartProds))
  sumQtysInCart()
}

sumQtysInCart()
