const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// Define an HTTP onRequest Cloud Function
exports.myOnRequestFunction = functions.https.onRequest((request, response) => {
  // Respond with a simple message
  response.send("Hello from my onRequest Cloud Function!");
});

// Define a Callable onCall Cloud Function
exports.myOnCallFunction = functions.https.onCall(async (data, context) => {
  // Extract data passed from the client-side application
  try {
    await db
      .collection("sessions")
      .doc()
      .collection(data.sessionInfo.tattooArtist)
      .doc()
      .set({
        name: data.name,
        price: data.sessionInfo.price,
        date: data.sessionInfo.date,
      });
    return { message: "Session created sucessfully", success: true };
  } catch (error) {
    console.error("Error adming admin for the institution", error);
    return {
      message: "Error adming admin for the institution",
      success: false,
    };
  }
});

exports.createUserDoc = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection("users").doc(user.uid).set({
    email: user.email,
    uid: user.uid,
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    gender: "",
    bio: "",
    place: "",
    birthdate: "",
    pic_url: "",
    hasTattoo: "",
    yearsXp: "",
    style: "",
    revshare: "",
    instagram: "",
    twitter: "",
    facebook: "",
    portfolio: "",
  });
});

exports.getUser = functions.https.onCall(async (data, context) => {
  try {
    // Check if the data contains the tattoo artist's name and date
    if (!context) {
      throw new Error("You are not logged in.");
    }

    // Firestore query for sessions based on both tattoo artist and date
    const userSnapshot = await db
      .collection("users")
      .where("uid", "==", context.auth.token.uid)
      .get();

    const user = [];
    userSnapshot.forEach((doc) => {
      const userData = doc.data();
      user.push({
        uid: doc.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        phoneNumber: userData.phoneNumber,
        gender: userData.gender,
        bio: userData.bio,
        place: userData.place,
        birthdate: userData.birthdate,
        pic_url: userData.pic_url,
        hasTattoo: userData.hasTattoo,
        yearsXp: userData.yearsXp,
        style: userData.style,
        revshare: userData.revshare,
        instagram: userData.instagram,
        twitter: userData.twitter,
        facebook: userData.facebook,
        portfolio: userData.portfolio,
      });
    });

    return { user, success: true };
  } catch (error) {
    console.error("Error retrieving sessions", error);
    return {
      message: "Error retrieving sessions",
      success: false,
    };
  }
});

exports.updateUser = functions.https.onCall(async (data, context) => {
  const userId = data.document_id;
  const newData = data.newData;
  const sessionRef = admin.firestore().collection("users").doc(data.uid);
  try {
    await sessionRef.update(newData);
    console.log("Session updated successfully.");
    return {
      message: "session updated successfully.",
      success: true,
      document_data: newData,
      document_id: userId,
    };
  } catch (error) {
    console.error("Error updating session:", error);
    return { message: "Error updating session", success: false };
  }
});

exports.createSession = functions.https.onCall(async (data, context) => {
  try {
    await db
      .collection("sessions")
      .doc()
      .collection(data.sessionInfo.tattooArtist)
      .doc()
      .set({
        name: data.name,
        tattooArtistEmail: tattooArtistEmail,
        price: data.sessionInfo.price,
        date: data.sessionInfo.date,
      });
    return { message: "Session created sucessfully", success: true };
  } catch (error) {
    console.error("Error adming admin for the institution", error);
    return {
      message: "Error adming admin for the institution",
      success: false,
    };
  }
});

exports.getSession = functions.https.onCall(async (data, context) => {
  try {
    // Check if the data contains the tattoo artist's name and date
    if (!data.tattooArtist || !data.date) {
      throw new Error("Tattoo artist's name and date are required.");
    }

    // Firestore query for sessions based on both tattoo artist and date
    const sessionsSnapshot = await db
      .collection("sessions")
      .where("tattooArtist", "==", data.tattooArtist)
      .where("date", "==", data.date)
      .get();

    const sessions = [];
    sessionsSnapshot.forEach((doc) => {
      const sessionData = doc.data();
      sessions.push({
        id: doc.id,
        name: sessionData.name,
        price: sessionData.price,
        date: sessionData.date,
        tattooArtist: sessionData.tattooArtist,
      });
    });

    return { sessions, success: true };
  } catch (error) {
    console.error("Error retrieving sessions", error);
    return {
      message: "Error retrieving sessions",
      success: false,
    };
  }
});

exports.updateSession = functions.https.onCall(async (data, context) => {
  const sessionId = data.document_id;
  const newData = data.newData;
  const sessionRef = admin
    .firestore()
    .collection("sessions")
    .doc()
    .collection(data.sessionInfo.tattooArtist)
    .doc(sessionId);
  try {
    await sessionRef.update(newData);
    console.log("Session updated successfully.");
    return {
      message: "session updated successfully.",
      success: true,
      document_data: newData,
      document_id: sessionId,
    };
  } catch (error) {
    console.error("Error updating session:", error);
    return { message: "Error updating session", success: false };
  }
});
