// src/components/customer/OrderCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MessageCircle, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';

const OrderCard = ({ order, onCancel, onChat, showActions = true }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'meeting_scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'ready_for_pickup':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'ready_for_pickup':
        return <Package className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Waiting for seller confirmation';
      case 'confirmed':
        return 'Order confirmed by seller';
      case 'meeting_scheduled':
        return 'Meeting scheduled';
      case 'ready_for_pickup':
        return 'Ready for pickup - OTP sent';
      case 'completed':
        return 'Order completed';
      case 'cancelled':
        return 'Order cancelled';
      default:
        return status;
    }
  };

  const canCancel = ['pending', 'confirmed'].includes(order.orderStatus);
  const canChat = !['completed', 'cancelled'].includes(order.orderStatus);

  const handleChat = () => {
    if (onChat) {
      onChat(order._id);
    } else {
      navigate(`/customer/chat/${order._id}`);
    }
  };

  const handleCancel = () => {
    if (onCancel && window.confirm('Are you sure you want to cancel this order?')) {
      onCancel(order._id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="bg-primary-100 p-3 rounded-xl">
              <Package className="text-primary-600 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Order #{order.orderNumber}
              </h3>
              <p className="text-gray-600">
                Seller: <span className="font-medium">{order.seller.businessName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">₹{order.totalAmount}</p>
              <p className="text-sm text-gray-600">
                {order.quantity} × ₹{order.pricePerUnit}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(order.orderStatus)}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
              {getStatusText(order.orderStatus)}
            </span>
          </div>
          
          <div className="text-sm text-gray-600">
            Ordered on {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* OTP Notice */}
        {order.orderStatus === 'ready_for_pickup' && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-blue-600" />
              <p className="text-blue-800 text-sm font-medium">OTP Sent to Your Email</p>
            </div>
            <p className="text-blue-700 text-xs mt-1">
              Check your email for the OTP and share it with the seller during your meeting.
            </p>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-6">
        <div className="flex space-x-4">
          {/* Product Image */}
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
            {order.productSnapshot?.images?.[0] ? (
              <img 
                src={order.productSnapshot.images[0]} 
                alt={order.productSnapshot.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-lg mb-2">
              {order.productSnapshot.title}
            </h4>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {order.productSnapshot.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Quantity:</span>
                <span className="font-medium ml-2">{order.quantity} {order.productSnapshot.unit || 'units'}</span>
              </div>
              <div>
                <span className="text-gray-500">Unit Price:</span>
                <span className="font-medium ml-2">₹{order.pricePerUnit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Meeting Details */}
        {order.meetingDetails && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Meeting Details</p>
                {order.meetingDetails.scheduledTime && (
                  <p className="text-sm text-gray-600 mt-1">
                    Scheduled for {new Date(order.meetingDetails.scheduledTime).toLocaleString()}
                  </p>
                )}
                {order.meetingDetails.location?.address && (
                  <p className="text-sm text-gray-600 mt-1">
                    Location: {order.meetingDetails.location.address}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
            {canChat && (
              <button
                onClick={handleChat}
                className="btn-primary flex items-center justify-center space-x-2 flex-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Seller</span>
              </button>
            )}

            {canCancel && (
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center justify-center space-x-2 flex-1 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Order</span>
              </button>
            )}

            {order.orderStatus === 'completed' && (
              <button
                onClick={() => navigate(`/customer/chat/${order._id}`)}
                className="btn-secondary flex items-center justify-center space-x-2 flex-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span>View Chat History</span>
              </button>
            )}
          </div>
        )}

        {/* Order Timeline */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-900 mb-3">Order Timeline</p>
            <div className="space-y-2">
              {order.statusHistory.slice(-3).reverse().map((history, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{history.note || `Status changed to ${history.status}`}</span>
                  <span className="text-gray-500">
                    {new Date(history.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;