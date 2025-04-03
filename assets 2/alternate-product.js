
document.addEventListener('DOMContentLoaded', function() {
  const selectors = {
      templateSelector        : '[js-product-template]',
      popupModalBtn           : '[js-pdp-open-modal]',
      popupModal              : '[js-popup-modal]',
      closeModalBtn           : '[js-popup-close-btn]',
      sizeChartPopupSelector  : '[js-pdp-size-chart-popup]',
      saveModalBtnSelector    : '[js-popup-save-btn]',     

      variantSelectSelector   : '[js-custom-variant-selects]',
      stitchedGroupSelector   : '[js-stitched-group]',
      customPropertySelector  : '[js-custom-property-list]',
      requiredFieldsSelector  : '[js-required-property-field]',
    
      stictchedPropertyDropSelector : '[js-option-drop-1] select',

      optionValuesSelector    : '[js-size-options]',
      stitchedOptionSelector  : '[js-stiched-option-name]',

      confSizeOptionSelector : '[js-conf-size-option-name]',
      confSizeOptionWrapperSelector :'[js-made-to-order-outfit-wrapper]',

      errorWrapperSelector    : '[js-pdp-form-error]',
      modalErrorList          : '[js-error-list]',

      customMeasurementMethodSelector : '[js-pdp-measurement-method-options]',
      customMeasurementOptionSelector : '[js-pdp-custom-measurement-option]',
      customMeasurementDetailSelector : '[js-pdp-select-detail-btn]',

      popupOverlay                    :'.product-custom .popup-overlay',

      copyToClipBoard                 : '[js-copy-to-clipboard]'
    }
    const templateContainer = document.querySelector(selectors.templateSelector)
    const customMeasurementMethodsContainer = templateContainer.querySelector(selectors.customMeasurementMethodSelector) 
    const confSizeOptionWrapper             = templateContainer.querySelector(selectors.confSizeOptionWrapperSelector)
    // variant select options
    const variantSelects    = templateContainer.querySelector(`${selectors.stitchedOptionSelector}`)
    const confSizeOption    = templateContainer.querySelector(`${selectors.confSizeOptionSelector}`)
    const templateName      = templateContainer?.dataset.productTemplateName


    const copyLinkWrapper   = templateContainer.querySelector(selectors.copyToClipBoard)

    // product stitched property drops
    const stictchedPropertyDrops = templateContainer.querySelectorAll(selectors.stictchedPropertyDropSelector)
    if(stictchedPropertyDrops.length) {
      stictchedPropertyDrops.forEach(el_ => {
        el_.addEventListener('change', productPropertyDropHandler)
      })
    }
    

    // all required fields of template
    const allRequiredFields = templateContainer.querySelectorAll(selectors.requiredFieldsSelector)
    // variant options
    const optionValues = templateContainer.querySelectorAll(`${selectors.stitchedGroupSelector}${selectors.optionValuesSelector} label`)

    // to remove required fields in case we don't need on fresh load
    const initialSelectedCheckField = templateContainer.querySelector(`${selectors.variantSelectSelector} input:checked`)
    const initialSelectedOption = initialSelectedCheckField?.value
    if(initialSelectedOption && optionValues.length) {
      if(initialSelectedOption && (initialSelectedOption == 'Unstitched' || initialSelectedOption == 'Made to Order')) {
        // remove all required fields of stitched group
        requiredFieldsToggle(allRequiredFields, true)
        if(initialSelectedCheckField && initialSelectedCheckField.name == 'Size Options' && initialSelectedOption == 'Made to Order' && confSizeOptionWrapper) {
          confSizeOptionWrapper.classList.remove('hide')
        }
        optionValues[0].click()

        // stitch return note
        ToggleUpsellReturnNote(templateContainer)

      } else {
        // optionValues[1].click()
        // stitch return note
        ToggleReturnNote(templateContainer)
      }
    }

    // All events
    templateContainer.addEventListener('click', handlePopupModals)
    variantSelects?.addEventListener('change', handleOptionChange)
    confSizeOption?.addEventListener('change', handleOptionChange)
    customMeasurementMethodsContainer?.addEventListener('click', handleCustomMeasurement)
    document.addEventListener('custom-measurement:reset', resetCustomMeasurements)
    copyLinkWrapper?.addEventListener('click', copyClipBoard)

    function copyClipBoard(e) {
      const wrapper_ = e.target.closest(selectors.copyToClipBoard)
      const productLink = wrapper_?.dataset.productLink
      const popup_  = e.target.closest('[js-product-share-popup]')

      if(productLink) {
        navigator.clipboard.writeText(productLink)
        .then(() => {
          console.log({popup_})
          popup_.querySelector('[js-link-copy-success]').style.opacity = 1;
          setTimeout(() => {
            popup_.querySelector('[js-link-copy-success]').style.opacity = 0;
          },2000)
        })
      }
    }
    function resetCustomMeasurements({detail}) {
    
      if(detail) {
        const { title } = detail
        const selectedOptionTitle   = title.split('/')[1]?.trim()
  
        if(selectedOptionTitle != 'Custom Size') {
          clearWhatsAppEntries()
          clearAfterOrderEntries()
          clearCustomMeasurementEntries()
        }
      }
    }
    function handlePopupModals(e) {
        const sizeChartPopupModal = templateContainer.querySelector(selectors.sizeChartPopupSelector)
        const self = e.target
        if(self.closest(selectors.popupModalBtn)) {
         
            const modalName = self.closest(selectors.popupModalBtn).dataset.modal || self.querySelector(selectors.popupModalBtn).dataset.modal
            templateContainer.querySelector(`${selectors.popupModal}[data-popup-modal="${modalName}"]`).classList.remove('hide')
            templateContainer.querySelector(selectors.popupOverlay).classList.remove('hide')

             if(document.body) {
               document.body.classList.add('popup-open');
             }
          
        } else if(self.closest(selectors.closeModalBtn)) {
            const modalName = self.closest(selectors.closeModalBtn)?.dataset.modal || self.querySelector(selectors.closeModalBtn)?.dataset.modal

            if(modalName != "select-measurement") {
             if(document.body) {
               document.body.classList.remove('popup-open');
             }
            }
          
            if(modalName == 'blouse-style') {
              templateContainer.querySelector('[js-blouse-style-popup] [js-popup-save-btn]')?.click()
              // const modalInputField_ = templateContainer.querySelector(`${selectors.popupModal} input:checked`)
              // if(modalInputField_) {
              //   modalInputField_.checked = false
              // }
              // templateContainer.querySelector(`${selectors.popupModalBtn}[data-modal='${modalName}'] span`).firstChild.textContent = 'Please Select'
            } else if(modalName == 'whatsapp-measurement') {
              const whatsappModal = templateContainer.querySelector(`${selectors.popupModal}[data-popup-modal="${modalName}"]`)
              const radio_ = whatsappModal.querySelector('input[type="radio"]:checked')
              const text_ = whatsappModal.querySelector('input[type="number"]')
              if(radio_) {
                radio_.checked = false
              }
              if(text_) {
                text_.value=''
              }
              if(initialSelectedOption && optionValues.length) {
                // optionValues[1].click()
              }
            } else if(modalName == 'custom-measurement' || modalName == 'choose_measurement') {
              if(initialSelectedOption && optionValues.length) {
                optionValues[1].click()
              }
            
            }
            

            templateContainer.querySelector(`${selectors.popupModal}[data-popup-modal="${modalName}"]`)?.classList.add('hide')
            if(modalName != "select-measurement") {
              templateContainer.querySelector(selectors.popupOverlay).classList.add('hide')
            }

        } else if(self.hasAttribute('js-size-convert-btn-inch')) {
            self.classList.add('active')
            sizeChartPopupModal.querySelector('[js-size-convert-btn-cm]').classList.remove('active')
            convertInchCm('in')

        } else if(self.hasAttribute('js-size-convert-btn-cm')) {

            self.classList.add('active')
            sizeChartPopupModal.querySelector('[js-size-convert-btn-inch]').classList.remove('active')
            convertInchCm('cm')
        } else if(self.closest(selectors.saveModalBtnSelector)) {
          const modalName = self.closest(selectors.saveModalBtnSelector)?.dataset.modal || self.querySelector(selectors.saveModalBtnSelector)?.dataset.modal
          
          if(modalName == 'blouse-style') {
            
            const modalInputField_ = templateContainer.querySelector(`${selectors.popupModal} input:checked`)
            templateContainer.querySelector(`${selectors.popupModalBtn}[data-modal='${modalName}'] span`).firstChild.textContent = modalInputField_.value
           // templateContainer.querySelector(`[js-alternate-custom-pdp] ${selectors.popupOverlay}`).classList.add('hide')

            templateContainer.querySelector(selectors.popupOverlay).classList.add('hide')
            templateContainer.querySelector(`[js-popup-modal][data-popup-modal="${modalName}"]`).classList.remove('hide')
            
          } else if(modalName == 'whatsapp-measurement') {
            const whatsappModal = templateContainer.querySelector(`${selectors.popupModal}[data-popup-modal="${modalName}"]`)
            const radio_ = whatsappModal.querySelector('input[type="radio"]:checked')
            const text_ = whatsappModal.querySelector('input[type="number"]')
            if(text_ && radio_) {
              whatsappModal.querySelector(selectors.modalErrorList).innerHTML = ''
            } else {
              whatsappModal.querySelector(selectors.modalErrorList).innerHTML = 'Please select any value'
              return
            }

            templateContainer.querySelector(selectors.popupOverlay).classList.remove('hide')
            templateContainer.querySelector('[js-pdp-whatsapp-complete-modal]')?.classList.remove('hide')

          }
          templateContainer.querySelector(`${selectors.popupModal}[data-popup-modal=${modalName}]`)?.classList.add('hide');
          templateContainer.querySelector(selectors.popupOverlay).classList.add('hide')


        } else if(self.closest(selectors.popupOverlay)) {

           if(document.body) {
               document.body.classList.remove('popup-open');
          }
          
          const allPopups = templateContainer.querySelectorAll('[js-popup-modal][data-popup-modal]')
          let openedPopups = []
          allPopups.forEach(popup => {
            if(!popup.classList.contains('hide') && !popup.getAttribute('data-popup-option-name')) {
              openedPopups.push(popup)
            }
          })
          // console.log(openedPopups)
          openedPopups.forEach(popup => {
            const modalName = popup.dataset.popupModal
            if( modalName == 'whatsapp-measurement' || modalName == 'complete-measurement' || modalName == 'choose-measurement') {
              if(initialSelectedOption && optionValues.length) {
                optionValues[1].click()
              }
            }
            // console.log(modalName)
            if(modalName == 'blouse-style') {
              templateContainer.querySelector('[js-blouse-style-popup] [js-popup-save-btn]')?.click()
              // const modalInputField_ = templateContainer.querySelector(`${selectors.popupModal} input:checked`)
              // if(modalInputField_) {
              //   modalInputField_.checked = false
              // }
              // templateContainer.querySelector(`${selectors.popupModalBtn}[data-modal='${modalName}'] span`).firstChild.textContent = 'Please Select'
            }
            popup.classList.add('hide')
          })

          self.closest(selectors.popupOverlay).classList.add('hide')
        } 
        if(self.hasAttribute('js-mini-size-convert-btn-inch')) {
            self.classList.add('active')
            document.querySelector('[js-mini-size-convert-btn-cm]').classList.remove('active')
            convertInchCm('in')
          
          } 
        if (self.hasAttribute('js-mini-size-convert-btn-cm')) {

            self.classList.add('active')
            document.querySelector('[js-mini-size-convert-btn-inch]').classList.remove('active')
            convertInchCm('cm')
        }
    }
    
    function handleOptionChange(e) {
    
      const checkedOption = e.target.value
      const customPropertyContainer = templateContainer.querySelector(`${selectors.customPropertySelector}`)
    
      if(checkedOption == 'Unstitched' || checkedOption == 'Made to Order' ) {
        // remove all elements related to stitched
        templateContainer.querySelectorAll(selectors.stitchedGroupSelector).forEach(elm => {
          elm.classList.add('hide')
        })

        // select first option
        if(initialSelectedOption && optionValues.length) {
          optionValues[0].click()
        }
        // remove all required fields of stitched group
        requiredFieldsToggle(allRequiredFields, true)

        // clear option select fields
        unselectOptionDrops(templateContainer, customPropertyContainer)

        //clear error wrapper too
        const erorWrapper = templateContainer.querySelector(`${selectors.errorWrapperSelector} ul`)
        removeErrorFields(erorWrapper)
        if(!erorWrapper.childNodes.length) {
          erorWrapper.style.display = "none"
        }
        
        //clear custom measurements
        const customMeasurementFields = templateContainer.querySelectorAll('[js-pdp-select-measurement-popup] input:checked')
        if(customMeasurementFields.length) {
          clearAllRadioFields(customMeasurementFields)
        }

        // clear ui from select-measurement popup
        const selectMeasurementFields = templateContainer.querySelectorAll('[js-pdp-select-detail-btn] .select-text')
        if(selectMeasurementFields.length) {
          selectMeasurementFields.forEach(el => {
            el.textContent = 'Select'
          })
        }
        const selectMeasurementImageFields = templateContainer.querySelectorAll('[js-pdp-select-detail-btn] img')
        if(selectMeasurementImageFields.length) {
          selectMeasurementImageFields.forEach(el => el.remove())
        }

        // clear custom whatsapp modal fields
        const whatsappModal = templateContainer.querySelector('[js-pdp-whatsapp-measurement-popup]')
        const radio_ = whatsappModal?.querySelector('input[type="radio"]:checked')
        const text_ = whatsappModal?.querySelector('input[type="number"]')
        if(radio_) {
          radio_.checked = false
        }
        if(text_) {
          text_.value=''
        }

        //  clear measure after order
        const afterOrderModal = templateContainer.querySelector('[js-pdp-custom-measurement-complete-modal]')
        if(afterOrderModal && afterOrderModal.querySelector('input:checked')) {
          afterOrderModal.querySelector('input:checked').checked = false
        }

        // cusf outfit wrapper 
        if(confSizeOptionWrapper) {
          confSizeOptionWrapper.classList.remove('hide')
        }
        

        // hide
        ToggleUpsellReturnNote(templateContainer)

        //Remove class on non returnable product
        document.querySelector('[js-product-details]').classList.remove('non-returnable')
        
      } else {

        // show all elements related to stitched
        templateContainer.querySelectorAll(selectors.stitchedGroupSelector).forEach(elm => {
          elm.classList.remove('hide')
        })

        // set all required fields of stitched group
        requiredFieldsToggle(allRequiredFields, false)

        // select first option
        // optionValues[1].click()

        if(confSizeOptionWrapper) {
          confSizeOptionWrapper.classList.add('hide')
        }

        // return  note
        ToggleReturnNote(templateContainer)

        //Add class on non returnable product
        document.querySelector('[js-product-details]').classList.add('non-returnable')
        
        templateContainer.querySelectorAll('.o-Size .product-form__input_wrap input[type=radio]').forEach(elm => {
          elm.removeAttribute('disabled');
        })

        // for move ymq app div
        let ymq = document.getElementById("ymq-box");
        let outerWrapper = document.getElementsByClassName("options-wrapper")[0];
        
        if (outerWrapper && outerWrapper.parentNode) {
          outerWrapper.parentNode.insertBefore(ymq, outerWrapper);
          outerWrapper.parentNode.appendChild(ymq);
        }
        
      }
    }
    function handleCustomMeasurement(e) {
      const self = e.target
      if(self.closest(selectors.customMeasurementOptionSelector) || self.getAttribute(selectors.customMeasurementOptionSelector)) {
        const selectedOption = self.getAttribute(selectors.customMeasurementOptionSelector) ?  self : self.closest(selectors.customMeasurementOptionSelector);

        const modalName = selectedOption.dataset.optionName
        const popupModal = templateContainer.querySelector(`${selectors.popupModal}[data-popup-modal="${modalName}"]`)
        
        if(popupModal) {
          popupModal.classList.remove('hide')
          templateContainer.querySelector(selectors.popupOverlay).classList.remove('hide')
        }

        if(modalName == 'whatsapp-measurement') {
          let selectBox = templateContainer.querySelector(`${selectors.popupModal}[data-popup-modal="${modalName}"]`).querySelector('[js-pdp-select-measurement-popup]').querySelector('select#country_code');
          if(selectBox) {
            selectBox.setAttribute('name', 'items[0][properties][Country Code]');
            selectBox.removeAttribute("disabled");
          }
          clearCustomMeasurementEntries()
          clearAfterOrderEntries()
        } else if(modalName == 'custom-measurement' || modalName == 'choose_measurement') {
          clearWhatsAppEntries()
          clearAfterOrderEntries()

        } else if(modalName == 'complete-measurement') {
          clearWhatsAppEntries()
          clearCustomMeasurementEntries()

        }
        // hide main popup
        customMeasurementMethodsContainer.classList.add('hide')
      }
    }

    function productPropertyDropHandler(e) {
      const self = e.target
      document.dispatchEvent(new CustomEvent('nativePropertySelectOptionDrop:init', { detail: self}))
    }

    document.querySelectorAll('variant-selects input[type="radio"]').forEach(function (input) {
    input.addEventListener('change', function () {
      var selectedLabel = document.querySelector('label[for="' + input.id + '"]');
      var variantQuantity = selectedLabel.getAttribute('data-variant-quantity');
      var bisFormWrapper = document.getElementById('appikon-bis-inline-form-wrapper');
      if (bisFormWrapper) {
        if (variantQuantity == '0') {
          bisFormWrapper.classList.remove('hidden')
        } else {
          bisFormWrapper.classList.add('hidden')
        }
      }
    });
  });
})

