import { Button, Form, FormInstance, Input, Modal } from "antd"

interface CustomCardProps {
    open: { open: boolean, type: string, id?: number } | undefined;
    handleOk: () => void;
    handleCancel: () => void;
    form: FormInstance;
}

const CustomModal: React.FC<CustomCardProps> = ({ open, handleOk, handleCancel, form }) => {
    if (!open) return null;

    return (
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
    )
}

export default CustomModal;