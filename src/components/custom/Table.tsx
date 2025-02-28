import { Flex, Table } from "antd"
import { ColumnsType } from "antd/es/table";
import { UserListProps } from "pages/User/Userlist/UserlistInterface"

interface CustomTableProps {
    columns: ColumnsType<UserListProps>;
    filteredData: UserListProps[];
}

const CusromTable: React.FC<CustomTableProps> = ({ columns, filteredData }) => {
    return (
        <Flex style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <Table<UserListProps> columns={columns} dataSource={filteredData} pagination={false}
                scroll={{
                    x: "max-content",
                    y: 380
                }}
                style={{ width: "100%", height: "100%" }}
            />
        </Flex>
    )
}

export default CusromTable;