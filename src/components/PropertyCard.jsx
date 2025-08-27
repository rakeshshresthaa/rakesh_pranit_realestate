import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Heart, 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Star,
  Eye,
  MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const PropertyCard = ({ property }) => {
  const { user, isAuthenticated } = useAuth();
  const imageSrc = property.image || (property.images && property.images[0]) || 'https://via.placeholder.com/400x250';
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await api.getFavorites(user.id);
        if (mounted && res.success) {
          setIsFav(res.data.some(p => p.id === property.id));
        }
      } catch {}
    };
    load();
    return () => { mounted = false; };
  }, [user?.id, isAuthenticated, property.id]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) return;
    try {
      if (isFav) {
        setIsFav(false);
        await api.removeFromFavorites(user.id, property.id);
      } else {
        setIsFav(true);
        await api.addToFavorites(user.id, property.id);
      }
    } catch {
      // revert on error
      setIsFav(prev => !prev);
    }
  };
  return (
    <div className="card overflow-hidden">
      <div className="relative">
        <img src={imageSrc} alt={property.title} className="w-full h-48 object-cover" />
        <div className="absolute top-3 left-3 bg-primary-600 text-white text-sm px-3 py-1 rounded-lg">${property.price?.toLocaleString?.() || property.price}</div>
        <button onClick={toggleFavorite} className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition">
          <Heart className={`w-4 h-4 ${isFav ? 'text-red-600 fill-current' : 'text-red-500'}`} />
        </button>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{property.title}</h3>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{property.location}</span>
        </div>
        <div className="pt-2">
          <Link to={`/property/${property.id}`} className="btn-primary w-full inline-block text-center">View Details</Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
