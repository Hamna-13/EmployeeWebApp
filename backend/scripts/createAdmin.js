const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user'); 

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existingAdmin = await User.findOne({ email: 'admin@corehours.com' });
  if (existingAdmin) {
    console.log('Admin already exists');
    return mongoose.disconnect();
  }

  const admin = new User({
    firstName: 'Admin',
    lastName: '123',
    companyName: 'CoreHours',
    email: 'admin@gmail.com',
    password: 'admin1234',
    role: 'admin',
  });

  await admin.save();
  console.log('Admin created');
  mongoose.disconnect();
};

createAdmin();
