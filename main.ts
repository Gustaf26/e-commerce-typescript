// PRODUCT FUNCTIONS
type Product = {
  badge1: string;
  badge2: string;
  brand: string;
  description: string;
  discount: number;
  readonly id: number;
  kilopris: number;
  main_img: string;
  origin: string;
  original_price: number;
  qty: number;
  category: string;
};

let allProds: { veckans: Product[] };
let cartProds: Product[] = [];
let searchProds: Product[] = [];
let totalSumma: number = 0;

document.getElementById("search-button")?.addEventListener("click", (e) => {
  let inputEL = document.getElementById("search-input") as HTMLInputElement;
  if (inputEL.value.length > 0) {
    searchProdsFunction(inputEL.value);
  } else {
    emptyProds();
    showProds(allProds);
  }
});

// Function för att tömma produkterna
function emptyProds() {
  let prodsContainer = document.getElementById("prodCat1") as HTMLBaseElement;
  prodsContainer.innerHTML = "";
}

// Search products function
function searchProdsFunction(val: string) {
  emptyProds();
  // alert("Searching prod");
  allProds.veckans.map((prod: Product) => {
    if (
      prod.description.toLowerCase().includes(val.toLowerCase()) ||
      prod.brand.toLowerCase().includes(val.toLowerCase()) ||
      prod.origin.toLowerCase().includes(val.toLowerCase())
    ) {
      // alert("Value founded");
      searchProds.push(prod);
    }
  });

  showProds({ veckans: searchProds });
  searchProds = [];
}

// Hämtar produkterna från db
const getProds = () => {
  fetch("./db/products.json")
    .then((res) => res.json())
    .then((res) => {
      allProds = res;
      showProds(allProds);
    });
};

getProds();

// CART FUNCTIONS

const emptyCart = () => {
  cartProds = [];

  // Visar empty cart meddelande
  showEmptyCart();
  // Uppdaterar varukorg i header element
  let cardPriceEl = document.getElementById("cart-price") as HTMLBaseElement;
  cardPriceEl.style.display = "none";
  let varuKorgEl = document.getElementById(
    "varukorg-i-header"
  ) as HTMLBaseElement;
  varuKorgEl.style.display = "flex";
  let totalQTyEl = document.getElementById(
    "total-qty-in-cart"
  ) as HTMLBaseElement;
  totalQTyEl.style.display = "none";

  // Uppdaterar pris i varukorg i header
  showPricesInCart();

  // Nollställa alla produkters inputs

  allProds.veckans.map((prod: Product) => {
    if (document.getElementById(`${prod.id}-qty`)) {
      let qtyEl = document.getElementById(`${prod.id}-qty`) as HTMLInputElement;
      let qtyNumber = 0;
      prod.qty = 0;
      qtyEl.value = qtyNumber.toString();
    }
  });
};

// Funktion för att visa total antal produkter i carten
const otherSumQtysInCart = () => {
  let allCartprodsQtys = 0;
  if (cartProds.length > 0) {
    cartProds.map((prod) => {
      allCartprodsQtys += prod.qty;
    });
  } else {
    // Visar tom carts meddelande om cartProds == 0
    showEmptyCart();
  }
  let totalQTyInCartEl = document.getElementById(
    "total-qty-in-cart"
  ) as HTMLBaseElement;
  totalQTyInCartEl.innerHTML = allCartprodsQtys.toString();
};

