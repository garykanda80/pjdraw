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
  //const classes = useStyles();
  return (
    <>
    {
      !props.date &&
      <LocalizationProvider dateAdapter={DateFnsUtils}>
      <DatePicker
        value={value}
        onChange={newValue => {
          setValue(newValue);
        }}
        renderInput={props => {
          //console.log("props", props);
          return <TextField {...props} />;
        }}
      />
    </LocalizationProvider>
    }
    
    {
      props.date &&
      <LocalizationProvider dateAdapter={DateFnsUtils}>
      <DatePicker
        value={props.date}
        onChange={newValue => {
          setValue(newValue);
        }}
        renderInput={props => {
         // console.log("props", props);
          return <TextField {...props} />;
        }}
      />
    </LocalizationProvider>
}
    

    </>
    
  );
}
