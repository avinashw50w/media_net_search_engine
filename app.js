require('dotenv').config();

const   express       = require('express'),
        path          = require('path'),
        routes        = require('./router'),
        bodyParser    = require('body-parser'),
        db            = require('./config/db');

const app = express();

const port = process.env.PORT || 3000;

app.set('port', port);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));
app.use(require('express-edge').engine);
app.set('views', path.join(__dirname, './views'));
app.use('/', routes);

function auth(req, res, next) {
    
    next();
}

async function run() {
    await db.connect(err => {    
        if (err) {
            throw err;
        }
        
        console.log('Connected to Database...');
        global.db = db;

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    });
}

run();
