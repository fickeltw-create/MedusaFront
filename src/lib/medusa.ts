const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

// Medusa API Client for making requests to your Medusa backend
export class MedusaClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = MEDUSA_BACKEND_URL;
    this.apiKey = MEDUSA_PUBLISHABLE_KEY || '';
  }

  // Generic fetch method for Medusa Store API
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/store${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': this.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Medusa API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Get all products
  async getProducts(limit = 100, offset = 0) {
    return this.fetch<{ products: any[]; count: number }>(
      `/products?limit=${limit}&offset=${offset}`
    );
  }

  // Get single product by handle
  async getProductByHandle(handle: string) {
    return this.fetch<{ product: any }>(`/products/${handle}`);
  }

  // Get all collections/categories
  async getCollections() {
    return this.fetch<{ collections: any[] }>('/collections');
  }

  // Create a cart
  async createCart(items: { variant_id: string; quantity: number }[]) {
    return this.fetch<{ cart: any }>('/carts', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  }

  // Get cart by ID
  async getCart(cartId: string) {
    return this.fetch<{ cart: any }>(`/carts/${cartId}`);
  }

  // Add item to cart
  async addToCart(cartId: string, variantId: string, quantity: number) {
    return this.fetch<{ cart: any }>(`/carts/${cartId}/line-items`, {
      method: 'POST',
      body: JSON.stringify({ variant_id: variantId, quantity }),
    });
  }

  // Create order from cart (triggers Medusa's payment flow)
  async createOrder(cartId: string) {
    return this.fetch<{ order: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify({ cart_id: cartId }),
    });
  }

  // Get regions (for shipping/tax calculations)
  async getRegions() {
    return this.fetch<{ regions: any[] }>('/regions');
  }
}

// Export singleton instance
export const medusaClient = new MedusaClient();