import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "reduxstore/features/authSlice";
import { useAppDispatch, useAppSelector } from "reduxstore/hooks";
import { Flex, Layout, Table, Space, Input, Typography, Button, TableProps, Popconfirm, Pagination, Avatar, Card, Row, Col, Modal, Form } from "antd";
import { DeleteOutlined, EditOutlined, LogoutOutlined, OrderedListOutlined, TableOutlined } from "@ant-design/icons";
import { createUserData, deleteUserData, fetchUserList, updateUserData } from "reduxstore/features/userSlice";
import { ColumnsType } from "antd/es/table";

const { Header, Content } = Layout;
const { Text, Title } = Typography;
const { Search } = Input;

interface UserList {
    avatar: string;
    email: string;
    first_name: string;
    id: number;
    last_name: string;
}

const Userlist: React.FC = () => {
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    const [loadingState, setLoadingState] = useState<boolean>(true);
    const [view, setView] = useState<string>('table');
    const [pageNum, setPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { token, username } = useAppSelector((state) => state.auth);
    const { userdata } = useAppSelector((state) => state.users);
    const { data, per_page, total } = userdata;
    const [name, setUsername] = useState(username);
    const [columns, setColumns] = useState<ColumnsType<UserList>>([]);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [open, setOpen] = useState<{ open: boolean, type: string, id?: number }>();
    const [form] = Form.useForm();


    const handleEdit = useCallback((data: any) => {
        form.setFieldsValue(data)
        setOpen({ open: true, type: "update", id: data.id })
    }, [form]);

    const handleDelete = useCallback((id: number) => {
        dispatch(deleteUserData(id))
    }, [dispatch]);

    const createColumn = useCallback(() => {
        if (!data || !data.length) {
            return [];
        }

        const column: TableProps<UserList>['columns'] = Object.keys(data[0]).filter((key) => key !== 'id').map((key) => ({
            title: key === "avatar" ? "" : key.replace('_', ' ').toUpperCase(),
            dataIndex: key,
            key,
        }));

        const avatarColumnIndex = column.findIndex(col => col.key === 'avatar');
        if (avatarColumnIndex !== -1) {
            const avatarColumn = column.splice(avatarColumnIndex, 1)[0];
            column.unshift(avatarColumn);
        }

        column.push({
            title: 'Actions',
            key: 'actions',
            render: (_, record: UserList) => (
                <Space align="center" size={"small"}>
                    <Button onClick={() => handleEdit(record)} type="primary" style={{ borderRadius: 0 }}>
                        Edit
                    </Button>
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                        <Button type="primary" style={{ background: "red", borderRadius: 0 }}>
                            <Text style={{ color: "white" }}>Delete</Text>
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        });

        column[0] = {
            ...column[0],
            render: (avatarUrl: string) => <Avatar src={avatarUrl} size={40} />,
        };
        setColumns(column);
    }, [data, handleDelete, handleEdit]);

    useEffect(() => {
        if (!token) {
            nav("/");
        } else {
            dispatch(fetchUserList(pageNum));
            setUsername(localStorage.getItem("username"));
            setLoadingState(false);
        }
    }, [dispatch, token, nav, pageNum]);

    useEffect(() => {
        if (data.length > 0) {
            createColumn()
        }
    }, [data, createColumn]);

    if (loadingState) {
        return null;
    }

    const logoutUser = () => {
        dispatch(logout());
        nav("/");
    };

    const handleViewChange = (viewType: string) => {
        setView(viewType);
    };

    const onPageChange = (pageNum: number) => {
        setPage(pageNum);
    };

    const filteredData = data.filter(user => {
        return (
            user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const onSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                console.log(open?.type, values);
                if (open?.type === "create") {
                    dispatch(createUserData(values))
                } else {
                    dispatch(updateUserData({ data: values, id: open?.id }))
                }
                setOpen({ open: false, type: "" });
            })
            .catch((error) => {
                console.error("Validation Failed:", error);
            });
    };

    const handleCancel = () => {
        form.resetFields()
        setOpen({ open: false, type: "" });
    };

    return (
        <Layout style={{ width: "100%", height: "100%" }}>
            <Header style={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
                <Space size="middle">
                    <Text style={{ color: "white" }}>{name?.split("@")[0].split(".").join(" ").toUpperCase()}</Text>
                    <LogoutOutlined onClick={logoutUser} style={{ fontSize: "20px", color: "white", padding: "5px", background: "red" }} />
                </Space>
            </Header>
            <Content style={{ width: "100%", height: "100%", background: "rgb(157, 157, 157)", padding: "4em" }}>
                <Layout style={{ width: "100%", height: "100%", background: "white", padding: "20px" }}>
                    <Flex justify="space-between" align="center">
                        <Title level={3}>Users</Title>
                        <Space>
                            <Search placeholder="input search text" allowClear onSearch={onSearch} />
                            <Button type="primary" style={{ borderRadius: "0" }} onClick={() => setOpen({ open: true, type: "create" })}>Create User</Button>
                        </Space>
                    </Flex>
                    <Space.Compact>
                        <Button
                            variant="outlined"
                            type={view === 'table' ? 'primary' : 'default'}
                            icon={<TableOutlined />}
                            onClick={() => handleViewChange('table')}
                        >
                            Table
                        </Button>
                        <Button variant="outlined"
                            type={view === 'card' ? 'primary' : 'default'}
                            icon={<OrderedListOutlined />}
                            onClick={() => handleViewChange('card')}
                        >
                            Card
                        </Button>
                    </Space.Compact>
                    {view === 'table' ? (
                        <Flex>
                            <Table<UserList> columns={columns} dataSource={filteredData} pagination={false}
                                scroll={{
                                    x: "max-content",
                                    y: 350,
                                }}
                                style={{ width: "100%", height: "100%" }}
                            />
                        </Flex>

                    ) : (
                        <Flex style={{ overflow: "hidden", padding: "20px" }} justify="center" align="center">
                            <Row justify="center" gutter={[16, 16]}>
                                {filteredData.map((user: any, idx: number) => (
                                    <Col xs={24} sm={12} md={8} key={user.id}>
                                        <Card
                                            style={{ position: "relative", boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.5)" }}
                                            hoverable
                                            onMouseEnter={() => setHoveredCard(user.id)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                            cover={
                                                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                                                    <Avatar src={user.avatar} size={80} />
                                                </div>
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
                                                        padding: "10px",
                                                        borderRadius: "5px",
                                                        gap: "10px",
                                                        zIndex: 1,
                                                    }}>
                                                        <Button
                                                            type="primary"
                                                            icon={<EditOutlined />}
                                                            onClick={() => handleEdit(user)}
                                                        />
                                                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(user.id)}>
                                                            <Button
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
                                ))}
                            </Row>
                        </Flex>
                    )}
                </Layout>
                <Pagination
                    style={{ display: "flex", justifyContent: "end", padding: "10px 0" }}
                    current={pageNum}
                    pageSize={per_page}
                    total={total}
                    onChange={onPageChange}
                />
            </Content>

            <Modal
                open={open?.open}
                title={open?.type === "create" ? "Create New User" : "Edit User"}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button style={{ borderRadius: 0 }} key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button style={{ borderRadius: 0 }} key="submit" type="primary" onClick={handleOk}>
                        Submit
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="First Name"
                        name="first_name"
                        rules={[{ required: true, message: "Please enter your first name!" }]}
                    >
                        <Input placeholder="Enter first name" />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="last_name"
                        rules={[{ required: true, message: "Please enter your last name!" }]}
                    >
                        <Input placeholder="Enter last name" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Please enter your email!" },
                            { type: "email", message: "Please enter a valid email!" },
                        ]}
                    >
                        <Input placeholder="Enter email" />
                    </Form.Item>

                    <Form.Item
                        label="Profile Image Link"
                        name="avatar"
                        rules={[{ required: true, message: "Please enter your profile image link!" }]}
                    >
                        <Input placeholder="Enter profile image URL" />
                    </Form.Item>
                </Form>
            </Modal>

        </Layout>
    );
};

export default Userlist;
