import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import {
  Search,
  Home as HomeIcon,
  Building2,
  MapPin,
  Star,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await api.getProperties({ featured: true });
        if (response.success) {
          setFeaturedProperties(response.data);
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim() && !searchLocation.trim() && !searchType) {
      navigate('/listings');
      return;
    }

    setIsSearching(true);

    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (searchLocation.trim()) params.append('location', searchLocation.trim());
    if (searchType) params.append('type', searchType);

    setTimeout(() => {
      setIsSearching(false);
      navigate(`/listings?${params.toString()}`);
    }, 300);
  };

  const categories = [
    {
      name: 'Buy Property',
      icon: HomeIcon,
      description: 'Residential and premium properties for sale',
      path: '/listings?status=for-sale',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Rent Property',
      icon: Building2,
      description: 'Apartments and houses available for rent',
      path: '/listings?status=for-rent',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Land Investment',
      icon: MapPin,
      description: 'Verified land listings for long-term investment',
      path: '/listings?type=land',
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Commercial',
      icon: Building2,
      description: 'Offices, shops, and commercial properties',
      path: '/listings?type=commercial',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Property Buyer',
      content:
        'The platform provided a seamless experience from search to purchase. The filters and listings were extremely accurate.',
      rating: 5,
      avatar:
        'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0ea5e9&color=fff'
    },
    {
      name: 'Michael Chen',
      role: 'Real Estate Investor',
      content:
        'A reliable marketplace with high-quality listings and transparent property information. Highly recommended.',
      rating: 5,
      avatar:
        'https://ui-avatars.com/api/?name=Michael+Chen&background=0ea5e9&color=fff'
    },
    {
      name: 'Lisa Wang',
      role: 'Tenant',
      content:
        'The process was straightforward and professional. I found a rental property that perfectly matched my needs.',
      rating: 5,
      avatar:
        'https://ui-avatars.com/api/?name=Lisa+Wang&background=0ea5e9&color=fff'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Property Listings' },
    { number: '5,000+', label: 'Verified Clients' },
    { number: '500+', label: 'Professional Agents' },
    { number: '50+', label: 'Cities Nationwide' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container-custom section-padding text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Trusted Real Estate Marketplace
            <span className="text-accent-400"> for Modern Living</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-10">
            Explore verified properties for buying, renting, and investment.
            Connect with professional agents and make confident property decisions.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by property name or features"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 py-3 border rounded-lg"
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Preferred location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-10 py-3 border rounded-lg"
                  />
                </div>

                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full py-3 border rounded-lg"
                >
                  <option value="">All Property Types</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="mt-6 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-10 py-3 rounded-lg"
              >
                {isSearching ? 'Searching...' : 'Search Properties'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-bold text-primary-600">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat.name} to={cat.path} className="card p-6 text-center">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${cat.color} flex items-center justify-center`}
              >
                <cat.icon className="text-white w-8 h-8" />
              </div>
              <h3 className="font-semibold text-xl mb-2">{cat.name}</h3>
              <p className="text-gray-600 mb-4">{cat.description}</p>
              <span className="text-primary-600 flex justify-center items-center">
                Explore <ArrowRight className="ml-1 w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12">
            Featured Properties
          </h2>

          {loading ? (
            <div className="text-center">Loading properties...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-custom grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="card p-6 text-center">
              <div className="flex justify-center mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 text-accent-500 fill-current" />
                ))}
              </div>
              <p className="italic text-gray-600 mb-6">"{t.content}"</p>
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-gray-500">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-700 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">
          Start Your Property Journey Today
        </h2>
        <p className="text-lg mb-8">
          Browse verified listings and connect with trusted real estate professionals.
        </p>
        <Link to="/listings" className="btn-secondary px-10 py-3">
          View Properties
        </Link>
      </section>
    </div>
  );
};

export default Home;
