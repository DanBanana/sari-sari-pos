import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Main reactive state
  items = signal<CartItem[]>([{ id: crypto.randomUUID(), name: '', price: null, quantity: 1 }]);

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

  // State mutation methods (creates fresh object references to trigger signal updates)
  addItem() {
    const newItem: CartItem = {
      id: crypto.randomUUID(),
      name: '',
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

  updateItemQuantity(id: string, quantity: number) {
    const validQty = quantity < 1 ? 1 : quantity;
    this.items.update((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity: validQty } : item)),
    );
  }

  updateItemName(id: string, name: string) {
    this.items.update((current) =>
      current.map((item) => (item.id === id ? { ...item, name } : item)),
    );
  }

  clearAll() {
    this.items.set([{ id: crypto.randomUUID(), name: '', price: null, quantity: 1 }]);
  }
}
