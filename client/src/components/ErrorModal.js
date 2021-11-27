import { useContext, useEffect, useState } from 'react';
import AuthContext from '../auth';

import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function ErrorModal() {
    const { auth } = useContext(AuthContext);
    const [modalOpen, setModalOpen] = useState(auth.errorMessage !== null)

    useEffect(() => {
        setModalOpen(auth.errorMessage !== null)
    }, [auth]); 

    const handleClose = () =>{
        auth.resetMessage(); 
        setModalOpen(false);  
    };

    return (
        <Modal
            hideBackdrop
            open={modalOpen}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box sx={{ position: 'absolute', top: '50%',                    
                        left: '50%', transform: 'translate(-50%, -50%)',                      
                        width: 400, bgcolor: 'white',
                        border: '2px solid #000',borderRadius: '10px',
                        boxShadow: 24, pt: 2,
                        px: 4, pb: 3}}
            >
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Alert severity="error">{auth.errorMessage}</Alert>
                    <Button onClick={handleClose}>OK</Button>
                </Grid>
            </Box>
        </Modal>
    ); 
}