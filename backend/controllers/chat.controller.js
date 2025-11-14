const MessageModel = require("../models/message.model");
const ChatRoomModel = require("../models/chatRoom.model");

// Get chat messages for an order
module.exports.getChatMessages = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Determine user type and ID from separate middleware
    let userId, userType;
    if (req.customer) {
      userId = req.customer._id;
      userType = 'customer';
    } else if (req.seller) {
      userId = req.seller._id;
      userType = 'seller';
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Find chat room and verify access
    const chatRoom = await ChatRoomModel.findOne({ order: orderId });
    
    if (!chatRoom) {
      return res.status(404).json({
        success: false,
        message: "Chat room not found"
      });
    }

    // Verify user has access to this chat
    const hasAccess = (userType === 'customer' && chatRoom.customer.toString() === userId.toString()) ||
                     (userType === 'seller' && chatRoom.seller.toString() === userId.toString());

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this chat"
      });
    }

    // Get messages
    const messages = await MessageModel.find({ 
      chatRoom: chatRoom._id 
    })
    .populate('senderId', 'name businessName')
    .sort({ createdAt: 1 });

    // Mark messages as read if they're viewing the chat
    if (messages.length > 0) {
      await MessageModel.updateMany(
        {
          chatRoom: chatRoom._id,
          isRead: false,
          senderType: { $ne: userType }
        },
        {
          isRead: true,
          readAt: new Date()
        }
      );

      // Reset unread count for this user
      await ChatRoomModel.findByIdAndUpdate(chatRoom._id, {
        [`unreadCount.${userType}`]: 0
      });
    }

    res.status(200).json({
      success: true,
      messages,
      chatRoom,
      message: "Messages fetched successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Send message 
module.exports.sendMessage = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { content, messageType = 'text' } = req.body;
    
    // Determine user type and ID from separate middleware
    let userId, userType;
    if (req.customer) {
      userId = req.customer._id;
      userType = 'customer';
    } else if (req.seller) {
      userId = req.seller._id;
      userType = 'seller';
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const chatRoom = await ChatRoomModel.findOne({ order: orderId });
    
    if (!chatRoom) {
      return res.status(404).json({
        success: false,
        message: "Chat room not found"
      });
    }

    // Verify access
    const hasAccess = (userType === 'customer' && chatRoom.customer.toString() === userId.toString()) ||
                     (userType === 'seller' && chatRoom.seller.toString() === userId.toString());

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this chat"
      });
    }

    const message = new MessageModel({
      chatRoom: chatRoom._id,
      senderType: userType,
      senderId: userId,
      content,
      messageType
    });

    await message.save();

    // Update chat room last message
    await ChatRoomModel.findByIdAndUpdate(chatRoom._id, {
      lastMessage: {
        content,
        senderType: userType,
        senderId: userId,
        timestamp: new Date()
      },
      $inc: {
        ...(userType === 'customer' ? { 'unreadCount.seller': 1 } : { 'unreadCount.customer': 1 })
      }
    });

    const populatedMessage = await MessageModel.findById(message._id)
      .populate('senderId', 'name businessName');

    res.status(201).json({
      success: true,
      message: populatedMessage,
      message: "Message sent successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};