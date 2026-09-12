import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 'Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Replace Requested' | 'Return Requested';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: 'cod' | 'bank';
  status: OrderStatus;
  placedAt: string;
  replaceReason?: string;
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  requestReplace: (orderId: string, reason: string) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),
      requestReplace: (orderId, reason) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, status: 'Replace Requested', replaceReason: reason }
              : o
          ),
        })),
    }),
    { name: 'glamourgrid-orders' }
  )
);
