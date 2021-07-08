import React, { useContext, useMemo, useState } from 'react'
import { AuthContext } from './AuthProvider'
import useFirestore  from '../hooks/useFirestore'

export const AppContext = React.createContext();

export default function AuthProvider({ children }) {
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const { user: { uid } } = useContext(AuthContext)

    const roomCondition = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: uid
        }
    }, [uid])
    const rooms = useFirestore('room', roomCondition)

    const currentRoom = useMemo(() => 
        rooms.find((room) => room.id === selectedRoomId || {}) 
    , [rooms, selectedRoomId]);
    const userCondition = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: currentRoom?.members
        }
    }, [currentRoom?.members])

    const members = useFirestore('user', userCondition);

    const clearState = () => {
        setSelectedRoomId('');
        setIsAddRoomVisible(false);
        setIsInviteMemberVisible(false);
    };
    return (
       <AppContext.Provider value={{ 
           rooms, 
           members,
           isAddRoomVisible, setIsAddRoomVisible, 
           isInviteMemberVisible, setIsInviteMemberVisible,
           selectedRoomId, setSelectedRoomId,
           currentRoom,
           clearState,
        }}>
           { children }
       </AppContext.Provider>
    )
}
   
   
   
