if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();
        
        this.form = this.querySelector('form');

        this.form.querySelector('[name=id]').disabled = false;
        
        // manipulate id name for upsell
        this.form.querySelector('input[name=id].product-variant-id')?.setAttribute('name', 'items[0][id]')
        this.form.querySelector('select[name=id].product-variant-id')?.setAttribute('name', 'items[0][id]')
        
        this.errorWrapper = this.form.querySelector('[js-pdp-form-error] ul')

        document.addEventListener('selectPDPOptions:change', this.getSelectionOption.bind(this));

        document.addEventListener('nativePropertySelectOptionDrop:init', this.nativeSelectOptionDrop.bind(this));

        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');

        if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

        this.hideErrors = this.dataset.hideErrors === 'true';
      }

      nativeSelectOptionDrop({detail}) {
        const context_ = detail

        let optionName = context_.dataset.optionName
        let isRequired = context_.getAttribute('required') != null
        let optionValue= context_.value

        let errAlreadyThere =  this.errorWrapper?.querySelector(`li[data-option-name="${optionName}"]`)
        if(errAlreadyThere && optionValue) {
          this.errorWrapper.removeChild(errAlreadyThere)
        }

        if(this.errorWrapper) {
          this.errorWrapper.style.display = 'none';
          if(this.errorWrapper?.childElementCount) {
            this.errorWrapper.style.display = 'block';
          }
        }
        
      }

      getSelectionOption({ detail }) {
        const context_ = detail.context

        let optionName = context_.dataset.optionName
        let isRequired = context_.getAttribute('required') != null
        let optionValue= context_.value

        let errAlreadyThere =  this.errorWrapper.querySelector(`li[data-option-name="${optionName}"]`)
        if(errAlreadyThere && optionValue) {
          this.errorWrapper.removeChild(errAlreadyThere)
        }
        if(this.errorWrapper) {
          this.errorWrapper.style.display = 'none';
        }
        if(this.errorWrapper?.childElementCount) {
          this.errorWrapper.style.display = 'block';
        }

      }

      formValidation() {
        this.errorWrapper.style.display = 'none';
        let requiredOptionSelects = this.form.querySelectorAll('[js-custom-option-select][required]')

        if(requiredOptionSelects) {
          requiredOptionSelects.forEach(el => {
            const optionName = el?.dataset.optionName
            let errAlreadyThere =  this.errorWrapper?.querySelector(`li[data-option-name="${optionName}"]`)
            if(el.value == '' && !errAlreadyThere) {
              let newError = document.createElement('li')
              newError.setAttribute('data-option-name', optionName)
              newError.textContent = `Please select ${optionName}`;
              this.errorWrapper?.appendChild(newError)
            }
          })
        }
      }
      onSubmitHandler(evt) {
  evt.preventDefault();

  if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

  this.handleErrorMessage();

  // Start showing loader immediately
  this.submitButton.setAttribute('aria-disabled', true);
  this.submitButton.classList.add('loading');
  this.querySelector('.loading__spinner').classList.remove('hidden');

  // Generate the refTimeStamp before adding any products
  const refTimeStamp = Date.now(); // Shared timestamp for both main and upsell products

  // First check for upsell products
  const upsellProducts = this.form.querySelectorAll('[js-upsell-product] input:checked');
  if (upsellProducts.length > 0) {
    // If there are upsell products, add them first
    this.addUpsellProducts(refTimeStamp)
      .then(() => {
        console.log('Upsell products added. Now adding main product.');
        return this.addMainProduct(refTimeStamp); // After upsell, add the main product with the same refTimeStamp
      })
      .catch((error) => {
        console.error('Error adding upsell products:', error);
      })
      .finally(() => {
        this.hideLoader(); // Hide loader after both upsell and main product are added
      });
  } else {
    // If no upsell products, directly add the main product
    this.addMainProduct(refTimeStamp)
      .finally(() => {
        this.hideLoader(); // Hide loader after adding the main product
      });
  }
}

