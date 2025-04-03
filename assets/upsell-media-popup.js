class UpsellMediaPopup extends HTMLElement {
    static observedAttributes = ['opened']
    constructor() {
        super()
    }

    connectedCallback() {
        this.selectors = {
            pdpContainer        : '[js-alternate-custom-pdp]',
            mediaModalContainer : '[js-media-popup-container]',
            dataButton          : '[js-media-popup-btn]',
            popupModal          : '[js-media-popup-modal]',
            overlay             : '[js-media-popup-overlay]',
            closeBtn            : '[js-close-btn]'
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
        if(button_.dataset.mediaUrl) {
            this.popupModal.classList.remove('hide')
            this.overlay.classList.remove('hide')
            const mediaUrl  = button_.dataset.mediaUrl
            if(mediaUrl) {
                const video = this.popupModal.querySelector('video')
                video.setAttribute('src', mediaUrl)
                video.classList.remove('hide')
                video.play()
            }
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

customElements.define('upsell-media-popup', UpsellMediaPopup)