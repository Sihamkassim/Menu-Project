import { useState, useEffect } from 'react';
import { Search, Grid, List } from 'lucide-react';
import { menuAPI } from '../config/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import MenuCard from '../components/MenuCard';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
  const navigate = useNavigate();
  const { addItem } = useOrderStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [menuResponse, categoriesResponse] = await Promise.all([
        menuAPI.getAll(),
        menuAPI.getCategories(),
      ]);

      if (menuResponse.data.success) {
        setMenuItems(menuResponse.data.data);
      }
      if (categoriesResponse.data.success) {
        setCategories(['All', ...categoriesResponse.data.data]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? true;
    return matchesCategory && matchesSearch;
  });

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
  <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Our Menu</h1>

        {/* Search Bar and View Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-center">
          <div className="relative max-w-full sm:max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          {/* View Toggle */}
          <div className="flex gap-2 bg-white border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`px-4 py-2 rounded-md transition flex items-center gap-2 ${
                viewMode === 'card' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md transition flex items-center gap-2 ${
                viewMode === 'list' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 px-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition ${
                selectedCategory === category
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items Grid or List */}
        {filteredItems.length > 0 ? (
          viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <MenuCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
              {categories.filter(cat => cat !== 'All').map((category) => {
                const categoryItems = filteredItems.filter(item => item.category === category);
                if (categoryItems.length === 0) return null;
                
                return (
                  <div key={category} className="mb-8 last:mb-0">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-orange-600">
                      {category}
                    </h2>
                    <div className="space-y-3">
                      {categoryItems.map((item) => (
                        <div key={item._id} className="flex items-start justify-between gap-3 py-2 hover:bg-orange-50 px-3 rounded transition group">
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                              <h3 className="font-semibold text-gray-800 text-lg">
                                {item.name || 'Unnamed Item'}
                              </h3>
                              {!item.availability && (
                                <span className="text-xs text-red-600 font-medium">(Unavailable)</span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            )}
                          </div>
                          <div className="flex-shrink-0 border-b border-dotted border-gray-300 flex-grow max-w-[100px] self-end mb-2"></div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="font-bold text-orange-600 text-lg whitespace-nowrap">
                              ${item.price?.toFixed(2) ?? '0.00'}
                            </span>
                            {item.availability && (
                              <button
                                onClick={() => {
                                  addItem(item);
                                  navigate('/order');
                                }}
                                className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition opacity-0 group-hover:opacity-100"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <p className="text-center text-gray-600 py-12">No items found</p>
        )}
      </div>
    </div>
  );
};

export default Menu;
