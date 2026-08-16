import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3NU0SZ4PgKFDNbiar6NGa3PpYioHSaqI",
  authDomain: "build-pilot.firebaseapp.com",
  projectId: "build-pilot",
  storageBucket: "build-pilot.firebasestorage.app",
  messagingSenderId: "5865197158",
  appId: "1:5865197158:web:53c656a2b836ee0672a7a7",
  measurementId: "G-4KEM5BY8BN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("Seeding professional applications...");
  await addDoc(collection(db, "professional_applications"), {
    userId: "mock-user-1",
    name: "John Doe",
    role: "Plumber",
    license: "LP-982736",
    date: "Jul 24",
    status: "Pending"
  });

  await addDoc(collection(db, "professional_applications"), {
    userId: "mock-user-2",
    name: "James Carter",
    role: "Electrician",
    license: "LE-873645",
    date: "Jul 25",
    status: "Pending"
  });

  console.log("Seeding flagged posts...");
  await addDoc(collection(db, "flagged_posts"), {
    type: "Property Listing",
    title: "Unverified Cabin Plot",
    reason: "Suspected fake deeds documentation",
    date: "Jul 25"
  });

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(console.error);
