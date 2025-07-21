import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
let docRef = collection(db, "posts");
let userRef = collection(db, "users");
export default function FireStore(postData) {
  let object = { ...postData };
  addDoc(docRef, object)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}
export const getStatus = (setPosts) => {
  onSnapshot(docRef, (data) => {
    setPosts(
      data.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      })
    );
  });
};

export const postUserData = async (userData) => {
  const uid = auth.currentUser?.uid;

  try {
    if (!uid) {
      console.error("User not authenticated");
      return;
    }
  } catch (error) {
    console.error("Error getting current user UID:", error);
  }
  let object = { ...userData };
  await setDoc(doc(userRef, uid), object);
};
export const getUser = (setCurrUser) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const currUser = user.email;
      // console.log("Authenticated user email:", currUser);
      onSnapshot(userRef, (data) => {
        const allUsers = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const matchedUser = allUsers.find((u) => u.email === currUser);
        setCurrUser(matchedUser);
      });
    } else {
      console.log("User not authenticated.");
    }
  });
};

// export const editUser = async (userId, payload) => {
//   const userDocRef = doc(userRef, userId);
//   const docSnap = await getDoc(userDocRef);
//   if (docSnap.exists()) {
//     await updateDoc(userDocRef, payload);
//     console.log("User document updated successfully");
//   } else {
//     // Create the document if it doesn't exist
//     await setDoc(userDocRef, payload);
//     console.log("User document created successfully");
//   }
// };

export const editUser = async (payload) => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.error("No authenticated user found.");
    return;
  }

  const userDocRef = doc(userRef, currentUser.uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    await updateDoc(userDocRef, payload);
    console.log("User document updated successfully");
  } else {
    console.warn("⚠️ User document not found. Not updating or creating.");
  }
};

export const getUserDataByUID = async (uid, setUserData) => {
  try {
    const docRef = doc(userRef, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserData({ id: docSnap.id, ...docSnap.data() });
    } else {
      console.log("No such user document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
