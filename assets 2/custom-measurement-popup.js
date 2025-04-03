class CustomMeasurementPopup extends HTMLElement {
    constructor() {
        super()
        this.selectMeasurementBtns  = this.querySelectorAll('[js-custom-measurement-select-btn]')
        this.selectMeasurementBtns.forEach((buttons_, index) => {
            buttons_.setAttribute('data-index', index)
            buttons_.addEventListener('click', () => {
                this.openModalHandler(buttons_)
            })
        })
    }
    openModalHandler(buttons_) {
        const modalName = buttons_.dataset.modalName
        const hyphenatedModalName = modalName.replace(/([a-z])([A-Z])/g, '$1-$2');
        this.querySelector(`[data-popup-modal-option-name='${hyphenatedModalName}']`).classList.remove('hide')
    }
    connectedCallback() {}

}

customElements.define('custom-measurement-popup', CustomMeasurementPopup)