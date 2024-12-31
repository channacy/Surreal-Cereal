import { writable } from "svelte/store";
import { db } from "$lib/firebase/firebase";
import { getDocs, addDoc, collection } from "firebase/firestore";

export const dataStore = writable([]);

export const fetchData = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    dataStore.set(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const addData = async (data) => {
  try {
    const docRef = addDoc(collection(db, 'images'), data);
    dataStore.update(data);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding data:", error);
  }
}
