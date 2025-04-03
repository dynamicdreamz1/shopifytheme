class CrossSell extends HTMLElement {
    constructor() {
      super();
      this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      this.slider;
      this.productForms = this.querySelectorAll("[js-atc-form]");
      this.allSelectOptionDrops = this.querySelectorAll('[js-cross-sell-option]')

      this.init();
    }
  
    init() {
        this.initSlider();
        window.addEventListener('resize', this.initSlider.bind(this));
        
  
        this.allSelectOptionDrops.forEach(select_ => {
            select_.addEventListener('change', () => {
                this.handleOptionChange(select_)
            })
        })
      //   this.productForms.forEach( form => form.addEventListener("submit", this.onSubmitHandler.bind(this)));
  
    }
    handleOptionChange(select_) {
        const form_ = select_.closest('form')
        const button = form_.querySelector('button[name="add"]')
        const buttonText = button.querySelector('span')
        const priceText = button.querySelector('[js-pdp-original-price]')
        const selectedOption = select_[select_.selectedIndex]
        const available = selectedOption.dataset.optionAvailable
        const price = selectedOption.dataset.variantPrice

        if(available === 'true') {
            buttonText.textContent = `Add To Bag`
            priceText.textContent = price
            button.removeAttribute('disabled')
        } else {
            buttonText.textContent = 'Sold Out'
            priceText.textContent = price
            button.setAttribute('disabled', '')
        }
    }
    initSlider() {
        if(window.innerWidth >= 0) {
            this.slider?.destroy();
            this.slider = new Swiper('[js-cross-sell-slider]', {
                loop: false,
                grabCursor: false,
                spaceBetween: 20,
                slidesPerGroup: 1,
                slidesPerView: "auto",
                watchSlidesProgress: true,
                draggable:!0,
                autoHeight:!1,
                watchOverflow:!0,
                threshold:10,
                mousewheel:{
                  forceToAxis:!0
                },
                navigation: {
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                },
                breakpoints: {
                    360: {
                        spaceBetween: 15
                    },
                    749: {
                        spaceBetween: 15
                    },
                    990: {
                        spaceBetween: 15
                    },
                    1220: {
                        spaceBetween: 20
                    }
                }
            });
        }else {
            this.slider?.destroy();
        }
    }
  

  }
  
  customElements.define('cross-sell', CrossSell);