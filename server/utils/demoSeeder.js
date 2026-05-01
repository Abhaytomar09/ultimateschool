const mongoose = require('mongoose');
const School = require('../models/School');
const User = require('../models/User');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Timetable = require('../models/Timetable');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission'); // may not exist yet; create placeholder if needed
const FeePayment = require('../models/FeePayment');

// Helper data
const indianNames = [
  'Aarav', 'Vihaan', 'Ananya', 'Priya', 'Rohit', 'Sanjay', 'Neha', 'Pooja',
  'Kavya', 'Riya', 'Arjun', 'Rajat', 'Deepak', 'Sunita', 'Manish', 'Amit',
  'Sneha', 'Kiran', 'Aniket', 'Shreya'
];
const surnames = ['Sharma', 'Patel', 'Gupta', 'Verma', 'Singh', 'Kumar', 'Reddy', 'Jain'];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomName = () => `${randomItem(indianNames)} ${randomItem(surnames)}`;

// Main seeder function
async function seedDemoData() {
  // Clean demo collections (keep other data untouched)
  await Promise.all([
    School.deleteMany({}),
    User.deleteMany({}),
    Class.deleteMany({}),
    Subject.deleteMany({}),
    Timetable.deleteMany({}),
    Attendance.deleteMany({}),
    Assignment.deleteMany({}),
    Submission && Submission.deleteMany({}),
    FeePayment && FeePayment.deleteMany({})
  ]);

  // 1️⃣ Create demo school
  const school = await School.create({
    schoolCode: 'SCH001',
    name: 'ABC Public School',
    address: '123 Demo St, Mumbai',
    contactEmail: 'admin@abcpublic.edu',
    idCounters: { admin: 1, teacher: 0, student: 0, parent: 0 }
  });

  // 2️⃣ Create admin user
  const admin = await User.create({
    schoolId: school._id,
    customId: 'ad0001',
    name: 'Demo Admin',
    email: 'admin@abcpublic.edu',
    password: await require('bcryptjs').hash('demo123', 10),
    role: 'admin'
  });

  // 3️⃣ Create teachers
  const teachers = [];
  for (let i = 1; i <= 20; i++) {
    const prefix = 'th';
    const customId = `${prefix}${String(i).padStart(4, '0')}`;
    const teacher = await User.create({
      schoolId: school._id,
      customId,
      name: randomName(),
      email: `teacher${i}@abcpublic.edu`,
      password: await require('bcryptjs').hash('demo123', 10),
      role: 'teacher'
    });
    teachers.push(teacher);
  }

  // 4️⃣ Create classes (9A‑12B)
  const sections = ['A', 'B'];
  const classes = [];
  for (let grade = 9; grade <= 12; grade++) {
    for (const sec of sections) {
      const classDoc = await Class.create({
        schoolId: school._id,
        name: `${grade}${sec}`,
        academicYear: '2025-2026',
        classTeacher: teachers[Math.floor(Math.random() * teachers.length)]._id
      });
      classes.push(classDoc);
    }
  }

  // 5️⃣ Create subjects (same for each class)
  const subjectNames = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Computer Science'];
  const subjects = [];
  for (const cls of classes) {
    for (const subName of subjectNames) {
      const sub = await Subject.create({
        schoolId: school._id,
        name: subName,
        classId: cls._id
      });
      subjects.push(sub);
    }
  }

  // 6️⃣ Assign teachers to subjects (simple round‑robin)
  for (let i = 0; i < subjects.length; i++) {
    const teacher = teachers[i % teachers.length];
    subjects[i].assignedTeacher = teacher._id;
    await subjects[i].save();
  }

  // 7️⃣ Create timetable for each class (6 periods, Mon‑Sat)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periodTimes = [
    { start: '08:00', end: '08:45' },
    { start: '09:00', end: '09:45' },
    { start: '10:00', end: '10:45' },
    { start: '11:00', end: '11:45' },
    { start: '12:00', end: '12:45' },
    { start: '13:00', end: '13:45' }
  ];
  for (const cls of classes) {
    const classSubjects = subjects.filter(s => s.classId.toString() === cls._id.toString());
    for (const day of days) {
      const periods = [];
      for (let p = 0; p < periodTimes.length; p++) {
        const subject = classSubjects[p % classSubjects.length];
        periods.push({
          startTime: periodTimes[p].start,
          endTime: periodTimes[p].end,
          subjectId: subject._id,
          teacherId: subject.assignedTeacher
        });
      }
      await Timetable.create({
        schoolId: school._id,
        classId: cls._id,
        dayOfWeek: day,
        periods
      });
    }
  }

  // 8️⃣ Create students & parents (500 students, 2 parents each)
  const students = [];
  const parents = [];
  for (let i = 1; i <= 500; i++) {
    const customId = `st${String(i).padStart(4, '0')}`;
    const cls = classes[i % classes.length]; // distribute evenly
    const student = await User.create({
      schoolId: school._id,
      customId,
      name: randomName(),
      email: `student${i}@abcpublic.edu`,
      password: await require('bcryptjs').hash('demo123', 10),
      role: 'student',
      classAssigned: cls._id
    });
    students.push(student);

    // Father
    const fatherId = `pf${String(i).padStart(4, '0')}`;
    const father = await User.create({
      schoolId: school._id,
      customId: fatherId,
      name: randomName(),
      email: `father${i}@abcpublic.edu`,
      password: await require('bcryptjs').hash('demo123', 10),
      role: 'parent',
      linkedStudents: [student._id]
    });
    // Mother
    const motherId = `pm${String(i).padStart(4, '0')}`;
    const mother = await User.create({
      schoolId: school._id,
      customId: motherId,
      name: randomName(),
      email: `mother${i}@abcpublic.edu`,
      password: await require('bcryptjs').hash('demo123', 10),
      role: 'parent',
      linkedStudents: [student._id]
    });
    parents.push(father, mother);
  }

  // 9️⃣ Attendance for past 30 days
  const today = new Date();
  const attendanceRecords = [];
  for (const student of students) {
    for (let d = 1; d <= 30; d++) {
      const date = new Date();
      date.setDate(today.getDate() - d);
      const present = Math.random() < 0.85; // 85% chance present
      attendanceRecords.push({
        schoolId: school._id,
        studentId: student._id,
        classId: student.classAssigned,
        date: date,
        status: present ? 'Present' : 'Absent'
      });
    }
  }
  await Attendance.insertMany(attendanceRecords);

  // 🔟 Assignments (5‑10 per subject)
  const assignments = [];
  for (const sub of subjects) {
    const count = 5 + Math.floor(Math.random() * 6);
    for (let a = 1; a <= count; a++) {
      const assignmentSubmissions = [];
      const classStudents = students.filter(s => s.classAssigned.toString() === sub.classId.toString());
      
      for (const student of classStudents) {
        if (Math.random() < 0.8) {
          assignmentSubmissions.push({
            studentId: student._id,
            submittedAt: new Date(),
            marksAwarded: 50 + Math.floor(Math.random() * 41) // 50‑90
          });
        }
      }

      const assignment = await Assignment.create({
        schoolId: school._id,
        classId: sub.classId,
        subjectId: sub._id,
        teacherId: sub.assignedTeacher,
        title: `${sub.name} Assignment ${a}`,
        description: `Please complete ${sub.name.toLowerCase()} assignment ${a}.`,
        dueDate: new Date(today.getTime() + a * 7 * 24 * 60 * 60 * 1000), // future deadline
        submissions: assignmentSubmissions
      });
      assignments.push(assignment);
    }
  }

  // 💰 Fees (monthly for 3 months)
  const feeRecords = [];
  for (const student of students) {
    for (let m = 6; m <= 8; m++) {
      const paid = Math.random() < 0.7; // 70% paid
      const amount = 2000 + Math.floor(Math.random() * 2001); // 2000-4000
      feeRecords.push({
        schoolId: school._id,
        studentId: student._id,
        classId: student.classAssigned,
        academicYear: '2025-2026',
        feeType: 'monthly',
        amountDue: amount,
        amountPaid: paid ? amount : 0,
        status: paid ? 'Paid' : 'Pending',
        dueDate: new Date(2025, m - 1, 10), // 10th of the month
        paymentDate: paid ? new Date(2025, m - 1, 5) : null,
        paymentMode: paid ? randomItem(['Online', 'Offline']) : undefined,
        receiptUrl: paid ? `https://demo.receipts.com/TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}.pdf` : undefined
      });
    }
  }
  await FeePayment.insertMany(feeRecords);

  console.log('✅ Demo data seeded successfully');
}

module.exports = { seedDemoData };
