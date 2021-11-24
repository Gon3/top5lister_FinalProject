import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            Site Developed by Okuchukwu Nwaduwa
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}