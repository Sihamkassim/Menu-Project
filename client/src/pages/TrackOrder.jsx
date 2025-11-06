import { useState } from 'react';
import { orderAPI } from '../config/api';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNumber) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const response = await orderAPI.getByOrderNumber(orderNumber);
      if (response.data.success) {
        setOrder(response.data.data);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Track My Order</h1>
        <form onSubmit={handleTrack} className="mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter your order number (e.g., ORD-1704153600000)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        {order && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Order Details</h2>
            <p className="mb-2"><span className="font-semibold">Order Number:</span> {order.orderNumber}</p>
            <p className="mb-2"><span className="font-semibold">Name:</span> {order.customerName}</p>
            <p className="mb-2"><span className="font-semibold">Phone:</span> {order.contactInfo.phone}</p>
            <p className="mb-2"><span className="font-semibold">Status:</span> <span className="px-2 py-1 rounded bg-orange-100 text-orange-800 font-semibold">{order.status}</span></p>
            <p className="mb-2"><span className="font-semibold">Notes:</span> {order.notes || 'None'}</p>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Items:</h3>
              <ul className="list-disc pl-6">
                {order.items.map((item) => (
                  <li key={item.menuItem}>
                    {item.name} x {item.quantity} <span className="text-orange-600">${item.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 text-lg font-bold text-right">
              Total: <span className="text-orange-600">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
