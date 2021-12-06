import React, { useContext, useState, useEffect} from 'react';
import { GlobalStoreContext } from '../store'; 
import { Modal, TextField, Button, Typography, List } from '@mui/material';
import { Grid, Box, Slide, Paper, Stack } from '@mui/material';
import { Backdrop } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function Editor(){
    const{store} = useContext(GlobalStoreContext); 
    const [title, setTitle] = useState(""); 
    const [items, setItems] = useState([]);
    const [publish, setPublish] = useState(true); 

    useEffect(() => {
        if(store.currentList){
            setTitle(store.currentList.name); 
            setItems(store.currentList.items);
            store.checkIsPublishable(store.currentList.name, store.currentList.items, 
                (enable) => setPublish(enable));
        }
    }, [store.currentList]);

    const handleClose = () => {
        store.closeCurrentList(); 
    }

    const handleUpdateTitle = (event) => {
        setTitle(event.target.value);
    }
    
    const handleUpdateItem = (event, index) => {
        items.splice(index, 1, event.target.value); 
        setItems(items); 
    }

    const handleKeyDown = (event) => {
        if(event.key === 'Enter'){
            handleBlur();
            event.target.blur();  
        }
    }

    const handleBlur = () => {
        store.checkIsPublishable(title, items, (enable) => setPublish(enable)); 
    }

    const handleSave = () => {
        store.saveList(title, items); 
    }

    const handlePublish = () => {
        store.publishList(title, items); 
    }

    let itemTextFields = ''; 
    if(store.currentList) {
        itemTextFields = 
            <List sx={{mt:"-2%", ml:"2%"}}>
                {items.map((item, index) => (
                        <TextField sx={{bgcolor:'orange', borderRadius: 3, mb:-0.9, height: 60}}
                            key={'item-text-'+(index+1)}
                            label="Top 5 List Item"
                            autoComplete="Item Name"
                            style={{width: 850}}
                            onChange={(event) => handleUpdateItem(event, index)}
                            onKeyPress={handleKeyDown}
                            onBlur={handleBlur}
                            defaultValue={item}
                            margin="normal"
                            size="small"
                            inputProps={{style: {fontSize: 32}}}
                            inputLabelProps={{style: {fontSize: 16}}}
                            fullWidth
                            required
                        />
                ))}
            </List>
    }

    return (
        <Modal
            hideBackdrop
            open={store.currentList !== null}
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
        }}>
            <Slide in={store.currentList !== null} direction="right">
            <Box sx={{position: 'absolute', top: '23%', left: '25%',
                           width: "50%", height:'60%',
                          bgcolor: '#BDBDFF', border: '2px solid #000', 
                          borderRadius: '10px', boxShadow: 24, p: 4}}>
                <Grid container spacing={2}>
                    <Grid item xs={11}>
                        <TextField 
                            id="list-title-bar"
                            label="Top 5 List Name"
                            autoComplete="List Name"
                            style={{width: 500}}
                            onChange={handleUpdateTitle}
                            onKeyPress={handleKeyDown}
                            onBlur={handleBlur}
                            value={title}
                            margin="normal"
                            inputProps={{style: {fontSize: 24}}}
                            InputLabelProps={{style: {fontSize: 17}}}
                            fullWidth
                            required
                        />
                    </Grid> 
                    <Grid item xs={1}>
                        <Button variant="outlined" sx={{width:20}} onClick={handleClose}>
                            <CloseIcon style={{fontSize:60}}/> 
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{display:"flex", bgcolor:"blue", height:'94%', borderRadius: 3, p:1}}>
                            <Box sx={{display:"flex", flexDirection:"column", p:1}}>
                                <Paper sx={{bgcolor:"orange", width:"5%", borderRadius: 3, p:1, mb:1, minWidth:'80%'}} variant="outlined">
                                    <Typography ml={1} variant="h4" color="black">1.</Typography>
                                </Paper>
                                <Paper sx={{bgcolor:"orange", width:"5%", borderRadius: 3, p:1, mb:1, minWidth:'80%'}} variant="outlined">
                                    <Typography ml={1} variant="h4" color="black">2.</Typography>
                                </Paper>
                                <Paper sx={{bgcolor:"orange", width:"5%", borderRadius: 3, p:1, mb:1, minWidth:'80%'}} variant="outlined">
                                    <Typography ml={1} variant="h4" color="black">3.</Typography>
                                </Paper>
                                <Paper sx={{bgcolor:"orange", width:"5%", borderRadius: 3, p:1, mb:1, minWidth:'80%'}} variant="outlined">
                                    <Typography ml={1} variant="h4" color="black">4.</Typography>
                                </Paper>
                                <Paper sx={{bgcolor:"orange", width:"5%", borderRadius: 3, p:1, mb:1, minWidth:'80%'}} variant="outlined">
                                    <Typography ml={1} variant="h4" color="black">5.</Typography>
                                </Paper>
                            </Box>
                            {itemTextFields}
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction='row' spacing={2} ml={98}>
                            <Button variant="contained" 
                                    color="primary" 
                                    onClick={handleSave}
                                    disabled={/^\s*$/.test(title)}>
                                SAVE
                            </Button>
                            <Button variant="contained" 
                                    color="primary" 
                                    onClick={handlePublish}
                                    disabled={!publish}>
                                PUBLISH
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
            </Slide>
        </Modal>
    );
}