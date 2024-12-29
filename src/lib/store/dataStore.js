import { writable } from "svelte/store";
import { getData } from "$lib/firebase/firebase";

export const dataStore = writable([]);

export const fetchData = async (collectionName) => {
  try {
    const data = await getData(collectionName);
    dataStore.set(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
