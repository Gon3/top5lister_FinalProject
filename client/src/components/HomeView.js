import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Box } from '@mui/system'
import DeleteModal from './DeleteModal';
import { Fab, List, Typography } from '@mui/material'
import Editor from './Editor'; 
import HomeListCard from './HomeListCard'; 
import AddIcon from '@mui/icons-material/Add'


export default function HomeView() {
    const { store } = useContext(GlobalStoreContext);

    const handleCreateNewList = () => {
        store.createNewList(); 
    }

    let listCard = 
        <List sx={{width: '90%', left: '5%'}}>
            {store.top5Lists.map((list) => (
                <HomeListCard list={list}/>
            ))}
        </List>;

    return (
        <Box sx={{position: "absolute", top: "20%", 
            display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems:"center"}}>
            <DeleteModal /> 
            <Editor /> 
            <Box sx={{height:550, display: "flex", width:1500, flexDirection: "column", overflowY: "scroll", m:1}}>
                {listCard}
            </Box>
            <Box>
                <Fab 
                    color="primary" 
                    aria-label="add"
                    id="add-list-button"
                    onClick={handleCreateNewList}>
                        <AddIcon />
                </Fab>
                <Typography variant="h3" component="span" fontWeight="bold" textAlign="center">
                    Your Lists
                </Typography>
            </Box>
        </Box>
    );

}