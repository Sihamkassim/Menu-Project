import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Utensils } from 'lucide-react';
import { menuAPI } from '../config/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import MenuCard from '../components/MenuCard';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getAll({ availability: true });
      if (response.data.success) {
        // Get first 6 items as featured
        setFeaturedItems(response.data.data.slice(0, 6));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchFeaturedItems} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Utensils className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">Welcome to Our Restaurant</h1>
          <p className="text-xl mb-8">Delicious food, delivered fresh to your table</p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            View Full Menu <ChevronRight />
          </Link>
        </div>
      </section>

      {/* Featured Items */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Dishes</h2>
        {featuredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No featured items available</p>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-orange-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Order?</h2>
          <p className="text-gray-600 mb-6">Browse our menu and place your order for dine-in or takeaway!</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/menu"
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
            >
              View Menu
            </Link>
            <Link
              to="/place-order"
              className="inline-block bg-white text-orange-600 border-2 border-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition"
            >
              Place Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
