
class UpsellProduct extends HTMLElement {
    constructor() {
        super();
  
        this.form = this.closest('form');
  
        this.upsellProductsList = []
        this.addEventListener('change', this.upsellProductHandler.bind(this), false)
        
    }
  
  
    // to add upsell product
    upsellProductHandler(evt) {
        const this_ = evt.target
  
        const checkedOption = this.form.querySelector('[js-stiched-option-name] input:checked')?.value
        const stitchReturnNote= this.querySelector('[js-stitch-return-note]')
        const stitched_ = checkedOption == "Stitched" ? true : false
  
        if(this_.type == 'checkbox' && this_.checked && this_.closest('[js-upsell-product]')) {
            let id_= this_.dataset.productId
            this.upsellProductsList.push(id_)
        } else {
            let id_ = this_.dataset.productId
            let exist = this.upsellProductsList.indexOf(id_)
            if(exist > -1) {
                this.upsellProductsList.splice(exist, 1)
            }
        }
        if(this.upsellProductsList.length) {
            this.form.setAttribute('upsell', true)
            // if(!stitched_) {
            stitchReturnNote?.classList.remove('hide')
            // } 
        }else {
            this.form.getAttribute('upsell') ? this.form.removeAttribute('upsell') : '' 
            // if(!stitched_ || !stitchReturnNote?.classList.contains('hide')) {
            stitchReturnNote?.classList.add('hide')
            // }
        }   
    }
  
  }
  
  customElements.define('upsell-product', UpsellProduct);