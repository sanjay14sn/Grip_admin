const mongoose = require('mongoose');

async function checkUser() {
    const mongoUri = "mongodb+srv://venkat_db_user:gkvOYrsmSijlT8IH@cluster0.nmftukw.mongodb.net/grip_live";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Fetch user by mobile number
    const user = await mongoose.connection.collection('users').findOne({ mobileNumber: '7868000645' });
    console.log("USER:", user);

    if (user) {
        // Fetch chapters where this user is mentor or cid
        const chapters = await mongoose.connection.collection('chapters').find({
            $or: [
                { mentorId: user._id },
                { cidId: user._id }
            ]
        }).toArray();
        console.log("CHAPTERS:", chapters.map(c => ({ _id: c._id, chapterName: c.chapterName, mentorId: c.mentorId, cidId: c.cidId })));
    }

    await mongoose.disconnect();
}

checkUser().catch(console.error);
