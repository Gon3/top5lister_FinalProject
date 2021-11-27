import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

export default function HomeView() {
    const { store } = useContext(GlobalStoreContext);

}