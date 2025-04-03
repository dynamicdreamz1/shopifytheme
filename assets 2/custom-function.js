// for tabs change
function ShowErrors(elm, show) {
  // show (true) will show error else will empty errors elm
  if(show) {
    if(!elm.childElementCount) {
      const newElm = document.createElement('ul')
      newElm.textContent = 'Please select options'
      elm.appendChild(newElm)
    }
  } else {
    console.log(elm)
    elm.innerHTML = ''
  }
}

function removeErrorFields(el) {
  el.innerHTML = ''
}

function clearCustomSelectedFields(btns) {
  btns.forEach(btn => {
    const imgExist = btn.querySelector('img')
    const btnText= btn.querySelector('.select-text') 
    if(imgExist) {
      imgExist.remove()
    }
    btnText.textContent = 'Select'
  })
}
function clearAllRadioFields(allRadioFields) {
  allRadioFields.forEach(inp => {
    inp.checked = false;
  })
}
function clearAllTextFields(allTextFields) {
  allTextFields.forEach(inp => {
    inp.value =''
  })
}
function removeTrailingZeros(value) {
  return value.split('.')[0];
}

function convertInchCm(parameter) {
  const sizeChartImages = document.querySelectorAll("[js-size-chart-image]")
  sizeChartImages.forEach( image => {
    if (image.getAttribute("data-parameter") === parameter) {
      image.classList.remove("visually-hide")
    }else {
      image.classList.add("visually-hide");
    }
  })
}

function requiredFieldsToggle(elementsList, remove ) {
  if(remove) {
    elementsList.forEach(elm => {
      elm.removeAttribute('required')
    })
  } else {
    elementsList.forEach(elm => {
      elm.setAttribute('required', true)
    })
  }
}

function toggleModal(element, show, container, containerTarget, target, modalName) {
  if(show == 'show') {
    element.classList.remove('hide')
  } else if(show == 'close') {
    let selectedOption = element.querySelector('input:checked');
    if(selectedOption){
      selectedOption.checked = false
    }
    element.classList.add('hide')

    // reset button value in case of close cross btn
    const btnElm = document.querySelector(`[js-khadi-open-popup-modal][data-modal="${modalName}"] span`)
    if(modalName != 'size-chart') {
      btnElm.textContent = 'Please Select'
    }
  } else if(show == 'save') {
    let selectedOption = element.querySelector('input:checked');

    element.classList.add('hide')
    // container.querySelector(containerTarget).textContent = selectedOption.value
    // change target button's value on in save case
    const btnElm = document.querySelector(`[js-khadi-open-popup-modal][data-modal="${modalName}"] span`)
    console.log({btnElm})
    btnElm.textContent = selectedOption.value
  }
}

function unselectOptionDrops(container, listContainer) {
  listContainer?.querySelectorAll('.select-styled').forEach(el => {
    el.firstChild.textContent = 'Please Select'
  })
  listContainer?.querySelectorAll('[js-option-drop-1] .select-options').forEach(el=> {
    el.querySelectorAll('li').forEach((elm, index) => {
      if(index == 0) {
        elm.classList.add('is-selected')
      } else {
        elm.classList.remove('is-selected')
      }

    })
  })
  listContainer?.querySelectorAll('[js-custom-option-select]').forEach(el => {
    el.selectedIndex = 0
  })

  // blouse case
  if(container.querySelector('[js-blouse-style-popup] input:checked')) {
    listContainer.querySelector('.option-drop[js-khadi-open-popup-modal] span').firstChild.textContent = 'Please Select'
    container.querySelector('[js-blouse-style-popup] input:checked').checked = false
  }
}


function clearWhatsAppEntries() {
 
  const container = document.querySelector('[js-pdp-whatsapp-measurement-popup]')
  const phoneNumber = container?.querySelector('input[type="number"]')
  const radioCheck = container?.querySelector('input[type="radio"]:checked')

  let selectBox = container?.querySelector('select#country_code');
  if(selectBox) {
    selectBox.removeAttribute('name', 'items[0][properties][Country Code]');
    selectBox.setAttribute("disabled", "disabled");
  }
  
  if(phoneNumber) {
    phoneNumber.value  = ''
  }
  if(radioCheck) {
    radioCheck.checked = false
  }

  
}

function clearAfterOrderEntries() {
  // items[0][properties][Measure After Order]
  const inputfield = document.querySelector('[js-pdp-custom-measurement-complete-modal] input:checked')
  if(inputfield) {
    inputfield.checked = false
  }

}

function clearCustomMeasurementEntries() {
  // Clear All Input fields inside custom measurements
  const allCustomOptions =document.querySelectorAll('[data-popup-modal-option-name] input:checked')

  if(allCustomOptions.length) {
    allCustomOptions.forEach(el_ => {
      el_.checked = false
    })
  }

  // reset all custom measurement select buttons
  const allButtons = document.querySelectorAll('[js-pdp-custom-measurement-popup] [js-pdp-select-detail-btn]')
  if(allButtons.length) {
    allButtons.forEach(el_ => {
      const text_ = el_.querySelector('.select-text')
      const img_  = el_.querySelector('img')
      if(text_) {
        text_.textContent = 'Select'
      }
      if(img_) img_.remove()
    })
  }
}

function ToggleUpsellReturnNote(templateContainer) {

  if(templateContainer?.querySelector('[js-stitch-return-note]')) {
    templateContainer?.querySelector('[js-stitch-return-note]').classList.add('hide')
  }
  // hide return note on unstitched

  const stitchUpsell = templateContainer.querySelector('[js-stitch-upsell-wrap]')
  const upsellSelected = stitchUpsell?.querySelector('input:checked')
  // if(upsellSelected) {
  //   stitchUpsell.querySelector('[js-stitch-return-note]')?.classList.remove('hide')
  // }
}
function ToggleReturnNote(templateContainer) {
  if(templateContainer?.querySelector('[js-stitch-return-note]')) {
    templateContainer?.querySelector('[js-stitch-return-note]').classList.remove('hide')
  }
  // show stitch return note

  const stitchUpsell = templateContainer.querySelector('[js-stitch-upsell-wrap]')

  const upsellSelected = stitchUpsell?.querySelector('[upsell-product] #stitched-blouse:checked')
  if(upsellSelected) {
    stitchUpsell?.querySelector('[js-stitch-return-note]')?.classList.remove('hide')
  } 
  // else {
  //   stitchUpsell?.querySelector('[js-stitch-return-note]')?.classList.add('hide')
  // }
}