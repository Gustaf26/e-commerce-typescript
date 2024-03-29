var _a;
var allProds;
var cartProds = [];
var searchProds = [];
var totalSumma = 0;
var cartShowing = false;
(_a = document.getElementById("search-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function (e) {
    var inputEL = document.getElementById("search-input");
    if (inputEL.value.length > 0) {
        searchProdsFunction(inputEL.value);
    }
    else {
        emptyProds();
        showProds(allProds);
    }
});
// Function för att tömma produkterna
function emptyProds() {
    var prodsContainer = document.getElementById("prodCat1");
    prodsContainer.innerHTML = "";
}
// Search products function
function searchProdsFunction(val) {
    emptyProds();
    allProds.map(function (prod) {
        if (prod.category.toLowerCase().includes(val.toLowerCase()) ||
            prod.description.toLowerCase().includes(val.toLowerCase()) ||
            prod.brand.toLowerCase().includes(val.toLowerCase()) ||
            prod.title.toLowerCase().includes(val.toLowerCase())) {
            searchProds.push(prod);
        }
    });
    showProds(searchProds);
    searchProds = [];
}
// To show the options for the Kategorier select element
var showCategories = function (prods) {
    var _a;
    var prodCats = [];
    // Get unique categories from prods
    prods.forEach(function (prod) {
        prod.category =
            prod.category.charAt(0).toUpperCase() + prod.category.slice(1);
        if (!prodCats.includes(prod.category)) {
            prodCats.push(prod.category);
        }
    });
    // Create an <li> for each category
    prodCats.forEach(function (cat) {
        var _a;
        var catEL = document.createElement("li");
        catEL.innerHTML = cat;
        catEL.classList.add("category");
        catEL.style.display = "none";
        (_a = document.getElementById("kategorier")) === null || _a === void 0 ? void 0 : _a.append(catEL);
    });
    var catsListEl = document.getElementById("kategorier");
    // Append elements created and event listeners
    (_a = document
        .getElementById("list-kategorier")) === null || _a === void 0 ? void 0 : _a.addEventListener("mouseover", function (e) {
        catsListEl.style.display = "flex";
    });
    var allCats = document.getElementsByClassName("category");
    Array.from(allCats).map(function (cat) {
        cat.style.display = "block";
        cat.addEventListener("click", function (e) {
            if (e.target instanceof HTMLLIElement) {
                searchProdsFunction(e.target.innerHTML);
            }
        });
    });
    catsListEl.addEventListener("mouseout", function (e) {
        catsListEl.style.display = "none";
    });
};
// Hämtar produkterna från db
var getProds = function () {
    fetch("https://dummyjson.com/products")
        .then(function (res) {
        return res.json().then(function (res) {
            allProds = res.products;
            allProds.forEach(function (prod) { return (prod.qty = 0); });
            showProds(allProds);
            showCategories(allProds);
        });
    })["catch"](function (err) { return console.log(err); });
};
getProds();
// CART FUNCTIONS
var emptyCart = function () {
    cartProds = [];
    // Visar empty cart meddelande
    showEmptyCart();
    // Uppdaterar varukorg i header element
    var cardPriceEl = document.getElementById("cart-price");
    cardPriceEl.style.display = "none";
    var varuKorgEl = document.getElementById("varukorg-i-header");
    varuKorgEl.style.display = "flex";
    var totalQTyEl = document.getElementById("total-qty-in-cart");
    totalQTyEl.style.display = "none";
    // Uppdaterar pris i varukorg i header
    showPricesInCart();
    // Nollställa alla produkters inputs
    allProds.map(function (prod) {
        if (document.getElementById("".concat(prod.id, "-qty"))) {
            var qtyEl = document.getElementById("".concat(prod.id, "-qty"));
            var qtyNumber = 0;
            prod.qty = 0;
            qtyEl.value = qtyNumber.toString();
        }
    });
};
// Funktion för att visa total antal produkter i carten
var otherSumQtysInCart = function () {
    var allCartprodsQtys = 0;
    if (cartProds.length > 0) {
        cartProds.map(function (prod) {
            allCartprodsQtys += prod.qty;
        });
    }
    else {
        // Visar tom carts meddelande om cartProds == 0
        showEmptyCart();
    }
    var totalQTyInCartEl = document.getElementById("total-qty-in-cart");
    totalQTyInCartEl.innerHTML = allCartprodsQtys.toString();
};
// Denna ändrar produkternas qty i carten och även på sidan
var changeQty = function (id, action) {
    var chosenProd;
    if (cartProds && cartProds.length > 0) {
        chosenProd = cartProds.filter(function (cartProd) { return cartProd.id == id; });
        if (chosenProd && action == "plus") {
            chosenProd[0].qty += 1;
        }
        else if (chosenProd && action == "minus") {
            chosenProd[0].qty -= 1;
        }
        cartProds.map(function (cartProd, ind) {
            if (cartProd.id == chosenProd[0].id) {
                cartProd = chosenProd[0];
                if (cartProd.qty == 0) {
                    var productEL = document.getElementById("product-".concat(cartProd.id));
                    productEL.remove();
                    cartProds.splice(ind, 1);
                    var prodQtyEl = document.getElementById("".concat(id, "-qty"));
                    if (prodQtyEl) {
                        prodQtyEl.value = "0";
                    }
                }
                else {
                    var prodQtyEl = document.getElementById("qty-".concat(id));
                    prodQtyEl.innerHTML = chosenProd[0].qty.toString();
                    var otherProdQtyEl = document.getElementById("".concat(id, "-qty"));
                    if (otherProdQtyEl) {
                        otherProdQtyEl.value = chosenProd[0].qty.toString();
                    }
                }
            }
        });
        // Uppdaterar även allProds med den valda produktens qty
        allProds.map(function (prod, ind) {
            if (prod.id == chosenProd[0].id) {
                prod.qty = chosenProd[0].qty;
            }
        });
    }
    // Uppdaterar antal produkter i carten + priserna nedan i carten
    otherSumQtysInCart();
    showPricesInCart();
};
// Updaterar priserna nedan i carten
var showPricesInCart = function () {
    var totalSumma = 0;
    var rawPrice = 0;
    var transportPrice = 0;
    cartProds.map(function (prod) {
        var prodPrice = prod.price * prod.qty;
        rawPrice += prodPrice;
    });
    transportPrice = rawPrice * 0.1;
    transportPrice = Math.round(transportPrice);
    totalSumma = Number(totalSumma);
    totalSumma = Number(rawPrice) + Math.round(transportPrice);
    totalSumma = Number(totalSumma.toFixed(2));
    var prelPriceEl = document.getElementById("prel-price");
    prelPriceEl.innerHTML = rawPrice + " kr";
    var transPriceEl = document.getElementById("transport-price");
    transPriceEl.innerHTML = transportPrice + " kr";
    var totalPriceEl = document.getElementById("total-price");
    totalPriceEl.innerHTML = totalSumma + " kr";
};
// Visar alla produkter i carten och skapar en HTML element för varje produkt
var showProdsInCart = function (cartProds) {
    // We empty the eventual msg of empty cart
    var emptyCartEl = document.getElementById("empty-cart-msg");
    if (emptyCartEl) {
        emptyCartEl.remove();
    }
    var prodsContainer = document.getElementById("products-container");
    var goToCheckoutEl = document.getElementById("go-to-checkout");
    goToCheckoutEl.style.display = "block";
    cartProds.map(function (prod) {
        if (!document.getElementById("product-".concat(prod.id))) {
            var prodContainer = document.createElement("div");
            prodContainer.id = "product-".concat(prod.id);
            prodContainer.className = "proditem";
            prodContainer.innerHTML = "<h3 id=\"heading-prod1\" class=\"proditem\">".concat(prod.category, "</h3>\n    <div class=\"product proditem\" id=\"prod1\">\n        <img src=\"").concat(prod.thumbnail, "\"/>\n        <div class=\"product-info\">\n            <div class=\"product-specifics\">\n                <p>").concat(prod.title, "</p>\n                <p><span id=\"").concat(prod.id, "-price\" class=\"price\">").concat(prod.price, ":-</span> <span class=\"discounted-prod-price\">").concat(Math.round(prod.discountPercentage), "</span></p>\n            </div>\n            <div class=\"qty-container\">\n                <i id=\"").concat(prod.id, "-qty-minus\" class=\"qtybutton fas fa-solid fa-minus\"></i>\n                <b class=\"qty\" id=\"qty-").concat(prod.id, "\">").concat(prod.qty, "</b>\n                <i id=\"").concat(prod.id, "-qty-plus\"  class=\"qtybutton fas fa-solid fa-plus\"></i>\n            </div>\n        </div>\n    </div>\n    <hr class=\"proditem\">");
            prodsContainer.prepend(prodContainer);
        }
    });
    var trashEl = document.getElementById("trash-container");
    trashEl.style.display = "flex";
    // Visa priserna i carten
    showPricesInCart();
    // Lyssna på klick event för att uppdatera prod.qtys i carten
    setTimeout(function () {
        var allQtyButtons = document.getElementsByClassName("qtybutton");
        Array.from(allQtyButtons).map(function (but) {
            but.addEventListener("click", function (e) {
                if (e.target instanceof HTMLElement) {
                    var prodId = e.target.id.slice(0, e.target.id.indexOf("-"));
                    var action = e.target.id.slice(e.target.id.lastIndexOf("-") + 1);
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
var showEmptyCart = function () {
    var cartContainer = document.getElementById("products-container");
    var emptyCartMsg = document.createElement("div");
    emptyCartMsg.id = "empty-cart-msg";
    emptyCartMsg.innerHTML = "<img src=\"/assets/tomvarukorg.png\">\n                      <h3>Oj, din varukorg ar tom.</h3>\n                      <p id=\"under-msg-empty-cart\">Borja handla, sa kommer varukorgen borja fyllas upp har</p>\n                      ";
    cartContainer.innerHTML = "";
    cartContainer.prepend(emptyCartMsg);
    var trashEl = document.getElementById("trash-container");
    trashEl.style.display = "none";
    var goToCheckoutEl = document.getElementById("go-to-checkout");
    goToCheckoutEl.style.display = "none";
};
// Ändrar synlighet för carten när man klickar
var toggleCart = function () {
    var cartEL = document.getElementById("cart");
    if (cartEL && cartEL.style.display == "none") {
        cartEL.style.display = "block";
        cartShowing = true;
        if (cartProds.length > 0) {
            showProdsInCart(cartProds);
            var emptyCartMsgEl = document.getElementById("empty-cart-msg");
            if (emptyCartMsgEl) {
                emptyCartMsgEl.remove();
            }
        }
        else {
            showEmptyCart();
        }
    }
    else {
        cartEL.style.display = "none";
        cartShowing = false;
        var allCartProds = document.getElementsByClassName("proditem");
        if (allCartProds.length > 0) {
            Array.from(allCartProds).map(function (cartElement) {
                cartElement.remove();
            });
        }
    }
};
// Event listeners för att toggla carten
var varukorgBildEl = document.getElementById("varukorg-bild");
varukorgBildEl.addEventListener("click", function () {
    toggleCart();
});
var forsattHandlaEl = document.getElementById("Fortsatt-handla");
forsattHandlaEl.addEventListener("click", function () {
    toggleCart();
});
// Ändrar value på inputen för den valda produkten
var changeProdQty = function (id, action) {
    var prodQty;
    if (document.getElementById("".concat(id, "-qty"))) {
        var prodQtyEl = document.getElementById("".concat(id, "-qty"));
        prodQty = Number(prodQtyEl.value);
        if (action == "plus") {
            prodQty = prodQty + 1;
        }
        else {
            if (prodQty == 0) {
                return;
            }
            prodQty = prodQty - 1;
        }
        prodQtyEl.value = prodQty.toString();
    }
    // Update cart element and qty if product is in cart as well
    if (document.getElementById("qty-".concat(id))) {
        var prodQtyEl = document.getElementById("qty-".concat(id));
        prodQtyEl.innerHTML = prodQty.toString();
        if (prodQty == 0) {
            var productEL = document.getElementById("product-".concat(id));
            productEL.remove();
        }
        // Map through the elements in cart to update qty in global variable
        cartProds.map(function (prod, ind) {
            if (prod.id == id) {
                prod.qty = prodQty;
                if (prodQty == 0) {
                    cartProds.splice(ind, 1);
                }
            }
        });
        showPricesInCart();
        if (cartProds.length == 0) {
            showEmptyCart();
        }
    }
    else if (cartShowing == true) {
        // Product can be added to the open cart from the page as well
        // even if not existing
        showProdsInCart(cartProds);
    }
};
// Från alla produktern i db uppvisar en card
var showProds = function (data) {
    // alert("Prods showing");
    var prodContainer = document.getElementById("prodCat1");
    for (var i = 0; i < data.length; i++) {
        var prodEl = document.createElement("div");
        prodEl.classList.add("product__list_single");
        prodEl.innerHTML = "\n            <div class=\"product__card\">\n                <div class=\"product__card_splash \">\n                    <div class=\"product__card_splash_inner product-overlay\">\n                        <span>".concat(data[i].price.toFixed(0), ":-</span>\n                    </div>\n                </div>\n                <div class=\"product__card_image\">\n                    \n                    <figure>\n                        <img src=").concat(data[i].thumbnail, " alt=\"Taco kryddmix\" />\n                    </figure>\n                </div>\n                <div class=\"product__card_content\">\n                    <div class=\"product__card_brand\">\n                        <a href=\"#\" class=\"product__card_brand_value\">\n                            <span>").concat(data[i].brand, "</span>\n                        </a>\n                    </div>\n                    <div class=\"product__card_title_holder\">\n                        <span>").concat(data[i].title, "</span>\n                    </div>\n                    <div class=\"product__card_subtitle\">\n                        <div class=\"product__card_origin\">\n                            <span class=\"aria-label\">").concat(data[i].category, "</span>\n                        </div>\n                    </div>\n                    <div class=\"product__card_bottom\">\n                        <div class=\"product__card_price\">\n                            <span class=\"price price__discount\">").concat(data[i].price, ":-</span>\n                            <span class=\"price__compare\"> ").concat(data[i].stock, " st kvar</span>\n                            <div class=\"divider\"></div>\n                            <span class=\"price_orginal\">").concat(data[i].discountPercentage, "</span>\n                        </div>\n                        <div class=\"product__card_quantity\">\n                            <div class=\"product__card_quantity_inner \">\n                                <div id=\"").concat(data[i].id, "-controls-container\" class=\"product__card_controls\">\n                                <button id=\"").concat(data[i].id, "-minus\" class=\"product__card_quantity_button button--primary\">\n                                    <i id=\"").concat(data[i].id, "-icon-minus\" class=\"fa-solid fa-minus\"></i>\n                                </button>\n                                <input id=\"").concat(data[i].id, "-qty\" type=\"text\" value=").concat(data[i].qty, " class=\"quantity__input\" max=\"99\">    \n                                <button id=\"").concat(data[i].id, "-plus\" class=\"product__card_quantity_button button--primary\">\n                                        <i id=\"").concat(data[i].id, "-icon-plus\" class=\"fa-solid fa-plus\"></i>\n                                    </button>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>");
        prodContainer.append(prodEl);
    }
    // Event listeners på produkterna för att kunna ändra qtys och lägga till i carten
    setTimeout(function () {
        var allQtyButtons = document.getElementsByClassName("product__card_quantity_button");
        Array.from(allQtyButtons).map(function (but) {
            but.addEventListener("click", function (e) {
                if (e.target instanceof HTMLElement) {
                    if (e.target.id.slice(e.target.id.lastIndexOf("-") + 1) == "plus") {
                        addToCart(Number(e.target.id.slice(0, e.target.id.indexOf("-"))), "plus");
                        changeProdQty(Number(e.target.id.slice(0, e.target.id.indexOf("-"))), "plus");
                    }
                    else {
                        addToCart(Number(e.target.id.slice(0, e.target.id.indexOf("-"))), "minus");
                        changeProdQty(Number(e.target.id.slice(0, e.target.id.indexOf("-"))), "minus");
                    }
                }
            });
        });
    }, 3000);
};
// Uppdaterar total antal prods i carten och antal prods symbolen
var sumQtysInCart = function () {
    var allCartprodsQtys = 0;
    var rawPrice = 0;
    var transportPrice = 0;
    var totalSumma = 0;
    if (cartProds && cartProds.length > 0) {
        var prodPrice_1 = 0;
        cartProds.map(function (prod) {
            allCartprodsQtys += prod.qty;
            prodPrice_1 = prod.price * prod.qty;
            rawPrice += prodPrice_1;
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
        var cartPriceEl = document.getElementById("cart-price");
        cartPriceEl.style.display = "none";
        var varukorgEl = document.getElementById("varukorg-i-header");
        varukorgEl.style.display = "flex";
        var totalCartQtyEl = document.getElementById("total-qty-in-cart");
        totalCartQtyEl.style.display = "none";
    }
    // ANNARS visar jag den totala summan i varukorg elementet + antal varor
    else {
        var cartPriceEl = document.getElementById("cart-price");
        cartPriceEl.style.display = "flex";
        var varukorgEl = document.getElementById("varukorg-i-header");
        varukorgEl.style.display = "none";
        cartPriceEl.innerHTML = totalSumma + ":-";
        cartPriceEl.addEventListener("click", toggleCart);
        var totalPriceEl = document.createElement("span");
        totalPriceEl.innerHTML = allCartprodsQtys.toString();
        totalPriceEl.id = "total-qty-in-cart";
        cartPriceEl.append(totalPriceEl);
    }
};
// Lägger till produkt i carten och uppdaterar cart_product
var addToCart = function (i, action) {
    if (cartProds) {
        var prodInCart = cartProds.filter(function (cartProd) { return cartProd.id == i; });
        // Change prod qty if prod in cart
        if (prodInCart.length > 0) {
            if (action == "plus") {
                prodInCart[0].qty += 1;
            }
            else {
                prodInCart[0].qty -= 1;
            }
            // Remove prod from cart if qty == 0
            if (prodInCart[0].qty == 0) {
                cartProds.splice(cartProds.indexOf(prodInCart[0]), 1);
            }
            // Add prod to cart if not existing there
        }
        else if (action == "plus") {
            allProds.map(function (prod, ind) {
                if (prod.id == i) {
                    prod.qty += 1;
                    cartProds.push(prod);
                }
            });
        }
        // Add first prod to cart
    }
    else if (action == "plus") {
        allProds.map(function (prod, ind) {
            if (prod.id == i) {
                cartProds.push(prod);
            }
        });
    }
    sumQtysInCart();
};
sumQtysInCart();
