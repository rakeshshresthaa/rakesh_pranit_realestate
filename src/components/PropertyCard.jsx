import { useState } from 'react';
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

const PropertyCard = ({ property, onFavoriteToggle }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const formatPrice = (price) => {
    if (property.status === 'for-rent') {
      return `$${price.toLocaleString()}/month`;
    }
    return `$${price.toLocaleString()}`;
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        await api.removeFromFavorites(user.id, property.id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await api.addToFavorites(user.id, property.id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
      
      if (onFavoriteToggle) {
        onFavoriteToggle(property.id);
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  const getPropertyTypeIcon = (type) => {
    const typeColors = {
      house: 'bg-blue-500',
      apartment: 'bg-green-500',
      condo: 'bg-purple-500',
      townhouse: 'bg-orange-500',
      studio: 'bg-pink-500',
      commercial: 'bg-gray-500',
      land: 'bg-brown-500'
    };
    
    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium text-white rounded-full ${typeColors[type] || 'bg-gray-500'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'for-sale': { text: 'For Sale', color: 'bg-green-500' },
      'for-rent': { text: 'For Rent', color: 'bg-blue-500' },
      'sold': { text: 'Sold', color: 'bg-gray-500' },
      'rented': { text: 'Rented', color: 'bg-gray-500' }
    };
    
    const config = statusConfig[status] || { text: status, color: 'bg-gray-500' };
    
    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium text-white rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="card group hover:scale-105 transition-all duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          disabled={isLoading}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {getStatusBadge(property.status)}
        </div>

        {/* Property Type */}
        <div className="absolute bottom-3 left-3">
          {getPropertyTypeIcon(property.type)}
        </div>

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute bottom-3 right-3 bg-accent-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Star className="w-3 h-3 fill-current" />
            <span>Featured</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Price */}
        <div className="mb-2">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(property.price)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{property.location}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center space-x-1">
            <Square className="w-4 h-4" />
            <span>{property.area} sqft</span>
          </div>
        </div>

        {/* Agent Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <img
              src={property.agent.avatar}
              alt={property.agent.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {property.agent.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {property.agent.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{property.views} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-3 h-3" />
            <span>{property.inquiries} inquiries</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/property/${property.id}`}
          className="btn-primary w-full text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
