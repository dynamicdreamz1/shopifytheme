
const ctabtnwrapper = document.querySelector('.product_details .product-form__submit');
const stickAddToCartBtn =  document.querySelector('[js-pdp-stick-addToCart-btn]');
const stickAddToCartBtnStitched =  document.querySelector('[js-pdp-stick-addtocart-btn-stitched]');
const productForm = document.querySelector("product-form");
const variantSelects = document.querySelector("variant-selects");
const announcementBar = document.querySelector(".Header_announcement_bar_main_new");
const Header = document.querySelector(".header-wrapper");
const stickBuyNowBtn =  document.querySelector('[data-buy-now]');
const stickBuyNowBtnDone =  document.querySelector('[data-buy-now-done]');

  function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

if(ctabtnwrapper) {
    window.addEventListener('scroll', e => {
        if(window.scrollY > offset(ctabtnwrapper).top) {
            document.body.classList.add('scrolled-past-header-body');
            document.querySelector('[js-pdp-sticky-addtocart-wrapper]').style.bottom = 0;
        } else {
            document.body.classList.remove('scrolled-past-header-body');
            document.querySelector('[js-pdp-sticky-addtocart-wrapper]').style.bottom = "-100%";
        }
    });
    if (window.innerWidth > 767) {
      stickAddToCartBtn.addEventListener('click', () => {
          ctabtnwrapper.click();
          setTimeout(() => // this changes the scrolling behavior to "smooth"
          {
              const headerGroupHeight = ((announcementBar?.clientHeight || 0) + Header.clientHeight);
              const scrollVal = (window.scrollY + variantSelects.getBoundingClientRect().top) - headerGroupHeight;
              window.scrollTo({ top: scrollVal, behavior: 'smooth' })
          }
          , 500)
      })
    }
  function stickyContentChange(currentVarient) {
        if(currentVarient) {
            document.querySelector('[js-pdp-sticky-addToCart-option-label]').textContent = currentVarient.title;
            if(currentVarient.compare_at_price > 0)
            {
              document.querySelector('[js-pdp-sticky-compare-at-price]').textContent = '₹ ' + Math.round(currentVarient.compare_at_price / 100)
            }
            document.querySelectorAll('[js-pdp-original-price]').forEach(originalPrice => {
                originalPrice.textContent = '₹ ' + Math.round(currentVarient.price / 100)
            })
        }
    }
    
    document.addEventListener('sticky-cta-content:init', (e) => {
        stickyContentChange(e.detail)
    });
}


// sticky add to cart with variable popup
var popupTriggre = false
var checkVisibilityButton = false
function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}


function handleIntersection(entries, observer) {
  entries.forEach(function(entry) {
    if (!entry.isIntersecting) {
      popupTriggre = true
    } else {
      popupTriggre = false
    }
  });
}
var observer = new IntersectionObserver(handleIntersection, {
  root: null, 
  threshold: 1
});
observer.observe(productForm);

function checkVisibility() {
  if (productForm && isElementInViewport(productForm)) {
    checkVisibilityButton = true;
  } else {
    checkVisibilityButton = false;
  }
}

const sizeInput = document.querySelectorAll('.o-Size .product-form__input_wrap');
function sizeFirstLineAddClass() {
  const firstChipTop = sizeInput[0].getBoundingClientRect().top;
  const firstRowChips = Array.from(sizeInput).filter(sizeInput => {
    return sizeInput.getBoundingClientRect().top === firstChipTop;
  });
  firstRowChips.forEach(sizeInput => {
    sizeInput.classList.add('size-first-row');
  });
}
function sizeFirstLineRemoveClass() {
  sizeInput.forEach(input => {
    input.classList.remove('size-first-row');
  });
}

