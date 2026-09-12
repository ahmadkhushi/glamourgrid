'use client';

import { useState } from 'react';
import AdminProductRow, { ProductData } from './AdminProductRow';
import AdminProductEditModal from './AdminProductEditModal';

interface AdminProductsTableProps {
  products: ProductData[];
}

export default function AdminProductsTable({ products }: AdminProductsTableProps) {
  // editingProduct lives HERE — outside the table — so the modal <div> is
  // rendered as a sibling of the table wrapper, never inside <tbody>.
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);

  return (
    // Relative wrapper so modal overlays correctly
    <div className="relative">
      {/* ── Products Table ── */}
      <div className="bg-[#16100a] border border-[#2a2018] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2a2018]">
              {['Image', 'Name / Slug', 'Category', 'Price ✎', 'Sale Price ✎', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left text-[10px] uppercase tracking-[0.2em] text-[#a89f91] px-5 py-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <AdminProductRow
                key={product.id}
                product={product}
                onEditClick={(p) => setEditingProduct(p)}
              />
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-[#a89f91] text-sm">
                  No products found.{' '}
                  <a href="/admin/products/new" className="text-[#d4af37] hover:underline">
                    Add product →
                  </a>
                </td>

              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Edit Modal — rendered OUTSIDE the table, as a sibling div ── */}
      {editingProduct && (
        <AdminProductEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSaved={(updated) => {
            // Update the stale editingProduct reference then close
            setEditingProduct(null);
            // Reload so the table row reflects the saved data without
            // complex state-sync gymnastics.
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
