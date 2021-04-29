// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/Trackertools";
//const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://Christian:amiga#1forever@cluster0.hnbt9.mongodb.net/trackertools?retryWrites=true&w=majority";

mongoose.connect(
  MONGO_URI, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
)
  .then(
    (x) => {
      console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
    }
  )
  .catch(
    (err) => {
      console.error("Error connecting to mongo: ", err);
    }
  );