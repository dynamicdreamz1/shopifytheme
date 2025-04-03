class ProductShareButton extends HTMLElement {
    constructor() {
        super()

        this.modal      = this.querySelector('[js-product-share-popup]')
        this.overlay    = this.querySelector('[js-product-share-overlay]')
        this.openBtn    = this.querySelector('[js-modal-open-btn]')
        this.closeBtn   = this.querySelector('[js-close-btn]')

        this.openBtn.addEventListener('click', () => {
            this.openModal()
        })

        this.overlay.addEventListener('click', () => {
            this.closeModal()
        })

        this.closeBtn.addEventListener('click', () => {
            this.closeModal()
        })
    }

    openModal() {
        this.modal.classList.remove('hide')
    }

    closeModal() {
        this.modal.classList.add('hide')
    }
}

customElements.define('product-share-button', ProductShareButton)