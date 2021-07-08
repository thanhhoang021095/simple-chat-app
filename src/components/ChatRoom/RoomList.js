import React, { useContext } from 'react'
import { Collapse, Typography, Button} from 'antd'
import styled from 'styled-components';
import { PlusSquareOutlined } from '@ant-design/icons';
import { AppContext } from '../../context/AppProvider';

const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
    &&& {
        .ant-collapse-header , p {
            color: #fff;
        }

        .ant-collapse-content-box {
            padding: 0 40px;
        }
        .add-room {
            color #fff;
            padding: 0;
        }
    }
`

const LinkStyled = styled(Typography.Link)`
    display: block;
    margin-bottom: 5px;
    color: #fff;
`

export default function RoomList() {
    const { rooms, setIsAddRoomVisible, setSelectedRoomId } = useContext(AppContext);
    const handleAddRoom = () => {
        setIsAddRoomVisible(true)
    }
    return (
        <Collapse ghost defaultActiveKey={['1']}>
            <PanelStyled header="Room List" key='1'>
                { rooms && rooms.map(room => 
                    <LinkStyled key={room.id} onClick={() => setSelectedRoomId(room.id)}>
                        {room.name}
                    </LinkStyled>
                )}
                <Button 
                    type="text" 
                    icon={<PlusSquareOutlined />} 
                    className="add-room"
                    onClick={handleAddRoom}
                >Add Room</Button>
            </PanelStyled>
        </Collapse>
    )
}
