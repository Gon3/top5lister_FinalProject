import Typography from '@mui/material/Typography';
import Copyright from './Copyright'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'; 
import Stack from '@mui/material/Stack';
import { useContext} from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth'

export default function WelcomeScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const handleGuest = () => {
        auth.loginGuest(store);
    }
    
    return (
        <div id="splash-screen">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column',
                alignItems: 'center'}}>
                <Typography variant="h1" component="div" gutterBottom mx={2} color="common.white">
                   Welcome to Top 5 Lister! 
                </Typography>
                <Typography variant="h4" gutterBottom component="div" color="common.white" mx={2} maxWidth={1000}
                    textAlign="center">
                    Discover, Create, Like, Dislike, and Comment on yours and others Top 5 Lists!
                </Typography>
                <Stack spacing={2}>
                <Button variant='contained' 
                        sx={{"&.MuiButton-text": {color: "white"}, border: "2px black solid", borderRadius: 1, backgroundColor: '#BDBDFF'}}
                        href='/login/'>
                    Login 
                </Button>
                <Button variant='contained' 
                        sx={{"&.MuiButton-text": {color: "white"}, border: "2px black solid", borderRadius: 1, backgroundColor: '#BDBDFF'}}
                        href='/register/'>
                    Create Account
                </Button>
                <Button variant='contained' 
                        sx={{"&.MuiButton-text": {color: "white"}, border: "2px black solid", borderRadius: 1, backgroundColor: '#BDBDFF'}}
                        onClick={handleGuest}>
                    Continue As Guest
                </Button>
                </Stack>
                
                <Copyright sx={{ mt: 5}} />
            </Box>
        </div>
    );
}