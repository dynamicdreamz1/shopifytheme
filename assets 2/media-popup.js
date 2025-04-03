class MediaPopup extends HTMLElement {
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
            overlay             : '[js-media-popup-overlay]'
        }

        this.measurementButtons = this.querySelectorAll(this.selectors.dataButton)
        this.popupModal         = this.querySelector(this.selectors.mediaModalContainer)
        this.overlay            = this.querySelector(this.selectors.overlay)   
        

        this.measurementButtons.forEach(button_ => {
            button_.addEventListener('click', () => {
                this.openModal(button_)
            })
        })

        this.overlay.addEventListener('click', () => {
            this.closeModal()
        })
    }
    openModal(button_) {
        
        if(button_.dataset.mediaUrl) {
            this.popupModal.classList.remove('hide')
            this.overlay.classList.remove('hide')
            const mediaType = button_.dataset.mediaType
            const mediaUrl  = button_.dataset.mediaUrl
            if(mediaType == 'video') {
                const video = this.popupModal.querySelector('video')
                video.setAttribute('src', mediaUrl)
                video.classList.remove('hide')
                video.play()
            } else {
                const image = this.popupModal.querySelector('img')
                image.setAttribute('src', mediaUrl)
                image.classList.remove('hide')
            }
        }
        
    }
    closeModal() {
        this.popupModal.classList.add('hide')
        const video = this.popupModal.querySelector('video')
        video.setAttribute('src', '')
        video.classList.add('hide')
        this.popupModal.querySelector('img').classList.add('hide')
    }
    outsideElementClick(component_, e) {
        const self = e.target
        this.modalName = component_.dataset.modalName
        
        if(self.closest(this.selectors.overlay)) {
            this.container_     = self.closest(this.selectors.pdpContainer)
            this.openedModal    = this.container_.querySelector(`${this.selectors.popupModal}[data-popup-modal="media-${this.modalName}-option"]`)
            this.overlay        = this.container_.querySelector(this.selectors.overlay)

            this.openedModal && this.openedModal.classList.add('hide')
            this.overlay && this.overlay.classList.add('hide')
            component_.setAttribute('opened', 'false')
        }
    }
    disconnectedCallback() {}
    attributeChangedCallback(attrName, oldVal, newVal){
        if(newVal == "true") {
            const cusElm = this
            document.addEventListener('click', this.outsideElementClick.bind(this, cusElm))
        } else {
            document.removeEventListener('click', this.outsideElementClick)
        }
    }
}

customElements.define('media-popup', MediaPopup)