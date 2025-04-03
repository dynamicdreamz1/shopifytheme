/*class Accordion extends HTMLElement {
    constructor() {
      super()
      this.accordionHeaders = this.querySelectorAll("[js-accordion-header]");
      this.accordionItems = this.querySelectorAll("[js-accordion-item]");
      this.init();
    }
  
    init() {
      this.accordionHeaders.forEach(header => {
  
        const parent = header.closest('[js-accordion-item]');
        if(parent.classList.contains('active')) {
          const height = parent.querySelector('.metafield-rich_text_field').clientHeight;
          const currentAccordionBody = parent.querySelector('[js-accordion-body]');
          currentAccordionBody.style.height = `${height}px`;
        }
  
        header.addEventListener('click', () => {
          const parent = header.closest('[js-accordion-item]');
          console.log({ parent })
          if(parent.classList.contains('active')) {
            const currentAccordionBody = parent.querySelector('[js-accordion-body]');
            currentAccordionBody.style.height = `0px`;
            parent.classList.remove('active');
          } else {
            this.accordionItems.forEach(item => {
              const parent = item.closest('[js-accordion-item]');
              const currentAccordionBody = parent.querySelector('[js-accordion-body]');
              currentAccordionBody.style.height = `0px`;
              item.classList.remove('active')
            })
            const height = parent.querySelector('.metafield-rich_text_field').clientHeight;
            const currentAccordionBody = parent.querySelector('[js-accordion-body]');
            currentAccordionBody.style.height = `${height}px`;
            parent.classList.add('active');
          }
        })
  
      })
    } 
  }
  
  customElements.define('accordion-section', Accordion);*/