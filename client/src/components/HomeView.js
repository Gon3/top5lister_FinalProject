import { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import { Box } from '@mui/system'

export default function HomeView() {
    const { store } = useContext(GlobalStoreContext);

    return (<Box sx={{position: "relative", top: "100px"}}>Home View</Box>)

}