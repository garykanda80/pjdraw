import * as React from 'react';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import DateFnsUtils from "@date-io/date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import { appdb, auth } from "../utils/firebase-config";
import { 
  selectedCustomerState, userState
} from "../store/atoms/appState";

import {
  collection,
  doc,
  updateDoc
} from "firebase/firestore";
import produce from 'immer';
// const useStyles = makeStyles({
//   root: {
//     "& .MuiInputBase-root": {
//       padding: 0,
//       'min-height': 'calc(1.5em + 22px)',
//       "& .MuiButtonBase-root": {
//         padding: 0,
//         paddingTop:1,
//         paddingBottom:1,
//         paddingLeft: 15
//       },
//       "& .MuiInputBase-input": {
//         padding: 15,
//         paddingTop:1,
//         paddingBottom:1,
//         paddingLeft: 15
//       }
//     }
//   }
// });


export default function PaymentDate(props) {
  const [value, setValue] = React.useState(null);
  const [customer, setCustomer] = useRecoilState(selectedCustomerState);
  const [user] = useRecoilValue(userState);
  //const classes = useStyles();
  const optionChange = (newValue) => { 

    let formattedDate = `${
      newValue.getMonth() + 1
    }-${newValue.getDate()}-${newValue.getFullYear()}`;

    const updateRecord = async (customer) => {
      const collectionRef = collection(appdb, "customerDraw");
        try {
          await updateDoc(doc(collectionRef, customer.id), customer);
          return 1;
        } catch (error) {
        }
    }

    
updateRecord(
      produce(customer, draft => {
        draft.payment[props.RowID-1].paymentDate= formattedDate;
        draft.payment[props.RowID-1].updatedBy= auth.currentUser.email;
      })
    );

    return setCustomer(
      produce(customer, draft => {
        draft.payment[props.RowID-1].paymentDate= formattedDate;
        draft.payment[props.RowID-1].updatedBy=  auth.currentUser.email;
      })
    );
  };
  return (
    <>
    {
      (props.date) ?
      <LocalizationProvider dateAdapter={DateFnsUtils}>
      <DatePicker
      readOnly
        value={props.date}
        onChange={newValue => {
          setValue(newValue);
        }}
        renderInput={props => {
          return <TextField {...props} />;
        }}
      />
    </LocalizationProvider>
    :
      <LocalizationProvider dateAdapter={DateFnsUtils}>
      <DatePicker
      format="MM-dd-y"
        value={value}
        onChange={newValue => {
          setValue(newValue);
          optionChange(newValue)
        }}
        renderInput={props => {
          return <TextField {...props} />;
        }}
      />
    </LocalizationProvider>
    
}
    

    </>
    
  );
}
