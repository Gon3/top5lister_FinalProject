import { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import { Box, List, Typography } from '@mui/material'
import  ListCard from './ListCard'


export default function OtherListView() {
    const { store } = useContext(GlobalStoreContext)

    let statusText = `${store.currentPage === "allLists" ? (store.searchName ? store.searchName : "All") :
                            (store.searchName ? store.searchName : "All Users")} Lists`; 

    let listCard = 
        <List sx={{width: '90%', left: '5%'}}>
            {store.top5Lists.map((list) => (
                <ListCard list={list}/>
            ))}
        </List>; 

    return (<Box sx={{position: "absolute", top: "20%", 
    display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
        <Box sx={{height:550, display: "flex", width:1500, flexDirection: "column", overflowY: "scroll", m:1}}>
            {listCard}
        </Box>
        <Typography variant="h3" component="div" fontWeight="bold" textAlign="center">
                {store.currentPage === "community" ? "Community Lists": statusText}
        </Typography>
        
    </Box>);

}