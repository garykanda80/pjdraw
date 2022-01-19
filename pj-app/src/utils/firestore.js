import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { appdb } from "./firebase-config";

export const handleCreateCustomer = async (payload, user) => {
  const cust_gen = {
    subsid: user.subsid,
    subsname: user.subsname,
    custtitle: payload.custtitle,
    custname: payload.custname,
    custtype: payload.custtype,
    custemail: payload.custemail,
    custphone1: payload.custphone1,
    custphone2: payload.custphone2,
    custstatus: payload.custstatus,
    createdby: user.usremail,
    createdon: serverTimestamp(),
    modifiedby: "",
    modifiedon: "",
  };

  const cust_loc = {
    custaddr1: payload.custaddr1,
    custaddr2: payload.custaddr2,
    custcity: payload.custcity,
    custstate: payload.custstate,
    custpostcode: payload.custpostcode,
  };

  const cust_cont = {
    custcontname: payload.custcontname,
    custcontemail: payload.custcontemail,
    custcontphone1: payload.custcontphone1,
    custcontphone2: payload.custcontphone2,
  };

  const collectionRef = collection(appdb, "customer");
  const q = query(collectionRef, where("custemail", "==", payload.custemail));

  try {
    const docs = await getDocs(q);

    if (docs.empty) {
      try {
        const docRef = await addDoc(collectionRef, cust_gen);

        await addDoc(
          collection(appdb, "customer", docRef.id, "custloc"),
          cust_loc
        );

        if (cust_cont.custcontemail !== "") {
          await addDoc(
            collection(appdb, "customer", docRef.id, "custcont"),
            cust_cont
          );
        }

        return {
          status: "Success",
          msg: docRef.id,
        };
      } catch (error) {
        console.log("Error in creating customer: ", error);
        return {
          status: "Error",
          msg: error,
        };
      }
    } else {
      //console.log("Document Exists");
      return {
        status: "Error",
        msg: "Customer with same email already exists",
      };
    }
  } catch (error) {
    //console.log("Error: ", error);
    return {
      status: "Error",
      msg: error,
    };
  }
};
