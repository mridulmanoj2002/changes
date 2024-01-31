import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./Routes/AdminRoute.js";
import EmployeeRouter from "./Routes/EmployeeRoute.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", router);
app.use("/employee", EmployeeRouter);
app.use(express.static("Public"));

app.listen(3000, () => {
  console.log("Server is running");
});
