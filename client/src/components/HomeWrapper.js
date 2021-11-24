import { useContext } from 'react'
import ListViewer from './ListViewer'
import WelcomeScreen from './WelcomeScreen'
import AuthContext from '../auth'

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);
    
    if (auth.loggedIn)
        return <ListViewer />
    else
        return <WelcomeScreen />
}