// Denna ändrar produkternas qty i carten och även på sidan
const changeQty = (id: number, action: string) => {
  let chosenProd: Product[];
  if (cartProds && cartProds.length > 0) {
    chosenProd = cartProds.filter((cartProd: Product) => cartProd.id == id);
    console.log(chosenProd);
    if (chosenProd && action == "plus") {
      chosenProd[0].qty += 1;
    } else if (chosenProd && action == "minus") {
      chosenProd[0].qty -= 1;
    }
    cartProds.map((cartProd: Product, ind) => {
      if (cartProd.id == chosenProd[0].id) {
        cartProd = chosenProd[0];
        if (cartProd.qty == 0) {
          let productEL = document.getElementById(
            `product-${cartProd.id}`
          ) as HTMLBaseElement;
          productEL.remove();
          cartProds.splice(ind, 1);
          let prodQtyEl = document.getElementById(
            `${id}-qty`
          ) as HTMLInputElement;
          prodQtyEl.value = "0";
        } else {
          let prodQtyEl = document.getElementById(
            `qty-${id}`
          ) as HTMLBaseElement;
          prodQtyEl.innerHTML = chosenProd[0].qty.toString();
          let otherProdQtyEl = document.getElementById(
            `${id}-qty`
          ) as HTMLInputElement;
          otherProdQtyEl.value = chosenProd[0].qty.toString();
        }
      }
    });

    // Uppdaterar även allProds med den valda produktens qty
    allProds.veckans.map((prod: Product, ind: number) => {
      if (ind == chosenProd[0].id) {
        prod.qty = chosenProd[0].qty;
      }
    });
  }

  // Uppdaterar antal produkter i carten + priserna nedan i carten
  otherSumQtysInCart();
  showPricesInCart();
};

// Updaterar priserna nedan i carten
const showPricesInCart = () => {
  let totalSumma = 0;
  let rawPrice = 0;
  let transportPrice = 0;
  cartProds.map((prod: Product) => {
    let prodPrice = prod.discount * prod.qty;
    rawPrice += prodPrice;
  });

  transportPrice = rawPrice * 0.1;
  transportPrice = Math.round(transportPrice);
  totalSumma = Number(totalSumma);
  totalSumma = Number(rawPrice) + Math.round(transportPrice);
  totalSumma = Number(totalSumma.toFixed(2));

  let prelPriceEl = document.getElementById("prel-price") as HTMLBaseElement;
  prelPriceEl.innerHTML = rawPrice + " kr";
  let transPriceEl = document.getElementById(
    "transport-price"
  ) as HTMLBaseElement;
  transPriceEl.innerHTML = transportPrice + " kr";
  let totalPriceEl = document.getElementById("total-price") as HTMLBaseElement;
  totalPriceEl.innerHTML = totalSumma + " kr";
};

// Visar alla produkter i carten och skapar en HTML element för varje produkt
const showProdsInCart = (cartProds: Product[]) => {
  let prodsContainer = document.getElementById(
    "products-container"
  ) as HTMLBaseElement;
  cartProds.map((prod: Product) => {
    let prodContainer = document.createElement("div");
    prodContainer.id = `product-${prod.id}`;
    prodContainer.innerHTML = `<h3 id="heading-prod1" class="proditem">${
      prod.category
    }</h3>
    <div class="product proditem" id="prod1">
        <img src="${prod.main_img}"/>
        <div class="product-info">
            <div class="product-specifics">
                <p>${prod.description}</p>
                <p><span id="${prod.id}-price" class="price">${
      prod.discount
    }:-</span> <span class="discounted-prod-price">${Math.round(
      prod.discount * 0.1
    )}</span></p>
            </div>
            <div class="qty-container">
                <i id="${
                  prod.id
                }-qty-minus" class="qtybutton fas fa-solid fa-minus"></i>
                <b class="qty" id="qty-${prod.id}">${prod.qty}</b>
                <i id="${
                  prod.id
                }-qty-plus"  class="qtybutton fas fa-solid fa-plus"></i>
            </div>
        </div>
    </div>
    <hr class="proditem">`;
    prodsContainer.prepend(prodContainer);
  });

  let trashEl = document.getElementById("trash-container") as HTMLBaseElement;

  trashEl.style.display = "flex";
  // Visa priserna i carten
  showPricesInCart();
  // Lyssna på klick event för att uppdatera prod.qtys i carten
  setTimeout(() => {
    let allQtyButtons = document.getElementsByClassName(
      "qtybutton"
    ) as HTMLCollectionOf<HTMLBaseElement>;
    Array.from(allQtyButtons).map((but: HTMLBaseElement) => {
      but.addEventListener("click", (e) => {
        if (e.target instanceof HTMLElement) {
          let prodId = e.target.id.slice(0, e.target.id.indexOf("-"));
          let action = e.target.id.slice(e.target.id.lastIndexOf("-") + 1);
          changeQty(Number(prodId), action);
        }

        // Funktionen från den andra filen för att uppdatera
        // total-qtys-in-cart
        sumQtysInCart();
      });
    });
  }, 2000);
};

