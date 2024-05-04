import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  Button,
  Space,
  Modal,
  message,
  DatePicker,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  DollarCircleOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { exportToPDF } from "../Common/report";
import LayoutNew from "../Layout";
import { DataGrid } from "@mui/x-data-grid";

const { Title } = Typography;
const { Content } = Layout;

const LeaveTrackingPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loggedInUserType, setLoggedInUserType] = useState("");
  const token = localStorage.getItem("userId");
  const empid = localStorage.getItem("empid");
  const userType = localStorage.getItem("loggedInUserType");
  const transformedRows = filteredData.map((row, index) => ({
    id: row._id, // or any other property that can uniquely identify the row
    ...row,
  }));

  useEffect(() => {
    const userType = localStorage.getItem("loggedInUserType");
    if (userType) {
      setLoggedInUserType(userType);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let apiUrl;
      if (userType === "admin") {
        apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/leave-request/`;
        const response = await axios.get(apiUrl);
        const modifiedData = await Promise.all(
          response.data.data.map(async (item, index) => {
            let employeeName = "";
            if (item.employee) {
              const employeeResponse = await axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/employees/${item.employee}`
              );
              const employee = employeeResponse.data.data;
              employeeName = `${employee.firstName} ${employee.lastName}`;
            }
            return {
              ...item,
              key: index.toString(),
              employeeName: employeeName,
              startDate: moment(item.startDate).format("YYYY-MM-DD"),
              endDate: moment(item.endDate).format("YYYY-MM-DD"),
            };
          })
        );
        setData(modifiedData);
      } else {
        apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/leave-request/user/${empid}`;
        const response = await axios.get(apiUrl);
        const modifiedData = response.data.data.map((item, index) => ({
          ...item,
          key: index.toString(),
          startDate: moment(item.startDate).format("YYYY-MM-DD"),
          endDate: moment(item.endDate).format("YYYY-MM-DD"),
        }));
        setData(modifiedData);
      }
    } catch (error) {
      message.error(`Failed to fetch data: ${error.message}`);
    }
  };

  const filterData = () => {
    const filtered = data.filter((row) => {
      const orderAttributesMatch = Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      return orderAttributesMatch;
    });
    setFilteredData(filtered);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    filterData();
  }, [searchQuery, data]);

  const columns = [
    ...(userType === "admin"
      ? [
          {
            field: "employeeName",
            headerName: "Employee Name",
            flex: 1,
          },
        ]
      : []),
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 1,
    },
    {
      field: "reason",
      headerName: "Reason",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Tag
          color={
            params.value === "Approved"
              ? "green"
              : params.value === "Rejected"
              ? "red"
              : "gold"
          }
        >
          {params.value}
        </Tag>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Space>
          {(userType === "admin" && params.row.status === "Pending") && (
            <Button onClick={() => approveRequest(params.row._id)}>Approve</Button>
          )}
          {userType === "user" &&
            (params.row.status === "Rejected" || params.row.status === "Pending") && (
              <>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => edit(params.row.key)}
                />
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => confirmDelete(params.row.key)}
                />
              </>
            )}
        </Space>
      ),
    },
  ];

  const approveRequest = async (_id) => {
    const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/leave-request/${_id}`;
    const updatePayload = {
      status: "Approved",
    };

    try {
      await axios.put(apiUrl, updatePayload);
      setData((prevData) =>
        prevData.map((item) =>
          item._id === _id ? { ...item, status: "Approved" } : item
        )
      );
      message.success("Leave request approved successfully");
    } catch (error) {
      message.error(`Failed to approve leave request: ${error.message}`);
    }
  };

  const edit = (key) => {
    const record = data.find((item) => item.key === key);
    if (record) {
      form.setFieldsValue({
        startDate: moment(record.startDate),
        endDate: moment(record.endDate),
        reason: record.reason,
      });
      setEditingKey(key);
    }
  };

  const confirmDelete = (key) => {
    const record = data.find((item) => item.key === key);
    if (record) {
      Modal.confirm({
        title: "Confirm Delete",
        content: "Are you sure you want to delete this leave request?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => deleteItem(record._id),
      });
    }
  };

  const deleteItem = async (_id) => {
    const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/leave-request/`;
    try {
      await axios.delete(`${apiUrl}${_id}`);
      setData((prevData) => prevData.filter((item) => item._id !== _id));
      message.success("Leave request deleted successfully");
    } catch (error) {
      message.error(`Failed to delete leave request: ${error.message}`);
    }
  };

  const onFinish = async (values) => {
    const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/leave-request/`;
    if (editingKey !== "") {
      const record = data.find((item) => item.key === editingKey);
      if (record) {
        try {
          await axios.put(`${apiUrl}${record._id}`, {
            ...values,
            startDate: values.startDate.toISOString(),
            endDate: values.endDate.toISOString(),
          });
          message.success("Leave request updated successfully");
          setData((prevData) =>
            prevData.map((item) =>
              item.key === editingKey ? { ...item, ...values } : item
            )
          );
          setEditingKey("");
          form.resetFields();
        } catch (error) {
          message.error(`Failed to update leave request: ${error.message}`);
        }
      }
    } else {
      try {
        const response = await axios.post(apiUrl, {
          ...values,
          employee: empid,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
        });
        setData([...data, { key: data.length.toString(), ...response.data }]);
        message.success("Leave request added successfully");
        fetchData();
      } catch (error) {
        message.error(`Failed to add leave request: ${error.message}`);
      }
    }
  };

  const generatePDF = () => {
    const columnsToExport = columns.filter(
      (col) => col.field !== "actions" && col.field !== "imageUrls"
    );
    const prepareDataForReport = (data) => {
      return data.map((menu) => {
        const rowData = {};
        columnsToExport.forEach((col) => {
          rowData[col.field] = menu[col.field];
        });
        return rowData;
      });
    };

    const reportData = prepareDataForReport(filteredData);
    exportToPDF(columnsToExport, reportData, {
      title: "Leave Tracking Report",
    });
  };

  return (
    <LayoutNew userType={loggedInUserType}>
      <Layout>
        <Content style={{ padding: "24px" }}>
          <Space
            style={{
              background: "#001529",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            <Space>
              <DollarCircleOutlined
                style={{ fontSize: "24px", marginRight: "8px" }}
              />
              <Title
                level={2}
                style={{ fontSize: "24px", marginTop: "8px", color: "white" }}
              >
                Leave Tracking
              </Title>
            </Space>
            <div style={{ marginLeft: "auto", marginRight: "20px" }}>
              <Space>
                <Button
                  type="primary"
                  icon={<FilePdfOutlined />}
                  onClick={generatePDF}
                >
                  Export to PDF
                </Button>
              </Space>
            </div>
          </Space>
          <br />
          <br />
          {userType !== "admin" && (
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[
                  { required: true, message: "Please select start date!" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: true, message: "Please select end date!" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="reason"
                label="Reason for Leave"
                rules={[
                  {
                    required: true,
                    message: "Please input the reason for leave!",
                  },
                ]}
              >
                <Input.TextArea placeholder="Describe the reason for leave" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {editingKey !== "" ? "Update" : "Submit"}
                </Button>
              </Form.Item>
            </Form>
          )}
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            onChange={handleSearchInputChange}
            style={{ marginRight: "8px", marginBottom: "10px" }}
          />
          <DataGrid
            columns={columns}
            rows={transformedRows}
            autoHeight
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default LeaveTrackingPage;