function mobileStickyVar() {
   if (window.innerWidth <= 767) {
    const closePopup = document.querySelector("#closeSizePopup");
    checkVisibility();
     
    function openVariablePopup() {
      productForm.classList.add('sticky-variable');
      document.querySelector('body').classList.add('variable-popup-open');
      sizeFirstLineAddClass();
    }
   function openVariablePopupBuyNow() {
     document.querySelector('body').classList.add('sticky-variable-buy-open');
   }
   function closeVariablePopupBuyNow() {
     document.querySelector('body').classList.remove('sticky-variable-buy-open');
   }
    function closeVariablePopup() {
      productForm.classList.remove('sticky-variable'); 
      document.querySelector('body').classList.remove('variable-popup-open');
      sizeFirstLineRemoveClass();
    }
    function addToCart() {
      stickAddToCartBtn.addEventListener('click', () => {
        ctabtnwrapper.click();
      });
    }
    function BuyNowBtn() {
      let addToCartForm = document.querySelector('form[action$="/cart/add"]');
      if(addToCartForm.getAttribute('upsell')) {
        // for upsell product reference
        let refTimeStamp = Date.now()
        // in case of upsell also add reference to main product
        formData.append('items[0][properties][_ref_id]', refTimeStamp)

        let upsellProducts = addToCartForm.querySelectorAll('[js-upsell-product] input:checked')
        console.log('upsellProducts', upsellProducts)
        upsellProducts.forEach((elm, index_) => {
          if(elm.dataset.productId) {
            formData.append(`items[${index_ + 1}][id]`, Number(elm.dataset.productId))
            formData.append(`items[${index_ + 1}][quantity]`, 1)
            formData.append(`items[${index_ + 1}][properties][_ref_id]`, refTimeStamp)
          }
        })
      }
      if (addToCartForm.checkValidity()) {
        let formData = new FormData(addToCartForm);
        fetch(window.Shopify.routes.root + 'cart/add.js', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          window.location.href = '/checkout';
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      } else {
        addToCartForm.reportValidity();
      }
    }
     
     
    var inputChecked = false
    function checkInputs() {
        const radioButtons = productForm.querySelectorAll('input[type="radio"]');
        const isRadioSelected = Array.from(radioButtons).some(radio => radio.checked);
        const selectBoxes = productForm.querySelectorAll('select');
        const areSelectsSelected = Array.from(selectBoxes).every(select => select.value !== '');
        if (radioButtons.length > 0 || selectBoxes.length > 0) {
          if (!isRadioSelected || !areSelectsSelected) {
              inputChecked = true
          } else {
            inputChecked = false
          }
        }
    }
    
    if(ctabtnwrapper) {
      productForm.addEventListener('change', checkInputs);
      if (stickAddToCartBtnStitched) {
        stickAddToCartBtnStitched.addEventListener('click', () => {
          if (!popupTriggre && !checkVisibilityButton) {
            ctabtnwrapper.click();
            return;
          }
          checkInputs();
          openVariablePopup()
          addToCart()
        });
      }
      stickBuyNowBtn && stickBuyNowBtn.addEventListener('click', (e) => {
        if (productForm.querySelector("variant-selects")) {
          e.preventDefault();
          if (!popupTriggre && !checkVisibilityButton) {
            return;
          }
          checkInputs();
          const Stitched = document.querySelector('.options-header.Stitched')
          const Mod = document.querySelector('.options-header[class*="Conf Size Options"]')
          if (Stitched && !productForm.classList.contains('sticky-variable')) {
            openVariablePopup();
            openVariablePopupBuyNow();
            stickBuyNowBtnDone.addEventListener('click', (e) => {
              BuyNowBtn()
            });
          } else {
            stickBuyNowBtn.click();
          }
          if (Mod && !productForm.classList.contains('sticky-variable')) {
            openVariablePopup();
            openVariablePopupBuyNow();
            BuyNowBtn()
          }
          if (inputChecked || ctabtnwrapper.classList.contains('unavailable-variant')) {
            openVariablePopup();
            openVariablePopupBuyNow();
            stickBuyNowBtnDone.addEventListener('click', (e) => {
              BuyNowBtn()
            });
          }
          if (productForm.classList.contains('sticky-variable')) {
            var errorDiv = document.querySelector('.product-form__error-message-wrapper');
            var checkVisibility = setInterval(function() {
              if (!errorDiv.hasAttribute('hidden')) {
                  errorDiv.scrollIntoView({ behavior: 'smooth' });
                  clearInterval(checkVisibility);
              }
            }, 500);
          } else {
            setTimeout(() => {
                const headerGroupHeight = ((announcementBar?.clientHeight || 0) + Header.clientHeight);
                const scrollVal = (window.scrollY + variantSelects.getBoundingClientRect().top) - headerGroupHeight;
                window.scrollTo({ top: scrollVal, behavior: 'smooth' })
            }, 500)
          }
        } else {
          BuyNowBtn()
        }
      });
      
      stickAddToCartBtn.addEventListener('click', () => {
        if (!popupTriggre && !checkVisibilityButton) {
          return;
        }
        checkInputs();
        const Stitched = document.querySelector('.options-header.Stitched')
        const Mod = document.querySelector('.options-header[class*="Conf Size Options"]')
        if (Stitched && !productForm.classList.contains('sticky-variable')) {
          openVariablePopup();
          addToCart()
        } else {
          ctabtnwrapper.click();
        }
        if (Mod && !productForm.classList.contains('sticky-variable')) {
          openVariablePopup();
          addToCart()
        }
        if (inputChecked || ctabtnwrapper.classList.contains('unavailable-variant')) {
          openVariablePopup();
          addToCart()
        }
        if (productForm.classList.contains('sticky-variable')) {
          var errorDiv = document.querySelector('.product-form__error-message-wrapper');
          var checkVisibility = setInterval(function() {
            if (!errorDiv.hasAttribute('hidden')) {
                errorDiv.scrollIntoView({ behavior: 'smooth' });
                clearInterval(checkVisibility);
            }
          }, 500);
        } else {
          setTimeout(() => {
              const headerGroupHeight = ((announcementBar?.clientHeight || 0) + Header.clientHeight);
              const scrollVal = (window.scrollY + variantSelects.getBoundingClientRect().top) - headerGroupHeight;
              window.scrollTo({ top: scrollVal, behavior: 'smooth' })
          }, 500)
        }
      });
      closePopup.addEventListener('click', () => {
        closeVariablePopup();
        closeVariablePopupBuyNow()
      });
    }
 }
  
}
mobileStickyVar();
window.addEventListener("resize", mobileStickyVar);


var observerCartDrawer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.attributeName === 'class') {
      var cartDrawer = document.querySelector('cart-drawer');
      
      if (cartDrawer.classList.contains('active')) {
        productForm.classList.remove('sticky-variable'); 
        document.querySelector('body').classList.remove('variable-popup-open');
        sizeFirstLineRemoveClass()
      }
    }
  });
});

observerCartDrawer.observe(document.querySelector('cart-drawer'), {
  attributes: true 
});
