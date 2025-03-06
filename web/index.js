import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import { OpenAI } from "openai";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "8081",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// Request handler for AI recommendations
app.post("/api/recommendations", shopify.validateAuthenticatedSession(), async (req, res) => {
  try {
    const { productId, shopId, recommendationType } = req.body;
    const session = res.locals.shopify.session;

    // Fetch current product details
    const product = await shopify.api.rest.Product.find({
      session,
      id: productId,
    });

    // Get all products from the store
    const allProducts = await shopify.api.rest.Product.all({
      session,
    });

    // Generate embeddings for the current product
    const productEmbedding = await generateEmbedding(product.title + " " + product.body_html);

    // Generate embeddings for all products and find similar ones
    const recommendations = await findSimilarProducts(
      productEmbedding,
      allProducts,
      recommendationType,
      product.id
    );

    res.status(200).json({
      products: recommendations
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({
      error: "Failed to generate recommendations"
    });
  }
});

async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data[0].embedding;
}

async function findSimilarProducts(sourceEmbedding, allProducts, recommendationType, currentProductId) {
  const productsWithScores = await Promise.all(
    allProducts
      .filter(product => product.id !== currentProductId)
      .map(async (product) => {
        const embedding = await generateEmbedding(product.title + " " + product.body_html);
        const similarity = cosineSimilarity(sourceEmbedding, embedding);
        return {
          ...product,
          similarity
        };
      })
  );

  // Sort by similarity and take top 4
  return productsWithScores
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 4)
    .map(product => ({
      id: product.id,
      title: product.title,
      url: `/products/${product.handle}`,
      price: product.variants[0].price,
      featured_image: product.images[0]?.src || ''
    }));
}

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

app.use(serveStatic(STATIC_PATH));
app.use("/*", shopify.ensureInstalledOnShop(), async (req, res, next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT); 