import React, {useCallback, useState, useEffect} from "react";
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';



function SimpleDialog(props) {
    const { onClose, selectedValue, open, handleNewCategory} = props;
    const [categories, setCategories] = useState([])
    const [promptText, setPromptText] = useState('Please wait for the categories to load')
    const [promptTextColor, setPromptTextColor] = useState('#000')

    useEffect(()=> {
        if (open == true) {
            setCategories([])
            setPromptText('Please wait for the categories to load')
            fetch(
                'https://email-classification-flask.herokuapp.com/get_categories',
                {
                    method:'GET'
                }
            ).then((res)=> {
                const statusCode = res.status;
                let data = res.json()
                return Promise.all([statusCode, data])
            }).then(([statusCode, data])=> {
                if (statusCode == 200) {
                    setCategories(data['result'])
                    setPromptText('Please Select the correct category')
                }
                else{
                    console.log("Error Retrieving Categories")
                }
            })
        }
    },[open])

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };


    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{promptText}</DialogTitle>
            {categories.length > 0 &&
                <List sx={{pt: 0}}>
                    <ListItem onClick={() => handleNewCategory()}>
                        <ListItemAvatar>
                            <Avatar>
                                <AddIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            style={{color: 'red'}}
                            primary="Add New Category"/>
                    </ListItem>
                    {categories.map((category) => (
                        <ListItem button onClick={() => handleListItemClick(category)} key={category}>
                            <ListItemText primary={category}/>
                        </ListItem>
                    ))}
                </List>
            }
        </Dialog>
    );
}


export default function SimpleDialogDemo({open, setOpenCB, selectedValue, setSelectedValueCB, setNewCategoryCB}) {
    const handleClickOpen = () => {
        setOpenCB(true);
    };

    const handleClose = (value) => {
        setOpenCB(false);
        setSelectedValueCB(value);

    };

    const handleNewCategory = () => {
        setOpenCB(false)
        setNewCategoryCB(true)
    }

    return (
        <div>
            <br />
            <SimpleDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
                handleNewCategory={handleNewCategory}

            />
        </div>
    );
}
