import React from "react";
// import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import Button from "@material-ui/core/Button";
// import { PiWarningOctagonBold } from "react-icons/pi";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    // MenuItem,
    Stack,
    TextField,
    Tooltip,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const ConfirmDialog = ({ type, title, children, open, setOpen,dialogObj, setDialogObj, onConfirm, setConfirmStatus, confirmStatus }) => {
    const handleConfirm = () => {
        console.log("555555555555",onConfirm);
        onConfirm(); // Call the onConfirm callback passed from parent component
        setOpen(false); // Close the dialog
        //setConfirmStatus(true)
        // setDialogObj({
        //     ...dialogObj,
        //     status: false
        // })
    };
    // const [confirmStatus, setConfirmStatus] = useState(false);
    const handleClose = () => {
        setOpen(false); // Close the dialog without confirmation
        //console.log("555555555555",setDialogObj);
        // setDialogObj({
        //     ...dialogObj,
        //     status: false
        // })
    };

    return (
        <Dialog open={open} fullWidth
            maxWidth="sm" >
            <DialogTitle style={{margin: "8px !important"}} sx={{ m: 1, p: 2 }} >
           <h2 className="confirmTitle text-center " style={{fontFamily:"Cursive"}}>{title}</h2>
                         {type !=="alert"?  <IconButton
                        aria-label="close"
                        // onClick={handleClose}
                        sx={{
                            position: 'absolute !important',
                            right: "8px !important",
                            top: 8,
                            color: "red",
                        }}
                    >
                        <i
                            className="mdi mdi-alert-octagon fs-100"
                            title="mdi-alert-octagon"
                          ></i>
                    </IconButton>:  <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon style={{ color: "black" }} />
                    </IconButton>}
            </DialogTitle>
            <DialogContent className="pb-0" >
                        <h4 className="confirmContent">{
                            children
                        }</h4>
            </DialogContent>
            {type !== "alert" && <DialogActions>
            <Button variant="contained" onClick={handleClose} className="btn btn-secondary">
                     No
                 </Button>
               <Button variant="contained"  onClick={handleConfirm} className="btn btn-primary ">
                   Yes
               </Button>
            </DialogActions>}
            {/* {type === "alert" &&<DialogActions>
            <Button variant="contained" onClick={handleClose} className="btn btn-secondary">
                    Close
                 </Button>
            </DialogActions>} */}
        </Dialog>
    )
};

export default ConfirmDialog;