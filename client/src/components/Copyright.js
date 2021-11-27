import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import AuthContext from '../auth'
import { useContext } from 'react';

export default function Copyright(props) {
    const { auth } = useContext(AuthContext);
    let link = "/"
    if(auth.loggedIn){
        link = "/list"
    }
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
           {'Copyright © '}
            <Link color="inherit" href={link}>
                The Top 5 Lister
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'} <br></br>
            {'Site Developed by Okuchukwu Nwaduwa'}
        </Typography>
    );
}