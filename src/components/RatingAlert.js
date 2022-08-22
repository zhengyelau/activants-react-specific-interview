import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const AlertDialog = ({open, setOpenCB, ChooseAnotherCategoryCB, Prediction_Correct_CB}) => {

    const handleClose = () => {
        setOpenCB(false);
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"User Attention Required"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        style={{
                            fontSize:17,
                            fontWeight:'bold'
                        }}
                        id="alert-dialog-description">
                        Please specify if the last prediction is correct
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        style={{
                            color:'Red',
                            fontWeight:'bold',
                            fontSize:15
                        }}
                        onClick={()=>{
                            handleClose()
                            ChooseAnotherCategoryCB(true)
                        }}>Wrong Prediction</Button>
                    <Button
                        style={{
                            color:'Green',
                            fontWeight:'bold',
                            fontSize:15

                        }}
                        onClick={()=> {
                            Prediction_Correct_CB()
                        }} autoFocus>
                        Prediction Correct
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

AlertDialog.defaultProps = {

}

export default AlertDialog