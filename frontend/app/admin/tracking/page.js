"use client";

import { useState, useEffect } from "react";
import { Truck, Package, MapPin, Clock, CheckCircle, AlertCircle, Search } from "lucide-react";

export default function TrackingAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders?limit=100`);
      const data = await response.json();
      if (data.success) {
        // Filter orders that have tracking information
        const trackableOrders = data.orders.filter(order => 
          order.shiprocketOrderId || order.awbCode || order.trackingId
        );
        setOrders(trackableOrders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingData = async (orderId) => {
    setTrackingLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${orderId}/tracking`);
      const data = await response.json();
      if (data.success) {
        setTrackingData(data.trackingData);
      }
    } catch (error) {
      console.error("Failed to fetch tracking data:", error);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setTrackingData(null);
    if (order.awbCode) {
      fetchTrackingData(order._id);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      case 'cancelled': return AlertCircle;
      default: return Clock;
    }
  };

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.awbCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff9800] to-[#f57c00] p-8 rounded-2xl text-white">
        <div className="flex items-center space-x-4">
          <Truck size={32} />
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">
              Shipment Tracking
            </h1>
            <p className="text-white/80 mt-2">Monitor and track all your shipments in real-time</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-black uppercase tracking-wide text-gray-900 mb-4">
                Trackable Orders
              </h2>
              
              {/* Search */}
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9800] focus:border-transparent"
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading orders...</div>
              ) : filteredOrders.length > 0 ? (
                <div className="space-y-2 p-4">
                  {filteredOrders.map((order) => {
                    const StatusIcon = getStatusIcon(order.orderStatus);
                    return (
                      <div
                        key={order._id}
                        onClick={() => handleOrderSelect(order)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedOrder?._id === order._id
                            ? 'bg-[#ff9800] text-white shadow-lg'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold">#{order._id.slice(-6)}</p>
                          <StatusIcon size={16} />
                        </div>
                        <p className={`text-sm ${selectedOrder?._id === order._id ? 'text-white/80' : 'text-gray-600'}`}>
                          {order.user}
                        </p>
                        {order.awbCode && (
                          <p className={`text-xs mt-1 ${selectedOrder?._id === order._id ? 'text-white/70' : 'text-gray-500'}`}>
                            AWB: {order.awbCode}
                          </p>
                        )}
                        <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedOrder?._id === order._id 
                            ? 'bg-white/20 text-white' 
                            : getStatusColor(order.orderStatus)
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <Truck size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No trackable orders found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tracking Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            {selectedOrder ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-black uppercase tracking-wide text-gray-900">
                    Tracking Details
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.orderStatus)}`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Order ID</p>
                      <p className="font-bold text-gray-900">#{selectedOrder._id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Customer</p>
                      <p className="font-bold text-gray-900">{selectedOrder.user}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Order Date</p>
                      <p className="font-bold text-gray-900">
                        {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedOrder.shiprocketOrderId && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Shiprocket Order ID</p>
                        <p className="font-bold text-gray-900">{selectedOrder.shiprocketOrderId}</p>
                      </div>
                    )}
                    {selectedOrder.awbCode && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">AWB Code</p>
                        <p className="font-bold text-gray-900">{selectedOrder.awbCode}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Total Amount</p>
                      <p className="font-bold text-gray-900">₹{(selectedOrder.totalAmount / 100).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                {selectedOrder.awbCode && (
                  <div>
                    <h3 className="text-md font-bold text-gray-900 mb-4">Shipment Tracking</h3>
                    
                    {trackingLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff9800] mx-auto"></div>
                        <p className="text-gray-500 mt-2">Loading tracking information...</p>
                      </div>
                    ) : trackingData ? (
                      <div className="space-y-4">
                        {/* Tracking Timeline */}
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h4 className="font-bold text-gray-900 mb-4">Shipment Timeline</h4>
                          <div className="space-y-3">
                            {trackingData.tracking_data?.track_status ? (
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-[#ff9800] rounded-full"></div>
                                <div>
                                  <p className="font-medium text-gray-900">{trackingData.tracking_data.track_status}</p>
                                  <p className="text-sm text-gray-600">
                                    {trackingData.tracking_data.current_timestamp && 
                                      new Date(trackingData.tracking_data.current_timestamp).toLocaleString('en-IN')
                                    }
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-500">No tracking updates available yet</p>
                            )}
                          </div>
                        </div>

                        {/* Delivery Info */}
                        {trackingData.tracking_data?.expected_delivery_date && (
                          <div className="bg-blue-50 rounded-xl p-6">
                            <h4 className="font-bold text-blue-900 mb-2">Expected Delivery</h4>
                            <p className="text-blue-800">
                              {new Date(trackingData.tracking_data.expected_delivery_date).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-yellow-50 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                          <AlertCircle size={20} className="text-yellow-600" />
                          <div>
                            <p className="font-medium text-yellow-800">Tracking data not available</p>
                            <p className="text-sm text-yellow-700">
                              Tracking information will be available once the shipment is picked up by the courier.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Order Items */}
                <div className="mt-8">
                  <h3 className="text-md font-bold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-gray-900">
                          ₹{(item.price * item.quantity / 100).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Package size={64} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-400 mb-2">Select an Order</h3>
                <p>Choose an order from the list to view its tracking details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}