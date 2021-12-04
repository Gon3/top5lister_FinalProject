import { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack'; 
import Box from '@mui/material/Box';
import { Grid, Link } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import LikeIcon from '@mui/icons-material/ThumbUp';
import DislikeIcon from '@mui/icons-material/ThumbDown';
import Collapse from '@mui/material/Collapse';
import ListDropDown from './ListDropDown.js'; 
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';


export default function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext); 
    const [open, setOpen] = useState(false); 
    const { list } = props;
    const [likes, setLikes] = useState(list.likes.length); 
    const [dislikes, setDislikes] = useState(list.dislikes.length); 
    const [views, setViews] = useState(list.views); 
    const [isLiked, setIsLiked] = useState(list.likes.includes(auth.user?.userName));
    const [isDisliked, setIsDisliked] = useState(list.dislikes.includes(auth.user?.userName));

    useEffect(() => {
        setLikes(list.likes.length);
        setDislikes(list.dislikes.length);
        setIsLiked(list.likes.includes(auth.user?.userName));
        setIsDisliked(list.dislikes.includes(auth.user?.userName));
        setViews(list.views);
        setOpen(false);
    },[store.sorting]);

    const handleListOpen = () => {
        if(open){
            store.loadTop5Lists();
        } else {
            if(!auth.user?.isGuest){
                store.updateViews(list._id, (view) => setViews(view)); 
            }
        }
        setOpen(!open);
    }

    const handleLikeClick = (event) => {
        event.stopPropagation();
        store.updateLikes(list._id, (like_arr, dislike_arr) => {
            setLikes(like_arr.length);
            setDislikes(dislike_arr.length);
            setIsLiked(like_arr.includes(auth.user?.userName));
            setIsDisliked(dislike_arr.includes(auth.user?.userName));
        });
    }

    const handleDislikeClick = (event) => {
        event.stopPropagation();
        store.updateDislikes(list._id, (like_arr, dislike_arr) => {
            setLikes(like_arr.length);
            setDislikes(dislike_arr.length);
            setIsLiked(like_arr.includes(auth.user?.userName));
            setIsDisliked(dislike_arr.includes(auth.user?.userName));
        }); 
    }

    const handleDelete = (event) => {

    }

    const handleEdit = (event) => {

    }

    let color = "##FAE69D";
    if(list.published){
        color = "#BDBDFF"; 
    }

    return (
        <ListItem
            id={list._id}
            key={list._id}
            sx={{marginTop: '15px', display: 'flex', p: 1, bgcolor:`${color}`, borderRadius:3}}
            button
            disableRipple={open}
            onClick={handleListOpen}
            style={{
                width: '100%'
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={9.5}>
                <Box sx={{ p: 1, display: 'flex', flexGrow: 1,  flexDirection: 'column',
                    alignText: 'left'}}>
                    <Typography variant="h5" component="div" color="black" fontWeight="bold">
                        {list.name} 
                    </Typography>
                    <br></br>
                    <Typography variant="subtitle1" component="div" color="black" >
                        {"By: "} 
                        <Typography variant="subtitle1" component="div" color="blue" display="inline">
                            <u>{list.userName}</u>
                        </Typography>
                    </Typography>
                    <br></br>
                    {list.published ? 
                    <Typography variant="subtitle1" component="div" color="black">
                        {"Published: "}
                        <Typography variant="subtitle1" component="div" color="green" display="inline">
                            {list.publishDate}
                        </Typography>
                    </Typography> :
                    <Link variant="subtitle" onClick={handleEdit} sx={{color:"red"}}>
                       Edit
                    </Link>
                    }
                </Box>
                </Grid>
                <Grid item xs={2.5}>
                <Box  sx={{ p: 1, display: 'flex', flexGrow: 1,  flexDirection: 'column',
                    alignItems: 'left'}}>
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <Stack direction="row" spacing={9}>
                            <IconButton
                                edge="end"
                                aria-label="like-button"
                                disabled={!list.Published}
                                onClick={handleLikeClick}>
                                <LikeIcon sx={{fontSize:30, p:1, color:`${isLiked ? "blue" : "grey"}`}}/>
                                {likes} 
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="dislike-button"
                                disabled={!list.published}
                                onClick={handleDislikeClick}>
                                <DislikeIcon sx={{fontSize:30, p:1, color:`${isDisliked ? "blue" : "grey"}`}}/> 
                                {dislikes}
                            </IconButton>
                        </Stack>
                        <IconButton
                                edge="end"
                                aria-label="delete-button"
                                onClick={handleDelete}>
                                <DeleteIcon sx={{fontSize:30, color:"grey"}}
                        </IconButton>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Typography variant="subtitle1" component="div" color="black" sx={{width:200}}>
                                {"Views: "} 
                                <Typography variant="subtitle1" component="div" textDecoration="underline" color="red" display="inline">
                                    {views}
                                </Typography>
                        </Typography>
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </Stack>
                </Box>
                </Grid>
                <Grid item xs={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <ListDropDown list={list}/> 
                    </Collapse>
                </Grid>
            </Grid>
        </ListItem>
    ); 

}