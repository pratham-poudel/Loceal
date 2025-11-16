// src/pages/Seller/SellerChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { chatAPI, sellerAPI } from '../../lib/api';
import { socket } from '../../lib/socket';
import { Send, ArrowLeft, MapPin, Clock, DollarSign } from 'lucide-react';

const SellerChat = () => {
  const { orderId } = useParams();
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    fetchOrderAndMessages();
    setupSocket();

    return () => {
      if (socket) {
        socket.emit('leave_chat_room', orderId);
      }
    };
  }, [orderId]);

  const fetchOrderAndMessages = async () => {
    try {
      setLoading(true);
      const [orderResponse, messagesResponse] = await Promise.all([
        sellerAPI.getOrderWithChat(orderId),
        chatAPI.getMessages(orderId, userType)
      ]);

      setOrder(orderResponse.data.order);
      setMessages(messagesResponse.data.messages || []);

      // Join chat room
      if (socket) {
        socket.emit('join_chat_room', orderResponse.data.order.chatRoom._id);
      }
    } catch (error) {
      console.error('Error fetching chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    if (!socket) return;

    socket.on('receive_message', (data) => {
      if (data.success && data.message) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    socket.on('message_error', (data) => {
      console.error('Message error:', data.error);
      alert('Failed to send message: ' + data.error);
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);

      if (socket) {
        socket.emit('send_message', {
          chatRoomId: order.chatRoom._id,
          senderType: userType,
          senderId: user._id,
          content: newMessage.trim(),
          messageType: 'text'
        });
      } else {
        // Fallback to REST API
        await chatAPI.sendMessage(orderId, userType, {
          content: newMessage.trim(),
          messageType: 'text'
        });
        await fetchOrderAndMessages(); // Refresh messages
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleInitiatePayment = async () => {
    try {
      await sellerAPI.initiatePayment(orderId);
      alert('OTP sent to customer successfully! Please ask the customer to share the OTP with you.');
      await fetchOrderAndMessages(); // Refresh to get updated order status
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setVerifyingOTP(true);
      await sellerAPI.verifyOTP(orderId, { otp });
      alert('Payment verified successfully! Order completed.');
      setShowOTPInput(false);
      setOtp('');
      await fetchOrderAndMessages(); // Refresh to get updated order status
      navigate('/seller/orders');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert(error.response?.data?.message || 'Invalid OTP. Please check with the customer.');
    } finally {
      setVerifyingOTP(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/seller/orders')}
            className="btn-primary"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/seller/orders')}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">
                Chat with {order.customer.name}
              </h1>
              <p className="text-gray-600 text-sm">
                Order #{order.orderNumber} • {order.productSnapshot.title}
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-primary-600">₹{order.totalAmount}</p>
              <p className="text-gray-600 text-sm">{order.quantity} × ₹{order.pricePerUnit}</p>
            </div>
          </div>

          {/* Order Status & Actions */}
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                {/* <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.orderStatus === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {order.orderStatus.replace('_', ' ')}
                </div> */}
                <span className="text-gray-700 text-base font-bold">
                  Chat with Customer
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                {order.orderStatus === 'meeting_scheduled' && (
                  <button
                    onClick={handleInitiatePayment}
                    className="btn-primary flex items-center space-x-2 text-sm"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Initiate Payment</span>
                  </button>
                )}

                {order.orderStatus === 'ready_for_pickup' && !showOTPInput && (
                  <button
                    onClick={() => setShowOTPInput(true)}
                    className="btn-primary flex items-center space-x-2 text-sm"
                  >
                    <span>Enter OTP</span>
                  </button>
                )}

                {order.meetingDetails?.scheduledTime && (
                  <div className="flex items-center space-x-1 text-gray-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(order.meetingDetails.scheduledTime).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* OTP Input */}
            {showOTPInput && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-yellow-800 mb-1">
                      Enter OTP from Customer
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="input-field text-center text-lg font-mono tracking-widest"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleVerifyOTP}
                      disabled={verifyingOTP || otp.length !== 6}
                      className="btn-primary text-sm disabled:opacity-50"
                    >
                      {verifyingOTP ? 'Verifying...' : 'Verify'}
                    </button>
                    <button
                      onClick={() => setShowOTPInput(false)}
                      className="btn-secondary text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <p className="text-yellow-700 text-xs mt-2">
                  Ask the customer to share the OTP they received via email.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="container mx-auto px-4 py-6">
        <div 
          ref={chatContainerRef}
          className="bg-white rounded-2xl shadow-sm h-[calc(100vh-280px)] overflow-hidden flex flex-col"
        >
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <p>No messages yet. Start the conversation!</p>
                <p className="text-sm mt-2">
                  Coordinate meeting time, location, and other details with the customer.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.senderType === userType ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.senderType === userType
                        ? 'bg-primary-500 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    {/* System Messages */}
                    {message.senderType === 'system' && (
                      <div className="text-center text-sm text-gray-500 italic">
                        {message.content}
                      </div>
                    )}
                    
                    {/* Regular Messages */}
                    {message.senderType !== 'system' && (
                      <>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderType === userType 
                            ? 'text-primary-100' 
                            : 'text-gray-500'
                        }`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 input-field"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>

            {/* Chat Tips */}
            <div className="mt-3 text-xs text-gray-500">
              <p>💡 Discuss meeting location, time, and product details with the customer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerChat;