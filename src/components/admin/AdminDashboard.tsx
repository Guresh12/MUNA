import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Product, Order, Brand, Category } from '../../types';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeBrands: number;
  totalCategories: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeBrands: 0,
    totalCategories: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [
        productsResult,
        ordersResult,
        brandsResult,
        categoriesResult,
        recentOrdersResult
      ] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('orders').select('*'),
        supabase.from('brands').select('*'),
        supabase.from('categories').select('*'),
        supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      // Calculate stats
      const products = productsResult.data || [];
      const orders = ordersResult.data || [];
      const brands = brandsResult.data || [];
      const categories = categoriesResult.data || [];
      const recentOrdersData = recentOrdersResult.data || [];

      // Calculate total revenue
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        activeBrands: brands.length,
        totalCategories: categories.length
      });

      setRecentOrders(recentOrdersData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `KSH ${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const dashboardStats = [
    {
      name: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      change: stats.totalProducts > 0 ? '+' + stats.totalProducts : '0',
      changeType: 'positive'
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      change: stats.totalOrders > 0 ? '+' + stats.totalOrders : '0',
      changeType: 'positive'
    },
    {
      name: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      change: stats.totalRevenue > 0 ? formatCurrency(stats.totalRevenue) : 'KSH 0',
      changeType: 'positive'
    },
    {
      name: 'Active Brands',
      value: stats.activeBrands.toString(),
      icon: Users,
      change: stats.activeBrands > 0 ? '+' + stats.activeBrands : '0',
      changeType: 'positive'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome to Admin Dashboard</h1>
        <p className="text-gray-600">Manage your luxury e-commerce platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {item.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
        </div>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at || '').toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500">Orders will appear here once customers start placing them.</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.href = '/admin/products'}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors text-center"
          >
            Add Product
          </button>
          <button
            onClick={() => window.location.href = '/admin/categories'}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            Manage Categories
          </button>
          <button
            onClick={() => window.location.href = '/admin/brands'}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-center"
          >
            Manage Brands
          </button>
          <button
            onClick={() => window.location.href = '/admin/orders'}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-center"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;