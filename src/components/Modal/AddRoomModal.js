import React, { useContext } from 'react'
import { Modal, Form, Input } from 'antd'
import { AppContext } from '../../context/AppProvider'
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../context/AuthProvider';

export default function AddRoomModal() {
    const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);
    const { user: { uid } } = useContext(AuthContext);
    const [form] = Form.useForm();

    const handleOk = () => {
        addDocument('room', {
            ...form.getFieldValue(),
            members: [uid]
        })
        form.resetFields();
        setIsAddRoomVisible(false);
    }
    const handleCancel = () => {
        form.resetFields();
        setIsAddRoomVisible(false);
    }

    return (
        <div>
            <Modal 
                title="Create room"
                visible={isAddRoomVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Room name" name="name">
                        <Input placeholder="Add room name" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input placeholder="Add description" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
