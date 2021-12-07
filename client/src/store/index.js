import { createContext, useContext, useState} from 'react'
import { useHistory } from 'react-router-dom'
import api from '../api'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_LISTS: "LOAD_LISTS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    CLEAR_STORE: "CLEAR_STORE",
    SET_SORT: "SET_SORT",
    SET_CURRENT_PAGE: "SET_CURRENT_TYPE",
    SET_SEARCH_NAME: "SET_SEARCH_NAME"
}



// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        top5Lists: [],
        currentList: null,
        newListCounter: 0,
        sorting: null,
        currentPage: "home",
        searchName: "",
        listMarkedForDeletion: null
    });
    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    sorting: store.sorting,
                    currentPage: store.currentPage,
                    searchName: store.searchName,
                    listMarkedForDeletion: null
                });
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    top5Lists: payload.newTop5Lists,
                    currentList: payload.newList,
                    newListCounter: store.newListCounter + 1,
                    sorting: store.sorting,
                    currentPage: store.currentPage,
                    searchName: store.searchName,
                    listMarkedForDeletion: null
                });
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_LISTS: {
                return setStore({
                    top5Lists: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    sorting: store.sorting,
                    currentPage: store.currentPage,
                    searchName: store.searchName,
                    listMarkedForDeletion: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    sorting: store.sorting,
                    currentPage: store.currentPage,
                    searchName: store.searchName,
                    listMarkedForDeletion: payload
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    sorting: store.sorting,
                    currentPage: store.currentPage,
                    searchName: store.searchName,
                    listMarkedForDeletion: null
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    sorting: store.sorting,
                    currentPage: store.currentPage,
                    searchName: store.searchName,
                    listMarkedForDeletion: null
                });
            }
            //SET LIST SORTING
            case GlobalStoreActionType.SET_SORT: {
                return setStore({
                    top5Lists: payload.top5Lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    sorting: payload.newSorting,
                    currentPage: store.currentPage,
                    searchName: store.searchName,
                    listMarkedForDeletion: null
                });
            }
            //SET CURRENT PAGE OF LIST VIEWER
            case GlobalStoreActionType.SET_CURRENT_PAGE: {
                return setStore({
                    top5Lists: payload.top5lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    sorting: null,
                    currentPage: payload.page,
                    searchName: "",
                    listMarkedForDeletion: null
                });
            }
            //SET CURRENT NAME OF LIST SEARCHING FOR
            case GlobalStoreActionType.SET_SEARCH_NAME: {
                return setStore({
                    top5Lists: payload.top5lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    sorting: store.sorting,
                    currentPage: store.currentPage,
                    searchName: payload.newSearch,
                    listMarkedForDeletion: null
                });
            }
            //RESET THE STORE FOR LOGOUT
            case GlobalStoreActionType.CLEAR_STORE: {
                return setStore({
                    top5Lists: [],
                    currentList: null,
                    newListCounter: 0,
                    sorting: null,
                    currentPage: "home",
                    searchName: "",
                    listMarkedForDeletion: null
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        let payload = {
            name: newListName,
            items: ["?", "?", "?", "?", "?"],
            userName: auth.user.userName,
            views: 0,
            likes: [],
            dislikes: [],
            comments: [],
            published: false 
        };
        const response = await api.createTop5List(payload);
        if (response.data.success) {
            let newList = response.data.top5List;
            let newtop5lists = [...store.top5Lists, newList];
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: {
                    newList: newList,
                    newTop5Lists: newtop5lists
                }
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // For loading of lists
    store.loadTop5Lists = async function () {
        switch(store.currentPage){
            case "home" : {
                let query = {
                    user: auth.user.userName, 
                    name: store.searchName
                }
                const response = await api.getUserTop5Lists(query);
                if(response.data.success){
                    let top5lists = response.data.top5lists;
                    let sortedLists = store.sortLists(top5lists, store.sorting);  
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_LISTS,
                        payload: sortedLists
                    });
                } else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
                break;
            }

            case "allLists" : {
                let query = {
                    name: store.searchName
                }
                const response = await api.getTop5Lists(query);
                if(response.data.success){
                    let top5lists = response.data.top5lists;
                    let sortedLists = store.sortLists(top5lists, store.sorting); 
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_LISTS,
                        payload: sortedLists
                    });
                } else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
                break;
            }

            case "userLists" : {
                let query = {
                    user: store.searchName
                }
                const response = await api.getTop5Lists(query);
                if(response.data.success){
                    let top5lists = response.data.top5lists;
                    let sortedLists = store.sortLists(top5lists, store.sorting);  
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_LISTS,
                        payload: sortedLists
                    });
                } else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
                break;
            }

            case "community" : {
                let query = {
                    user: "Community",
                    name: store.searchName
                }
                const response = await api.getUserTop5Lists(query);
                if(response.data.success){
                    let top5lists = response.data.top5lists;
                    let sortedLists = store.sortLists(top5lists, store.sorting); 
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_LISTS,
                        payload: sortedLists
                    });
                } else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
                break;
            }
            default: {
                return; 
            }
        }
    }

    store.changePageToHome = async function () {
        let query = {
            user: auth.user?.userName, 
            name: ""
        }
        const response = await api.getUserTop5Lists(query);
        if(response.data.success){
            let top5lists = response.data.top5lists;
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_PAGE,
                payload: {
                    page: "home",
                    top5lists: top5lists
                }
            });
        } else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    store.changePageToAllLists = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_PAGE,
            payload: {
                page: "allLists",
                top5lists: []
            }
        });
    }

    store.changePageToUserLists = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_PAGE,
            payload: {
                page: "userLists",
                top5lists: []
            }
        });
    }

    store.changePageToCommunityLists = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_PAGE,
            payload: {
                page: "community",
                top5lists: []
            }
        });
    }

    store.changeSearchName = async function (search) {
        switch(store.currentPage){
            case "home" : {
                let query = {
                    user: auth.user.userName, 
                    name: search
                }
                const response = await api.getUserTop5Lists(query);
                if(response.data.success){
                    let top5lists = response.data.top5lists;
                    let sortedLists = store.sortLists(top5lists, store.sorting);  
                    storeReducer({
                        type: GlobalStoreActionType.SET_SEARCH_NAME,
                        payload: {
                            top5lists: sortedLists,
                            newSearch: search
                        }
                    });
                } else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
                break;
            }

            case "allLists" : {
                let query = {
                    name: search
                }
                const response = await api.getTop5Lists(query);
                if(response.data.success){
                    console.log("success" + response); 
                    let top5lists = response.data.top5lists;
                    let sortedLists = store.sortLists(top5lists, store.sorting); 
                    storeReducer({
                        type: GlobalStoreActionType.SET_SEARCH_NAME,
                        payload: {
                            top5lists: sortedLists,
                            newSearch: search
                        }
                    });
                } else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
                break;
            }

            case "userLists" : {
                let query = {
                    user: search
                }
                const response = await api.getTop5Lists(query);
                if(response.data.success){
                    let top5lists = response.data.top5lists;
                    let sortedLists = store.sortLists(top5lists, store.sorting);  
                    storeReducer({
                        type: GlobalStoreActionType.SET_SEARCH_NAME,
                        payload: {
                            top5lists: sortedLists,
                            newSearch: search
                        }
                    });
                } else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
                break;
            }

            case "community" : {
                let query = {
                    user: "Community",
                    name: search
                }
                const response = await api.getUserTop5Lists(query);
                if(response.data.success){
                    let top5lists = response.data.top5lists;
                    let sortedLists = store.sortLists(top5lists, store.sorting); 
                    storeReducer({
                        type: GlobalStoreActionType.SET_SEARCH_NAME,
                        payload: {
                            top5lists: sortedLists,
                            newSearch: search
                        }
                    });
                } else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
                break;
            }
            default: {
                return; 
            }
        }
    }

    store.changeSort = function (newSort) {
        let sortedLists = store.sortLists(store.top5Lists, newSort);

        storeReducer({
            type: GlobalStoreActionType.SET_SORT,
            payload: {
                newSorting: newSort,
                top5Lists: sortedLists
            }
        });
    }

    store.sortLists = function (lists, sort) {
        switch(sort){
            case "Publish Date (Oldest)" : {
                lists.sort((list1, list2) => {
                    if (list1.published && list2.published){
                        let d1 = new Date(list1.publishDate);
                        let d2 = new Date(list2.publishDate);
                        return d2.getTime() - d1.getTime();
                    }
                    else{
                        if(!list1.published && !list2.published){
                            return 0; 
                        }
                        else if(!list1.published){
                            return 1; 
                        }
                        else {
                            return -1; 
                        }
                    }
                });
                return lists; 
            }
            case "Publish Date (Newest)" : {
                lists.sort((list1, list2) => {
                    if (list1.published && list2.published){
                        let d1 = new Date(list1.publishDate);
                        let d2 = new Date(list2.publishDate);
                        return d1.getTime() - d2.getTime();
                    }
                    else{
                        if(!list1.published && !list2.published){
                            return 0; 
                        }
                        else if(!list1.published){
                            return -1; 
                        }
                        else {
                            return 1; 
                        }
                    }
                });
                return lists; 
            }
            case "Views" : {
                lists.sort((list1, list2) => {
                    return list2.views - list1.views; 
                });
                return lists; 
            }
            case "Likes" : {
                lists.sort((list1, list2) => {
                    return list2.likes.length - list1.likes.length; 
                });
                return lists; 
            }
            case "Dislikes" : {
                lists.sort((list1, list2) => {
                    return list2.dislikes.length - list1.dislikes.length; 
                });
                return lists; 
            }
            default : {
                return lists; 
            }
        }
    }

   //For Deletion of list
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        await api.getTop5ListById(id).then(response => {
            if (response.data.success) {
                let top5List = response.data.top5List;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: top5List
                });
            }
        }); 
    }

    const deleteList = async function (listToDelete) {
        await api.deleteTop5ListById(listToDelete._id, auth.user.userName).then(response => {
            store.loadTop5Lists();
        }).catch(error => {console.log(error); store.loadTop5Lists();}); 
    }

    store.deleteMarkedList = function () {
        deleteList(store.listMarkedForDeletion);
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    //For editing of lists
    store.setCurrentList = async function (id) {
        await api.getTop5ListById(id).then( response => {
        
            let top5List = response.data.top5List;
            async function setList(top5List){
                let payload = {
                    name: top5List.name,
                    items: top5List.items
                }
                response = await api.userUpdateTop5ListById(top5List._id, payload, auth.user.userName);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: top5List
                    });
                }
            }
            setList(top5List); 
        }
        );
    }

    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    store.updateLikes = async function (id, setLikeDislikeCallback) {
        await api.getTop5ListById(id).then( response => {
            let top5List = response.data.top5List;
            if(top5List.likes.includes(auth.user.userName)){
                let index = top5List.likes.indexOf(auth.user.userName);
                top5List.likes.splice(index, 1); 
            } else if (top5List.dislikes.includes(auth.user.userName)){
                let index = top5List.dislikes.indexOf(auth.user.userName);
                top5List.dislikes.splice(index, 1); 
                top5List.likes.push(auth.user.userName); 
            } else {
                top5List.likes.push(auth.user.userName); 
            }
            async function updatingList(top5List){
                let payload = {
                    likes: top5List.likes,
                    dislikes: top5List.dislikes,
                    comments: top5List.comments,
                    views: top5List.views
                };
                response = await api.updateTop5ListById(top5List._id, payload); 
                if(response.data.success){
                    setLikeDislikeCallback(top5List.likes, top5List.dislikes);
                    store.loadTop5Lists(); 
                }
            }
            updatingList(top5List)
        });
    }

    store.updateDislikes = async function (id, setLikeDislikeCallback) {
        await api.getTop5ListById(id).then( response => {
            let top5List = response.data.top5List;
            if(top5List.dislikes.includes(auth.user.userName)){
                let index = top5List.dislikes.indexOf(auth.user.userName);
                top5List.dislikes.splice(index, 1); 
            } else if (top5List.likes.includes(auth.user.userName)){
                let index = top5List.likes.indexOf(auth.user.userName);
                top5List.likes.splice(index, 1); 
                top5List.dislikes.push(auth.user.userName); 
            } else {
                top5List.dislikes.push(auth.user.userName); 
            }
            async function updatingList(top5List){
                let payload = {
                    likes: top5List.likes,
                    dislikes: top5List.dislikes,
                    comments: top5List.comments,
                    views: top5List.views
                };
                response = await api.updateTop5ListById(top5List._id, payload); 
                if(response.data.success){
                    setLikeDislikeCallback(top5List.likes, top5List.dislikes);
                    store.loadTop5Lists(); 
                }
            }
            updatingList(top5List)
        });
    }

    store.updateViews = async function (id, setViewCallback) {
        await api.getTop5ListById(id).then( response => {
            let top5List = response.data.top5List;
            top5List.views++; 
            async function updatingList(top5List){
                let payload = {
                    likes: top5List.likes,
                    dislikes: top5List.dislikes,
                    comments: top5List.comments,
                    views: top5List.views
                };
                response = await api.updateTop5ListById(top5List._id, payload); 
                if(response.data.success){
                    setViewCallback(top5List.views); 
                    store.loadTop5Lists();
                }
            }
            updatingList(top5List);
        });
    }

    store.addComment = async function (id, comment_text) {
        if(!comment_text){
            return; 
        }
        await api.getTop5ListById(id).then( response => {
            let top5List = response.data.top5List;
            let comment = {
                text: comment_text,
                user: auth.user.userName
            };
            top5List.comments.push(comment); 
            async function updatingList(top5List){
                let payload = {
                    likes: top5List.likes,
                    dislikes: top5List.dislikes,
                    comments: top5List.comments,
                    views: top5List.views
                };
                response = await api.updateTop5ListById(top5List._id, payload); 
                if(response.data.success){
                }
            }
            updatingList(top5List);
        });
    }

    store.saveList = async function (title, items){
        let payload = {
            name: title,
            items: items
        }
        await api.userUpdateTop5ListById(store.currentList._id, payload, auth.user.userName).then(
            response => {
                store.loadTop5Lists(); 
            }
        ).catch(({response}) => console.log(response.data.errorMessage)); 
    }

    store.publishList = async function (title, items){
        let payload = {
            name: title,
            items: items
        }
        await api.publishTop5ListById(store.currentList._id, payload, auth.user.userName).then(
            response => {
                store.loadTop5Lists(); 
            }
        ).catch(({response}) => console.log(response.data.errorMessage)); 
    }

    //reset the store (for logout)
    store.reset = function () {
        storeReducer({
            type: GlobalStoreActionType.CLEAR_STORE,
            payload: null
        });
    }

    store.checkIsPublishable = function (title, items, setPublishCallback){
        if(!title){
            console.log("reject " + title); 
            setPublishCallback(false); 
            return; 
        }

        let filteredItems = items.filter((item) => !(/^\s*$/.test(item)));
        console.log(filteredItems); 
        let nonDuplicateItems = new Set(filteredItems); 
        console.log(nonDuplicateItems); 
        if(nonDuplicateItems.size !== 5){
            console.log("reject " + nonDuplicateItems); 
            setPublishCallback(false); 
            return; 
        }
        
        async function checkTitle(name){
            let query = {
            user: auth.user.userName
            }
            const response = await api.getTop5Lists(query);
            if(response.data.success){
                let top5lists = response.data.top5lists;
                for(let index in top5lists){
                    let list = top5lists[index]; 
                    if(list.name === title){
                        console.log("reject "+ title); 
                        setPublishCallback(false);  
                        return;
                    }
                }
                console.log("accepted"); 
                setPublishCallback(true); 
            }
            else{
                console.log('failed to check if title valid'); 
                return; 
            }
        } 
        checkTitle(title); 
    }

    store.pingCommunityLists = async function (){
        await api.generateCommunityLists().then(() => {
            console.log('MADE COMMUNITY LISTS, SUCCESS!!'); 
        }).catch(() => {
            console.log('COMMUNITY LISTS NOT MADE, FAILURE!!'); 
        }); 
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };