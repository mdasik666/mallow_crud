import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Avatar, Button, Card, Col, Flex, Popconfirm, Row } from "antd"
import { UserListProps } from "pages/User/Userlist/UserlistInterface";
import React from "react";

interface CustomCardProps {
    filteredData: UserListProps[];
    setHoveredCard: React.Dispatch<React.SetStateAction<number | null>>;
    hoveredCard: number | null;
    handleEdit: (data: UserListProps) => void;
    handleDelete: (id: number) => void;
}

const CustomCard: React.FC<CustomCardProps> = ({ filteredData, setHoveredCard, hoveredCard, handleEdit, handleDelete }) => {
    return (
        <Row justify="center">
            {
                filteredData.map((user: any) => (
                    <Col xs={24} sm={12} md={8} key={user.id}>
                        <Card
                            style={{ margin: "10px", position: "relative", boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.5)" }}
                            hoverable
                            onMouseEnter={() => setHoveredCard(user.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            cover={
                                <Flex justify="center" style={{ padding: '16px', display:"flex" }}>
                                    <Avatar src={user.avatar} size={80} />
                                </Flex>
                            }
                        >
                            {
                                hoveredCard === user.id && (
                                    <Flex justify="center" align="center" style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        top: 0,
                                        left: 0,
                                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.5)",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        gap: "10px",
                                        zIndex: 1,
                                    }}>
                                        <Button
                                            shape="circle"
                                            type="primary"
                                            size="large"
                                            icon={<EditOutlined />}
                                            onClick={() => handleEdit(user)}
                                        />
                                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(user.id)}>
                                            <Button
                                                shape="circle"
                                                size="large"
                                                type="primary"
                                                style={{ backgroundColor: "red" }}
                                                icon={<DeleteOutlined />}
                                            />
                                        </Popconfirm>
                                    </Flex>
                                )
                            }
                            <Card.Meta style={{ textAlign: "center" }} title={`${user.first_name} ${user.last_name}`} description={user.email} />
                        </Card>
                    </Col>
                ))
            }
        </Row>
    )
}

export default CustomCard;