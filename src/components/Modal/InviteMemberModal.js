import React, { useContext, useState, useMemo, useEffect } from 'react'
import { AppContext } from '../../context/AppProvider'
import { Modal, Form, Select, Spin, Avatar } from 'antd'
import { debounce } from 'lodash'
import { db } from '../../firebase/config'

const DebounceSelect = ({ fetchOptions, debounceTimeout = 300, currentMember, ...props}) => {
    const [isFetching, setIsFetching] = useState(false);
    const [options, setOptions] = useState(false);

    const debounceFetcher = useMemo(() => {
        const loadOptions = value => {
            setOptions([]);
            setIsFetching(true);

            fetchOptions(value, currentMember).then(newOptions => {
                setOptions(newOptions);
                setIsFetching(false);
            })
        }

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions, currentMember])

    useEffect(() => {
        return () => {
            setOptions([]);
        };
    }, [])

    return (
        <Select
            labelInValue
            onSearch={debounceFetcher}
            filterOption={false}
            notFoundContent={ isFetching ? <Spin size="small" /> : null}
            {...props}
        >
            { options.length && options.map(option => (
                <Select.Option key={option.value} title={option.label} value={option.value}>
                    <Avatar src={option.photoUrl} size="small">
                        { option.photoUrl ? '' : option.label?.charAt(0)?.toUpperCase() }
                    </Avatar>
                    {`${option.label}`}
                </Select.Option>
            ))}
        </Select>
    )
}

const fetchUserList = async(searchText, currentMember) => {
    return db
    .collection('user')
    .where('keywords', 'array-contain', searchText?.toLowerCase())
    .orderBy('displayName')
    .limit(20)
    .get()
    .then((snapshot) => {
        return snapshot.docs
            .map((doc) => ({
                label: doc.data().displayName,
                value: doc.data().uid,
                photoUrl: doc.data().photoUrl
            }))
            .filter(opt => !currentMember.includes(opt.value))
    })
}

export default function InviteMemberModal() {
    const [value, setValue] = useState([])
    const { isInviteMemberVisible, setIsInviteMemberVisible, selectedRoomId, currentRoom } = useContext(AppContext)
    const [form] = Form.useForm();

    const handleOk = () => {
        form.resetFields();
        setValue([]);

        const roomRef = db.collection('room').doc(selectedRoomId);
        roomRef.update({
            members: [...currentRoom.members, ...value.map(val => val.value)]
        })
        setIsInviteMemberVisible(false);
    }

    const handleCancel = () => {
        form.resetFields();
        setValue([]);
        setIsInviteMemberVisible(false);
    }

    return (
        <div>
            <Modal 
                title="Add more member"
                visible={isInviteMemberVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                <Form form={form} layout="vertical">
                    <DebounceSelect 
                        mode="multiple"
                        name="search-user"
                        label="Name of members"
                        value={value}
                        placeholder="Insert name of members"
                        fetchOptions={fetchUserList}
                        onChange={newValue => setValue(newValue)}
                        style={{ width: "100%"}}
                        currentMember={currentRoom?.members}
                    />
                </Form>
            </Modal>
        </div>
    )
}
