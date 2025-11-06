import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, UtensilsCrossed, Package, CheckCircle, Clock, ChefHat, Utensils, ClipboardCopy, RefreshCw } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { orderAPI } from '../config/api';

const PlaceOrder = () => {
  const { items, updateQuantity, removeItem, getTotalAmount, clearOrder } = useOrderStore();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in' or 'takeaway'
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [copied, setCopied] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    if (confirmation?.orderNumber) {
      navigator.clipboard.writeText(confirmation.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const fetchOrderDetails = async () => {
    if (!confirmation?.orderNumber) return;
    try {
      setTrackingLoading(true);
      const response = await orderAPI.getByOrderNumber(confirmation.orderNumber);
      if (response.data.success) {
        setOrderDetails(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch order details:', err);
    } finally {
      setTrackingLoading(false);
    }
  };

  useEffect(() => {
    if (confirmation) {
      fetchOrderDetails();
      const interval = setInterval(fetchOrderDetails, 30000); // Auto-refresh every 30s
      return () => clearInterval(interval);
    }
  }, [confirmation]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      setError('Please add items to your order');
      return;
    }

    if (!customerName || !phone) {
      setError('Please fill in all required fields');
      return;
    }

    if (orderType === 'dine-in' && !tableNumber) {
      setError('Please provide table number for dine-in orders');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderData = {
        items: items.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
        })),
        customerName,
        contactInfo: { phone, email },
        notes: `${orderType === 'takeaway' ? 'TAKEAWAY' : 'DINE-IN'} ${
          orderType === 'dine-in' ? `(Table ${tableNumber})` : ''
        } ${notes ? `- ${notes}` : ''}`.trim(),
      };

      const response = await orderAPI.create(orderData);

      if (response.data.success) {
        setConfirmation({
          orderNumber: response.data.data.orderNumber,
          customerName,
        });
        clearOrder();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (confirmation) {
    const getStatusIcon = (status) => {
      switch (status) {
        case 'Pending': return <Clock className="w-6 h-6" />;
        case 'Preparing': return <ChefHat className="w-6 h-6" />;
        case 'Served': return <Utensils className="w-6 h-6" />;
        case 'Completed': return <CheckCircle className="w-6 h-6" />;
        default: return <Clock className="w-6 h-6" />;
      }
    };

    const statusColors = {
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Preparing: 'bg-blue-100 text-blue-800 border-blue-300',
      Served: 'bg-purple-100 text-purple-800 border-purple-300',
      Completed: 'bg-green-100 text-green-800 border-green-300',
      Cancelled: 'bg-red-100 text-red-800 border-red-300',
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600">Thank you, <span className="font-semibold text-orange-600">{confirmation.customerName}</span>!</p>
          </div>

          {/* Order Number Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-600 mb-1">Your Order Number</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-800 font-mono">{confirmation.orderNumber}</span>
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition"
                    title="Copy order number"
                  >
                    <ClipboardCopy className="w-5 h-5" />
                  </button>
                </div>
                {copied && <p className="text-green-600 text-sm mt-1">✓ Copied to clipboard!</p>}
              </div>
              <button
                onClick={fetchOrderDetails}
                disabled={trackingLoading}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:bg-gray-400"
              >
                <RefreshCw className={`w-4 h-4 ${trackingLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Status</span>
              </button>
            </div>
          </div>

          {/* Order Status & Details */}
          {orderDetails ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Timeline */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Status</h2>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 mb-6 ${statusColors[orderDetails.status] || statusColors.Pending}`}>
                  {getStatusIcon(orderDetails.status)}
                  <span className="font-semibold text-lg">{orderDetails.status}</span>
                </div>

                <div className="space-y-4">
                  {['Pending', 'Preparing', 'Served', 'Completed'].map((status, index) => {
                    const statuses = ['Pending', 'Preparing', 'Served', 'Completed'];
                    const currentIndex = statuses.indexOf(orderDetails.status);
                    const isCompleted = index <= currentIndex;
                    const isCancelled = orderDetails.status === 'Cancelled';
                    const isActive = status === orderDetails.status;

                    return (
                      <div key={status} className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                          isCancelled && index > 0
                            ? 'bg-gray-200 text-gray-400'
                            : isCompleted
                            ? isActive ? 'bg-orange-500 text-white ring-4 ring-orange-200' : 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isCompleted && !isCancelled ? '✓' : index + 1}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${isCompleted && !isCancelled ? 'text-gray-800' : 'text-gray-400'}`}>
                            {status}
                          </p>
                          {isActive && (
                            <p className="text-sm text-orange-600">Currently here</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {orderDetails.status === 'Cancelled' && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white">
                        ✗
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-600">Cancelled</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Details</h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-semibold text-gray-800">{orderDetails.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-semibold text-gray-800">{orderDetails.contactInfo.phone}</p>
                    {orderDetails.contactInfo.email && (
                      <p className="text-sm text-gray-600">{orderDetails.contactInfo.email}</p>
                    )}
                  </div>
                  {orderDetails.notes && (
                    <div>
                      <p className="text-sm text-gray-600">Notes</p>
                      <p className="text-gray-800">{orderDetails.notes}</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Items</h3>
                  <div className="space-y-2">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.name} x{item.quantity}</span>
                        <span className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-orange-600">${orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                  <p>Order placed: {new Date(orderDetails.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="animate-pulse">
                <p className="text-gray-600">Loading order details...</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/menu')}
              className="flex-1 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition shadow-lg"
            >
              Order More
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your order is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
          <button
            onClick={() => navigate('/menu')}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Place Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Your Items</h2>
              {items.map((item) => (
                <div key={item._id} className="flex items-center gap-4 py-4 border-b last:border-b-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80?text=Food';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-orange-600 font-medium">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Details</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handlePlaceOrder}>
                {/* Order Type */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Order Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderType('dine-in')}
                      className={`p-3 rounded-lg border-2 transition ${
                        orderType === 'dine-in'
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-300 hover:border-orange-400'
                      }`}
                    >
                      <UtensilsCrossed className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-sm font-medium">Dine In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('takeaway')}
                      className={`p-3 rounded-lg border-2 transition ${
                        orderType === 'takeaway'
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-300 hover:border-orange-400'
                      }`}
                    >
                      <Package className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-sm font-medium">Takeaway</span>
                    </button>
                  </div>
                </div>

                {/* Table Number (only for dine-in) */}
                {orderType === 'dine-in' && (
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Table Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 5"
                      required={orderType === 'dine-in'}
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Special Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Allergies, preferences, etc."
                  />
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total:</span>
                    <span className="text-orange-600">${getTotalAmount().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-400"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
