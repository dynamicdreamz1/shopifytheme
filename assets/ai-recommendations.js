class AIRecommendations {
  constructor() {
    this.container = document.querySelector('.ai-recommendations');
    if (!this.container) return;

    this.productsContainer = this.container.querySelector('.ai-recommendations__products');
    this.loadingElement = this.container.querySelector('.ai-recommendations__loading');
    this.productId = this.container.dataset.productId;
    this.shopId = this.container.dataset.shopId;
    this.recommendationType = this.getRecommendationType();

    this.init();
  }

  getRecommendationType() {
    const section = this.container.closest('.shopify-section');
    if (!section) return 'similar';
    
    const sectionSettings = window.sectionSettings?.[section.id];
    return sectionSettings?.recommendation_type || 'similar';
  }

  async init() {
    try {
      this.showLoading();
      const recommendations = await this.fetchRecommendations();
      this.renderRecommendations(recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      this.hideLoading();
    }
  }

  showLoading() {
    this.loadingElement.style.display = 'block';
  }

  hideLoading() {
    this.loadingElement.style.display = 'none';
  }

  async fetchRecommendations() {
    try {
      const response = await fetch('/apps/ai-recommendations/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: this.productId,
          shopId: this.shopId,
          recommendationType: this.recommendationType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  renderRecommendations(recommendations) {
    this.hideLoading();
    
    if (!recommendations || !recommendations.products || recommendations.products.length === 0) {
      this.productsContainer.innerHTML = '<p class="ai-recommendations__empty">No recommendations found</p>';
      return;
    }

    const productsHTML = recommendations.products.map(product => this.createProductCard(product)).join('');
    this.productsContainer.innerHTML = productsHTML;
  }

  createProductCard(product) {
    const formattedPrice = this.formatMoney(product.price);
    
    return `
      <div class="ai-recommendations__product">
        <a href="${product.url}" class="ai-recommendations__product-image">
          <img src="${product.featured_image}" 
               alt="${product.title}"
               loading="lazy"
               width="300"
               height="300">
        </a>
        <h3 class="ai-recommendations__product-title">
          <a href="${product.url}">${product.title}</a>
        </h3>
        <div class="ai-recommendations__product-price">
          ${formattedPrice}
        </div>
      </div>
    `;
  }

  formatMoney(cents) {
    if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
      return Shopify.formatMoney(cents);
    }

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(cents / 100);
  }
}

// Initialize the recommendations
document.addEventListener('DOMContentLoaded', () => {
  new AIRecommendations();
}); 