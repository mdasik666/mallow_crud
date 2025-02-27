import { Checkbox, Button, Col } from "antd";
import { RowSC, FormSC, InputSC, InputPasswordSC } from "./LoginSC";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { loginUser, setToken } from "reduxstore/features/authSlice";
import { useAppDispatch, useAppSelector } from "reduxstore/hooks";
import { LoginProps } from "./LoginInterface";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const [form] = FormSC.useForm();
    const [isDisabled, setIsDisabled] = useState(false);
    const [loadingState, setLoadingState] = useState(true);
    const dispatch = useAppDispatch();
    const nav = useNavigate();

    const { token, loading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            dispatch(setToken(savedToken));
            nav("/userlist");
        } else {
            setLoadingState(false);
        }
    }, [dispatch, nav]);

    const onFinish = (values: unknown) => {
        const typedValues = values as LoginProps;
        dispatch(loginUser(typedValues));
    };

    const onFieldsChange = () => {
        hasDisabled();
    };

    const hasDisabled = () => {
        const values = form.getFieldsValue();
        const hasEmptyField = !values.email || !values.password;
        const hasErrors = form.getFieldsError().some(({ errors }) => errors.length > 0);
        setIsDisabled(hasEmptyField || hasErrors);
    };

    useEffect(() => {
        if (token) {
            nav("/userlist");
        }
    }, [token, nav]);

    if (loadingState) {
        return null;
    }

    return (
        <RowSC justify={"center"} align={"middle"}>
            <Col xs={24} sm={16} md={8}>
                <FormSC
                    form={form}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFieldsChange={onFieldsChange}
                    autoComplete="off"
                >
                    <FormSC.Item<LoginProps>
                        name="email"
                        rules={[{ required: true, message: 'Please input your username!' }]}>
                        <InputSC placeholder="Email" size="middle" variant="underlined" prefix={<UserOutlined />} />
                    </FormSC.Item>

                    <FormSC.Item<LoginProps>
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}>
                        <InputPasswordSC placeholder="Password" size="middle" variant="underlined" prefix={<LockOutlined />} />
                    </FormSC.Item>

                    <FormSC.Item<LoginProps> name="remember" valuePropName="checked" label={null}>
                        <Checkbox>Remember me</Checkbox>
                    </FormSC.Item>

                    <FormSC.Item label={null}>
                        <Button type="primary" htmlType="submit" style={{ width: "100%", borderRadius: "0" }}
                            disabled={isDisabled}>
                            {loading ? "Submitting..." : "Log in"}
                        </Button>
                    </FormSC.Item>
                </FormSC>
            </Col>
        </RowSC >
    );
};

export default Login;
