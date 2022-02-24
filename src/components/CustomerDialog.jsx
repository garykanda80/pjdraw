import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { appdb, auth } from "../utils/firebase-config";
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs
} from "firebase/firestore";

export default function CustomerDialog() {
  const [open, setOpen] = React.useState(false);
  const [newUserError, setNewUserError] = useState();
  const [values, setValues] = useState({
    phone: '', name: '', address: ''
  })

  const set = name => {
    return ({ target: { value } }) => {
      setValues(oldValues => ({...oldValues, [name]: value }));
    }
  };
  
  const handleCancel = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    if(values.name === "" || values.phone === "" || values.address === ""){
      return setNewUserError("Form is incomplete");
    }
    try {
      const collectionRef = collection(appdb, "customer");
      const q = query(collectionRef, where("phone", "==", values.phone));
      const docs = await getDocs(q);

      console.log(docs.empty);
      if (docs.empty) {
        try {
          await setDoc(doc(appdb, "customer", values.phone), values);
          //setOpenNewUser(false);
        }
    catch(error) {
      console.log(error.message)
      return setNewUserError(error.message);       
  }
}else{
  return setNewUserError("User with same email already exists"); 
}
    }catch{

    }
    
    setOpen(false);
  };

  
  return (
    <div>
      <Button onClick={handleClickOpen}>
        Create Customer
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Customer</DialogTitle>
        {newUserError && <Alert severity="error">{newUserError}</Alert>}
        <DialogContent>
        <TextField
        required
            autoFocus
            margin="dense"
            id="phone"
            label="Phone Number"
            type="text"
            fullWidth
            variant="standard"
            value={values.phone} 
            onChange={set('phone')}
          />
        <TextField
        required
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={values.name} 
            onChange={set('name')}
            
          />
          <TextField
          required
            autoFocus
            margin="dense"
            id="name"
            label="Address"
            type="text"
            fullWidth
            variant="standard"
            value={values.address} 
            onChange={set('address')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleClose}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
