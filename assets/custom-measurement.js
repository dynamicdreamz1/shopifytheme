document.addEventListener('click', function(e) {
  
    const target = e.target
    const parentContainer = document.querySelector('[js-product-template]')
    const customMeasurementContainer = parentContainer.querySelector('[js-pdp-custom-measurement-popup]')
    const overlayElement = document.querySelector('.product-custom .popup-overlay') || document.querySelector('.bridal-product .popup-overlay')
  
  
    // if(!parentContainer.querySelectorAll('[js-custom-measurement-radio-field]:checked').length) {
    //   parentContainer.querySelector('[js-custom-measurement-option]').checked =false
    // } else {
    //   parentContainer.querySelector('[js-custom-measurement-option]').checked =true
    // }
  
    
     if(target.hasAttribute('js-pdp-select-detail-btn') || target.closest('[js-pdp-select-detail-btn]')) {
      // on selecting option from custom measurement popup , close custom measurement and open select measurement popup
      /*
      target.closest('[js-pdp-custom-measurement-popup]').classList.add('hide')
      // get data from select button to use it into select measurement popup
      const currentTargetBtn = target.hasAttribute('js-pdp-select-detail-btn') ? target : target.closest('[js-pdp-select-detail-btn]')
      const selectedOptionName =currentTargetBtn.dataset.popupOptionName
  
      parentContainer.querySelector(`[data-popup-modal-option-name="${selectedOptionName}"]`).classList.remove('hide')
      */
    } 
    /*else if(target.hasAttribute('js-whatsapp-callback-request-btn') || target.closest('[js-whatsapp-callback-request-btn]')) {
      // whatsapp measurement save button click handler
      const whatsappCallbackWrapper = target.closest('[js-pdp-whatsapp-measurement-popup]')
      const whatsappCallbackInput   = whatsappCallbackWrapper.querySelector('[js-whatsapp-callback-phone-number]')
      const errorWrapper = whatsappCallbackWrapper.querySelector('.option .error_list')
  
      if(!whatsappCallbackInput.value || !whatsappCallbackWrapper.querySelector('input:checked')) {
        if(!errorWrapper.childElementCount) {
          let errElm = document.createElement('p')
          errElm.textContent = 'Please select option and enter your number'
          errorWrapper.appendChild(errElm)
        }
      } else {
        errorWrapper.innerHTML = ''
        whatsappCallbackWrapper.classList.add('hide')
        overlayElement.classList.add('hide')
      }
  
    } */
    else if(target.hasAttribute('js-custom-size-popup-btn') || target.closest('[js-custom-size-popup-btn]')) {
      let modalName = target.hasAttribute('js-custom-size-popup-btn') ? target.dataset.modal : target.closest('[js-custom-size-popup-btn]').dataset.modal
      parentContainer.querySelector(`[data-popup-modal=${modalName}]`).classList.remove('hide')
      document.querySelector('.popup-overlay').classList.remove('hide')
  
    } else if(target.hasAttribute('js-pdp-select-measurement-back-btn') || target.closest('[js-pdp-select-measurement-back-btn]')) {
      const modalName = target.hasAttribute('js-pdp-select-measurement-back-btn') ? target.dataset.modal : target.closest('[js-pdp-select-measurement-back-btn]').dataset.modal
      const modalOptionName = target.hasAttribute('js-pdp-select-measurement-back-btn') ? target.dataset.optionModalName: target.closest('[js-pdp-select-measurement-back-btn]').dataset.optionModalName
      const recentClosedModal  = customMeasurementContainer.querySelector(`[data-popup-option-name="${modalOptionName}"] `)
      const modalContainer = target.closest(`[data-popup-modal="${modalName}"]`)
      const selectedValue =  modalContainer.querySelector('input:checked') || ''
      const imgValueIfExists = selectedValue.dataset?.optionImageLink

      console.log('modalName', modalName)
      console.log('modalOptionName', modalOptionName)
      console.log('modalContainer', modalContainer)
  
      modalContainer.classList.add('hide')
      customMeasurementContainer.classList.remove('hide')
      if(selectedValue) {
        recentClosedModal.querySelector('.select-text').textContent= selectedValue.value
      }
      if(imgValueIfExists) {
        let imgElm = document.createElement('img')
        imgElm.setAttribute('src', imgValueIfExists)
        imgElm.classList.add('custom-measurement-select-text')
        recentClosedModal.insertBefore(imgElm, recentClosedModal.firstChild)
      }
  
      // to remove and retain error text in error-fields elm
      let optionSelected  =true
      customMeasurementContainer.querySelectorAll('.content-item').forEach(elm => {
        if(elm.querySelector('.select-text')) {
          if(elm.querySelector('.select-text').textContent == 'Select') {
            optionSelected = false
          }
        }
      })
      // if all options are selected after back btn clicked, then empty error fields elm
      if(optionSelected) {
        ShowErrors(customMeasurementContainer.querySelector('.error-fields .error-contents'), false)
      }
  
    } else if(target.closest('[js-popup-close-btn]')) {
      const modalName = target.closest('[js-popup-close-btn]').dataset.modal
      const modalContainer = target.closest(`[data-popup-modal="${modalName}"]`)
        if(modalName == 'whatsapp-measurement') {
          // whatsapp measurement cross button click handler
          const whatsappCallbackWrapper = target.closest('[js-pdp-whatsapp-measurement-popup]')
          const whatsappInputRadio = whatsappCallbackWrapper.querySelectorAll('[js-custom-measurement-radio-field]:checked')
          const whatsappInputText = whatsappCallbackWrapper.querySelectorAll('[js-custom-measurement-text-field]')
          
          clearAllRadioFields(whatsappInputRadio)
          clearAllTextFields(whatsappInputText)
        }
        if(modalName == 'complete-measurement') {
            parentContainer.querySelector('[js-pdp-custom-measurement-complete-modal] input').checked = true
        }
        if(modalName == 'select-measurement') {
          //  empty all selected/choosen values too from form ****
          modalContainer.querySelectorAll('input:checked').forEach(elm => {
            elm.checked = false
          })
  
          // cross btn will also unselect option value from custom-measurement page too
          const modalOptionName = target.closest('[js-popup-close-btn]').dataset.optionModalName
          const recentClosedModal  = customMeasurementContainer.querySelector(`[data-popup-option-name="${modalOptionName}"] `)
          recentClosedModal.querySelector('.select-text').textContent = 'Select'
  
          // remove if in caasse of image
          recentClosedModal.querySelectorAll('img')?.forEach(el => el.remove())
  
  
          // empty all selected/choosen values too from form write code above 
  
          modalContainer.classList.add('hide')
          parentContainer.querySelector('[js-pdp-custom-measurement-popup]').classList.remove('hide')
        }
        if(modalName == 'custom-measurement') {
          // empty all values related to custom measurement from form
          // from all popup modals select-measurement modal listed inside custom-measurement modal
  
          const allSelectMeasurementModals = modalContainer.querySelectorAll('.content-item [js-pdp-select-detail-btn]')
          allSelectMeasurementModals.forEach(elm => {
            let optionName = elm.dataset.popupOptionName
            parentContainer.querySelectorAll(`[data-popup-modal-option-name="${optionName}"] input:checked`).forEach(inEl => {
              inEl.checked = false
            })
          })
  
          modalContainer.querySelectorAll('.content-item [js-pdp-select-detail-btn] .select-text')?.forEach(el => {
            el.textContent = 'Select'
          })
          modalContainer.querySelectorAll('.content-item [js-pdp-select-detail-btn] img')?.forEach(el => {
            el.remove()
          })
          // document.querySelector('.o-Size[js-size-options]').querySelector('input:checked').checked = false
        
        }
        modalContainer.classList.add('hide')
        // overlayElement.classList.add('hide')
        //  check if custom measurement is checked or not
        if(!parentContainer.querySelectorAll('[js-custom-measurement-radio-field]:checked').length) {
            parentContainer.querySelector('[js-custom-measurement-option]') && (parentContainer.querySelector('[js-custom-measurement-option]').checked = false);
        } else {
            parentContainer.querySelector('[js-custom-measurement-option]') && (parentContainer.querySelector('[js-custom-measurement-option]').checked = true);
        }
  
    } else if(target.hasAttribute('js-pdp-save-btn') || target.closest('[js-pdp-save-btn]')) {
      // hide custom-measurement popup modal without removing all selected input values 
      const modalName = target.hasAttribute('js-pdp-save-btn') ? target.dataset.modal : target.closest('[js-pdp-save-btn]').dataset.modal
      const modalContainer = target.closest(`[data-popup-modal="${modalName}"]`)
      // remains true if all options are selected
      let optionSelected  =true
      modalContainer.querySelectorAll('.content-item').forEach(elm => {
        if(elm.querySelector('.select-text')) {
          if(elm.querySelector('.select-text').textContent == 'Select') {
            optionSelected = false
          }

        }
      })
      if(optionSelected) {
        modalContainer.classList.add('hide')
        overlayElement.classList.add('hide')
        document.querySelector('body').classList.remove('popup-open')
        // parentContainer.querySelector('[js-pdp-custom-measurement-complete-modal]').classList.remove('hide')
      } else {
        // in case unselected options are there in modal then show erros on save btn clicked
        ShowErrors(modalContainer.querySelector('.error-fields .error-contents'), true)
      }
  
    } else if(target.hasAttribute('js-open-popup-modal')) {
        const modalName = target.dataset.modal
        let pdpContainer = target.closest('[js-product-template]')
        pdpContainer.querySelector(`[data-popup-modal="${modalName}"]`).classList.remove('hide')
        overlayElement.classList.remove('hide')
  
    } else if(target.hasAttribute('js-pdp-radio-tabs') || target.closest('[js-pdp-radio-tabs]')) {
      const currentParent = target.hasAttribute('js-pdp-radio-tabs') ? target : target.closest('[js-pdp-radio-tabs]')
      const titleElm      = currentParent.querySelector('[js-pdp-radio-tab-title]')
      let selectOptions = currentParent.querySelector('[js-pdp-radio-fieldset]')
      
      const checkedItem = selectOptions.querySelector('input:checked')
  
      titleElm.textContent = checkedItem?.value
  
    } else if(target.closest('.popup-overlay')) {
      const allPopups = parentContainer.querySelectorAll('[data-popup-modal]')
      let openedPopups = []
      allPopups.forEach(popup => {
        if(!popup.classList.contains('hide')  && !popup.getAttribute('data-popup-option-name')) {
          openedPopups.push(popup)
        }
      })
      openedPopups.forEach(popup => {
        popup.classList.add('hide')
      })
      target.closest('.popup-overlay').classList.add('hide')
    }
  })

