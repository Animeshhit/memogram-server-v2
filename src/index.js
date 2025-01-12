require("dotenv").config();
const app = require("./app.js");
const PORT = process.env.PORT || "8080";

const connectToDataBase = require("./db/db.js");




connectToDataBase(() => {
    app.listen(PORT, () => {
        console.log(`server has started on port:${PORT}`);
    });
});
