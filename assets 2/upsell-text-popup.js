class UpsellTextPopup extends HTMLElement {
    static observedAttributes = ['opened']
    constructor() {
        super()
    }

    connectedCallback() {
      
        this.selectors = {
            pdpContainer        : '[js-alternate-custom-pdp]',
            mediaModalContainer : '[js-text-popup-container]',
            dataButton          : '[js-text-popup-btn]',
            popupModal          : '[js-text-popup-modal]',
            overlay             : '[js-text-popup-overlay]',
            closeBtn            : '[js-text-popup-close-btn]'
        }
      
        this.measurementButtons = this.querySelectorAll(this.selectors.dataButton)
        this.popupModal         = this.querySelector(this.selectors.mediaModalContainer)
        this.overlay            = this.querySelector(this.selectors.overlay)
        this.closeBtn           = this.querySelector(this.selectors.closeBtn)
        

        this.measurementButtons.forEach(button_ => {
            button_.addEventListener('click', () => {
                this.openModal(button_)
            })
        })

        this.overlay.addEventListener('click', () => {
            this.closeModal()
        })
        this.closeBtn.addEventListener('click', () => {
            this.closeModal()
        })
    }
    openModal(button_) {
        if(button_) {
            this.popupModal.classList.remove('hide')
            this.overlay.classList.remove('hide')
        }
    }
    closeModal() {
        this.popupModal.classList.add('hide')
        const video = this.popupModal.querySelector('video')
        video.setAttribute('src', '')
        video.classList.add('hide')
    }
    outsideElementClick(component_, e) {}
    disconnectedCallback() {}
    attributeChangedCallback(attrName, oldVal, newVal){}
}

customElements.define('upsell-text-popup', UpsellTextPopup)