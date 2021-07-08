import React, { useEffect, useState } from 'react'
import { auth } from '../firebase/config'
import { useHistory } from 'react-router'
import { Spin } from 'antd'

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
    const history = useHistory();
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const unsubscribed = auth.onAuthStateChanged((user) => {
            if (user) {
                const { displayName, email, uid, photoUrl } = user;
                setUser({
                    displayName,
                    email,
                    uid,
                    photoUrl
                })
                setIsLoading(false);
                history.push("/");
                return;
            }
            setUser({});
            setIsLoading(false);
            history.push("/login");
        })

        // clean function
        return () => {
            unsubscribed();
        }
    }, [history])
    
    return (
       <AuthContext.Provider value={{ user }}>
           { isLoading ? <Spin  style={{ position: 'fixed', inset: 0 }} /> : children }
       </AuthContext.Provider>
    )
}
   
   
   
