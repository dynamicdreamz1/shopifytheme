# Shopify AI Product Recommendations

This app uses OpenAI to provide intelligent product recommendations for your Shopify store. It analyzes product descriptions and images to suggest similar or complementary products to your customers.

## Features

- AI-powered product recommendations
- Multiple recommendation types (similar, complementary, personalized)
- Easy integration with your Shopify theme
- Customizable display options
- Responsive design

## Setup Instructions

1. **Create a Shopify App**
   - Go to your Shopify Partner dashboard
   - Create a new app
   - Set the App URL and Allowed redirection URL(s) from your `shopify.app.toml`

2. **Environment Setup**
   Create a `.env` file with the following variables:
   ```
   SHOPIFY_API_KEY=your_api_key
   SHOPIFY_API_SECRET=your_api_secret
   OPENAI_API_KEY=your_openai_api_key
   SCOPES=read_products,read_customers
   HOST=your_app_url
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run the App**
   Development mode:
   ```bash
   npm run dev
   ```
   Production mode:
   ```bash
   npm run serve
   ```

5. **Add to Theme**
   - In your Shopify admin, go to Online Store > Themes
   - Click "Customize" on your active theme
   - Add the "AI Recommendations" section to your product pages

## Usage

1. **Section Configuration**
   - Choose the recommendation type (similar/complementary/personalized)
   - Set the number of products to display
   - Customize the heading and button text
   - Enable/disable the "View all" button

2. **Customization**
   - The section's appearance can be customized through the theme editor
   - Additional styling can be added through your theme's CSS

## Technical Details

- Uses OpenAI's text-embedding-ada-002 model for generating product embeddings
- Implements cosine similarity for finding similar products
- Caches embeddings to reduce API calls
- Responsive design works on all device sizes

## Requirements

- Node.js >= 16.0.0
- Shopify Partner account
- OpenAI API key
- Shopify store on a paid plan

## Support

For support, please create an issue in the GitHub repository or contact our support team.

## License

This project is licensed under the UNLICENSED license. 