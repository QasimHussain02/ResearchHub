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
  query,
  where,
  getDocs,
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

// Updated getUserDataByUID function
export const getUserDataByUID = async (uid) => {
  try {
    if (!uid) {
      console.error("No UID provided");
      return null;
    }

    const docRef = doc(userRef, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = { id: docSnap.id, ...docSnap.data() };
      console.log("User data fetched:", userData);
      return userData;
    } else {
      console.log("No such user document found for UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// Alternative function using callback (for compatibility with existing code)
export const getUserDataByUIDWithCallback = async (uid, setUserData) => {
  try {
    const userData = await getUserDataByUID(uid);
    if (setUserData && typeof setUserData === "function") {
      setUserData(userData);
    }
    return userData;
  } catch (error) {
    console.error("Error in getUserDataByUIDWithCallback:", error);
    if (setUserData && typeof setUserData === "function") {
      setUserData(null);
    }
    return null;
  }
};

// Function to get user posts by UID
export const getUserPosts = (uid, setPosts) => {
  if (!uid) {
    console.error("No UID provided for getting user posts");
    return;
  }

  // Create a query to get posts where the user UID matches
  const q = query(docRef, where("currUser.uid", "==", uid));

  onSnapshot(q, (querySnapshot) => {
    const userPosts = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setPosts(userPosts);
  });
};

// Function to get user by email
export const getUserByEmail = async (email) => {
  try {
    if (!email) {
      console.error("No email provided");
      return null;
    }

    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      console.log("No user found with email:", email);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

// Function to follow/unfollow a user
export const toggleFollowUser = async (targetUID, isFollowing) => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error("No authenticated user found.");
    return false;
  }

  try {
    const currentUserRef = doc(userRef, currentUser.uid);
    const targetUserRef = doc(userRef, targetUID);

    // Update current user's following list
    const currentUserDoc = await getDoc(currentUserRef);
    const targetUserDoc = await getDoc(targetUserRef);

    if (currentUserDoc.exists() && targetUserDoc.exists()) {
      const currentUserData = currentUserDoc.data();
      const targetUserData = targetUserDoc.data();

      let updatedFollowing = currentUserData.following || [];
      let updatedFollowers = targetUserData.followers || [];

      if (isFollowing) {
        // Remove from following/followers
        updatedFollowing = updatedFollowing.filter((id) => id !== targetUID);
        updatedFollowers = updatedFollowers.filter(
          (id) => id !== currentUser.uid
        );
      } else {
        // Add to following/followers
        if (!updatedFollowing.includes(targetUID)) {
          updatedFollowing.push(targetUID);
        }
        if (!updatedFollowers.includes(currentUser.uid)) {
          updatedFollowers.push(currentUser.uid);
        }
      }

      // Update both documents
      await updateDoc(currentUserRef, { following: updatedFollowing });
      await updateDoc(targetUserRef, { followers: updatedFollowers });

      return true;
    }
    return false;
  } catch (error) {
    console.error("Error toggling follow status:", error);
    return false;
  }
};