// Visar tom carts meddelande och bild
const showEmptyCart = () => {
  let cartContainer = document.getElementById(
    "products-container"
  ) as HTMLBaseElement;
  let emptyCartMsg = document.createElement("div");
  emptyCartMsg.id = "empty-cart-msg";

  emptyCartMsg.innerHTML = `<img src="/assets/tom-varukorg.png">
                      <h3>Oj, din varukorg ar tom.</h3>
                      <p id="under-msg-empty-cart">Borja handla, sa kommer varukorgen borja fyllas upp har</p>
                      `;

  cartContainer.innerHTML = "";
  cartContainer.prepend(emptyCartMsg);
  let trashEl = document.getElementById("trash-container") as HTMLBaseElement;
  trashEl.style.display = "none";
};

// Ändrar synlighet för carten när man klickar
const toggleCart = () => {
  let cartEL = document.getElementById("cart") as HTMLBaseElement;
  if (cartEL && cartEL.style.display == "none") {
    cartEL.style.display = "block";
    if (cartProds.length > 0) {
      showProdsInCart(cartProds);
      let emptyCartMsgEl = document.getElementById(
        "empty-cart-msg"
      ) as HTMLBaseElement;
      if (emptyCartMsgEl) {
        emptyCartMsgEl.remove();
      }
    } else {
      showEmptyCart();
    }
  } else {
    cartEL.style.display = "none";
    let allCartProds = document.getElementsByClassName(
      "proditem"
    ) as HTMLCollection;
    if (allCartProds.length > 0) {
      Array.from(allCartProds).map((cartElement) => {
        cartElement.remove();
      });
    }
  }
};

// Event listeners för att toggla carten
let varukorgBildEl = document.getElementById(
  "varukorg-bild"
) as HTMLBaseElement;
varukorgBildEl.addEventListener("click", () => {
  toggleCart();
});

let forsattHandlaEl = document.getElementById(
  "Fortsatt-handla"
) as HTMLBaseElement;
forsattHandlaEl.addEventListener("click", () => {
  toggleCart();
});

// Ändrar value på inputen för den valda produkten
const changeProdQty = (id: number, action: "plus" | "minus") => {
  if (document.getElementById(`${id}-qty`)) {
    let prodQtyEl = document.getElementById(`${id}-qty`) as HTMLInputElement;
    let prodQty = Number(prodQtyEl.value);
    if (action == "plus") {
      prodQty = prodQty + 1;
    } else {
      if (prodQty == 0) {
        return;
      }
      prodQty = prodQty - 1;
    }
    prodQtyEl.value = prodQty.toString();
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
};

// Från alla produktern i db uppvisar en card
const showProds = (data: { veckans: Product[] }) => {
  // alert("Prods showing");
  let prodContainer = document.getElementById("prodCat1") as HTMLBaseElement;

  for (let i = 0; i < data.veckans.length; i++) {
    let prodEl = document.createElement("div");
    prodEl.classList.add("product__list_single");

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
                                <div id="${
                                  data.veckans[i].id
                                }-controls-container" class="product__card_controls">
                                <button id="${
                                  data.veckans[i].id
                                }-minus" class="product__card_quantity_button button--primary">
                                    <i id="${
                                      data.veckans[i].id
                                    }-icon-minus" class="fa-solid fa-minus"></i>
                                </button>
                                <input id="${
                                  data.veckans[i].id
                                }-qty" type="text" value=${
      data.veckans[i].qty
    } class="quantity__input" max="99">    
                                <button id="${
                                  data.veckans[i].id
                                }-plus" class="product__card_quantity_button button--primary">
                                        <i id="${
                                          data.veckans[i].id
                                        }-icon-plus" class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

    prodContainer.append(prodEl);
  }
  // Event listeners på produkterna för att kunna ändra qtys och lägga till i carten
  setTimeout(() => {
    let allQtyButtons = document.getElementsByClassName(
      "product__card_quantity_button"
    );

    Array.from(allQtyButtons).map((but) => {
      console.log(but);
      but.addEventListener("click", (e) => {
        if (e.target instanceof HTMLElement) {
          if (e.target.id.slice(e.target.id.lastIndexOf("-") + 1) == "plus") {
            addToCart(
              Number(e.target.id.slice(0, e.target.id.indexOf("-"))),
              "plus"
            );
            changeProdQty(
              Number(e.target.id.slice(0, e.target.id.indexOf("-"))),
              "plus"
            );
          } else {
            addToCart(
              Number(e.target.id.slice(0, e.target.id.indexOf("-"))),
              "minus"
            );
            changeProdQty(
              Number(e.target.id.slice(0, e.target.id.indexOf("-"))),
              "minus"
            );
          }
        }
      });
    });
  }, 3000);
};

