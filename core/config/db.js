const mongoose = require('mongoose');

const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_LOCAL_URL)
        .then((con) => console.log(`DB Connected to the host : ${con.connection.host} and DB is : ${con.connection.name}`))
        .catch((err) => console.error(`Error connecting to database ${err}`));
};

module.exports = connectDatabase;  
