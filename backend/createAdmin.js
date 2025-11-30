const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGO_URI;

const adminData = {
  name: "Admin User",
  email: "admin@loceal.com",
  password: "admin123", // Change this to your desired password
  phone: "1234567890"
};

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Insert admin
    const admin = await mongoose.connection.collection('admins').insertOne({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      phone: adminData.phone,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Admin created successfully:', admin.insertedId);
    console.log('Login with:');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();