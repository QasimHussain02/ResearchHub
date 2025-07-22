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
  arrayUnion,
  arrayRemove,
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

// Enhanced like/unlike functionality with user tracking
export const toggleLike = async (postId) => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error("User must be logged in to like posts");
    return { success: false, error: "User not authenticated" };
  }

  try {
    const postRef = doc(docRef, postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      console.error("Post not found");
      return { success: false, error: "Post not found" };
    }

    const postData = postSnap.data();
    const likedBy = postData.likedBy || [];
    const isLiked = likedBy.some((like) => like.uid === currentUser.uid);

    if (isLiked) {
      // Unlike the post - remove the user's like object
      const updatedLikedBy = likedBy.filter(
        (like) => like.uid !== currentUser.uid
      );
      await updateDoc(postRef, {
        likedBy: updatedLikedBy,
        likes: Math.max(0, (postData.likes || 0) - 1),
      });
    } else {
      // Like the post - get fresh user data and add like
      const userData = await getUserDataByUID(currentUser.uid);

      // Create comprehensive like object with fallbacks
      const userName =
        userData?.name ||
        currentUser.displayName ||
        currentUser.email?.split("@")[0] ||
        "User";

      const likeObject = {
        uid: currentUser.uid,
        name: userName,
        email: currentUser.email || "No email",
        timestamp: new Date(),
        // Add additional user info if available
        userPhoto: userData?.photoURL || currentUser.photoURL,
        userBio: userData?.bio || "",
      };

      console.log("Creating like object:", likeObject); // Debug log

      await updateDoc(postRef, {
        likedBy: arrayUnion(likeObject),
        likes: (postData.likes || 0) + 1,
      });
    }

    return { success: true, isLiked: !isLiked };
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, error: error.message };
  }
};

// Function to get users who liked a specific post
export const getPostLikes = async (postId) => {
  try {
    const postRef = doc(docRef, postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return { success: false, error: "Post not found" };
    }

    const postData = postSnap.data();
    const likedBy = postData.likedBy || [];

    return { success: true, likedBy };
  } catch (error) {
    console.error("Error getting post likes:", error);
    return { success: false, error: error.message };
  }
};

// Enhanced postUserData function to ensure user document exists
export const postUserData = async (userData) => {
  const uid = auth.currentUser?.uid;

  try {
    if (!uid) {
      console.error("User not authenticated");
      return { success: false, error: "User not authenticated" };
    }

    // Ensure we have basic user data
    const userEmail = auth.currentUser?.email;
    const userName =
      userData.name || auth.currentUser?.displayName || "Anonymous User";

    const completeUserData = {
      name: userName,
      email: userEmail,
      bio: "",
      headline: "",
      about: "",
      location: "",
      institution: "",
      website: "",
      followers: [],
      following: [],
      interests: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData, // Override with provided data
    };

    await setDoc(doc(userRef, uid), completeUserData);
    console.log("User document created/updated successfully");
    return { success: true };
  } catch (error) {
    console.error("Error creating/updating user document:", error);
    return { success: false, error: error.message };
  }
};

// Function to ensure user document exists
export const ensureUserDocument = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  try {
    const userDocRef = doc(userRef, currentUser.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      // Create basic user document
      const basicUserData = {
        name: currentUser.displayName || "Anonymous User",
        email: currentUser.email,
        bio: "",
        headline: "",
        about: "",
        location: "",
        institution: "",
        website: "",
        followers: [],
        following: [],
        interests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(userDocRef, basicUserData);
      console.log("Basic user document created");
      return { id: currentUser.uid, ...basicUserData };
    }

    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error("Error ensuring user document:", error);
    return null;
  }
};

// Enhanced getUser function with real-time updates
export const getUser = (setCurrUser) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Set up real-time listener for the current user's data
      const userDocRef = doc(userRef, user.uid);
      onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = { id: docSnap.id, ...docSnap.data() };
          setCurrUser(userData);
        } else {
          console.log("User document not found");
          setCurrUser(null);
        }
      });
    } else {
      console.log("User not authenticated.");
      setCurrUser(null);
    }
  });
};

