import { db } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
let docRef = collection(db, "posts");
export default function FireStore(title, content) {
  let object = { title: title, content: content };
  addDoc(docRef, object)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}
