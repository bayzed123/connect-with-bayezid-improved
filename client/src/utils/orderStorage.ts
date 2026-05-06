/**
 * Order Storage Utility
 * Persists order details to browser localStorage for data recovery after page refresh
 */

export interface StoredOrder {
  id: number;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  totalPrice: string;
  paymentMethod: string;
  transactionId: string;
  invoiceStatus: "pending" | "successful" | "failed";
  createdAt: string;
  paymentProofUrl?: string;
}

const STORAGE_KEY = "cwb_orders";
const RECENT_ORDER_KEY = "cwb_recent_order_id";

/**
 * Save order to localStorage
 */
export function saveOrderToStorage(order: StoredOrder): void {
  try {
    // Get existing orders
    const existing = getOrdersFromStorage();
    
    // Add or update order
    const index = existing.findIndex(o => o.id === order.id);
    if (index >= 0) {
      existing[index] = order;
    } else {
      existing.push(order);
    }
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    
    // Save as recent order
    localStorage.setItem(RECENT_ORDER_KEY, String(order.id));
    
    console.log("[OrderStorage] Order saved:", order.id);
  } catch (error) {
    console.error("[OrderStorage] Failed to save order:", error);
  }
}

/**
 * Get all orders from localStorage
 */
export function getOrdersFromStorage(): StoredOrder[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("[OrderStorage] Failed to retrieve orders:", error);
    return [];
  }
}

/**
 * Get specific order by ID
 */
export function getOrderFromStorage(orderId: number): StoredOrder | null {
  try {
    const orders = getOrdersFromStorage();
    return orders.find(o => o.id === orderId) || null;
  } catch (error) {
    console.error("[OrderStorage] Failed to retrieve order:", error);
    return null;
  }
}

/**
 * Get most recent order ID
 */
export function getRecentOrderId(): number | null {
  try {
    const id = localStorage.getItem(RECENT_ORDER_KEY);
    return id ? parseInt(id) : null;
  } catch (error) {
    console.error("[OrderStorage] Failed to get recent order:", error);
    return null;
  }
}

/**
 * Delete order from localStorage
 */
export function deleteOrderFromStorage(orderId: number): void {
  try {
    const existing = getOrdersFromStorage();
    const filtered = existing.filter(o => o.id !== orderId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    console.log("[OrderStorage] Order deleted:", orderId);
  } catch (error) {
    console.error("[OrderStorage] Failed to delete order:", error);
  }
}

/**
 * Clear all orders from localStorage
 */
export function clearOrdersFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RECENT_ORDER_KEY);
    console.log("[OrderStorage] All orders cleared");
  } catch (error) {
    console.error("[OrderStorage] Failed to clear orders:", error);
  }
}

/**
 * Update order status in localStorage
 */
export function updateOrderStatusInStorage(
  orderId: number,
  status: "pending" | "successful" | "failed"
): void {
  try {
    const order = getOrderFromStorage(orderId);
    if (order) {
      order.invoiceStatus = status;
      saveOrderToStorage(order);
      console.log("[OrderStorage] Order status updated:", orderId, status);
    }
  } catch (error) {
    console.error("[OrderStorage] Failed to update order status:", error);
  }
}
