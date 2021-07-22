let MongoStore = require('connect-mongo');
let mongoose = require('mongoose');

const dbUrl = process.env.DBURL || 'mongodb://localhost:27017/logistiexdb';
const secret = process.env.SECRET || 'betterkeepitasasecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24*3600
});

store.on('error',(e) => {
    console.log('Error while connecting to mongo :',e);
});

mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex: true,
    useFindAndModify: false
});

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUnitialized: true
};

module.exports = sessionConfig;