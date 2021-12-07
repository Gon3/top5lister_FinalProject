import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';
import { Box, List, Paper, ListItemText, TextField, Typography, Grid } from '@mui/material';
import AuthContext from '../auth';

export default function ListDropDown(props) {
    const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext); 
    const [text, setText] = useState(""); 
    const {list} = props;
    const [comments, setComments] = useState(list.comments);

    const handleClick = (event) => {
        event.stopPropagation();
    }
    const handleUpdateText = (event) => {
        setText(event.target.value); 
    }

    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            let comment = {
                text: text, 
                user: auth.user.userName
            }
            store.addComment(list._id, text); 
            if(text){
                setComments([...comments, comment]);
            }
            event.target.blur();
            setText("");
        }
    }

    let itemViews = ""; 
    if(!('userName' in list)){ 
        itemViews = 
        <List >
        {list.items.map((item, index) => (
            <ListItemText key={"top-5-item-" + (index+1)} sx={{marginLeft:2}}
                primary={
                <Typography sx={{ display: 'inline', color: 'orange'}}
                    fontWeight="bold"
                    lineHeight={0.9}
                    component="span"
                    variant="h4" >
                        {`${index+1}. ${item}`}<br></br>
                </Typography>
                }
                secondary={
                <Typography sx={{marginLeft: 5, color:"orange"}}
                    component="span"
                    variant="caption" >
                        {`(${list.votes[index]} votes)`}
                </Typography>
                }/>
        )
        )}
        </List>;
    }else{
        itemViews = 
        <List>
        {list.items.map((item, index) => (
            <ListItemText key={"top-5-item-" + (index+1)} sx={{p:0.5, ml:1}}>
                <Typography sx={{ display: 'inline', color: 'orange'}}
                    fontWeight="bold"
                    component="span"
                    variant="h4" >
                        {`${index+1}. ${item}`}
                </Typography>
            </ListItemText>
        ))}    
        </List>;
    }
    let commentItems = 
    <List >
        {comments.map((comment, index) => (
            <Paper sx={{bgcolor:"orange", borderRadius: 3, mb:1, mr:1}} variant="outlined">
            <ListItemText key={"comment-item-" + (index+1)} 
            sx={{textAlign:"left", ml:1}}
                primary={
                <Typography sx={{ display: 'inline' }} 
                            lineHeight={0.9}
                            color="blue"
                            component="span"
                            variant="body1"> 
                        <u>{comment.user}</u> <br></br>
                </Typography>
                }
                secondary={
                <Typography 
                    component="span"
                    variant="h6"
                    color="black" >
                        {comment.text}
                </Typography>
                 }/>
            </Paper>
        ))}
    </List>;
    console.log(itemViews);
    return (
        <Grid container direction="row" spacing={2} xs={12} onClick={handleClick}>
            <Grid item xs={6}>
                <Paper sx={{bgcolor:"blue", height:300, borderRadius: 3}} variant="outlined"> 
                    {itemViews}
                </Paper>
            </Grid>
            <Grid item xs={6}>
                {list.published || !("published" in list) ? <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Box sx={{height:235, display: "flex", width:640, flexDirection: "column", overflowY: "scroll"}}>
                    {commentItems}
                </Box>
                    <TextField 
                            id="add-comment-bar"
                            placeholder={auth.user?.isGuest? "Must Register or Login to Comment": "Add Comment"}
                            autoComplete="Comment"
                            onChange={handleUpdateText}
                            onKeyPress={handleKeyPress}
                            value={text}
                            margin="normal"
                            style = {{position:'relative', left:-15, width: "95%"}}
                            inputProps={{style: {fontSize: 18}}}
                            disabled={auth.user?.isGuest}
                            fullWidth/>
                </Box> : 
                <Typography sx={{ display: "block"}}
                            component="div"
                            variant="h3">
                            Comments are disabled; <br></br>List has not been published yet. 
                </Typography>
                }
            </Grid>
        </Grid>

    ); 
}