// Uppdaterar total antal prods i carten och antal prods symbolen
const sumQtysInCart = () => {
  let allCartprodsQtys = 0;

  let rawPrice = 0;
  let transportPrice = 0;
  let totalSumma = 0;
  if (cartProds && cartProds.length > 0) {
    let prodPrice = 0;
    cartProds.map((prod: Product) => {
      allCartprodsQtys += prod.qty;
      prodPrice = prod.discount * prod.qty;
      rawPrice += prodPrice;
    });
    transportPrice = rawPrice * 0.1;
    transportPrice = Math.round(transportPrice);
    totalSumma = Number(totalSumma);
    totalSumma = Number(rawPrice) + Math.round(transportPrice);
    totalSumma = Number(totalSumma.toFixed(0));
  }

  // OM det inte finns produkter i carten vill jag visa
  // den tomma varukorg symbolen
  if (totalSumma == 0) {
    let cartPriceEl = document.getElementById("cart-price") as HTMLBaseElement;
    cartPriceEl.style.display = "none";
    let varukorgEl = document.getElementById(
      "varukorg-i-header"
    ) as HTMLBaseElement;
    varukorgEl.style.display = "flex";
    let totalCartQtyEl = document.getElementById(
      "total-qty-in-cart"
    ) as HTMLBaseElement;
    totalCartQtyEl.style.display = "none";
  }
  // ANNARS visar jag den totala summan i varukorg elementet + antal varor
  else {
    let cartPriceEl = document.getElementById("cart-price") as HTMLBaseElement;
    cartPriceEl.style.display = "flex";
    let varukorgEl = document.getElementById(
      "varukorg-i-header"
    ) as HTMLBaseElement;
    varukorgEl.style.display = "none";
    cartPriceEl.innerHTML = totalSumma + ":-";
    cartPriceEl.addEventListener("click", toggleCart);
    let totalPriceEl = document.createElement("span") as HTMLBaseElement;
    totalPriceEl.innerHTML = allCartprodsQtys.toString();
    totalPriceEl.id = "total-qty-in-cart";
    cartPriceEl.append(totalPriceEl);
  }
};

// Lägger till produkt i carten och uppdaterar cart_product i localStorage
const addToCart = (i: number, action: "plus" | "minus") => {
  // alert("Adding working");
  if (cartProds) {
    let prodInCart: Product[] = cartProds.filter(
      (cartProd: Product) => cartProd.id == i
    );
    if (prodInCart.length > 0) {
      if (action == "plus") {
        prodInCart[0].qty += 1;
      } else {
        prodInCart[0].qty -= 1;
      }
      if (prodInCart[0].qty == 0) {
        cartProds.splice(cartProds.indexOf(prodInCart[0]), 1);
      }
    } else if (action == "plus") {
      allProds.veckans.map((prod, ind) => {
        if (ind == i) {
          prod.qty += 1;
          cartProds.push(prod);
        }
      });
    }
  } else if (action == "plus") {
    allProds.veckans.map((prod, ind) => {
      if (ind == i) {
        cartProds.push(prod);
      }
    });
  }
  sumQtysInCart();
};

sumQtysInCart();

export {};