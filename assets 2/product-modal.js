if (!customElements.get('product-modal')) {
  customElements.define(
    'product-modal',
    class ProductModal extends ModalDialog {
      constructor() {
        super();
      }

      hide() {
        super.hide();
      }

      show(opener) {
        super.show(opener);
        this.showActiveMedia();
      }

      showActiveMedia() {

        

         if(document.querySelector('.product-modal-main-slider')) {
              new Swiper ('.product-modal-main-slider').destroy(true, true);
              let modalSwiper = new Swiper ('.product-modal-main-slider', {
                slidesPerView: 1,
                centeredSlides: true,
                loop: false,
                autoHeight: true,
                navigation: {
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }
              });
              const activeMedia = this.querySelector(`[data-media-id="${this.openedBy.getAttribute('data-media-id')}"]`);
              if(activeMedia) {
                let currentIndex = activeMedia.closest('.swiper-slide').getAttribute('data-index');
               
                //setTimeout(() => {
                   //console.log('currentIndex', currentIndex);
                   modalSwiper.slideToLoop(Number(currentIndex));
               // modalSwiper.destroy(true, true)
               // }, 5000);
              }
            }
        
        
        // this.querySelectorAll(
        //   `[data-media-id]:not([data-media-id="${this.openedBy.getAttribute('data-media-id')}"])`
        // ).forEach((element) => {
        //   element.classList.remove('active');
        // });
        // const activeMedia = this.querySelector(`[data-media-id="${this.openedBy.getAttribute('data-media-id')}"]`);
        // const activeMediaTemplate = activeMedia.querySelector('template');
        // const activeMediaContent = activeMediaTemplate ? activeMediaTemplate.content : null;
        // activeMedia.classList.add('active');
        // activeMedia.scrollIntoView();

        // const container = this.querySelector('[role="document"]');
        // container.scrollLeft = (activeMedia.width - container.clientWidth) / 2;

        // if (
        //   activeMedia.nodeName == 'DEFERRED-MEDIA' &&
        //   activeMediaContent &&
        //   activeMediaContent.querySelector('.js-youtube')
        // )
        //   activeMedia.loadContent();
      }
    }
  );
}



