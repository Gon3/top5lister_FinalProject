import { useContext } from 'react';
import { GlobalStoreContext } from '../store';
import { Backdrop, Slide, Typography } from '@mui/material';
import Modal from '@mui/material/Modal'; 
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'; 
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';


export default function DeleteModal(){
    const {store} = useContext(GlobalStoreContext);

    const handleDeleteClose = () => {
        store.unmarkListForDeletion();
    }

    function handleDelete() {
        store.deleteMarkedList(); 
        handleDeleteClose();
    }

    return(
        <Modal
            hideBackdrop
            open={store.listMarkedForDeletion !== null}
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
        }}>
            <Slide in={store.listMarkedForDeletion !== null} direction="right">
                <Box sx={{position: 'absolute', top: '45%', left: '38%',
                          transform: 'translate(-38%, -45%)', width: 400,
                          bgcolor: 'white', border: '2px solid #000',
                          borderRadius: '10px', boxShadow: 24, p: 4}}>
                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            <b>Delete Top 5 {store.listMarkedForDeletion?.name} List?</b>
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
    );
}