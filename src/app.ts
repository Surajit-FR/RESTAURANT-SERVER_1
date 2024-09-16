import express, { NextFunction, Request, Response } from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { EXPRESS_CONFIG_LIMIT } from "./constants";


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: EXPRESS_CONFIG_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: EXPRESS_CONFIG_LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());


// routes
import healthcheckRoute from "./routes/healthcheck.routes";
import permissionRoutes from "./routes/permission.routes";
import roleRoutes from "./routes/role.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";

// routes declaration
app.use("/api/v1/healthcheck", healthcheckRoute);
app.use("/api/v1/admin/permission", permissionRoutes);
app.use("/api/v1/admin/role", roleRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoutes);


app.get('/ping', (req: Request, res: Response) => {
    res.send("Hi!...I am server, Happy to see you boss...");
});
// Internal server error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(500).json({
        status: 500,
        message: "Server Error",
        error: err.message
    });
});
// Page not found middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        status: 404,
        message: "Endpoint Not Found"
    });
});


export { app };