import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/system';
import makeStyles from "@material-ui/styles/makeStyles";
import DateFnsUtils from "@date-io/date-fns";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { appdb } from "../utils/firebase-config";
import { 
  selectedCustomerState
} from "../store/atoms/appState";
import {
  collection,
  doc,
  setDoc,
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

const updateRecord = async (customer) => {
  console.log(customer.id)
  console.log(customer)
  const collectionRef = collection(appdb, "draw");
    try {
      await updateDoc(doc(collectionRef, customer.id), customer);
      return 1;
    } catch (error) {
    }
}

export default function PaymentDate(props) {
  const [value, setValue] = React.useState(null);
  const [customer, setCustomer] = useRecoilState(selectedCustomerState);
  //const classes = useStyles();
  const optionChange = (newValue) => { 

    let formattedDate = `${
      newValue.getMonth() + 1
    }-${newValue.getDate()}-${newValue.getFullYear()}`;

updateRecord(
      produce(customer, draft => {
        draft.payment[props.RowID-1].paymentDate= formattedDate
      })
    );

    return setCustomer(
      produce(customer, draft => {
        draft.payment[props.RowID-1].paymentDate= formattedDate
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
