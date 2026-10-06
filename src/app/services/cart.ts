import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Main reactive state
  items = signal<CartItem[]>([
    {
      id: crypto.randomUUID(),
      price: null,
      quantity: 1,
    },
  ]);

  // Payment state
  paymentAmount = signal<number | null>(null);

  // Helper for individual subtotal
  getItemSubtotal(item: CartItem): number {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return price * qty;
  }

  // Computed total quantity across all items
  totalItemCount = computed(() =>
    this.items().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
  );

  // Computed grand total across all items
  grandTotal = computed(() =>
    this.items().reduce((sum, item) => sum + this.getItemSubtotal(item), 0),
  );

  // Computed change due calculation
  changeDue = computed(() => {
    const payment = Number(this.paymentAmount()) || 0;
    const total = this.grandTotal();
    return Math.max(0, payment - total);
  });

  // State mutation methods
  addItem() {
    const newItem: CartItem = {
      id: crypto.randomUUID(),
      price: null,
      quantity: 1,
    };
    this.items.update((current) => [...current, newItem]);
  }

  removeItem(id: string) {
    this.items.update((current) => current.filter((item) => item.id !== id));
  }

  updateItemPrice(id: string, price: number | null) {
    this.items.update((current) =>
      current.map((item) => (item.id === id ? { ...item, price } : item)),
    );
  }

  updateItemQuantity(id: string, quantity: number | null) {
    const validQty = quantity === null ? 0 : Math.max(0, quantity);
    this.items.update((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity: validQty } : item)),
    );
  }

  updatePaymentAmount(amount: number | null) {
    this.paymentAmount.set(amount);
  }

  clearAll() {
    this.items.set([
      {
        id: crypto.randomUUID(),
        price: null,
        quantity: 1,
      },
    ]);
    this.paymentAmount.set(null);
  }
}
