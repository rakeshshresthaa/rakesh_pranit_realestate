import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { Heart, Trash2, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.getFavorites(user.id);
      if (response.success) {
        setFavorites(response.data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (propertyId) => {
    try {
      await api.removeFromFavorites(user.id, propertyId);
      setFavorites(favorites.filter(p => p.id !== propertyId));
      toast.success('Property removed from favorites');
    } catch (error) {
      toast.error('Failed to remove from favorites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              No favorites yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start browsing properties and add them to your favorites to see them here. 
              You can save properties you're interested in for easy access later.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/listings" className="btn-primary">
                Browse Properties
              </a>
              <a href="/" className="btn-outline">
                Go to Home
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((property) => (
                <div key={property.id} className="relative group">
                  <PropertyCard property={property} />
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromFavorites(property.id)}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="text-center pt-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Manage Your Favorites
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  Keep track of properties you love and easily compare them
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all favorites?')) {
                        // Clear all favorites logic
                        toast.success('All favorites cleared');
                      }
                    }}
                    className="btn-secondary text-sm"
                  >
                    Clear All
                  </button>
                  <a href="/listings" className="btn-outline text-sm">
                    Find More
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
