import { Plus, Minus } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { useNavigate } from 'react-router-dom';

const MenuCard = ({ item }) => {
  const { items, addItem, updateQuantity } = useOrderStore();
  const navigate = useNavigate();
  const orderItem = items.find((i) => i._id === item._id);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 bg-gray-200">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Food+Image';
          }}
        />
        {!item.availability && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Unavailable</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{item.name || 'Unnamed Item'}</h3>
          <span className="text-orange-600 font-bold">${item.price?.toFixed(2) ?? '0.00'}</span>
        </div>
        {item.description && (
          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
            {item.category}
          </span>
          {item.availability && (
            <>
              {orderItem ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item._id, orderItem.quantity - 1)}
                    className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold w-8 text-center">{orderItem.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, orderItem.quantity + 1)}
                    className="p-1 bg-orange-600 text-white rounded hover:bg-orange-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    addItem(item);
                    navigate('/order');
                  }}
                  className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition"
                >
                  Add
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
