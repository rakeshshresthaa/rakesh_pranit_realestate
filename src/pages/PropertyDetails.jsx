import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Calendar, 
  Star, 
  Heart, 
  Share2, 
  Phone, 
  Mail, 
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Building2,
  Car,
  Wifi,
  Waves,
  Shield,
  Trees
} from 'lucide-react';
import toast from 'react-hot-toast';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: '',
    scheduleVisit: false,
    visitDate: '',
    visitTime: ''
  });

  useEffect(() => {
    fetchProperty();
    checkFavoriteStatus();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await api.getProperty(id);
      if (response.success) {
        setProperty(response.data);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (user) {
      try {
        const favorites = await api.getFavorites(user.id);
        if (favorites.success) {
          const isFav = favorites.data.some(p => p.id === parseInt(id));
          setIsFavorite(isFav);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }

    try {
      if (isFavorite) {
        await api.removeFromFavorites(user.id, parseInt(id));
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await api.addToFavorites(user.id, parseInt(id));
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the contact form data to your backend
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setContactForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      message: '',
      scheduleVisit: false,
      visitDate: '',
      visitTime: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatPrice = (price) => {
    if (property.status === 'for-rent') {
      return `$${price.toLocaleString()}/month`;
    }
    return `$${price.toLocaleString()}`;
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'Parking': Car,
      'Pool': Waves,
      'Gym': Building2,
      'Security': Shield,
      'Garden': Trees,
      'WiFi': Wifi,
      'Balcony': Building2,
      'Fireplace': Building2,
      'Central AC': Building2,
      'Laundry': Building2,
      'Furnished': Building2,
      'Utilities Included': Building2,
      'Conference Room': Building2,
      'Kitchen': Building2,
      'High-Speed Internet': Wifi
    };
    return iconMap[amenity] || Building2;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Property not found
          </h2>
          <Link to="/listings" className="btn-primary">
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li><Link to="/listings" className="hover:text-primary-600">Listings</Link></li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white">{property.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
              <div className="relative h-96">
                <img
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="p-4 flex space-x-2 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      currentImageIndex === index
                        ? 'border-primary-600'
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{property.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {property.status === 'for-rent' ? 'For Rent' : 'For Sale'}
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <Bed className="w-6 h-6 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {property.bedrooms}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Bath className="w-6 h-6 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {property.bathrooms}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</div>
                </div>
                <div className="text-center">
                  <Square className="w-6 h-6 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {property.area}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">sqft</div>
                </div>
                <div className="text-center">
                  <Calendar className="w-6 h-6 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {property.yearBuilt}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Year Built</div>
                </div>
              </div>

              {/* Description */}
              <div className="py-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="py-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => {
                    const IconComponent = getAmenityIcon(amenity);
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-600 dark:text-gray-400">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <div className="space-y-3">
                <button
                  onClick={handleFavoriteToggle}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                    isFavorite
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                </button>
                
                <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200">
                  <Share2 className="w-5 h-5" />
                  <span>Share Property</span>
                </button>
              </div>
            </div>

            {/* Agent Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact Agent
              </h3>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={property.agent.avatar}
                  alt={property.agent.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {property.agent.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Real Estate Agent
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>{property.agent.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{property.agent.email}</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Send Message
              </h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone"
                    value={contactForm.phone}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="input-field"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="scheduleVisit"
                    id="scheduleVisit"
                    checked={contactForm.scheduleVisit}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="scheduleVisit" className="text-sm text-gray-700 dark:text-gray-300">
                    Schedule a visit
                  </label>
                </div>

                {contactForm.scheduleVisit && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      name="visitDate"
                      value={contactForm.visitDate}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                    <input
                      type="time"
                      name="visitTime"
                      value={contactForm.visitTime}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
