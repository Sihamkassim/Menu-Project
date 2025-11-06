import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { menuAPI } from '../config/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import MenuCard from '../components/MenuCard';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

        {/* Search Bar */}
        <div className="mb-6 max-w-full mx-auto px-2 sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
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

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-12">No items found</p>
        )}
      </div>
    </div>
  );
};

export default Menu;
