import React from 'react'
import { Row, Col, Button, Typography } from 'antd'
import firebase, { auth } from '../../firebase/config'
import { addDocument, generateKeywords } from '../../firebase/services'

const { Title } = Typography

const fbProvider = new firebase.auth.FacebookAuthProvider();

export default function Login() {

    const handleLoginFB = async () => {
        const { additionalUserInfo, user } = await auth.signInWithPopup(fbProvider);
        if (additionalUserInfo?.isNewUser) {
            addDocument('user', { 
                displayName: user.displayName,
                email: user.email,
                photoUrl: user.photoURL,
                uid: user.uid,
                providerId: additionalUserInfo.providerId,
                keywords: generateKeywords(user.displayName?.toLowerCase())
            })
        };
    }

    return (
        <div>
            <Row justify="center" style={{ height: "800px" }}>
                <Col span={8}>
                    <Title style={{ textAlign: "center"}} level={3}>
                        Clone Slack
                    </Title>
                    <Button style={{ width: "100%", marginBottom: 5 }}>
                        Sign in with Google
                    </Button>
                    <Button style={{ width: "100%" }} onClick={handleLoginFB}>
                        Sign in with Facebook
                    </Button>
                </Col>
            </Row>
        </div>
    )
}
