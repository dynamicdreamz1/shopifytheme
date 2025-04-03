
class CartUpsell extends HTMLElement {
    constructor() {
      super();
      this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      this.slider;
      this.productForms = this.querySelectorAll("[js-atc-form]");
      this.allSelectOptionDrops = this.querySelectorAll('[js-upsell-option]')
      this.init();
    }
  
    init() {
     
        this.initSlider();

        this.allSelectOptionDrops.forEach(select_ => {
            select_.addEventListener('change', () => {
                this.handleOptionChange(select_)
            })
        })
        window.StampedFn?.reloadUGC(); 

     
      if(typeof upsellDeliver != undefined) {
        document.addEventListener('DOMContentLoaded', () => {
            upsellDeliver();
        })
      }
        
    }
  
    initSlider() {
      
        this.slider = new Swiper('[js-upsell-slider]', {
            loop: false,
            grabCursor: true,
            spaceBetween: 12,
            freeMode: true,
            slidesPerView: "auto",
            watchSlidesProgress: true,
            draggable:!0,
            autoHeight:!1,
            watchOverflow:!0,
            threshold:10,
            mousewheel:{
                forceToAxis:!0
            }
        });
    }
    
    handleOptionChange(select_) {
        const form_ = select_.closest('form')
        const priceContent = form_.querySelector('[js-cart-uspell-product-price]')
        const button = form_.querySelector('button[name="add"]')
        const buttonText = button.querySelector('span')
        const selectedOption = select_[select_.selectedIndex]
        const available = selectedOption.dataset.optionAvailable
        const price_ = selectedOption.dataset.optionPrice

        if(available === 'true') {
            buttonText.textContent = 'Add To Bag'
            button.removeAttribute('disabled')
        } else {
            buttonText.textContent = 'Sold Out'
            button.setAttribute('disabled', '')
        }
        if(priceContent && price_) {
          priceContent.textContent = price_
        }
    }

}
  
customElements.define('cart-upsell', CartUpsell);