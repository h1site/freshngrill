export interface Product {
  id: number;
  name: string;
  nameEn?: string;
  slug: string;
  description?: string;
  descriptionEn?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  productType: 'physical' | 'digital';
  digitalFileUrl?: string;
  downloadLimit: number;
  weightGrams?: number;
  requiresShipping: boolean;
  trackInventory: boolean;
  inventoryQuantity: number;
  allowBackorder: boolean;
  featuredImage?: string;
  images: string[];
  seoTitle?: string;
  seoDescription?: string;
  status: 'draft' | 'active' | 'archived';
  featured: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerEmail: string;
  customerName?: string;
  userId?: string;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  shippingAddress?: ShippingAddress;
  shippingMethod?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  customerNotes?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  items?: OrderItem[];
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'unpaid'
  | 'paid'
  | 'refunded'
  | 'partially_refunded';

export type FulfillmentStatus =
  | 'unfulfilled'
  | 'partially_fulfilled'
  | 'fulfilled';

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productImage?: string;
  productType: 'physical' | 'digital';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  downloadCount: number;
  downloadToken?: string;
  downloadExpiresAt?: string;
}

// Helpers pour transformer les données Supabase
export function transformProduct(data: Record<string, unknown>): Product {
  return {
    id: data.id as number,
    name: data.name as string,
    nameEn: data.name_en as string | undefined,
    slug: data.slug as string,
    description: data.description as string | undefined,
    descriptionEn: data.description_en as string | undefined,
    price: parseFloat(String(data.price)),
    compareAtPrice: data.compare_at_price ? parseFloat(String(data.compare_at_price)) : undefined,
    currency: (data.currency as string) || 'CAD',
    productType: (data.product_type as 'physical' | 'digital') || 'physical',
    digitalFileUrl: data.digital_file_url as string | undefined,
    downloadLimit: (data.download_limit as number) || 3,
    weightGrams: data.weight_grams as number | undefined,
    requiresShipping: data.requires_shipping !== false,
    trackInventory: (data.track_inventory as boolean) || false,
    inventoryQuantity: (data.inventory_quantity as number) || 0,
    allowBackorder: (data.allow_backorder as boolean) || false,
    featuredImage: data.featured_image as string | undefined,
    images: (data.images as string[]) || [],
    seoTitle: data.seo_title as string | undefined,
    seoDescription: data.seo_description as string | undefined,
    status: (data.status as 'draft' | 'active' | 'archived') || 'draft',
    featured: (data.featured as boolean) || false,
    stripeProductId: data.stripe_product_id as string | undefined,
    stripePriceId: data.stripe_price_id as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  };
}

export function transformOrder(data: Record<string, unknown>): Order {
  return {
    id: data.id as number,
    orderNumber: data.order_number as string,
    customerEmail: data.customer_email as string,
    customerName: data.customer_name as string | undefined,
    userId: data.user_id as string | undefined,
    subtotal: parseFloat(String(data.subtotal)),
    shippingCost: parseFloat(String(data.shipping_cost || 0)),
    taxAmount: parseFloat(String(data.tax_amount || 0)),
    total: parseFloat(String(data.total)),
    currency: (data.currency as string) || 'CAD',
    status: data.status as OrderStatus,
    paymentStatus: data.payment_status as PaymentStatus,
    fulfillmentStatus: data.fulfillment_status as FulfillmentStatus,
    shippingAddress: data.shipping_address as ShippingAddress | undefined,
    shippingMethod: data.shipping_method as string | undefined,
    trackingNumber: data.tracking_number as string | undefined,
    trackingUrl: data.tracking_url as string | undefined,
    customerNotes: data.customer_notes as string | undefined,
    internalNotes: data.internal_notes as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
    paidAt: data.paid_at as string | undefined,
    shippedAt: data.shipped_at as string | undefined,
    deliveredAt: data.delivered_at as string | undefined,
  };
}
