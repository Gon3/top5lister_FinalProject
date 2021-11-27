import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import HomeView from './HomeView'
import OtherListView from './OtherListView'
import MenuToolbar from './MenuToolbar'

export default function ListViewer() {
    const { auth } = useContext(AuthContext);

    return (<div> ListViewer Screen </div>);

}