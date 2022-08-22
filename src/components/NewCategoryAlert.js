import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog({open, setOpenCB, setOpenCB_RatingSelectCategory, loadingCB}) {
    // const [open, setOpen] = React.useState(false);
    const [promptTextColor, setPromptTextColor] = React.useState('#000')
    const [promptText, setPromptText] = React.useState('Please key in a new/unique category!')
    const [category, setCategory] = React.useState('')


    const handleClickOpen = () => {
        setOpenCB(true);
        setPromptTextColor('#000')
        setCategory('')
    };

    const handleClose = () => {
        setOpenCB(false);
        setPromptTextColor('#000')
        setCategory('')
    };

    const category_on_change = (event) => {
        setCategory(event.target.value)
    }

    React.useEffect(() => {
        setPromptTextColor('#000')
        setCategory('')
    }, [open])


    const handleSubmit = async () => {
        if (category != '' && category != null) {
            setPromptText('Adding New Category, please wait......')
            fetch(
                // 'https://email-classification-flask.herokuapp.com/rate_prediction',
                'https://email-classification-flask.herokuapp.com/add_category',
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        new_cat: category
                    })
                }).then((res) => {
                const data = res.json()
                const statusCode = res.status
                return Promise.all([statusCode, data])
            }).then(([statusCode, data]) => {
                setPromptText('Please key in a new/unique category!')
                if (statusCode == 200) {
                    if (data['result'] == 200) {
                        setOpenCB(false)
                        console.log('Add Category:', category)
                        setOpenCB_RatingSelectCategory(true)
                        setCategory('')
                    } else {
                        setPromptTextColor('red')
                        setCategory('')
                    }
                }
            })
        }
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add a New Category</DialogTitle>
                <DialogContent>
                    <DialogContentText
                        style={{
                            fontSize: 16,
                            color: promptTextColor,
                            fontWeight: 'bold'
                        }}
                    >
                        {promptText}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="New Category"
                        fullWidth
                        variant="standard"
                        value={category}
                        onChange={category_on_change}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
