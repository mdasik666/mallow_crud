import { Suspense, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "reduxstore/features/authSlice";
import { useAppDispatch, useAppSelector } from "reduxstore/hooks";
import { Flex, Layout, Space, Input, Typography, Button, TableProps, Popconfirm, Pagination, Avatar, Form } from "antd";
import { LogoutOutlined, OrderedListOutlined, TableOutlined } from "@ant-design/icons";
import { createUserData, deleteUserData, fetchUserList, updateUserData } from "reduxstore/features/userSlice";
import { ColumnsType } from "antd/es/table";
import { Loading } from "components/Loading/Laoding";
import { UserListProps } from "./UserlistInterface";
import CusromTable from "components/custom/Table";
import CustomCard from "components/custom/Card";
import CustomModal from "components/custom/Modal";
import Toast from "components/custom/Toast";

const { Header, Content } = Layout;
const { Text, Title } = Typography;
const { Search } = Input;

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
    const [columns, setColumns] = useState<ColumnsType<UserListProps>>([]);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [open, setOpen] = useState<{ open: boolean, type: string, id?: number } | undefined>(undefined);
    const [form] = Form.useForm();

    const handleEdit = useCallback((data: UserListProps) => {
        form.setFieldsValue(data)
        setOpen({ open: true, type: "update", id: data.id })
    }, [form]);

    const handleDelete = useCallback((id: number) => {
        dispatch(deleteUserData(id))
        Toast("success", "User deleted successfully");
    }, [dispatch]);

    const createColumn = useCallback(() => {
        if (!data || !data.length) {
            return [];
        }

        const column: TableProps<UserListProps>['columns'] = Object.keys(data[0]).filter((key) => key !== 'id').map((key) => ({
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
            render: (_, record: UserListProps) => (
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
            setUsername(localStorage.getItem("username") || sessionStorage.getItem("username"));
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
                    Toast("success", "User created successfully");
                } else {
                    dispatch(updateUserData({ data: values, id: open?.id }))
                    Toast("success", "User updated successfully");
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
            <Content style={{ width: "100%", height: "100%", background: "#DEDEDE", padding: "4em" }}>
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
                            ghost={view !== 'card'}
                            type={view === 'table' ? 'primary' : 'default'}
                            icon={<TableOutlined />}
                            onClick={() => handleViewChange('table')}
                        >
                            Table
                        </Button>
                        <Button
                            ghost={view !== 'table'}
                            type={view === 'card' ? 'primary' : 'default'}
                            icon={<OrderedListOutlined />}
                            onClick={() => handleViewChange('card')}
                        >
                            Card
                        </Button>
                    </Space.Compact>
                    {view === 'table' ? (
                        <Flex style={{ width: "100%", height: "100%", overflow: "auto" }}>
                            <Suspense fallback={<Loading />}>
                                <CusromTable columns={columns} filteredData={filteredData} />
                            </Suspense>
                        </Flex>
                    ) : (
                        <Flex style={{ width: "100%", height: "100%", overflowY: "auto", padding: "20px" }} justify="center">
                            <Suspense fallback={<Loading />}>
                                <CustomCard filteredData={filteredData} setHoveredCard={setHoveredCard} hoveredCard={hoveredCard} handleEdit={handleEdit} handleDelete={handleDelete} />
                            </Suspense>
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
            <CustomModal open={open} handleOk={handleOk} handleCancel={handleCancel} form={form} />
        </Layout>
    );
};

export default Userlist;
