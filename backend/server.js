// const http = require('http');
// const app = require('./app');
// const server = http.createServer(app);
// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//     console.log('Server is running on port: ' + PORT);
// });

const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// 🔥 SOCKET.IO SETUP
const socketIo = require('socket.io');
const ChatRoomModel = require('./models/chatRoom.model');
const MessageModel = require('./models/message.model');

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Join specific chat room
  socket.on('join_chat_room', (chatRoomId) => {
    socket.join(chatRoomId);
    console.log(`User ${socket.id} joined chat room: ${chatRoomId}`);
  });

  // Leave chat room
  socket.on('leave_chat_room', (chatRoomId) => {
    socket.leave(chatRoomId);
    console.log(`User ${socket.id} left chat room: ${chatRoomId}`);
  });

  // Handle sending messages
  socket.on('send_message', async (data) => {
    try {
      const { chatRoomId, senderType, senderId, content, messageType = 'text' } = data;

      // Save message to database
      const message = new MessageModel({
        chatRoom: chatRoomId,
        senderType,
        senderId,
        content,
        messageType
      });

      await message.save();

      // Update chat room's last message
      await ChatRoomModel.findByIdAndUpdate(chatRoomId, {
        lastMessage: {
          content,
          senderType,
          senderId,
          timestamp: new Date()
        },
        // Update unread counts
        $inc: {
          ...(senderType === 'customer' ? { 'unreadCount.seller': 1 } : { 'unreadCount.customer': 1 })
        }
      });

      // Populate message for sending to clients
      const populatedMessage = await MessageModel.findById(message._id)
        .populate('senderId', 'name businessName');

      // Broadcast to everyone in the chat room
      io.to(chatRoomId).emit('receive_message', {
        success: true,
        message: populatedMessage
      });

      console.log(`💬 Message sent in room ${chatRoomId} by ${senderType}`);

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', {
        success: false,
        error: 'Failed to send message'
      });
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const { chatRoomId, userType } = data;
    socket.to(chatRoomId).emit('user_typing', {
      userType,
      isTyping: true
    });
  });

  socket.on('typing_stop', (data) => {
    const { chatRoomId, userType } = data;
    socket.to(chatRoomId).emit('user_typing', {
      userType,
      isTyping: false
    });
  });

  // Handle message read receipts
  socket.on('mark_messages_read', async (data) => {
    try {
      const { chatRoomId, userType } = data;
      
      // Update unread count in chat room
      await ChatRoomModel.findByIdAndUpdate(chatRoomId, {
        [`unreadCount.${userType}`]: 0
      });

      // Mark messages as read in database
      await MessageModel.updateMany(
        { 
          chatRoom: chatRoomId,
          isRead: false,
          senderType: { $ne: userType } // Only mark others' messages as read
        },
        { 
          isRead: true,
          readAt: new Date()
        }
      );

      // Notify other user that messages were read
      socket.to(chatRoomId).emit('messages_read', {
        readBy: userType,
        readAt: new Date()
      });

    } catch (error) {
      console.error('Error marking messages read:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Make io accessible to other parts of your app
app.set('io', io);

server.listen(PORT, () => {
  console.log('🚀 Server is running on port: ' + PORT);
  console.log('🔌 Socket.io is running');
});

module.exports = { server, io };