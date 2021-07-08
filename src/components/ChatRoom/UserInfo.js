import React, { useContext } from 'react'
import { Button, Avatar, Typography } from 'antd'
import styled from 'styled-components'
import { auth } from '../../firebase/config'
import { AuthContext } from '../../context/AuthProvider'
import { AppContext } from '../../context/AppProvider'

const WrapperStyled = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(82,38,83);

    .username {
        color: #fff;
        margin-left: 5px;
    }
`

export default function UserInfo() {
    const { user: {
        displayName,
        photoUrl,
    }} = useContext(AuthContext)
    const { clearState } = useContext(AppContext)
    
    return (
        <WrapperStyled>
            <div>
                <Avatar src={photoUrl}>{photoUrl ? '' : displayName?.charAt(0)?.toUpperCase()}</Avatar>
                <Typography.Text className="username">{displayName}</Typography.Text>
            </div>
            <Button ghost onClick={() => { 
                clearState();
                auth.signOut();
            }}>
                Sign out
            </Button>
        </WrapperStyled>
    )
}
