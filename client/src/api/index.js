/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE CALL THE payload, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createTop5List = (payload) => api.post(`/top5list/`, payload)
export const getTop5Lists = (query) => api.get(`/top5lists/`, {params: query})
export const getUserTop5Lists = (query) => api.get(`/usertop5lists/`, {params: query})
export const updateTop5ListById = (id, payload) => api.put(`/top5list/${id}/`, payload)
export const deleteTop5ListById = (id, user) => api.delete(`/top5list/${id}/${user}/`)
export const getTop5ListById = (id) => api.get(`/top5list/${id}/`)
export const userUpdateTop5ListById = (id, payload, user) => api.put(`/top5list/${id}/${user}`, payload)
export const publishTop5ListById = (id, payload, user) => api.put(`/publishtop5list/${id}/${user}`, payload)
export const generateCommunityLists = () => api.get(`/gencommunitylists/`)


export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload)
export const loginUser = (payload) => api.get(`/login/`, {params: payload})
export const logoutUser = () => api.get(`/logout/`)
export const loginGuest = () => api.get(`/loginguest/`)

const apis = {
    createTop5List,
    getTop5Lists,
    getUserTop5Lists,
    updateTop5ListById,
    deleteTop5ListById,
    getTop5ListById,
    userUpdateTop5ListById,
    publishTop5ListById,
    generateCommunityLists,

    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    loginGuest
}

export default apis
