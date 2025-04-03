document.addEventListener('DOMContentLoaded', function() {
    const selectors = {
        pdpContainer                : '[js-alternate-custom-pdp]',
        pdpCustomMeasureContainer   : '[js-pdp-custom-measurement-popup]',
        popupModal                  : '[js-pdp-select-measurement-popup]',
        inputFieldsWrap             : '[js-select-content]',
        selectMeasurementDownBtn    : '[js-popup-down-btn]',

    }

    const pdpContainer              = document.querySelector(selectors.pdpContainer)
    const customMeasurementContainer = pdpContainer.querySelector(selectors.pdpCustomMeasureContainer)
    const selectMeasurementPopups   = pdpContainer.querySelectorAll(selectors.popupModal)
    const selectMeasurementDownBtn_ = pdpContainer.querySelectorAll(selectors.selectMeasurementDownBtn)


    selectMeasurementDownBtn_.forEach((measurementPopup) => {
        measurementPopup.addEventListener('click', selectMeasurementMobileHandler)
    })
    

    selectMeasurementPopups.forEach(el_ => {
        const inputWrappers = el_.querySelectorAll(selectors.inputFieldsWrap)

        inputWrappers.forEach(inputField => {
            inputField.addEventListener('change', handleChange)
        })
    })

    function selectMeasurementMobileHandler(e) {
        if(window.innerWidth < 767) {
            // const container = e.target.closest(selectors.popupModal)
            // const modalName = container.dataset.popupModalOptionName
            const self = e.target.closest('[js-select-m-content-beta]')
            if(self) {
            if(self.classList.contains('select_m_active')) {
                self.classList.remove('select_m_active')
            }else {
                self.classList.add('select_m_active')
            }
            }
        }
      }

    function handleChange(e) {
        const self      = e.target
        const currentModal      = self.closest(selectors.popupModal)
        const inputFields_      = currentModal.querySelectorAll(selectors.inputFieldsWrap)

        if(inputFields_.length > 1) {
            let allCheckedInputs = []
            inputFields_.forEach((input_, x) => {
                input_.querySelector('input:checked') &&  allCheckedInputs.push(input_.querySelector('input:checked'))
            })
            if(allCheckedInputs.length > 1) {
                closeAndUpdate(allCheckedInputs, currentModal, true)
            }
        } else {
            setTimeout(() => {
                const checkedValue = inputFields_[0].querySelector('input:checked')
                closeAndUpdate(checkedValue, currentModal)
            }, 500)
        }
        
    }

    function closeAndUpdate(updatedInput, modal, img) {
        modal.classList.add('quick-hide')
        modal.classList.add('hide') 
        setTimeout(() => {
            modal.classList.remove('quick-hide')
        }, 500);
        customMeasurementContainer.classList.remove('hide')
        const modalName = modal.dataset.popupModalOptionName
        const targetBtn = customMeasurementContainer.querySelector(`[js-pdp-select-detail-btn][data-popup-option-name="${modalName}"`)

        
        if(!img) {
            targetBtn.querySelector('.select-text').textContent = updatedInput.value
        } else {
            
            targetBtn.querySelector('.select-text').textContent = updatedInput[0].value
            if(!targetBtn.querySelector('img')) {
                const imgEl = document.createElement('img')
                imgEl.setAttribute('src', updatedInput[0].dataset.optionImageLink)
                imgEl.setAttribute('class', "custom-measurement-select-text")
                targetBtn.insertBefore(imgEl, targetBtn.firstChild)
            } else {
                targetBtn.querySelector('img').src = updatedInput[0].dataset.optionImageLink
            }
            
        }

        const targetBtnContainer= targetBtn.closest('[js-custom-measurement-select-btn]')
        if(targetBtnContainer) {
            let currentIndex = targetBtnContainer.dataset.index
            const nextModal = customMeasurementContainer.querySelector(`[js-custom-measurement-select-btn][data-index='${++currentIndex}']`)
            if(nextModal) {
                nextModal.click()
            }
        }
    }
})