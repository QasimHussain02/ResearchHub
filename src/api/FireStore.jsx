import { auth, db } from "../firebaseConfig";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
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

export const postUserData = (userData) => {
  let object = { ...userData };
  addDoc(userRef, object)
    .then((docRef) => {
      // console.log("User document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding user document: ", error);
    });
};
export const getUser = () => {
  // let currUser = localStorage.getItem("userEmail");
  let currUser = auth.currentUser.email;
  onSnapshot(userRef, (data) => {
    console.log(
      data.docs
        .map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
        .filter((user) => user.email === currUser)[0]
    );
  });
};
