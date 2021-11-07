import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Fab, Slide, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import Modal from '@mui/material/Modal'; 
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert'; 
import Button from '@mui/material/Button'; 
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { Backdrop } from '@mui/material';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [modalOpen, setModalOpen] = useState(false);  
    const [warningMessage, setMessage] = useState("");
    let deleteOpen = false;
    let deleteName = "";

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    const handleClose = () =>{
        setModalOpen(false); 
    };

    const handleDeleteClose = () => {
        store.unmarkListForDeletion();
        deleteName = ""
        deleteOpen = false; 
    }

    const warn = (msg) => {
        setMessage(msg);
        setModalOpen(true); 
    }

    function handleCreateNewList() {
        store.createNewList();
    }

    function handleDelete() {
        store.deleteMarkedList(warn); 
        handleDeleteClose();
    }
    
    if(store.listMarkedForDeletion){
        deleteOpen = true; 
        deleteName = store.listMarkedForDeletion.name; 
    }
    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        errorCallback = {warn}
                    />
                ))
            }
            </List>;
    }

    const style ={
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'white',
        border: '2px solid #000',
        borderRadius: '10px',
        boxShadow: 24,
        p: 4
    }

    const slide_style = {
        position: 'absolute',
        top: '45%',
        left: '38%',
        transform: 'translate(-38%, -45%)',
        width: 400,
        bgcolor: 'white',
        border: '2px solid #000',
        borderRadius: '10px',
        boxShadow: 24,
        p: 4
    };

    return (
        <div id="top5-list-selector">
            <Modal
                    hideBackdrop
                    open={modalOpen}
                    aria-labelledby="error-modal-title"
                    aria-describedby="error-modal-description"
                >
                    <Box sx={{ ...style}}>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Alert severity="error">{warningMessage}</Alert>
                            <Button onClick={handleClose}>OK</Button>
                        </Grid>
                    </Box>
            </Modal>
            
            <Modal
                    hideBackdrop
                    open={deleteOpen}
                    aria-labelledby="delete-modal-title"
                    aria-describedby="delete-modal-description"
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,

                    }}
                >
                    <Slide in={deleteOpen} direction="right">
                    <Box sx={{ ...slide_style}}>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                <b>Delete Top 5 {deleteName} List?</b>
                            </Typography>
                            <Stack direction='row' spacing={2}>
                                <Button variant="outlined" 
                                        color= "success" 
                                        onClick={handleDelete}>
                                            Confirm
                                </Button>
                                <Button variant="outlined" 
                                        color= "error" 
                                        onClick={handleDeleteClose}>
                                            Cancel
                                </Button>
                            </Stack>
                        </Grid>
                    </Box>
                    </Slide>
            </Modal>
           
            <div id="list-selector-heading">
            <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
                disabled={store.isListNameEditActive}
            >
                <AddIcon />
            </Fab>
                <Typography variant="h2">Your Lists</Typography>
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
            </div>
        </div>)
}

export default HomeScreen;