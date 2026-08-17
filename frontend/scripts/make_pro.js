import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

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

async function upgradeUsers() {
  console.log("Upgrading all users to 'pro'...");
  const snap = await getDocs(collection(db, "users"));
  
  if (snap.empty) {
    console.log("No users found in database yet. Please log in to the app first so your user document is created!");
    process.exit(0);
  }

  for (const document of snap.docs) {
    await updateDoc(doc(db, "users", document.id), { role: 'pro' });
    console.log(`Upgraded user ${document.id} to pro!`);
  }

  console.log("Success! Refresh your browser.");
  process.exit(0);
}

upgradeUsers().catch(console.error);
