const { onCall } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onObjectFinalized } = require("firebase-functions/v2/storage");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

/// 1. Dodajanje hišnega ljubljenčka
exports.addPet = onCall(async (request) => {
  const { name, type } = request.data;
  const uid = request.auth?.uid;

  if (!uid || !name || !type) {
    throw new Error("Missing required fields or user not authenticated.");
  }

  await db.collection("pets").add({
    name,
    type,
    owner: uid,
    created: new Date(),
  });

  return { message: "Žival dodana" };
});

/// 2. Načrtovanje nege
exports.scheduleCare = onCall(async (request) => {
  const { petId, date, description } = request.data;
  const uid = request.auth?.uid;

  if (!uid || !petId || !date || !description) {
    throw new Error("Missing required fields or user not authenticated.");
  }

  await db.collection("careTasks").add({
    petId,
    date,
    description,
    owner: uid,
    done: false,
    created: new Date(),
  });

  return { message: "Opravilo shranjeno" };
});

/// 3. Obvestilo ob dodani negi (trigger)
exports.onCareScheduled = onDocumentCreated("careTasks/{taskId}", async (event) => {
  const task = event.data.data();
  console.log(`Care task for pet ${task.petId} scheduled on ${task.date}: ${task.description}`);
});

/// 4. Trigger za naloženo potrdilo (npr. zdravniško) NETESTIRANO
exports.onVetDocUploaded = onObjectFinalized(async (event) => {
  const filePath = event.data.name;
  const contentType = event.data.contentType;
  console.log(`Uploaded file: ${filePath} (${contentType})`);
});

/// 5. Dnevni cron opomnik za nego
exports.sendDailyReminders = onSchedule("every day 07:00", async () => {
  const now = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const snapshot = await db.collection("careTasks").where("date", "==", now).get();

  snapshot.forEach(doc => {
    const task = doc.data();
    console.log(`Reminder: ${task.description} for pet ${task.petId} (user ${task.owner})`);
  });

/// 6. dodajanje slike
exports.onPetImageUploaded = onObjectFinalized("pets/{filename}", async (event) => {
  const filePath = event.data.name;
  const contentType = event.data.contentType;

  console.log(`Nova datoteka naložena: ${filePath} (${contentType})`);

  await db.collection("imageLogs").add({
    filePath,
    contentType,
    uploadedAt: new Date()
  });
});

});
