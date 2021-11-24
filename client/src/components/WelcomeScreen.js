import Typography from '@mui/material/Typography';
import Copyright from './Copyright'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'; 

export default function WelcomeScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const handleRegister;

    const handleLogin;

    const handleGuestLogin; 
    
    return (
        <div id="splash-screen">
            <Box sx={{width: '100%', maxWidth: 500, justifyContent: 'center'}}>
                <Typography variant="h1" component="div" gutterBottom mx={2} color="common.white">
                   Welcome to top 5 Lister! 
                </Typography>
                <Typography variant="subtitle1" gutterBottom component="div" color="common.white" mx={2}>
                    Discover, Create, Like, Dislike, and Comment on yours and others Top 5 Lists!
                </Typography>
                <Button variant='contained' 
                        sx={{"&.MuiButton-text": {color: "white"}, border: "2px black solid", borderRadius: 1, backgroundColor: '#BDBDFF'}}>
                    Login 
                </Button>
                <Button variant='contained' 
                        sx={{"&.MuiButton-text": {color: "white"}, border: "2px black solid", borderRadius: 1, backgroundColor: '#BDBDFF'}}>
                    Create Account
                </Button>
                <Button variant='contained' 
                        sx={{"&.MuiButton-text": {color: "white"}, border: "2px black solid", borderRadius: 1, backgroundColor: '#BDBDFF'}}>
                    Continue As Guest
                </Button>
                <Copyright sx={{ mt: 5 }} />
            </Box>
        </div>
    )
}