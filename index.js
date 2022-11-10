const express = require("express");
const morgan = require("morgan");
const { client } = require("./db/index");

const app = express();

client.connect();

app.use(morgan("dev"));

const staticMiddleware = express.static(path.join(__dirname, "public"));
app.use(staticMiddleware);

app.get("/", (req, res, next) => {
    res.send(`<h1>I really like github!</h1>`);
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});