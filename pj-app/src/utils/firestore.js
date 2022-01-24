import {
  collection,
  doc,
  addDoc,
  setDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { appdb } from "./firebase-config";


export const handleCustomerCount = async () => {
  const data = '' 
  try {
    const collectionRef = collection(appdb, "customer");
    data = await getDocs(collectionRef);
    console.log(`Customer Record Count => ${data.docs.length}`)
    return data.docs.length
    } catch (e) {
    console.error("Error adding document: ", e);
    return 'error'
  }
}



export const handleCreateCustomer = async () => {
  const cust_cont = {
    custPhone: "07846861338",
    custAddress: ""
  };

  const collectionRef = collection(appdb, "customer");
  //const q = query(collectionRef, where("custPhone", "==", "07846861338"));
 
    // try {
    //   const docRef = await addDoc(collectionRef, cust_cont)
    //    console.log("Document written with ID: ", docRef.id);
    //     return docRef
    //   } catch (e) {
    //   console.error("Error adding document: ", e);
    // }

    try {
      const q = query(collectionRef, where("custPhone", "==", "07846861338"));
 
      //const querySnapshot = await getDocs(collectionRef);
      const querySnapshot = await getDocs(q);
      console.log(`Record Count => ${querySnapshot.docs.length}`)
      console.log("***********************");
      querySnapshot.forEach((doc) => {
        console.log("***********************")        
        console.log(`${doc.id} => ${doc.data()}`);
        });
      } catch (e) {
      console.error("Error adding document: ", e);
    }
};
















  //   const docs = await getDocs(q);
  //   console.log(JSON.parse(docs) + "check if empty")
  //   if (docs.empty) {
     
  //     }
  //   } else {
  //     //console.log("Document Exists");
  //     return {
  //       status: "Error",
  //       msg: "Customer with same phone already exists",
  //     };
  //   }
  // } catch (error) {
  //   console.log("Error: ", error.message);
  //   return {
  //     status: "Error",
  //     msg: error,
  //   };