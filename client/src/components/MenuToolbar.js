import { useContext, useState } from 'react';
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { TextField } from '@mui/material';
import Home from '@mui/icons-material/Home';
import Groups from '@mui/icons-material/Groups';
import Person from '@mui/icons-material/Person';
import Sort from '@mui/icons-material/Sort'; 
import Functions from '@mui/icons-material/Functions';
import { AppBar } from '@mui/material';

export default function MenuToolbar(props) {
    const {store} = useContext(GlobalStoreContext); 
    const {auth} = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [text, setText] = useState("");
    const [sort, setSort] = useState(""); 
    const isMenuOpen = Boolean(anchorEl);
    //const {setViewCallback} = props; 
    
    const menuId = "sort-list-menu"

    const handleUpdateText = (event) => {
        setText(event.target.value); 
    }

    const handleKeyPress = (event) =>  {
        if(event.key === 'Enter'){
            store.changeSearchName(text); 
            event.target.blur()
        }
    }

    const handleSortMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);

    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const handleSortClick = (event) => {
        handleMenuClose(); 
        console.log(event.target.innerText);
        setSort(event.target.innerText); 
        store.changeSort(event.target.innerText); 
    }

    const isMenuItemDisabled = (menuItemText) => {
        return store.sorting === menuItemText;
    }
    
    const handleHome = () =>{
        store.changePageToHome();
        setText("");
        setSort("");
        //setViewCallback(store.currentPage); 
    }

    const handleAllLists = () =>{
        store.changePageToAllLists();
        setText("");
        setSort("");
        console.log(store.currentPage);
        //setViewCallback(store.currentPage);
    }

    const handleUserLists = () =>{
        store.changePageToUserLists(); 
        setText("");
        setSort("");
        console.log(store.currentPage);
        //setViewCallback(store.currentPage);
    }

    const handleCommunity = () =>{
        store.changePageToCommunityLists(); 
        setText("");
        setSort("");
        console.log(store.currentPage);
        //setViewCallback(store.currentPage); 
    }

    return (
        <Box sx={{flexGrow: 1, position:"absolute", left:0}}>
            <Toolbar >
                <Box sx={{display:"flex", alignItems: "center", marginRight: 58}}>
                    <Stack direction="row" spacing={2} mt={2}>
                    <IconButton  
                        edge="end"
                        aria-label="home-button"
                        disabled={!auth.loggedIn || auth.user.isGuest}
                        onClick={handleHome}>
                            <Home style={{ fontSize: 60 }} />
                    </IconButton>
                    <IconButton  
                        edge="end"
                        aria-label="alllists-button"
                        onClick={handleAllLists}>
                            <Groups style={{ fontSize: 60 }} />
                    </IconButton>
                    <IconButton  
                        edge="end"
                        aria-label="userlists-button"
                        onClick={handleUserLists}>
                            <Person style={{ fontSize: 60 }} />
                    </IconButton>
                    <IconButton  
                        edge="end"
                        aria-label="community-button"
                        onClick={handleCommunity}>
                            <Functions style={{ fontSize: 60 }} />
                    </IconButton> 
                    <TextField
                        id="search-bar"
                        placeholder="Search"
                        autoComplete="Search Name"
                        onChange={handleUpdateText}
                        onKeyPress={handleKeyPress}
                        value={text}
                        margin="normal"
                        style = {{width: 500}}
                        inputProps={{style: {fontSize: 24}}}
                        fullWidth/>
                    </Stack>
                </Box>
                <Box sx={{display:"flex", alignItems: "center"}}>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' }}} >
                            SORT BY
                    </Typography>
                    <IconButton
                        edge="end"
                        aria-label="sort-list-menu-button"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleSortMenuOpen}
                        >
                            <Sort style={{ fontSize: 60 }} />
                    </IconButton>

                </Box>
            </Toolbar>
            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                id={menuId}
                keepMounted
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                    <MenuItem disabled={sort==="Publish Date (Newest)"}
                                onClick={handleSortClick}>
                        Publish Date (Newest)</MenuItem>
                    <MenuItem disabled={sort==="Publish Date (Oldest)"}
                            onClick={handleSortClick}>
                        Publish Date (Oldest)</MenuItem>
                    <MenuItem disabled={sort==="Views"}
                        onClick={handleSortClick}>
                        Views</MenuItem>
                    <MenuItem disabled={sort==="Likes"}
                        onClick={handleSortClick}>
                        Likes</MenuItem>
                    <MenuItem disabled={sort==="Dislikes"}
                        onClick={handleSortClick}>
                        Dislikes</MenuItem> 
            </Menu> 
        </Box>
    );
}