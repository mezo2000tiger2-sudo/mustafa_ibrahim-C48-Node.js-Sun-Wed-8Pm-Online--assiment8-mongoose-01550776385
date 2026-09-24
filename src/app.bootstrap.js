import express from "express";
import connectDb from "./DB/connectionDb.js";
import userRouter from "./DB/modules/users/users.controller.js";
import notesRouter from "./DB/modules/notes/notes.controller.js";
const port = 3000;
const app  = express();
const bootstrap = async () => {

    await connectDb(port, app);
    app.use(express.json());

    app.use('/users', userRouter);
    app.use('/notes', notesRouter);
    app.use('{*demo}', (req, res) => {
        res.status(404).send(`the endpoint ${req.originalUrl} and the method ${req.method} are not found`);
    });
}
export default bootstrap;