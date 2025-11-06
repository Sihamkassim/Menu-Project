import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, UtensilsCrossed, Package, CheckCircle, Clock, ChefHat, Utensils, ClipboardCopy, RefreshCw, Search } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { orderAPI } from '../config/api';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Preparing: 'bg-blue-100 text-blue-800 border-blue-300',
  Served: 'bg-purple-100 text-purple-800 border-purple-300',
  Completed: 'bg-green-100 text-green-800 border-green-300',
  Cancelled: 'bg-red-100 text-red-800 border-red-300',
};
const getStatusIcon = (status) => {
  switch (status) {
    case 'Pending': return <Clock className="w-6 h-6" />;
    case 'Preparing': return <ChefHat className="w-6 h-6" />;
    case 'Served': return <Utensils className="w-6 h-6" />;
    case 'Completed': return <CheckCircle className="w-6 h-6" />;
    default: return <Clock className="w-6 h-6" />;
  }
};

const OrderAndTrack = () => {
  // Track order state
  const [trackOrderNumber, setTrackOrderNumber] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');
  const [copiedTrack, setCopiedTrack] = useState(false);

  // Place order state
  const { items, updateQuantity, removeItem, getTotalAmount, clearOrder } = useOrderStore();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [orderType, setOrderType] = useState('dine-in');
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [copiedOrder, setCopiedOrder] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const navigate = useNavigate();

  // Track order handler
  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackOrderNumber) return;
    setTrackLoading(true);
    setTrackError('');
    setTrackedOrder(null);
    try {
      const response = await orderAPI.getByOrderNumber(trackOrderNumber);
      if (response.data.success) {
        setTrackedOrder(response.data.data);
      } else {
        setTrackError('Order not found');
      }
    } catch (err) {
      setTrackError(err.response?.data?.message || 'Order not found');
    } finally {
      setTrackLoading(false);
    }
  };

  // Place order handler
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      setPlaceError('Please add items to your order');
      return;
    }
    if (!customerName || !phone) {
      setPlaceError('Please fill in all required fields');
      return;
    }
    if (orderType === 'dine-in' && !tableNumber) {
      setPlaceError('Please provide table number for dine-in orders');
      return;
    }
    try {
      setPlacing(true);
      setPlaceError('');
      const orderData = {
        items: items.map((item) => ({ menuItem: item._id, quantity: item.quantity })),
        customerName,
        contactInfo: { phone, email },
        notes: `${orderType === 'takeaway' ? 'TAKEAWAY' : 'DINE-IN'} ${orderType === 'dine-in' ? `(Table ${tableNumber})` : ''} ${notes ? `- ${notes}` : ''}`.trim(),
      };
      const response = await orderAPI.create(orderData);
      if (response.data.success) {
        setConfirmation({ orderNumber: response.data.data.orderNumber, customerName });
        clearOrder();
      }
    } catch (err) {
      setPlaceError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  // Fetch order details for confirmation
  const fetchOrderDetails = async () => {
    if (!confirmation?.orderNumber) return;
    try {
      setTrackingLoading(true);
      const response = await orderAPI.getByOrderNumber(confirmation.orderNumber);
      if (response.data.success) {
        setOrderDetails(response.data.data);
      }
    } catch (err) {
      setOrderDetails(null);
    } finally {
      setTrackingLoading(false);
    }
  };
  useEffect(() => {
    if (confirmation) {
      fetchOrderDetails();
      const interval = setInterval(fetchOrderDetails, 30000);
      return () => clearInterval(interval);
    }
  }, [confirmation]);

  // Copy handlers
  const handleCopyTrack = () => {
    if (trackedOrder?.orderNumber) {
      navigator.clipboard.writeText(trackedOrder.orderNumber);
      setCopiedTrack(true);
      setTimeout(() => setCopiedTrack(false), 1500);
    }
  };
  const handleCopyOrder = () => {
    if (confirmation?.orderNumber) {
      navigator.clipboard.writeText(confirmation.orderNumber);
      setCopiedOrder(true);
      setTimeout(() => setCopiedOrder(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Track Order Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Search /> Track Your Order</h2>
          <form onSubmit={handleTrack} className="mb-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={trackOrderNumber}
                onChange={(e) => setTrackOrderNumber(e.target.value)}
                placeholder="Enter your order number (e.g., ORD-1704153600000)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={trackLoading}
              className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-400"
            >
              {trackLoading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
          {trackError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{trackError}</div>}
          {trackedOrder && (
            <div className="bg-orange-50 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono font-bold text-lg">{trackedOrder.orderNumber}</span>
                <button onClick={handleCopyTrack} className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition" title="Copy order number">
                  <ClipboardCopy className="w-5 h-5" />
                </button>
                {copiedTrack && <span className="text-green-600 text-sm">Copied!</span>}
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 mb-4 ${statusColors[trackedOrder.status] || statusColors.Pending}`}>
                {getStatusIcon(trackedOrder.status)}
                <span className="font-semibold text-lg">{trackedOrder.status}</span>
              </div>
              <div className="space-y-2 mb-2">
                <p className="text-gray-700"><span className="font-semibold">Name:</span> {trackedOrder.customerName}</p>
                <p className="text-gray-700"><span className="font-semibold">Phone:</span> {trackedOrder.contactInfo.phone}</p>
                {trackedOrder.contactInfo.email && <p className="text-gray-700"><span className="font-semibold">Email:</span> {trackedOrder.contactInfo.email}</p>}
                {trackedOrder.notes && <p className="text-gray-700"><span className="font-semibold">Notes:</span> {trackedOrder.notes}</p>}
              </div>
              <div className="border-t pt-2">
                <h3 className="font-semibold text-gray-800 mb-2">Items</h3>
                <ul className="list-disc pl-6">
                  {trackedOrder.items.map((item) => (
                    <li key={item.menuItem}>{item.name} x {item.quantity} <span className="text-orange-600">${item.price.toFixed(2)}</span></li>
                  ))}
                </ul>
                <div className="mt-2 text-lg font-bold text-right">
                  Total: <span className="text-orange-600">${trackedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">Order placed: {new Date(trackedOrder.createdAt).toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* Place Order Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><ShoppingBag /> Place a New Order</h2>
          {confirmation ? (
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Order Placed!</h3>
              <p className="text-gray-700 mb-2">Thank you, <span className="font-semibold">{confirmation.customerName}</span>!</p>
              <div className="mb-4">
                <span className="font-medium text-gray-800">Order Number:</span>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="px-3 py-2 bg-orange-100 text-orange-800 rounded font-mono text-lg select-all">{confirmation.orderNumber}</span>
                  <button onClick={handleCopyOrder} className="px-2 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition" title="Copy order number">
                    <ClipboardCopy className="w-5 h-5" />
                  </button>
                  {copiedOrder && <span className="text-green-600 text-sm">Copied!</span>}
                </div>
              </div>
              {orderDetails ? (
                <div className="mt-4 text-left">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 mb-4 ${statusColors[orderDetails.status] || statusColors.Pending}`}>
                    {getStatusIcon(orderDetails.status)}
                    <span className="font-semibold text-lg">{orderDetails.status}</span>
                  </div>
                  <div className="space-y-2 mb-2">
                    <p className="text-gray-700"><span className="font-semibold">Name:</span> {orderDetails.customerName}</p>
                    <p className="text-gray-700"><span className="font-semibold">Phone:</span> {orderDetails.contactInfo.phone}</p>
                    {orderDetails.contactInfo.email && <p className="text-gray-700"><span className="font-semibold">Email:</span> {orderDetails.contactInfo.email}</p>}
                    {orderDetails.notes && <p className="text-gray-700"><span className="font-semibold">Notes:</span> {orderDetails.notes}</p>}
                  </div>
                  <div className="border-t pt-2">
                    <h3 className="font-semibold text-gray-800 mb-2">Items</h3>
                    <ul className="list-disc pl-6">
                      {orderDetails.items.map((item) => (
                        <li key={item.menuItem}>{item.name} x {item.quantity} <span className="text-orange-600">${item.price.toFixed(2)}</span></li>
                      ))}
                    </ul>
                    <div className="mt-2 text-lg font-bold text-right">
                      Total: <span className="text-orange-600">${orderDetails.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">Order placed: {new Date(orderDetails.createdAt).toLocaleString()}</div>
                </div>
              ) : (
                <div className="animate-pulse text-gray-500 mt-4">Loading order details...</div>
              )}
              <button onClick={() => navigate('/menu')} className="mt-6 w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition">Order More</button>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder}>
              {/* ...order form fields, same as PlaceOrder.jsx... */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Order Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setOrderType('dine-in')} className={`p-3 rounded-lg border-2 transition ${orderType === 'dine-in' ? 'border-orange-600 bg-orange-50' : 'border-gray-300 hover:border-orange-400'}`}>
                    <UtensilsCrossed className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm font-medium">Dine In</span>
                  </button>
                  <button type="button" onClick={() => setOrderType('takeaway')} className={`p-3 rounded-lg border-2 transition ${orderType === 'takeaway' ? 'border-orange-600 bg-orange-50' : 'border-gray-300 hover:border-orange-400'}`}>
                    <Package className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm font-medium">Takeaway</span>
                  </button>
                </div>
              </div>
              {orderType === 'dine-in' && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Table Number <span className="text-red-500">*</span></label>
                  <input type="text" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., 5" required={orderType === 'dine-in'} />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Name <span className="text-red-500">*</span></label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Phone <span className="text-red-500">*</span></label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Email (Optional)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Special Notes (Optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Allergies, preferences, etc." />
              </div>
              {/* Current selected items with quantity controls */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Items</h3>
                {items.length === 0 ? (
                  <div className="p-4 bg-yellow-50 text-yellow-800 rounded">No items selected yet. Tap Add on any menu item to start your order.</div>
                ) : (
                  <div className="space-y-3">
                    {items.map((it) => (
                      <div key={it._id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <img src={it.image} alt={it.name} className="w-12 h-12 object-cover rounded" onError={(e)=>{e.target.src='https://via.placeholder.com/80x80?text=Food'}} />
                          <div>
                            <div className="font-medium text-gray-800">{it.name}</div>
                            <div className="text-sm text-gray-500">${it.price.toFixed(2)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(it._id, it.quantity - 1)} className="p-2 bg-gray-200 rounded hover:bg-gray-300">-</button>
                          <div className="px-3 py-1 bg-white border rounded text-center w-12">{it.quantity}</div>
                          <button onClick={() => updateQuantity(it._id, it.quantity + 1)} className="p-2 bg-orange-600 text-white rounded hover:bg-orange-700">+</button>
                          <button onClick={() => removeItem(it._id)} className="p-2 text-red-600 hover:text-red-800" title="Remove">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total:</span>
                  <span className="text-orange-600">${getTotalAmount().toFixed(2)}</span>
                </div>
              </div>
              {placeError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{placeError}</div>}
              <button type="submit" disabled={placing} className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-400">
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderAndTrack;
