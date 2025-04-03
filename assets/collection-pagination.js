class collectionPagination extends HTMLElement {
    constructor() {
      super();

        if(window.location.pathname == "/search") {
          this.paginationItems = this.querySelectorAll("[js-pagination-item]");
        } else {
          
          this.mainCollection = document.querySelector("[js-main-collection]");
          this.collectionId = this.mainCollection.getAttribute('data-section-id');
           this.paginationItems = this.querySelectorAll("[js-pagination-item]");
        }
       
       this.init();
    };

    init() {
        this.paginationItems.forEach( item => {
          item.addEventListener('click', evt => {
            const limit = evt.currentTarget.getAttribute("data-products-limit");

            this.updateState(evt.currentTarget);
            this.updateHistoryState(limit);
            document.dispatchEvent(new Event("update:scroll"));

             if(window.location.pathname == "/search") {
                location.reload();
             } else {
               this.updatePagination(limit);
             }
            
          })
        })
    }

    updateState(target) {
        this.paginationItems.forEach( item => item.classList.remove('active'));
        target.classList.add('active');
    };

    updateHistoryState(limit) {
        const url = new URL(location.href);
        url.searchParams.set("limit", limit);
        url.searchParams.set('page', 1);
        window.history.replaceState({path: location.href}, '', url);
    };

  
    updatePagination(limit) {
        let url;
        if(location.search) {
            url = `${location.origin}${location.pathname}${location.search}&section_id=${this.collectionId}&limit=${limit}`
        }else {
            url = `${location.origin}${location.pathname}?section_id=${this.collectionId}&limit=${limit}`
        };

        fetch(url).then(function(response) {
            return response.text();
        }).then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            this.mainCollection.innerHTML = doc.querySelector('[js-main-collection]').innerHTML;
        });
    }
}
  
customElements.define('collection-pagination', collectionPagination);