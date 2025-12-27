'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { transformOrder, Order } from '@/types/shop';
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  Eye,
  Loader2,
  Mail,
  DollarSign,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const supabase = createClient();

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data } = await query;
    setOrders(data?.map(transformOrder) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const updateOrderStatus = async (orderId: number, status: string) => {
    const updates: Record<string, unknown> = { status };

    if (status === 'shipped') {
      updates.shipped_at = new Date().toISOString();
      updates.fulfillment_status = 'fulfilled';
    } else if (status === 'delivered') {
      updates.delivered_at = new Date().toISOString();
    }

    await supabase.from('orders' as never).update(updates as never).eq('id', orderId);
    fetchOrders();
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'paid':
        return <DollarSign className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
      case 'refunded':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'paid':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-purple-100 text-purple-700';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700';
      case 'refunded':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'paid':
        return 'Payée';
      case 'processing':
        return 'En traitement';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      case 'refunded':
        return 'Remboursée';
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending' || o.status === 'paid')
      .length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    revenue: orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div>
      {/* Test Mode Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <p className="text-sm text-yellow-800">
          <strong>Mode test Stripe</strong> - Ces commandes sont des tests.
        </p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-500 mt-1">
            {stats.total} commandes · {formatPrice(stats.revenue, 'CAD')} de revenus
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#F77313] transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Actualiser
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">À traiter</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">En traitement</p>
          <p className="text-2xl font-bold text-purple-600">
            {stats.processing}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Expédiées</p>
          <p className="text-2xl font-bold text-indigo-600">{stats.shipped}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Revenus</p>
          <p className="text-2xl font-bold text-green-600">
            {formatPrice(stats.revenue, 'CAD')}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par # commande, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              'all',
              'paid',
              'processing',
              'shipped',
              'delivered',
              'refunded',
            ].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-[#F77313] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'Toutes' : getStatusLabel(f)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#F77313]" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Aucune commande
          </h3>
          <p className="text-gray-500">
            Les nouvelles commandes apparaîtront ici
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Commande
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Client
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Date
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Total
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
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/commandes/${order.id}`}
                      className="font-mono font-medium text-[#F77313] hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.customerName || 'Client'}
                      </p>
                      <a
                        href={`mailto:${order.customerEmail}`}
                        className="text-sm text-gray-500 hover:text-[#F77313] flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        {order.customerEmail}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {formatPrice(order.total, order.currency)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/commandes/${order.id}`}
                        className="p-2 text-gray-500 hover:text-[#F77313] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>

                      {/* Quick status actions */}
                      {order.status === 'paid' && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, 'processing')
                          }
                          className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Marquer en traitement"
                        >
                          <Package className="w-5 h-5" />
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Marquer expédiée"
                        >
                          <Truck className="w-5 h-5" />
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, 'delivered')
                          }
                          className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                          title="Marquer livrée"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
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
