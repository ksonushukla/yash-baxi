// const mongoose = require('mongoose');
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// dotenv.config();



// const app = express();
// app.use(express.json())

// app.use(cors());

// const userRoute = require('./routes/userRoute');
// app.use("/user", userRoute);

// const categoryRoute = require('./routes/CategoryRoute');
// app.use("/category", categoryRoute);

// const ExpenseRoute = require('./routes/ExpenseRoute');
// app.use("/expense", ExpenseRoute);


// mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.db_name}`).then((res)=>{
//     console.log("Database connected successfully");
// }).catch((err)=>{
//     console.log("Database connection failed");
// })

// const PORT = process.env.PORT || 5000;
// app.listen(PORT,()=>{
//     console.log(`Server is running on port ${PORT}`);
// })

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/CategoryRoute');
const ExpenseRoute = require('./routes/ExpenseRoute');

app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/expense", ExpenseRoute);
    
// ✅ MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected successfully 🚀");
  })
  .catch((err) => {
    console.log("Database connection failed ❌", err.message);
  });

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});