import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { TrendingPerfume, Product } from '../../types';

const TrendingPerfumes: React.FC = () => {
  const [trendingPerfumes, setTrendingPerfumes] = useState<TrendingPerfume[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');

  useEffect(() => {
    fetchTrendingPerfumes();
    fetchPerfumeProducts();
  }, []);

  const fetchTrendingPerfumes = async () => {
    try {
      const { data, error } = await supabase
        .from('trending_perfumes')
        .select(`
          *,
          product:products(
            *,
            brand:brands(name),
            category:categories(name)
          )
        `)
        .order('order_index');
      
      if (error) throw error;
      setTrendingPerfumes(data || []);
    } catch (error) {
      console.error('Error fetching trending perfumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerfumeProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(name),
          category:categories(name)
        `)
        .eq('categories.name', 'Perfumes')
        .order('title');
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching perfume products:', error);
    }
  };

  const handleAddTrending = async () => {
    if (!selectedProductId) return;

    try {
      const maxOrder = Math.max(...trendingPerfumes.map(tp => tp.order_index), 0);
      
      const { error } = await supabase
        .from('trending_perfumes')
        .insert([{
          product_id: selectedProductId,
          order_index: maxOrder + 1,
          is_active: true
        }]);
      
      if (error) throw error;
      fetchTrendingPerfumes();
      setShowModal(false);
      setSelectedProductId('');
    } catch (error) {
      console.error('Error adding trending perfume:', error);
      alert('Error adding trending perfume');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this trending perfume?')) return;

    try {
      const { error } = await supabase
        .from('trending_perfumes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchTrendingPerfumes();
    } catch (error) {
      console.error('Error deleting trending perfume:', error);
      alert('Error deleting trending perfume');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('trending_perfumes')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      fetchTrendingPerfumes();
    } catch (error) {
      console.error('Error updating trending perfume status:', error);
      alert('Error updating status');
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentItem = trendingPerfumes.find(tp => tp.id === id);
    if (!currentItem) return;

    const currentIndex = trendingPerfumes.findIndex(tp => tp.id === id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= trendingPerfumes.length) return;

    const targetItem = trendingPerfumes[targetIndex];

    try {
      // Swap order_index values
      await Promise.all([
        supabase
          .from('trending_perfumes')
          .update({ order_index: targetItem.order_index })
          .eq('id', currentItem.id),
        supabase
          .from('trending_perfumes')
          .update({ order_index: currentItem.order_index })
          .eq('id', targetItem.id)
      ]);

      fetchTrendingPerfumes();
    } catch (error) {
      console.error('Error reordering trending perfumes:', error);
      alert('Error reordering items');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Trending Perfumes Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Trending Perfume
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trendingPerfumes.map((trending, index) => (
                <tr key={trending.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center space-x-2">
                      <span>#{trending.order_index}</span>
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => handleReorder(trending.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleReorder(trending.id, 'down')}
                          disabled={index === trendingPerfumes.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded object-cover"
                          src={trending.product?.image_url || 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=100'}
                          alt={trending.product?.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {trending.product?.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trending.product?.brand?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    KSH {trending.product?.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(trending.id, trending.is_active)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        trending.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {trending.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(trending.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {trendingPerfumes.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No trending perfumes</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a trending perfume.</p>
        </div>
      )}

      {/* Add Trending Perfume Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Trending Perfume</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Perfume Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Choose a perfume...</option>
                  {products
                    .filter(product => !trendingPerfumes.some(tp => tp.product_id === product.id))
                    .map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.title} - {product.brand?.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTrending}
                  disabled={!selectedProductId}
                  className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingPerfumes;