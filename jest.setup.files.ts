import dotenv from "dotenv";
dotenv.config();

process.on("unhandledRejection", (err) => {
    fail(err);
});
