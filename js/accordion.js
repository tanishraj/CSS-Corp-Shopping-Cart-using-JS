// Function for creating custom accordion
(function customAccordion() {
    var acc = $(".accordion");
    var i;
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            var panel = this.nextElementSibling;
            for (let j = 0; j < acc.length; j++) {
                acc[j].classList.remove('active');
                editSelectedProducts(acc[j], 'Select +');
            }
            document.querySelectorAll('.panel').forEach(item => {
                if (item != panel)
                    item.style.maxHeight = null;
            })
            this.classList.add("active");
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                this.classList.remove("active");
                editSelectedProducts(this, 'Select +');
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                editSelectedProducts(this, 'close x');
            }
        });
    }
})();

function editSelectedProducts(params, params2) {
    if ($(params).find('.product-description')[0].innerHTML === "")
        $(params).find('.access-button').text(params2);
    else
        $(params).find('.access-button').text('Edit +');
}

function preapareDOM(data) {
    let productHTML = `
    <div class="carousel-cell">
        <div class="item-description" data-product="${data.id}">
            <img src=${data.productImage} />
            <div class="other-details">
                <div class="product-name">${data.productName}</div>
                <div class="brief-descrption">${data.briefDescription}</div>
                <div class="product-rating">
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star-o"></span>
                </div>
                <div class="usage">${data.productUsage}</div>
                <div class="product-price-and-capacity">
                    <div class="price">
                        $${data.productPrice}
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    return productHTML;
}

function mergerWithContainer(innerDom) {
    let mainContainer = `
    <div class="carousel" data-flickity='{ "freeScroll": true, "wrapAround": true }'>
        ${innerDom}
    </div>
    `;
    return mainContainer;
}

function insertProducts(data) {
    let targetContainer = document.getElementById(data.categoryType);
    let finalDOM = "";
    data.allProducts.forEach(item => {
        finalDOM += preapareDOM(item);
    })
    targetContainer.innerHTML = mergerWithContainer(finalDOM);
}

(function bindEachCategory() {
    dataApi.forEach(item => {
        insertProducts(item);
    })
})();

function fetchSelectedProductData(selectedProductId, categoryType) {
    const selectedProduct = (dataApi.filter(item => item.categoryType === categoryType))[0].allProducts.filter(item => item.id === selectedProductId)
    return selectedProduct;
}

$(document).ready(() => {
    $('.cart-button').attr('disabled', 'true');

    $('.item-description').click(function () {
        const panelId = $(this).closest('.panel').attr('id');
        const unselectedProduct = $(`#${panelId}`).find('.selected').removeClass('selected');

        recentUnselectedProdcut(unselectedProduct, panelId);

        $(this).addClass('selected');

        const productId = $(this).attr('data-product');
        const productDetails = fetchSelectedProductData(productId, panelId);
        placeSelectedProductinHeader(panelId, productDetails[0]);
        updateCartPrice("addPrice", productDetails[0].productPrice);
    })
})

function placeSelectedProductinHeader(panelId, productDetails) {
    $(`#${panelId}`).prev().find('.product-image')[0].innerHTML = `<img src="${productDetails.productImage}" />`;
    $(`#${panelId}`).prev().find('.product-description')[0].innerHTML = productDetails.productName;
    let panelName = $(`#${panelId}`).prev().find('.panel-name')[0];
    panelName.style.display = 'none';
}

function recentUnselectedProdcut(unselectedProduct, panelId) {
    if (unselectedProduct.length > 0) {
        const productId = unselectedProduct[0].dataset.product;
        const productPrice = fetchSelectedProductData(productId, panelId)[0].productPrice;
        updateCartPrice('deductPrice', productPrice)
    } else {
        totalSelectedProducts();
    }
}

function totalSelectedProducts() {
    let totalSelectedProducts = $('.noOfSelectedProducts').text();
    totalSelectedProducts++;
    $('.noOfSelectedProducts').text(totalSelectedProducts);
    enableAddToCartButton(totalSelectedProducts);
}

function enableAddToCartButton(totalSelectedProducts) {
    if (totalSelectedProducts === 3) {
        $('.cart-button').removeAttr('disabled');
    } else {
        $('.cart-button').attr('disabled', 'true');
    }
}

function updateCartPrice(actionType, productPrice) {
    let totalPrice = $('.total-price').text();

    if (actionType === "deductPrice") {
        totalPrice = parseFloat(totalPrice) - parseFloat(productPrice);
    } else {
        totalPrice = parseFloat(totalPrice) + parseFloat(productPrice);
    }

    $('.total-price').text(totalPrice.toFixed(2));
}