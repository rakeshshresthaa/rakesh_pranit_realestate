import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, 
  Check, 
  X, 
  Star, 
  MapPin, 
  DollarSign, 
  Eye, 
  MessageCircle,
  Building2,
  Heart,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading notifications
    setTimeout(() => {
      setNotifications(generateMockNotifications());
      setLoading(false);
    }, 1000);
  }, []);

  const generateMockNotifications = () => {
    return [
      {
        id: 1,
        type: 'price-drop',
        title: 'Price Drop Alert',
        message: 'Property in Downtown has reduced by $25,000',
        timestamp: '2 hours ago',
        read: false,
        priority: 'high',
        icon: DollarSign,
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/20'
      },
      {
        id: 2,
        type: 'new-listing',
        title: 'New Property Match',
        message: 'New apartment matching your search criteria in University District',
        timestamp: '4 hours ago',
        read: false,
        priority: 'medium',
        icon: Building2,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20'
      },
      {
        id: 3,
        type: 'inquiry',
        title: 'New Inquiry Received',
        message: 'Someone inquired about your property listing',
        timestamp: '1 day ago',
        read: true,
        priority: 'medium',
        icon: MessageCircle,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100 dark:bg-purple-900/20'
      },
      {
        id: 4,
        type: 'favorite',
        title: 'Property Added to Favorites',
        message: 'You added "Modern Downtown Apartment" to your favorites',
        timestamp: '2 days ago',
        read: true,
        priority: 'low',
        icon: Heart,
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/20'
      },
      {
        id: 5,
        type: 'market-update',
        title: 'Market Update',
        message: 'Property prices in your area increased by 5% this month',
        timestamp: '3 days ago',
        read: true,
        priority: 'low',
        icon: TrendingUp,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100 dark:bg-orange-900/20'
      },
      {
        id: 6,
        type: 'view-increase',
        title: 'High View Count',
        message: 'Your property received 50+ views in the last 24 hours',
        timestamp: '4 days ago',
        read: true,
        priority: 'low',
        icon: Eye,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100 dark:bg-indigo-900/20'
      },
      {
        id: 7,
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance on Sunday, 2:00 AM - 4:00 AM',
        timestamp: '1 week ago',
        read: true,
        priority: 'low',
        icon: Info,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100 dark:bg-gray-900/20'
      }
    ];
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(notif => !notif.read);
      case 'price-alerts':
        return notifications.filter(notif => notif.type === 'price-drop');
      case 'new-listings':
        return notifications.filter(notif => notif.type === 'new-listing');
      case 'inquiries':
        return notifications.filter(notif => notif.type === 'inquiry');
      default:
        return notifications;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-red-500';
      case 'medium':
        return 'border-l-4 border-l-yellow-500';
      case 'low':
        return 'border-l-4 border-l-green-500';
      default:
        return '';
    }
  };

  const getTabCount = (tab) => {
    switch (tab) {
      case 'all':
        return notifications.length;
      case 'unread':
        return notifications.filter(notif => !notif.read).length;
      case 'price-alerts':
        return notifications.filter(notif => notif.type === 'price-drop').length;
      case 'new-listings':
        return notifications.filter(notif => notif.type === 'new-listing').length;
      case 'inquiries':
        return notifications.filter(notif => notif.type === 'inquiry').length;
      default:
        return 0;
    }
  };

  const tabs = [
    { id: 'all', name: 'All', count: getTabCount('all') },
    { id: 'unread', name: 'Unread', count: getTabCount('unread') },
    { id: 'price-alerts', name: 'Price Alerts', count: getTabCount('price-alerts') },
    { id: 'new-listings', name: 'New Listings', count: getTabCount('new-listings') },
    { id: 'inquiries', name: 'Inquiries', count: getTabCount('inquiries') }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Notifications
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Stay updated with property alerts, market changes, and inquiries
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={markAllAsRead}
                className="btn-secondary flex items-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.name}
                  {tab.count > 0 && (
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {activeTab === 'all' 
                  ? 'You\'re all caught up! No new notifications.'
                  : `No ${activeTab.replace('-', ' ')} notifications.`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`card p-4 transition-all duration-200 hover:shadow-lg ${
                  !notification.read ? 'ring-2 ring-primary-200 dark:ring-primary-800' : ''
                } ${getPriorityColor(notification.priority)}`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${notification.bgColor}`}>
                    <notification.icon className={`w-5 h-5 ${notification.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{notification.timestamp}</span>
                          {notification.priority === 'high' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              High Priority
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                          title="Delete notification"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notification Settings */}
        <div className="mt-12">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notification Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Price drop alerts</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">New property matches</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Inquiry notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Market updates</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable push notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Sound alerts</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Vibration alerts</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button className="btn-primary">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
