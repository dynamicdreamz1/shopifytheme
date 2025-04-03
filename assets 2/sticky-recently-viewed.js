class StickyRecentlyViewed extends HTMLElement {
    constructor() {
      super();
     
      this.rwBtn = this.querySelector("[js-rw-btn]");
      this.drawerItems = this.querySelector("[js-drawer-items]");

      this.init();
    }

    init() {
        this.rwBtn.addEventListener("click", this.toggleDrawer.bind(this));
        document.addEventListener("DOMContentLoaded", this.getRecentlyViewedProducts.bind(this));
    }

    toggleDrawer() {
        this.classList.toggle("is-open")
    }

    getRecentlyViewedProducts() {
        const productData = JSON.parse(localStorage.getItem("recentlyViewedProduct"));
        if(!productData?.length) return;

        productData.map(product => {
            const productHtml = `
                <a href="${product.productUrl}" class="product-item">
                    <div class="product__img">
                        <img src="${product.productImg}" alt="${product.productTitle}">
                    </div>
                    <div class="product-details">
                        <h3 class="product-title">${product.productTitle}</h3>
                        <span class="product-price">${product.productPrice}</span>
                    </div>
                </a>
            `;

            this.drawerItems.insertAdjacentHTML("beforeend", productHtml)
        });
        this.classList.remove("locked")
    }
}
  
customElements.define('sticky-recently-viewed', StickyRecentlyViewed);