// Enhanced editUser function with better error handling and real-time updates
export const editUser = async (payload) => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.error("No authenticated user found.");
    return { success: false, error: "No authenticated user" };
  }

  try {
    const userDocRef = doc(userRef, currentUser.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      // Update the user document
      await updateDoc(userDocRef, payload);
      console.log("User document updated successfully");

      // Update the display name in Firebase Auth if name was changed
      if (payload.name && currentUser.displayName !== payload.name) {
        try {
          await currentUser.updateProfile({
            displayName: payload.name,
          });
          console.log("Firebase Auth display name updated");
        } catch (authError) {
          console.warn(
            "Could not update Firebase Auth display name:",
            authError
          );
        }
      }

      return { success: true };
    } else {
      console.warn("⚠️ User document not found. Creating new document.");
      await setDoc(userDocRef, payload);
      return { success: true };
    }
  } catch (error) {
    console.error("Error updating user document:", error);
    return { success: false, error: error.message };
  }
};

// Updated getUserDataByUID function with better error handling
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

// Real-time user data listener
export const getUserDataByUIDRealtime = (uid, setUserData) => {
  if (!uid) {
    console.error("No UID provided for real-time user data");
    setUserData(null);
    return null;
  }

  const userDocRef = doc(userRef, uid);

  const unsubscribe = onSnapshot(
    userDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const userData = { id: docSnap.id, ...docSnap.data() };
        setUserData(userData);
      } else {
        console.log("User document not found for UID:", uid);
        setUserData(null);
      }
    },
    (error) => {
      console.error("Error in real-time user data listener:", error);
      setUserData(null);
    }
  );

  return unsubscribe; // Return the unsubscribe function
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

// Enhanced function to get user posts with real-time updates
export const getUserPosts = (userEmail, setPosts) => {
  if (!userEmail) {
    console.error("No user email provided for getting user posts");
    return null;
  }

  // Create a query to get posts where the user email matches
  const q = query(docRef, where("currUser.email", "==", userEmail));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const userPosts = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setPosts(userPosts);
  });

  return unsubscribe;
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

// Function to update posts when user name changes
export const updateUserNameInPosts = async (newName, userEmail) => {
  try {
    if (!userEmail || !newName) {
      console.error("Missing required parameters for updating posts");
      return;
    }

    // Get all posts by this user
    const q = query(docRef, where("currUser.email", "==", userEmail));
    const querySnapshot = await getDocs(q);

    // Update each post with the new name
    const updatePromises = querySnapshot.docs.map((docSnapshot) => {
      const postRef = doc(docRef, docSnapshot.id);
      return updateDoc(postRef, {
        "currUser.name": newName,
        author: newName,
      });
    });

    await Promise.all(updatePromises);
    console.log(`Updated ${updatePromises.length} posts with new user name`);
  } catch (error) {
    console.error("Error updating user name in posts:", error);
  }
};

// Add this function to your FireStore.jsx for debugging
export const debugPostLikes = async (postId) => {
  try {
    const postRef = doc(docRef, postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data();
      console.log("=== DEBUG: Post Likes Data ===");
      console.log("Post ID:", postId);
      console.log("Total Likes:", postData.likes);
      console.log("Liked By Array:", postData.likedBy);

      if (postData.likedBy && postData.likedBy.length > 0) {
        postData.likedBy.forEach((like, index) => {
          console.log(`Like ${index + 1}:`, {
            uid: like.uid,
            name: like.name,
            email: like.email,
            timestamp: like.timestamp,
          });
        });
      }
      console.log("=== END DEBUG ===");

      return postData.likedBy || [];
    } else {
      console.log("Post not found for debugging");
      return [];
    }
  } catch (error) {
    console.error("Error debugging post likes:", error);
    return [];
  }
};

// Function to check current user data
export const debugCurrentUser = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.log("No current user authenticated");
    return;
  }

  console.log("=== DEBUG: Current User ===");
  console.log("Auth User:", {
    uid: currentUser.uid,
    email: currentUser.email,
    displayName: currentUser.displayName,
  });

  const userData = await getUserDataByUID(currentUser.uid);
  console.log("Firestore User Data:", userData);
  console.log("=== END DEBUG ===");
};
