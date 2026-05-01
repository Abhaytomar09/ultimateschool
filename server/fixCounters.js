const mongoose = require('mongoose');
require('dotenv').config();
const School = require('./models/School');
const User = require('./models/User');

async function fix() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ultimateschool');
    
    const schools = await School.find();
    for (const school of schools) {
        const studentCount = await User.countDocuments({ schoolId: school._id, role: 'student' });
        const teacherCount = await User.countDocuments({ schoolId: school._id, role: 'teacher' });
        const parentCount = await User.countDocuments({ schoolId: school._id, role: 'parent' });
        const adminCount = await User.countDocuments({ schoolId: school._id, role: 'admin' });
        
        school.idCounters = {
            student: studentCount,
            teacher: teacherCount,
            parent: parentCount,
            admin: adminCount
        };
        await school.save();
        console.log(`Updated school ${school.name} counters:`, school.idCounters);
    }
    
    mongoose.disconnect();
}

fix().catch(console.error);
