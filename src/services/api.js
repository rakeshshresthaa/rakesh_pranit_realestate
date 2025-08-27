import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const http = axios.create({ baseURL: BASE_URL });

const mapProperty = (p) => ({
  id: p.id,
  title: p.title,
  price: p.price,
  location: p.location,
  address: p.address || p.location,
  type: (p.type || '').toString().toLowerCase(),
  status: p.status || 'for-sale',
  bedrooms: p.bedrooms ?? 0,
  bathrooms: p.bathrooms ?? 0,
  area: p.area ?? 0,
  yearBuilt: p.yearBuilt ?? 0,
  description: p.description || '',
  amenities: p.amenities || [],
  image: p.image,
  images: p.images && p.images.length ? p.images : [p.image].filter(Boolean),
  agentId: p.agentId,
  views: p.views ?? 0,
  inquiries: p.inquiries ?? 0,
  featured: p.featured ?? false,
});

export const api = {
  // Properties
  async getProperties(filters = {}) {
    const params = {};
    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    if (filters.agentId) params.agentId = filters.agentId;
    if (filters.location) params.location_like = filters.location;
    if (filters.search) params.q = filters.search;
    if (filters.minPrice) params.price_gte = filters.minPrice;
    if (filters.maxPrice) params.price_lte = filters.maxPrice;
    if (filters.bedrooms) params.bedrooms_gte = filters.bedrooms;
    if (filters.sortBy === 'priceAsc') { params._sort = 'price'; params._order = 'asc'; }
    if (filters.sortBy === 'priceDesc') { params._sort = 'price'; params._order = 'desc'; }
    if (filters.sortBy === 'newest') { params._sort = 'id'; params._order = 'desc'; }

    const { data } = await http.get('/properties', { params });
    return { success: true, data: data.map(mapProperty) };
  },

  async getProperty(id) {
    const { data: prop } = await http.get(`/properties/${id}`);
    const property = mapProperty(prop);
    // Expand agent details if available
    if (property.agentId) {
      try {
        const { data: agent } = await http.get(`/users/${property.agentId}`);
        property.agent = {
          id: agent.id,
          name: agent.name,
          email: agent.email,
          phone: agent.phone || '',
          avatar: agent.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}`,
        };
      } catch {}
    }
    // Fallbacks
    if (!property.images || property.images.length === 0) {
      property.images = [property.image || 'https://via.placeholder.com/800x500'];
    }
    return { success: true, data: property };
  },

  async createProperty(propertyData) {
    const { data } = await http.post('/properties', propertyData);
    return { success: true, data: mapProperty(data) };
  },

  async updateProperty(id, updates) {
    const { data } = await http.patch(`/properties/${id}`, updates);
    return { success: true, data: mapProperty(data) };
  },

  async deleteProperty(id) {
    await http.delete(`/properties/${id}`);
    return { success: true };
  },

  // Search (alias to getProperties with q)
  async searchProperties(query) {
    return this.getProperties({ search: query });
  },

  // Analytics (computed client-side)
  async getAnalytics() {
    const { data } = await http.get('/properties');
    const props = data.map(mapProperty);
    const totalProperties = props.length;
    const totalViews = props.reduce((s, p) => s + (p.views || 0), 0);
    const totalInquiries = props.reduce((s, p) => s + (p.inquiries || 0), 0);
    const avgPrice = Math.round(props.reduce((s, p) => s + (p.price || 0), 0) / (props.length || 1));
    const typeDistribution = props.reduce((acc, p) => { acc[p.type] = (acc[p.type] || 0) + 1; return acc; }, {});
    return { success: true, data: { totalProperties, totalViews, totalInquiries, avgPrice, typeDistribution, recentProperties: props.slice(0, 5) } };
  },

  // Favorites
  async getFavorites(userId) {
    const { data: favs } = await http.get('/favorites', { params: { userId } });
    const propertyIds = favs.map(f => f.propertyId);
    const { data: props } = await http.get('/properties', { params: { id: propertyIds } });
    return { success: true, data: props.map(mapProperty) };
  },

  async addToFavorites(userId, propertyId) {
    await http.post('/favorites', { userId, propertyId });
    return { success: true };
  },

  async removeFromFavorites(userId, propertyId) {
    const { data: favs } = await http.get('/favorites', { params: { userId, propertyId } });
    await Promise.all(favs.map(f => http.delete(`/favorites/${f.id}`)));
    return { success: true };
  },

  // Notifications
  async getNotifications(userId) {
    const { data } = await http.get('/notifications', { params: { userId } });
    return { success: true, data };
  },

  async markNotificationRead(id) {
    const { data } = await http.patch(`/notifications/${id}`, { read: true });
    return { success: true, data };
  },
};