document.addEventListener('DOMContentLoaded', function() {
  //console.log("onreload---");
  const container_ = document.querySelector('[js-product-details]')

  const upsellProducts_ = container_.querySelectorAll('upsell-product input')

  upsellProducts_.forEach(upsellProd => {
    upsellProd.addEventListener('change', function(e) {

      document.addEventListener('sumTotalPrice:run', sumTotalPrice)
      document.dispatchEvent(new CustomEvent('sumTotalPrice:run'))

      function sumTotalPrice() {
        const mainProductPrice = container_.querySelector('[data-pdp-product-price]').dataset.pdpProductPrice
        const stickyATCPrice = document.querySelector('[js-pdp-sticky-addtocart-wrapper] form [js-pdp-original-price]')

        const allCheckedUpsellProducts = container_.querySelectorAll('upsell-product input:checked')
        const preDrapeSelect = container_.querySelectorAll('.options-dropdown-list-pre-drap select')
          
        let totalUpsellProductPrice = 0
      
        if(allCheckedUpsellProducts.length) {
          allCheckedUpsellProducts.forEach(upsellItem => {
            const parent_ = upsellItem.closest('upsell-product')
            const price = parent_.dataset.upsellProductPrice
            totalUpsellProductPrice += parseFloat(price.replace(/,/g, ''));
          })
            //Add class on non returnable product
            document.querySelector('[js-product-details]').classList.add('non-returnable-pre-drap')
            if (preDrapeSelect) {
              preDrapeSelect.forEach(selectBox => {
                if (selectBox.hasAttribute("js-required-property-field")) {
                  selectBox.setAttribute('required', 'true');
                }
              })
            }
          } else {
            //Remove class on non returnable product
            document.querySelector('[js-product-details]').classList.remove('non-returnable-pre-drap')
            if (preDrapeSelect) {
              preDrapeSelect.forEach(selectBox => {
                selectBox.selectedIndex = 0;
                selectBox.removeAttribute('required');
              })
            }
          }
        const currencySymbol = container_.querySelector('[data-shop-currency]').dataset.shopCurrency
        const ctaBtn = container_.querySelector('form button[type="submit"] [js-pdp-original-price]')
        let mainProductPriceChange = parseFloat(mainProductPrice.replace(/,/g, ''));
        const sum = mainProductPriceChange + totalUpsellProductPrice;
        const displayTotalPrice = `${currencySymbol} ${sum}`
        if (ctaBtn) {
          ctaBtn.textContent = displayTotalPrice
        }
        if(stickyATCPrice) {
          stickyATCPrice.textContent = displayTotalPrice
        }
        const stickyButtons = document.querySelectorAll('.sticky-addtocart-button .button');
        stickyButtons.forEach(stickyButton => {
          const stickyPriceText = stickyButton.querySelector('[js-pdp-original-price]');
          if (stickyPriceText) {
              stickyPriceText.textContent = displayTotalPrice;
          }
        });
      }
    })
  })  

    function changeStickyBtnText() {
    let primaryAtcButton= document.querySelector('.product-form__submit')
    let atcButtonContent= primaryAtcButton.querySelector('span').innerHTML

    
    const stickyBtn = document.querySelector('[js-pdp-stick-addtocart-btn]')
    let targetButton = stickyBtn.querySelector('[js-sticky-atc-btn-text]')
    
    if(primaryAtcButton.classList.contains('unavailable-variant')) {
      stickyBtn.classList.add('unavailable-variant')
    } else {
      stickyBtn.classList.contains('unavailable-variant') && stickyBtn.classList.remove('unavailable-variant')
    }
    targetButton.innerHTML= atcButtonContent
  }


  document.addEventListener('changeStickyBtnText:run', changeStickyBtnText)
  document.dispatchEvent(new CustomEvent('changeStickyBtnText:run'))
})

document.addEventListener('DOMContentLoaded', () => {
  const discountInput = document.getElementById('discount-on-product');
  const comparePriceInput = document.getElementById('compare-at-price');

  // Function to update hidden fields when radio changes
  function updateProductDetails(radio) {
    const comparePrice = radio.getAttribute('data-product-compare-price');
    const discount = radio.getAttribute('data-product-discount');

    if (comparePrice) {
      comparePriceInput.value = comparePrice;
    } else {
      comparePriceInput.value = ''; // Clear value if compare price is empty
    }

    if (discount) {
      discountInput.value = discount;
    } else {
      discountInput.value = ''; // Clear value if discount is empty
    }
  }

  if (discountInput && comparePriceInput) {
    const sizeRadios = document.querySelectorAll('.product-form input[type="radio"]');
    sizeRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        updateProductDetails(this); // Update on radio selection
      });
  
      // Check if a radio is pre-selected (on page load)
      if (radio.checked) {
        updateProductDetails(radio);
      }
    });
  }
});