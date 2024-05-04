import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Space,
  Form,
  message,
  DatePicker,
  Input,
} from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import "jspdf-autotable";
import moment from 'moment';
import { exportToPDF } from "../Common/report";
import { DataGrid } from "@mui/x-data-grid";
import LayoutNew from "../Layout";
import axios from "axios";
import { formatDate, formatDateOnly } from "../Common/date";
const { Title } = Typography;
const Attendance = () => {
  const token = localStorage.getItem("userId");
  const empid = localStorage.getItem("empid");
  const userType = localStorage.getItem("loggedInUserType");
  const [attendance, setAttendance] = useState({
    employee: empid,
    date: moment().format("YYYY-MM-DD"),
    startTime: null,
    endTime: null,
    status: "",
    remarks: "",
  });
  const [records, setRecords] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [todayRecord, setTodayRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // For Edit

  const [filteredData, setFilteredData] = useState([]);
  const fetchRecords = async () => {
    try {
      let apiUrl;
      if (userType === "admin") {
        apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/attendance/`;
        const response = await axios.get(apiUrl);
        const modifiedData = await Promise.all(
          response.data.data.map(async (item, index) => {
            let employeeName = ""; // Initialize employee name to an empty string
            if (item.employee) { // Check if employeeId exists
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
              
            };
          })
        );
        setRecords(modifiedData);
      } else {
        apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/attendance/user/${empid}`;
        const response = await axios.get(apiUrl);
        setRecords(response.data.data);
        foundRecordForToday(response.data.data);
      }
     
    } catch (error) {
      message.error("Failed to fetch records: " + error.message);
    }
  };

 
  const foundRecordForToday = (records) => {
    const today = new Date();
    const todayDate = formatDateOnly(today);

    console.log(todayDate);

    const foundTodayRecord = records.find((record) => {
      const recordDate = formatDateOnly(record.date);
      return recordDate === todayDate;
    });

    console.log(foundTodayRecord);

    if (foundTodayRecord) {
      setTodayRecord(foundTodayRecord);
      return foundTodayRecord
    } else {
      console.log("No record found for today.");
      return null
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleApprove = async (recordId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/attendance/${recordId}`;
      const response = await axios.put(apiUrl, { remarks: "Approved" });
      if (response.data) {
        setRecords((prevRecords) =>
          prevRecords.map((record) =>
            record._id === recordId ? { ...record, status: "Approved" } : record
          )
        );
        message.success("Attendance approved successfully");
        fetchRecords();
      }
    } catch (error) {
      message.error(
        "Failed to approve attendance: " +
          (error.response?.data?.message || error.message)
      );
    }
  };
  const handleCheckIn = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/attendance/`;
      const fullStartTime = moment().toISOString();
      const response = await axios.post(apiUrl, {
        ...attendance,
        startTime: fullStartTime,
        status: "Present",
      });

      if (response.data) {
        message.success(
          "Check-in recorded at " + moment(fullStartTime).format("HH:mm A")
        );
        fetchRecords();
      }
    } catch (error) {
      message.error(
        "Error recording check-in: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleCheckOut = async () => {
    const foundTodayRecord = foundRecordForToday(records);

    try {
      const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/attendance/${foundTodayRecord?._id}`;

      const fullEndTime = moment().toISOString(); // Get current date and time in ISO format
      const response = await axios.put(apiUrl, {
        endTime: fullEndTime, // Send full ISO date-time string
      });

      if (response.data) {
        message.success(
          "Check-out recorded at " + moment(fullEndTime).format("HH:mm A")
        );
        fetchRecords();
      }
    } catch (error) {
      message.error(
        "Error recording check-out: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleFormChange = (changedValues, allValues) => {
    setAttendance({ ...attendance, ...changedValues });
  };
  const columns = [
    ...(userType === "admin"
      ? [
          {
            field: "employeeName",
            headerName: "Employee Name",
            width: 150,
          },
        ]
      : []),
    {
      field: "date",
      headerName: "Date",
      width: 150,
      renderCell: (params) => formatDateOnly(params.value),
    },
    {
      field: "startTime",
      headerName: "Start Time",
      width: 130,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "endTime",
      headerName: "End Time",
      width: 130,
      renderCell: (params) => (params.value ? formatDate(params.value) : ""),
    },
    { field: "status", headerName: "Status", width: 120 },
    { field: "remarks", headerName: "Remarks", width: 200 },
    {
      field: "totalHours",
      headerName: "Total Hours",
      width: 130,
      valueGetter: (params) => {
        if (params.row.startTime && params.row.endTime) {
          const start = moment(params.row.startTime);
          const end = moment(params.row.endTime);
          const duration = moment.duration(end.diff(start));
          return duration.asHours().toFixed(2) + " hours";
        }
        return "";
      },
    },
    ...(userType === "admin"
      ? [
          {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params) =>
              params.row.remarks !== "Approved" && (
                <Button
                  onClick={() => handleApprove(params.row.id)}
                  type="primary"
                >
                  Approve
                </Button>
              ),
          },
        ]
      : []),
  ];
  const [loggedInUserType, setLoggedInUserType] = useState("");

const generatePDF = () => {
    const columnsToExport = columns.filter(
      (col) => col.field !== "actions" && col.field !== "imageUrls" 
      && col.field !== "startTime" && col.field !== "endTime"
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
      title: " Daily  Report",
    });
  };

  useEffect(() => {
    const userType = localStorage.getItem("loggedInUserType");
    if (userType) {
      setLoggedInUserType(userType);
    }
  }, []);
  const filterData = () => {
    const filtered = records.filter((row) => {
      const orderAttributesMatch = Object.values(row).some((value) =>
        value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [searchQuery, records]);
  const transformedRows = filteredData.map((row, index) => ({
    id: row._id, // or any other property that can uniquely identify the row
    ...row,
  }));

  return (
    <LayoutNew userType={loggedInUserType}>
      <div style={{ padding: "24px" }}> <Space
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
                Attendance Tracking
              </Title>
            </Space>
            <div style={{ marginLeft: "auto", marginRight: "20px" }}>
              {/* Export buttons */}
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
          <br/>
        <Form
          layout="vertical"
          initialValues={attendance}
          onValuesChange={handleFormChange}
        >
          <Form.Item>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              onChange={handleSearchInputChange}
              style={{ marginRight: "8px", marginBottom: "10px" }}
            />
          </Form.Item>
        </Form>
        <Form
          layout="vertical"
          initialValues={attendance}
          onValuesChange={handleFormChange}
        >
          {userType === "user" && (
            <Form.Item>
              <Space>
                {!todayRecord && (
                  <Button
                    type="primary"
                    onClick={handleCheckIn}
                    icon={<CheckCircleOutlined />}
                  >
                    Check In
                  </Button>
                )}
                <Button
                  type="danger"
                  onClick={handleCheckOut}
                  icon={<ClockCircleOutlined />}
                >
                  Check Out
                </Button>
              </Space>
            </Form.Item>
          )}
        </Form>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={transformedRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </div>
      </div>
    </LayoutNew>
  );
};

export default Attendance;