hideLoader() {
  // Hide loader and reset submit button state
  this.submitButton.classList.remove('loading');
  this.submitButton.removeAttribute('aria-disabled');
  this.querySelector('.loading__spinner').classList.add('hidden');
}

// Add upsell products before the main product
addUpsellProducts(refTimeStamp) {
  return new Promise((resolve, reject) => {
    const upsellProducts = this.form.querySelectorAll('[js-upsell-product] input:checked');
    
    if (upsellProducts.length > 0) {
      let upsellFormData = new FormData();

      // Loop through upsell products and add them to the formData
      upsellProducts.forEach((elm, index_) => {
        if (elm.dataset.productId) {
          upsellFormData.append(`items[${index_}][id]`, Number(elm.dataset.productId));
          upsellFormData.append(`items[${index_}][quantity]`, 1);
          upsellFormData.append(`items[${index_}][properties][_ref_id]`, refTimeStamp); // Append the same refTimeStamp
        }
      });

      const upsellConfig = fetchConfig('javascript');
      upsellConfig.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete upsellConfig.headers['Content-Type'];
      upsellConfig.body = upsellFormData;

      fetch(`${routes.cart_add_url}`, upsellConfig)
        .then((response) => response.json())
        .then((response) => {
          if (!response.status) {
            console.log('Upsell products added to cart successfully');
            resolve(); // Resolve when upsell products are added
          } else {
            console.error('Failed to add upsell products');
            reject('Failed to add upsell products');
          }
        })
        .catch((e) => {
          console.error('Error adding upsell products:', e);
          reject(e);
        });
    } else {
      console.log('No upsell products selected.');
      resolve(); // Resolve if no upsell products are selected
    }
  });
}

// Add main product after upsell products (or directly if no upsell)
addMainProduct(refTimeStamp) {
  return new Promise((resolve, reject) => {
    const config = fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];

    const formData = new FormData(this.form);
    console.log('Adding main product to cart');

    // Append the same refTimeStamp to the main product
    formData.append('items[0][properties][_ref_id]', refTimeStamp);

    if (this.cart) {
      formData.append(
        'sections',
        this.cart.getSectionsToRender().map((section) => section.id)
      );
      formData.append('sections_url', window.location.pathname);
      this.cart.setActiveElement(document.activeElement);
    }

    config.body = formData;

    fetch(`${routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          publish(PUB_SUB_EVENTS.cartError, {
            source: 'product-form',
            productVariantId: formData.get('items[0][id]'), // Handle errors correctly
            errors: response.errors || response.description,
            message: response.message,
          });
          this.handleErrorMessage(response.description);

          const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
          if (!soldOutMessage) return;
          this.submitButton.setAttribute('aria-disabled', true);
          this.submitButton.querySelector('span').classList.add('hidden');
          soldOutMessage.classList.remove('hidden');
          this.error = true;
          reject('Main product sold out');
        } else {
          if (!this.cart) {
            window.location = window.routes.cart_url;
            return;
          }

          publish(PUB_SUB_EVENTS.cartUpdate, {
            source: 'product-form',
            productVariantId: formData.get('id'),
            cartData: response,
          });

          const quickAddModal = this.closest('quick-add-modal');
          if (quickAddModal) {
            document.body.addEventListener(
              'modalClosed',
              () => {
                setTimeout(() => {
                  this.cart.renderContents(response);
                });
              },
              { once: true }
            );
            quickAddModal.hide(true);
          } else {
            this.cart.renderContents(response);
            if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
          }

          resolve(); // Main product added successfully
        }
      })
      .catch((e) => {
        console.error(e); // Handle errors
        reject(e);
      });
  });
}



      handleErrorMessage(errorMessage = false) {
        if (this.hideErrors) return;

        this.errorMessageWrapper =
          this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }
    }
  );
}


