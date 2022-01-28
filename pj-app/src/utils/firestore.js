import {
  collection,
  doc,
  setDoc,
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
    drawID: "draw1-a"
  };

  const draw_detail = {
    customerId: "07846861338-c",
    customerPhone: "07846861338",
    payment: {
      january: {
        id:1,
        paymentDate: "24012022",
        paymentMethod: "cash"
      },
      february: {
        id:2,
        paymentDate: "24012022",
        paymentMethod: "cash"
      },
      march: {
        id:3,
        paymentDate: "24012022",
        paymentMethod: "cash"
      },
      april: {
        id:4,
        paymentDate: "24012022",
        paymentMethod: "cash"
      },
      may: {
        id:5,
        paymentDate: "24012022",
        paymentMethod: "cash"
      },
      june: {
        id:6,
        paymentDate: "24012022",
        paymentMethod: "cash"
      },
      july: {
        id:7,
        paymentDate: "24012022",
        paymentMethod: "cash"
      },
      august: {
        id:8,
        paymentDate: "24012022",
        paymentMethod: "cash"
      },
      september: {
        id:9,
        paymentDate: "24012022",
        paymentMethod: "cash"
      },
      october: {
        id:10,
        paymentDate: "24012022",
        paymentMethod: "cash"
      },
      november: {
        id:11,
        paymentDate: "24012022",
        paymentMethod: "cash"
      },
      december: {
        id:12,
        paymentDate: "24012022",
        paymentMethod: "cash"
      }
    }
  };

  const collectionRef = collection(appdb, "draw");
    try {
      await setDoc(doc(collectionRef, draw.drawID), draw_detail);
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