document.querySelectorAll('.custom-measurement .measurement-tab li:nth-child(-n+2)').forEach(tab => {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.custom-measurement .measurement-tab li:nth-child(-n+2)').forEach(item => item.classList.remove('active'));
      document.querySelectorAll('.know-size-tab, .dont-know-size-tab').forEach(content => content.classList.add('hide'));
      this.classList.add('active');
      const targetClass = this.getAttribute('data-target');
      document.querySelector(`.${targetClass}`).classList.remove('hide');
    });
});

document.addEventListener('DOMContentLoaded', function() {
  const parentContainer = document.querySelector('[js-product-template]')
  const saveMeasurementBtn = parentContainer.querySelector('[js-pdp-save-btn-know-size]');
  const notKnowTabList = parentContainer.querySelectorAll('.custom-measurement .measurement-tab li:not(:first-child)');
  const notDontKnowTabList = parentContainer.querySelectorAll('.custom-measurement .measurement-tab li:not(:nth-child(2)');
  const selects = parentContainer.querySelectorAll('.know-size-tab select');
  const knowSizeRadio = parentContainer.querySelectorAll('.know-size-tab input[type="radio"]');
  const howToMeasureTab = parentContainer.querySelector('[js-pdp-whatsapp-measurement]');
  notKnowTabList.forEach(function(tab) {
    tab.addEventListener('click', function(e) {
      selects.forEach(select => {
        select.selectedIndex = 0;
      });
      knowSizeRadio.forEach(function(radio) {
        radio.checked = false;
      });
    });
  });
  notDontKnowTabList.forEach(function(tab) {
    const radioButtons = document.querySelectorAll('.dont-know-size-tab .select-measurement-inner input[type="radio"]');
    tab.addEventListener('click', function(e) {
      radioButtons.forEach(function(radio) {
        radio.checked = false;
      });
    });
  });
  saveMeasurementBtn.addEventListener('click', function(e) {
    const target = e.target
    if (parentContainer.querySelector('.custom-measurement .measurement-tab li.active').getAttribute('data-target') === 'know-size-tab') {
        let allValid = true;
        selects.forEach(select => {
            const firstOptionValue = select.options[0].value;
            if (select.value === '' || select.value === firstOptionValue) {
                allValid = false;
                select.classList.add('error');
            } else {
                select.classList.remove('error');
            }
        });
        if (!allValid) {
            document.querySelector('.know-size-error-fields').classList.remove('hide');
        } else {
            document.querySelector('.know-size-error-fields').classList.add('hide');
            parentContainer.querySelector('[js-custom-measurement-option]') && (parentContainer.querySelector('[js-custom-measurement-option]').checked = false);
            document.querySelector('body').classList.remove('popup-open')
            document.querySelector('[js-pdp-custom-measurement-popup]').classList.add('hide')
            document.querySelector('.product-custom > .popup-overlay').classList.add('hide')
        }
    }
  });
  howToMeasureTab.addEventListener('click', function() {
    parentContainer.querySelector('[js-pdp-custom-measurement-popup]').classList.add('hide')
    parentContainer.querySelector('.whatsapp_measurement').classList.remove('hide')
    setTimeout(() => {
      document.querySelector('body').classList.add('popup-open')
    }, 100);
    let selectBox = parentContainer.querySelector('select#country_code');
    if(selectBox) {
      selectBox.setAttribute('name', 'items[0][properties][Country Code]');
      selectBox.removeAttribute("disabled");
    }
  });

  // HOW TO MEASURE tab js
  const howKnowSize = parentContainer.querySelector('[js-pdp-know-size]');
  const howDontKnowSize = parentContainer.querySelector('[js-pdp-dont-know-size]');
  const notMeasuretab = parentContainer.querySelectorAll('.whatsapp_measurement .measurement-tab li:not(:last-child)');
  notMeasuretab.forEach(function(tab) {
    tab.addEventListener('click', function(e) {
      parentContainer.querySelector('[js-pdp-custom-measurement-popup]').classList.remove('hide')
      parentContainer.querySelector('.whatsapp_measurement').classList.add('hide')
      if (tab.hasAttribute('js-pdp-know-size')) {
        parentContainer.querySelector('.measurement-tab [data-target="know-size-tab"]').classList.add('active')
        parentContainer.querySelector('.measurement-tab [data-target="dont-know-size-tab"]').classList.remove('active')
        parentContainer.querySelector('.custom-measurement .know-size-tab').classList.remove('hide')
        parentContainer.querySelector('.custom-measurement .dont-know-size-tab').classList.add('hide')
      }
      if (tab.hasAttribute('js-pdp-dont-know-size')) {
        parentContainer.querySelector('.measurement-tab [data-target="know-size-tab"]').classList.remove('active')
        parentContainer.querySelector('.measurement-tab [data-target="dont-know-size-tab"]').classList.add('active')
        parentContainer.querySelector('.custom-measurement .know-size-tab').classList.add('hide')
        parentContainer.querySelector('.custom-measurement .dont-know-size-tab').classList.remove('hide')
      }
    });
  });

});