import React, { useContext, useEffect, useMemo, useState, useRef } from 'react'
import styled from 'styled-components'
import { Button, Avatar, Tooltip, Form, Input, Alert } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import Message from './Message';
import { AppContext } from '../../context/AppProvider'
import { addDocument } from '../../firebase/services'
import { AuthContext } from '../../context/AuthProvider';
import useFirestore from '../../hooks/useFirestore';

const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
    align-items: center;
    border-bottom: 1px solid rgb(230, 230, 230);

    .header {
        &__info {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        &__title {
            margin: 0;
            font-weight: bold;
        }

        &__description {
            font-size: 12px;
        }
    }
`;

const ButtonGroupStyled = styled.div`
    display: flex;
    align-items: center;
`;


const WrapperStyled = styled.div`
    height: 100vh;
`;

const ContentStyled = styled.div`
    height: calc(100% - 56px);
    display: flex;
    flex-direction: column;
    padding: 11px;
    justify-content: flex-end;
`;

const FormStyled = styled(Form)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 2px 2px 0;
    border: 1px solid rgb(230, 230, 230);
    border-radius: 2px;

    .ant-form-item {
        flex: 1;
        margin-bottom: 0;
    }
`;
const MessageListStyled = styled.div`
    max-height: 100%
    overflow-y: 100%;
`;

export default function ChatWindow() {
    const { currentRoom, members, setIsInviteMemberVisible } = useContext(AppContext);
    const { user: { uid, photoUrl, displayName }} = useContext(AuthContext);
    const [inputValue, setInputValue] = useState("");
    const [form] = Form.useForm();
    const inputRef = useRef(null);
    const messageListRef = useRef(null);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleInputSubmit = () => {
        addDocument('messages', {
            text: inputValue,
            uid,
            photoUrl,
            roomId: currentRoom?.id,
            displayName,
        });
        form.resetFields(['message'])
    }

    const messageCondition = useMemo(() => ({
        fieldName: 'roomId',
        operator: '==',
        compareValue: currentRoom?.id
    }), [currentRoom?.id])
    
    const messages = useFirestore('messages', messageCondition);

    useEffect(() => {
        if (messageListRef?.current) {
          messageListRef.current.scrollTop =
            messageListRef.current.scrollHeight + 50;
        }
      }, [messages]);
    return (
        <WrapperStyled>
            { currentRoom?.id ? (
                <>
                    <HeaderStyled>
                        <div className="header__info">
                            <p className="header__title">{currentRoom?.name}</p>
                            <span className="header__description">{currentRoom?.description}</span>
                        </div>
                        <ButtonGroupStyled>
                            <Button 
                                icon={<UserAddOutlined />} 
                                type="text"
                                onClick={() => setIsInviteMemberVisible(true)}
                            >
                                Invite
                            </Button>
                            <Avatar.Group size="small" maxCount={2}>
                                { members.length && members.map((member) => 
                                    <Tooltip key={member.id} title={member.displayName}>
                                        <Avatar src={member.photoUrl}>{
                                            member.photoUrl ? '' : member.displayName?.charAt(0)?.toUpperCase()
                                        }</Avatar>
                                    </Tooltip>
                                )}
                            </Avatar.Group>
                        </ButtonGroupStyled>
                    </HeaderStyled>
                    <ContentStyled>
                        <MessageListStyled ref={messageListRef}>
                            { messages.length && messages.map((mess) => 
                                <Message 
                                    key={mess.id} 
                                    text={mess.text} 
                                    photo={mess.photoUrl} 
                                    displayName={mess.displayName} 
                                    createAt={mess.createAt} 
                                />
                            )}
                        </MessageListStyled>
                        <FormStyled form={form}>
                            <Form.Item name="message">
                                <Input
                                    ref={inputRef}
                                    placeholder="Type your message" 
                                    bordered={false} 
                                    autoComplete="off"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onPressEnter={handleInputSubmit}
                                />
                            </Form.Item>
                            <Button type="primary" onClick={handleInputSubmit}>Send</Button>
                        </FormStyled>

                    </ContentStyled>
                </> 
                ) : (
                    <Alert 
                        message="Let choose room"
                        type="info"
                        showIcon
                        style={{ margin: 5}}
                        closable
                    />
                )
            }
        </WrapperStyled>
    )
}
