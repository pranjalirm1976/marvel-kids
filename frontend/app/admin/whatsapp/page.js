"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Send, Users, CheckCircle, XCircle, Clock } from "lucide-react";

export default function WhatsAppAdmin() {
  const [activeTab, setActiveTab] = useState("send");
  const [offerDetails, setOfferDetails] = useState("");
  const [targetCustomers, setTargetCustomers] = useState("all");
  const [customCustomers, setCustomCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders?limit=50`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const addCustomCustomer = () => {
    if (newCustomer.name && newCustomer.phone) {
      setCustomCustomers([...customCustomers, { ...newCustomer }]);
      setNewCustomer({ name: "", phone: "" });
    }
  };

  const removeCustomCustomer = (index) => {
    setCustomCustomers(customCustomers.filter((_, i) => i !== index));
  };

  const sendPromotionalMessages = async () => {
    if (!offerDetails.trim()) {
      alert("Please enter offer details");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/whatsapp/promotional`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerDetails: offerDetails.trim(),
          targetCustomers: targetCustomers === "custom" ? customCustomers : targetCustomers,
        }),
      });

      const data = await response.json();
      setResults(data);
      
      if (data.success) {
        alert(`Messages sent successfully to ${data.results.success} customers!`);
      } else {
        alert(`Failed to send messages: ${data.message}`);
      }
    } catch (error) {
      console.error("Failed to send messages:", error);
      alert("Failed to send messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppStatusColor = (status) => {
    switch (status) {
      case "Sent": return "text-green-600 bg-green-100";
      case "Failed": return "text-red-600 bg-red-100";
      case "Pending": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getWhatsAppStatusIcon = (status) => {
    switch (status) {
      case "Sent": return CheckCircle;
      case "Failed": return XCircle;
      case "Pending": return Clock;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#25d366] to-[#128c7e] p-8 rounded-2xl text-white">
        <div className="flex items-center space-x-4">
          <MessageCircle size={32} />
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">
              WhatsApp Marketing
            </h1>
            <p className="text-white/80 mt-2">Send promotional messages and track customer communications</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("send")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "send"
                  ? "border-[#25d366] text-[#25d366]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Send Messages
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "status"
                  ? "border-[#25d366] text-[#25d366]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Message Status
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "send" && (
            <div className="space-y-6">
              {/* Offer Details */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Offer Details *
                </label>
                <textarea
                  value={offerDetails}
                  onChange={(e) => setOfferDetails(e.target.value)}
                  placeholder="Enter your promotional offer details here..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#25d366] focus:border-transparent resize-none"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This message will be sent to selected customers along with your branding.
                </p>
              </div>

              {/* Target Customers */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-4">
                  Target Customers
                </label>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="targetCustomers"
                      value="all"
                      checked={targetCustomers === "all"}
                      onChange={(e) => setTargetCustomers(e.target.value)}
                      className="mr-3 text-[#25d366] focus:ring-[#25d366]"
                    />
                    <span className="text-sm font-medium">All Customers (from order history)</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="targetCustomers"
                      value="custom"
                      checked={targetCustomers === "custom"}
                      onChange={(e) => setTargetCustomers(e.target.value)}
                      className="mr-3 text-[#25d366] focus:ring-[#25d366]"
                    />
                    <span className="text-sm font-medium">Custom List</span>
                  </label>
                </div>

                {targetCustomers === "custom" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex space-x-4 mb-4">
                      <input
                        type="text"
                        placeholder="Customer Name"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-transparent"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-transparent"
                      />
                      <button
                        onClick={addCustomCustomer}
                        className="px-6 py-3 bg-[#25d366] text-white rounded-lg hover:bg-[#128c7e] transition-colors font-medium"
                      >
                        Add
                      </button>
                    </div>

                    {customCustomers.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Custom Customers ({customCustomers.length}):</p>
                        {customCustomers.map((customer, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <span className="text-sm">
                              {customer.name} - {customer.phone}
                            </span>
                            <button
                              onClick={() => removeCustomCustomer(index)}
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Send Button */}
              <div className="flex justify-end">
                <button
                  onClick={sendPromotionalMessages}
                  disabled={loading || !offerDetails.trim()}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                >
                  <Send size={20} />
                  <span>{loading ? "Sending..." : "Send Messages"}</span>
                </button>
              </div>

              {/* Results */}
              {results && (
                <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Sending Results</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-900">{results.results?.total || 0}</p>
                      <p className="text-sm text-gray-500">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-green-600">{results.results?.success || 0}</p>
                      <p className="text-sm text-gray-500">Success</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-red-600">{results.results?.failed || 0}</p>
                      <p className="text-sm text-gray-500">Failed</p>
                    </div>
                  </div>
                  
                  {results.results?.details && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {results.results.details.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-sm">{result.customer} - {result.phone}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {result.success ? 'Sent' : 'Failed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "status" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">WhatsApp Message Status</h3>
                <button
                  onClick={fetchRecentOrders}
                  className="px-4 py-2 bg-[#25d366] text-white rounded-lg hover:bg-[#128c7e] transition-colors text-sm font-medium"
                >
                  Refresh
                </button>
              </div>

              <div className="space-y-4">
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const StatusIcon = getWhatsAppStatusIcon(order.whatsappStatus);
                    return (
                      <div key={order._id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-bold text-gray-900">#{order._id.slice(-6)}</p>
                            <p className="text-sm text-gray-600">{order.user} - {order.phone}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <StatusIcon size={16} className={getWhatsAppStatusColor(order.whatsappStatus).split(' ')[0]} />
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWhatsAppStatusColor(order.whatsappStatus)}`}>
                              {order.whatsappStatus || 'Pending'}
                            </span>
                          </div>
                        </div>
                        
                        {order.whatsappMessages && order.whatsappMessages.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium text-gray-700">Messages:</p>
                            {order.whatsappMessages.map((msg, index) => (
                              <div key={index} className="p-2 bg-white rounded-lg border text-xs">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium capitalize">{msg.messageType?.replace('_', ' ')}</span>
                                  <span className="text-gray-500">
                                    {new Date(msg.sentAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-gray-600 truncate">{msg.message.substring(0, 100)}...</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No orders with WhatsApp data found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}