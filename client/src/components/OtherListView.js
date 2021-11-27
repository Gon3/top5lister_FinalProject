import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'

export default function OtherListView() {
    const { store } = useContext(GlobalStoreContext)
    const { auth } = useContext(AuthContext);

}