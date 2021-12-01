import { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import { Box } from '@mui/system'


export default function OtherListView() {
    const { store } = useContext(GlobalStoreContext)
    const { auth } = useContext(AuthContext);

    return (<Box sx={{position: "relative", top: "100px"}}>
         {store.currentPage} List View</Box>)

}