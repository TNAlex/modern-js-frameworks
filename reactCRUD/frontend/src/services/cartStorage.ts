import { Product } from "./productsApi";

export interface CartItem extends Product {
  quantity: number;
}

const CART_KEY = "shopping_cart";
const CART_UPDATED_EVENT = "cart:updated";

function readCart(): CartItem[] {
  const rawCart = localStorage.getItem(CART_KEY);

  if (!rawCart) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawCart) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function getCartItems(): CartItem[] {
  return readCart();
}

export function getCartCount(): number {
  return readCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function addToCart(product: Product): void {
  const cart = readCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  writeCart(cart);
}

export function updateCartItemQuantity(
  productId: number,
  quantity: number,
): void {
  const cart = readCart();
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex === -1) {
    return;
  }

  if (quantity <= 0) {
    cart.splice(itemIndex, 1);
  } else {
    cart[itemIndex] = {
      ...cart[itemIndex],
      quantity,
    };
  }

  writeCart(cart);
}

export function removeFromCart(productId: number): void {
  const cart = readCart().filter((item) => item.id !== productId);
  writeCart(cart);
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function subscribeToCartChanges(handler: () => void): () => void {
  window.addEventListener(CART_UPDATED_EVENT, handler);

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, handler);
  };
}
