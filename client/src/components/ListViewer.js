import { useContext, useState } from 'react'   
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import HomeView from './HomeView'
import OtherListView from './OtherListView'
import MenuToolbar from './MenuToolbar'
import { Container, Box } from '@mui/material'

export default function ListViewer() {

    const {store} = useContext(GlobalStoreContext); 
    const{auth} = useContext(AuthContext); 
    //use currentPage store
    //const [view, setView] = useState(auth.user.isGuest ? "community" : "home"); 

    let viewElement = <HomeView />; 
    if(store.currentPage !== "home"){
        viewElement = <OtherListView />; 
    }
    /* switch(store.currentPage){
        case "home" :{
            viewElement = <HomeView />
            break; 
        }
        case "allLists" : {
            viewElement = <OtherListView type="all" />
            break; 
        }
        case "userLists" : {
            viewElement = <OtherListView type="users" /> 
            break; 
        }
        case "community" : {
            viewElement = <OtherListView type="community" />
        }
    }; */
    
    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
            <MenuToolbar />
            {viewElement}
            </Box>
        </Container>
    );

}