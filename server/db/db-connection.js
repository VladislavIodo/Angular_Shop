const mongoose = require("mongoose");

const dbUser = "Admin-Artur";
const dbPass = "cAXMYycfkFNwoUzP";
const dbUrl = `mongodb+srv://${dbUser}:${dbPass}@carpenter.1eshj.mongodb.net/Carpenter?retryWrites=true&w=majority`;

const connectDatabase = () => {
  mongoose.connect(dbUrl)
    .then(() => console.log("Connected to DB!"))
    .catch((error) => {
      console.error("Connection failed!", error.message);
      process.exit(1);
    })
};

module.exports = connectDatabase;
