import {
  collection,
  doc,
  setDoc,
  //updateDoc,
} from "firebase/firestore";
import { appdb } from "./firebase-config";


// export const handleCustomerCount = async () => {
//   const data = null;
//   console.log("-+-+-+-+-+-+-+-+-+-+++-+-+-") 
//   const collectionRef = collection(appdb, "customer");
//   try {
    
//     data = await getDocs(collectionRef);
//     console.log(`Customer Record Count => ${data.docs.length}`)
//     return data.docs.length
//     } catch (e) {
//     console.error("Error adding document: ", e);
//     return 'error'
//   }
// };

// export const handleCreateCustomer = async () => {

//   const citiesRef = collection(appdb, "cities");

// await setDoc(doc(citiesRef, "SF"), {
//     name: "San Francisco", state: "CA", country: "USA",
//     capital: false, population: 860000,
//     regions: ["west_coast", "norcal"] });
// await setDoc(doc(citiesRef, "LA"), {
//     name: "Los Angeles", state: "CA", country: "USA",
//     capital: false, population: 3900000,
//     regions: ["west_coast", "socal"] });
// await setDoc(doc(citiesRef, "DC"), {
//     name: "Washington, D.C.", state: null, country: "USA",
//     capital: true, population: 680000,
//     regions: ["east_coast"] });
// await setDoc(doc(citiesRef, "TOK"), {
//     name: "Tokyo", state: null, country: "Japan",
//     capital: true, population: 9000000,
//     regions: ["kanto", "honshu"] });
// await setDoc(doc(citiesRef, "BJ"), {
//     name: "Beijing", state: null, country: "China",
//     capital: true, population: 21500000,
//     regions: ["jingjinji", "hebei"] });

// }

// export const handleCreateCustomer = async () => {
//   const cust_cont = {
//     custPhone: "07846861338-c",
//     custAddress: ""
//   };

//   const cust_detail = {
//     custPhone: "07846861338",
//     custDrawID: "07846861338-c",
//     custAddress: "ABC Road"
//   };


//   const collectionRef = collection(appdb, "customer");
//     try {
//       await setDoc(doc(collectionRef, cust_cont.custPhone), cust_detail);
//       return 1
//     }catch (e) {
//       console.error("Error adding document: ", e);
//       return 0
//     }
// };



export const handleCreateCustomer = async () => {

  const draw = {
    drawID: "draw-1001-2"
  };

  const draw_detail = {
    customerId: "07846861338-2",
    customerPhone: "07846861338",
    customerName: "",
    payment: [
        {id:1,month: 'January',paymentDate: "",paymentMethod: "", updatedBy:""},
          {id:2,month: 'February',paymentDate: "",paymentMethod: "", updatedBy:""},
          {id:3,month: 'March',paymentDate: "",paymentMethod: "", updatedBy:""},
          {id:4,month: 'April',paymentDate: "",paymentMethod: "", updatedBy:""},
          {id:5,month: 'May',paymentDate: "",paymentMethod: "", updatedBy:""},
          {id:6,month: 'June',paymentDate: "",paymentMethod: "", updatedBy:""},
          {id:7,month: 'July',paymentDate: "",paymentMethod: "", updatedBy:""},
          {id:8,month: 'August',paymentDate: "",paymentMethod: "", updatedBy:""},
          {id:9,month: 'September',paymentDate: "",paymentMethod: "", updatedBy:""},
          {id:10,month: 'October',paymentDate: "",paymentMethod: "", updatedBy:""},
          {id:11,month: 'November',paymentDate: "",paymentMethod: "", updatedBy:""},
          {id:12,month: 'December',paymentDate: "",paymentMethod: "", updatedBy:""}
    ]
   
  };

  const collectionRef = collection(appdb, "customerDraw");
    try {
       await setDoc(doc(collectionRef, draw.drawID), draw_detail);
      //await updateDoc(doc(collectionRef, draw.drawID), draw_detail);
      return 1
    }catch (e) {
      console.error("Error adding document: ", e);
      return 0
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