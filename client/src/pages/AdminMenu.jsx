import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { menuAPI } from '../config/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Appetizers',
    description: '',
    image: '',
    price: '',
    availability: true,
  });

  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Salads', 'Soups'];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getAll();
      if (response.data.success) {
        setMenuItems(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await menuAPI.update(editingItem._id, formData);
      } else {
        await menuAPI.create(formData);
      }
      fetchMenuItems();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await menuAPI.delete(id);
      fetchMenuItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        description: item.description || '',
        image: item.image,
        price: item.price,
        availability: item.availability,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        category: 'Appetizers',
        description: '',
        image: '',
        price: '',
        availability: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchMenuItems} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Menu Management</h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            <Plus className="w-5 h-5" /> Add Item
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/64';
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        item.availability
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(item)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold">
                  {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Image URL *</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="availability"
                    checked={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="availability" className="font-medium">
                    Available
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenu;
