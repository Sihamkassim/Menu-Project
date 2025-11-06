import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Package, RefreshCw } from 'lucide-react';
import { orderAPI } from '../config/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import OrderStatusBadge from '../components/OrderStatusBadge';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getByOrderNumber(id);
      if (response.data.success) {
        setOrder(response.data.data);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading order details..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrder} />;
  if (!order) return <ErrorMessage message="Order not found" />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Tracking</h1>
              <p className="text-gray-600">Order #{order.orderNumber}</p>
            </div>
            <button
              onClick={fetchOrder}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>

          {/* Status */}
          <div className="mb-6">
            <OrderStatusBadge status={order.status} />
          </div>

          {/* Customer Info */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
            <div className="space-y-1 text-gray-600">
              <p><span className="font-medium">Name:</span> {order.customerName}</p>
              <p><span className="font-medium">Phone:</span> {order.contactInfo.phone}</p>
              {order.contactInfo.email && (
                <p><span className="font-medium">Email:</span> {order.contactInfo.email}</p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-orange-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold text-gray-800 mb-2">Notes</h3>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-center text-xl font-bold">
            <span className="text-gray-800">Total Amount:</span>
            <span className="text-orange-600">${order.totalAmount.toFixed(2)}</span>
          </div>

          {/* Order Time */}
          <div className="mt-4 text-sm text-gray-500">
            <p>Order placed: {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Order Status Timeline</h3>
          <div className="space-y-4">
            {['Pending', 'Preparing', 'Served', 'Completed'].map((status, index) => {
              const statuses = ['Pending', 'Preparing', 'Served', 'Completed'];
              const currentIndex = statuses.indexOf(order.status);
              const isCompleted = index <= currentIndex;
              const isCancelled = order.status === 'Cancelled';

              return (
                <div key={status} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCancelled && index > 0
                        ? 'bg-gray-300'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300'
                    }`}
                  >
                    {isCompleted && !isCancelled ? '✓' : index + 1}
                  </div>
                  <span
                    className={`font-medium ${
                      isCompleted && !isCancelled ? 'text-gray-800' : 'text-gray-400'
                    }`}
                  >
                    {status}
                  </span>
                </div>
              );
            })}
            {order.status === 'Cancelled' && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white">
                  ✗
                </div>
                <span className="font-medium text-red-600">Cancelled</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
