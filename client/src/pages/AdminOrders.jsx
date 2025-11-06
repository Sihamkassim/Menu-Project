import { useState, useEffect } from 'react';
import { orderAPI } from '../config/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import OrderStatusBadge from '../components/OrderStatusBadge';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const statuses = ['All', 'Pending', 'Preparing', 'Served', 'Completed', 'Cancelled'];

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, statsResponse] = await Promise.all([
        orderAPI.getAll(),
        orderAPI.getStats(),
      ]);

      if (ordersResponse.data.success) {
        setOrders(ordersResponse.data.data);
      }
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredOrders = orders.filter(
    (order) => filterStatus === 'All' || order.status === filterStatus
  );

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Orders Dashboard</h1>
          <button
            onClick={fetchData}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            </div>
            <div className="bg-blue-50 rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Preparing</p>
              <p className="text-2xl font-bold text-blue-600">{stats.preparingOrders}</p>
            </div>
            <div className="bg-green-50 rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Served</p>
              <p className="text-2xl font-bold text-green-600">{stats.servedOrders}</p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-gray-600">{stats.completedOrders}</p>
            </div>
            <div className="bg-orange-50 rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-orange-600">${stats.revenue.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === status
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-gray-600">{order.customerName}</p>
                    <p className="text-sm text-gray-500">{order.contactInfo.phone}</p>
                  </div>
                  <div className="text-right">
                    <OrderStatusBadge status={order.status} />
                    <p className="text-xl font-bold text-orange-600 mt-2">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Items:</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-gray-800 font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.notes && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-1">Notes:</h4>
                    <p className="text-sm text-gray-600">{order.notes}</p>
                  </div>
                )}

                {/* Status Update Buttons */}
                {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {order.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'Preparing')}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Start Preparing
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'Cancelled')}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === 'Preparing' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'Served')}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Mark as Served
                      </button>
                    )}
                    {order.status === 'Served' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'Completed')}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Complete Order
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-600">
              No orders found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
