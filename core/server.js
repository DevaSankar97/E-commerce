const app = require('./app');
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/db');

dotenv.config({path:path.join(__dirname,'config/config.env')});
connectDatabase();

app.listen(process.env.PORT,()=>{
    console.log(`This is listen ${process.env.PORT} in ${process.env.NODE_ENV}`);
})