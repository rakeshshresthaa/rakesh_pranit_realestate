import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Building2, 
  Eye, 
  MessageCircle, 
  DollarSign,
  MapPin,
  Calendar,
  BarChart3
} from 'lucide-react';

const Analytics = () => {
  const { user, isAgent, isAdmin } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.getAnalytics();
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const prepareChartData = () => {
    if (!analytics) return [];

    // Property type distribution for pie chart
    const typeData = Object.entries(analytics.typeDistribution).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      fill: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));

    // Mock data for line chart (property views over time)
    const viewsData = [
      { month: 'Jan', views: 120, inquiries: 15 },
      { month: 'Feb', views: 180, inquiries: 22 },
      { month: 'Mar', views: 150, inquiries: 18 },
      { month: 'Apr', views: 220, inquiries: 28 },
      { month: 'May', views: 280, inquiries: 35 },
      { month: 'Jun', views: 320, inquiries: 42 }
    ];

    // Mock data for area chart (price trends)
    const priceData = [
      { month: 'Jan', avgPrice: 450000, maxPrice: 850000, minPrice: 180000 },
      { month: 'Feb', avgPrice: 460000, maxPrice: 870000, minPrice: 185000 },
      { month: 'Mar', avgPrice: 455000, maxPrice: 860000, minPrice: 182000 },
      { month: 'Apr', avgPrice: 470000, maxPrice: 880000, minPrice: 190000 },
      { month: 'May', avgPrice: 480000, maxPrice: 900000, minPrice: 195000 },
      { month: 'Jun', avgPrice: 490000, maxPrice: 920000, minPrice: 200000 }
    ];

    return { typeData, viewsData, priceData };
  };

  const renderStatsCards = () => {
    if (!analytics) return null;

    const stats = [
      {
        title: 'Total Properties',
        value: analytics.totalProperties,
        icon: Building2,
        color: 'bg-blue-500',
        change: '+12%',
        changeType: 'positive'
      },
      {
        title: 'Total Views',
        value: analytics.totalViews.toLocaleString(),
        icon: Eye,
        color: 'bg-green-500',
        change: '+8%',
        changeType: 'positive'
      },
      {
        title: 'Total Inquiries',
        value: analytics.totalInquiries,
        icon: MessageCircle,
        color: 'bg-purple-500',
        change: '+15%',
        changeType: 'positive'
      },
      {
        title: 'Average Price',
        value: `$${analytics.avgPrice?.toLocaleString()}`,
        icon: DollarSign,
        color: 'bg-orange-500',
        change: '+5%',
        changeType: 'positive'
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                from last month
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCharts = () => {
    const { typeData, viewsData, priceData } = prepareChartData();

    return (
      <div className="space-y-8">
        {/* Property Type Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Property Type Distribution
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {typeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    ></div>
                    <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Views and Inquiries Trend */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Views & Inquiries Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Property Views"
              />
              <Line 
                type="monotone" 
                dataKey="inquiries" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Inquiries"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Price Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Price Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="avgPrice" 
                stackId="1" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6}
                name="Average Price"
              />
              <Area 
                type="monotone" 
                dataKey="maxPrice" 
                stackId="2" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.4}
                name="Maximum Price"
              />
              <Area 
                type="monotone" 
                dataKey="minPrice" 
                stackId="3" 
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.4}
                name="Minimum Price"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Market Insights */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Market Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Top Performing Areas</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary-600" />
                    <span className="text-gray-700 dark:text-gray-300">Downtown</span>
                  </div>
                  <span className="font-semibold text-green-600">+25%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary-600" />
                    <span className="text-gray-700 dark:text-gray-300">Suburban Heights</span>
                  </div>
                  <span className="font-semibold text-green-600">+18%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary-600" />
                    <span className="text-gray-700 dark:text-gray-300">University District</span>
                  </div>
                  <span className="font-semibold text-green-600">+12%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Recent Activity</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    New property listed in Downtown
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Price increase in Suburban Heights
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    High inquiry rate for apartments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Analytics & Insights
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isAgent ? 'Track your property performance and market insights' :
                 isAdmin ? 'Monitor platform analytics and user engagement' :
                 'View market trends and property insights'}
              </p>
            </div>
            
            {/* Time Range Selector */}
            <div className="mt-4 md:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input-field"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Charts and Insights */}
        {renderCharts()}
      </div>
    </div>
  );
};

export default Analytics;
