// Scroll to target section on size tab click
document.querySelector('.minisize-popup .size-tabs a').addEventListener('click', (event) => {
  event.preventDefault();
  const targetSectionMini = document.querySelector(event.target.getAttribute('href'));
  targetSectionMini?.scrollIntoView({ behavior: 'smooth' });
});

let isEventFromCodeMini = false;
const updateSubmitPopupButtonStateMini = () => {
   const selectedValueMini = document.querySelector('.minisize-popup .size-chart-product .product-form__input_wrap input[name="Size"]:checked');
  const submitPopupButtonMini = document.getElementById('mini-submit-popup');
  if (selectedValueMini) {
    submitPopupButtonMini.disabled = false; // Enable button if a size is selected
    if (!isEventFromCodeMini) {
      isEventFromCodeMini = true; // Set flag to prevent recursion
      const mainProductVariantMini = document.querySelector(`.minisize-popup .product-custom form > variant-selects input[name="Size"][value="${selectedValueMini?.value}"]`);
        if (mainProductVariantMini) {
          if (!mainProductVariantMini.checked) {
            mainProductVariantMini.checked = true;
            mainProductVariantMini.dispatchEvent(new Event('change', { bubbles: false }));
            // document.querySelector(`label[for="${mainProductVariantMini.id}"]`)?.click();
          }
        }
      isEventFromCodeMini = false; // Reset flag after event is dispatched
    }
    
  } else {
    submitPopupButtonMini.disabled = true; // Disable button if no size is selected
  }
};
updateSubmitPopupButtonStateMini();

// Normalize variant names
const normalizeVariantNameMini = name => name.replace(/\s*-\s*/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();

// Handle table size chart selection
const tableSizeChartContainersMini = document.querySelectorAll('.minisize-popup .size-radio');
const sizeChartFormVariantsMini = document.querySelectorAll('.minisize-popup .size-chart-product .product-form__input_wrap input[name="Size"]');
const handleSelectionMiini = (selectedVariantValue) => {
  tableSizeChartContainersMini.forEach(container => {
    container.querySelectorAll('input[name="sizeTable"]').forEach(variant => {
      const parentElementMini = variant.closest('tr');
      const isSelectedMini = normalizeVariantNameMini(variant.value) === selectedVariantValue;
      variant.checked = isSelectedMini;
      parentElementMini.classList.toggle('selected', isSelectedMini);
      sizeChartFormVariantsMini.forEach(formVariant => {
        if (normalizeVariantNameMini(formVariant.value) === selectedVariantValue) {
          document.querySelector(`label[for="${formVariant.id}"]`)?.click();
        }
      });
    });
  });

  // sizeChartFormVariantsMini.forEach(sizeChartVariant => {
  //   if (normalizeVariantNameMini(sizeChartVariant.value) === selectedVariantValue) {
  //     sizeChartVariant.checked = true;
  //     sizeChartVariant.dispatchEvent(new Event('change'));
  //     updateSubmitPopupButtonStateMini();
  //   }
  // });
};

// Handle click events on table size and form size variants
tableSizeChartContainersMini.forEach(container => {
  container.querySelectorAll('input[name="sizeTable"]').forEach(variant => {
    variant.addEventListener('click', () => handleSelectionMiini(normalizeVariantNameMini(variant.value)));
  });
});
sizeChartFormVariantsMini.forEach(variant => {
  variant.addEventListener('click', () => handleSelectionMiini(normalizeVariantNameMini(variant.value)));
});

tableSizeChartContainersMini.forEach(container => {
  container.querySelectorAll('input[name="sizeTable"]').forEach(variant => {
    const correspondingFormVariantMini = Array.from(sizeChartFormVariantsMini).find(formVariant => normalizeVariantNameMini(formVariant.value) === normalizeVariantNameMini(variant.value));
    const parentElementMini = variant.closest('tr');
    const formVariantParentMini = correspondingFormVariantMini?.closest('.product-form__input_wrap');
    
    if (!correspondingFormVariantMini) {
      parentElementMini?.classList.add('hide');
    } else {
      parentElementMini?.classList.remove('hide');

      if (correspondingFormVariantMini.disabled) {
        parentElementMini?.classList.add('disabled'); 
      } else {
        parentElementMini?.classList.remove('disabled'); 
      }
      if (formVariantParentMini?.classList.contains('hidden')) {
        parentElementMini?.classList.remove('hide'); 
      } else {
        parentElementMini?.classList.add('hide'); 
      }
    }
  });
});

// Convert size units
const inchBtnMini = document.querySelector('[js-mini-size-convert-btn-inch]');
const cmBtnMini = document.querySelector('[js-mini-size-convert-btn-cm]');
const convertibleCellsMini = document.querySelectorAll('.minisize-popup .convertible');
const inchToCmMini = 2.54;

const convertToCmMini = () => {
  convertibleCellsMini.forEach(cell => cell.textContent = (parseFloat(cell.getAttribute('data-inch')) * inchToCmMini).toFixed(2));
};

const convertToInchesMini = () => {
  convertibleCellsMini.forEach(cell => cell.textContent = cell.getAttribute('data-inch'));
};

inchBtnMini.addEventListener('click', () => !inchBtnMini.classList.contains('active') && convertToInchesMini());
cmBtnMini.addEventListener('click', () => !cmBtnMini.classList.contains('active') && convertToCmMini());

const observePriceChanges = () => {
  const miniSizePrice = document.querySelector('.minisize-popup .product_details > [id*="price"]'); // Replace with your actual price selector
  const miniSizeChartPrice = document.querySelector('.minisize-popup .size-chart .Product_price_main_new');
  if (miniSizePrice) {
    const observer = new MutationObserver(() => {
      setTimeout(() => {
        if (miniSizePrice && miniSizeChartPrice) {
          miniSizeChartPrice.innerHTML = miniSizePrice.innerHTML; // Copy the HTML from main price and paste it into mini popup
        }
      }, 200);
    });
    observer.observe(miniSizePrice, { childList: true, subtree: true, characterData: true });
  }
};


// Sync size chart with product variant change
document.querySelectorAll('.minisize-popup .product-custom form > variant-selects input[name="Size"]').forEach(mainProductVariantMini => {
  mainProductVariantMini.addEventListener('change', () => {
    if (mainProductVariantMini.checked) {
      
      const selectedValueMini = normalizeVariantNameMini(mainProductVariantMini.value);
      mainProductVariantMini.classList.add('selected');
      document.querySelectorAll('.minisize-popup .product-custom form > variant-selects input[name="Size"]').forEach(variant => {
        if (variant !== mainProductVariantMini) {
          variant.classList.remove('selected');
        }
      });
      
      sizeChartFormVariantsMini.forEach(sizeChartVariant => {
        if (normalizeVariantNameMini(sizeChartVariant.value) === selectedValueMini) {
          sizeChartVariant.checked = true;
          sizeChartVariant.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      document.querySelectorAll('.minisize-popup .size-radio input[name="sizeTable"]').forEach(tableVariant => {
        const parentElementMini = tableVariant.closest('tr');
        if (normalizeVariantNameMini(tableVariant.value) === selectedValueMini) {
          tableVariant.checked = true;
          tableVariant.dispatchEvent(new Event('change'));
          parentElementMini.classList.add('selected');
        } else {
          parentElementMini.classList.remove('selected');
        }
      });
      updateSubmitPopupButtonStateMini();
      observePriceChanges();
    }
  });
});
