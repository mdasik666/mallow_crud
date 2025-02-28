import styled from "styled-components";
import { Row, Form, Input } from "antd";

const RowSC = styled(Row)({
    width: "100%",
    height: "100%",
    backgroundColor: "#DEDEDE"
});

const FormSC = styled(Form)({
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "10px"
});

const InputSC = styled(Input)({
    paddingInline: 0,
});

const InputPasswordSC = styled(Input.Password)({
    paddingInline: 0
});

export { RowSC, FormSC, InputSC, InputPasswordSC }
