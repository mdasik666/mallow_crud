import { Flex, Typography } from "antd";
const { Title } = Typography

const UserNotfound = () => {
    return (
        <Flex justify="center" align="center" style={{ width: "100%", height: "100%" }}>
            <Title level={3}>User Page 404 Not Found</Title>
        </Flex>
    )
}

export default UserNotfound;