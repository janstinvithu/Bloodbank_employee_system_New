const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const userRoutes = require("./src/users/users.routes");
const employeeRoutes = require("./src/employees/employee.routes");
const attendanceRoutes = require("./src/attendance/attendance.routes");
const leaveRequestRoutes = require("./src/leave-request/leave-request.routes");
const payrollRoutes = require("./src/payroll/payroll.routes");
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave-request", leaveRequestRoutes);
app.use("/api/payroll", payrollRoutes);
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await connectToDatabase();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
});
