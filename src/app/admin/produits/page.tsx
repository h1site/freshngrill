'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-browser';
import { transformProduct, Product } from '@/types/shop';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Truck,
  Loader2,
  Search,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'archived'>(
    'all'
  );
  const [deleting, setDeleting] = useState<number | null>(null);

  const supabase = createClient();

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data } = await query;
    setProducts(data?.map(transformProduct) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const toggleStatus = async (product: Product) => {
    const newStatus = product.status === 'active' ? 'draft' : 'active';
    await supabase.from('products' as never).update({ status: newStatus } as never).eq('id', product.id);
    fetchProducts();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) return;
    setDeleting(id);
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
    setDeleting(null);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === 'active').length,
    draft: products.filter((p) => p.status === 'draft').length,
    digital: products.filter((p) => p.productType === 'digital').length,
  };

  return (
    <div>
      {/* Test Mode Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <p className="text-sm text-yellow-800">
          <strong>Mode test Stripe</strong> - Les paiements ne sont pas réels.
        </p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-gray-500 mt-1">
            {stats.total} produits ({stats.active} actifs, {stats.draft} brouillons)
          </p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center gap-2 bg-[#F77313] hover:bg-[#e56200] text-white font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouveau produit
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'draft', 'archived'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-[#F77313] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all'
                  ? 'Tous'
                  : f === 'active'
                  ? 'Actifs'
                  : f === 'draft'
                  ? 'Brouillons'
                  : 'Archivés'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products list */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#F77313]" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Aucun produit trouvé
          </h3>
          <p className="text-gray-500 mb-4">
            Commencez par ajouter votre premier produit
          </p>
          <Link
            href="/admin/produits/nouveau"
            className="inline-flex items-center gap-2 text-[#F77313] hover:underline"
          >
            <Plus className="w-4 h-4" />
            Ajouter un produit
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Produit
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Type
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Prix
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Stock
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Statut
                </th>
                <th className="text-right px-6 py-4 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.featuredImage ? (
                          <Image
                            src={product.featuredImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Package className="w-6 h-6 m-3 text-gray-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.productType === 'digital' ? (
                      <span className="inline-flex items-center gap-1 text-purple-600 text-sm">
                        <Download className="w-4 h-4" />
                        Numérique
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-blue-600 text-sm">
                        <Truck className="w-4 h-4" />
                        Physique
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        {formatPrice(product.compareAtPrice, product.currency)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {product.trackInventory ? (
                      <span
                        className={`font-medium ${
                          product.inventoryQuantity > 10
                            ? 'text-green-600'
                            : product.inventoryQuantity > 0
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }`}
                      >
                        {product.inventoryQuantity}
                      </span>
                    ) : (
                      <span className="text-gray-400">∞</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(product)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : product.status === 'draft'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.status === 'active' ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Actif
                        </>
                      ) : product.status === 'draft' ? (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Brouillon
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Archivé
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/boutique/${product.slug}`}
                        target="_blank"
                        className="p-2 text-gray-500 hover:text-[#F77313] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Voir"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link
                        href={`/admin/produits/${product.id}`}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        disabled={deleting === product.id}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Supprimer"
                      >
                        {deleting === product.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
