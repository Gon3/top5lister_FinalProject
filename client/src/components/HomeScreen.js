import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import Modal from '@mui/material/Modal'; 
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert'; 
import Button from '@mui/material/Button'; 
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [modalOpen, setModalOpen] = useState(false); 
    const [warningMessage, setMessage] = useState("");

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    const handleClose = () =>{
        setModalOpen(false); 
    };

    const warn = (msg) => {
        setMessage(msg);
        setModalOpen(true); 
    }

    function handleCreateNewList() {
        store.createNewList();
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

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'white',
        border: '2px solid #000',
        borderRadius: '10px',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
      };

    return (
        <div id="top5-list-selector">
            <Modal
                    hideBackdrop
                    open={modalOpen}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style}}>
                        <Alert severity="error">{warningMessage}</Alert>
                        <Button onClick={handleClose}>OK</Button>
                    </Box>
            </Modal>
            <div id="list-selector-heading">
            <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
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