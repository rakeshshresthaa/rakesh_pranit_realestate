// Mock data for development - replace with actual API endpoints
const mockProperties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    price: 450000,
    location: "Downtown, City Center",
    address: "123 Main St, Downtown",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    type: "apartment",
    status: "for-sale",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    yearBuilt: 2020,
    description: "Beautiful modern apartment in the heart of downtown with stunning city views.",
    amenities: ["Balcony", "Gym", "Pool", "Parking", "Security"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800",
      "https://images.unsplash.com/photo-1560448204-5c3a4b0b0b0b?w=800"
    ],
    agent: {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@realestate.com",
      phone: "+1-555-0123",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=0ea5e9&color=fff"
    },
    views: 156,
    inquiries: 12,
    createdAt: "2024-01-15",
    featured: true
  },
  {
    id: 2,
    title: "Luxury Family Home",
    price: 850000,
    location: "Suburban Heights",
    address: "456 Oak Ave, Suburban Heights",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    type: "house",
    status: "for-sale",
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    yearBuilt: 2018,
    description: "Spacious family home with large backyard and modern amenities.",
    amenities: ["Garden", "Garage", "Fireplace", "Central AC", "Security System"],
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
    ],
    agent: {
      id: 2,
      name: "Mike Chen",
      email: "mike@realestate.com",
      phone: "+1-555-0456",
      avatar: "https://ui-avatars.com/api/?name=Mike+Chen&background=0ea5e9&color=fff"
    },
    views: 89,
    inquiries: 8,
    createdAt: "2024-01-10",
    featured: true
  },
  {
    id: 3,
    title: "Cozy Studio for Rent",
    price: 1800,
    location: "University District",
    address: "789 College Blvd, University District",
    coordinates: { lat: 40.7505, lng: -73.9934 },
    type: "studio",
    status: "for-rent",
    bedrooms: 0,
    bathrooms: 1,
    area: 450,
    yearBuilt: 2015,
    description: "Perfect studio apartment for students or young professionals.",
    amenities: ["Furnished", "Utilities Included", "Laundry", "Internet"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800"
    ],
    agent: {
      id: 3,
      name: "Lisa Wang",
      email: "lisa@realestate.com",
      phone: "+1-555-0789",
      avatar: "https://ui-avatars.com/api/?name=Lisa+Wang&background=0ea5e9&color=fff"
    },
    views: 67,
    inquiries: 5,
    createdAt: "2024-01-08",
    featured: false
  },
  {
    id: 4,
    title: "Commercial Office Space",
    price: 2500,
    location: "Business District",
    address: "321 Commerce St, Business District",
    coordinates: { lat: 40.7069, lng: -74.0091 },
    type: "commercial",
    status: "for-rent",
    bedrooms: 0,
    bathrooms: 2,
    area: 1500,
    yearBuilt: 2022,
    description: "Modern office space in prime business location with excellent amenities.",
    amenities: ["Conference Room", "Kitchen", "Parking", "Security", "High-Speed Internet"],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"
    ],
    agent: {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@realestate.com",
      phone: "+1-555-0123",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=0ea5e9&color=fff"
    },
    views: 45,
    inquiries: 3,
    createdAt: "2024-01-05",
    featured: false
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Properties
  async getProperties(filters = {}) {
    await delay(500);
    let filtered = [...mockProperties];
    
    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }
    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.bedrooms) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedrooms);
    }
    if (filters.location) {
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(filters.location.toLowerCase()) ||
        p.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    return { success: true, data: filtered };
  },

  async getProperty(id) {
    await delay(300);
    const property = mockProperties.find(p => p.id === parseInt(id));
    if (!property) {
      throw new Error('Property not found');
    }
    return { success: true, data: property };
  },

  async createProperty(propertyData) {
    await delay(800);
    const newProperty = {
      id: Date.now(),
      ...propertyData,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      inquiries: 0,
      featured: false
    };
    mockProperties.push(newProperty);
    return { success: true, data: newProperty };
  },

  async updateProperty(id, updates) {
    await delay(600);
    const index = mockProperties.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Property not found');
    }
    mockProperties[index] = { ...mockProperties[index], ...updates };
    return { success: true, data: mockProperties[index] };
  },

  async deleteProperty(id) {
    await delay(400);
    const index = mockProperties.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Property not found');
    }
    mockProperties.splice(index, 1);
    return { success: true };
  },

  // Search
  async searchProperties(query) {
    await delay(400);
    const results = mockProperties.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
    return { success: true, data: results };
  },

  // Analytics
  async getAnalytics() {
    await delay(600);
    const totalProperties = mockProperties.length;
    const totalViews = mockProperties.reduce((sum, p) => sum + p.views, 0);
    const totalInquiries = mockProperties.reduce((sum, p) => sum + p.inquiries, 0);
    const avgPrice = mockProperties.reduce((sum, p) => sum + p.price, 0) / totalProperties;
    
    const typeDistribution = mockProperties.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {});

    return {
      success: true,
      data: {
        totalProperties,
        totalViews,
        totalInquiries,
        avgPrice: Math.round(avgPrice),
        typeDistribution,
        recentProperties: mockProperties.slice(0, 5)
      }
    };
  },

  // Favorites
  async getFavorites(userId) {
    await delay(300);
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
    const favoriteProperties = mockProperties.filter(p => favorites.includes(p.id));
    return { success: true, data: favoriteProperties };
  },

  async addToFavorites(userId, propertyId) {
    await delay(200);
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
    if (!favorites.includes(propertyId)) {
      favorites.push(propertyId);
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
    }
    return { success: true };
  },

  async removeFromFavorites(userId, propertyId) {
    await delay(200);
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
    const updatedFavorites = favorites.filter(id => id !== propertyId);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
    return { success: true };
  }
};
