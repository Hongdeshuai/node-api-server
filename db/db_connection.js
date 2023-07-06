const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const settings = require('../config/base.js');
const logger = require('../logger.js');
const app = require('../app.js');
const path = require('path');
exports.connection;

// ------ start database connection ------
connectDB = function()  {
	const dbConnection = mongoose.createConnection('mongodb://' + settings.dbUrl, function(err){
		if(err) {
			logger.error(err);
			setTimeout(function() {
				console.log("Retry DB connection");
				connectDB();
			}, 3000);
		} else {
		    exports.connection = dbConnection;
			logger.info("MongoDB connected at: " + settings.dbUrl);

			require('./db_schema.js');
            require('../controllers/test.js');
            require('../controllers/auth.js');
            require('../controllers/internships.js');
            require('../controllers/hiredata.js');
            require('../controllers/applications.js');
            require('../controllers/reimbursements.js');
            require('../controllers/admins.js');
            require('../controllers/students.js');
            require('../controllers/employers.js');
		}

        // Redirect for frontend pages
        app.use('*', function (req, res, next) {
            if (req._parsedOriginalUrl) {
                url = req._parsedOriginalUrl.path;
                if(!url.startsWith('/api/') && url.indexOf('.') == -1) {
                    res.status(200).sendFile(path.resolve(__dirname + '//..//..//frontend//dist//index.html'));
                } else {
                    next();
                }
            } else {
                next();
            }
        });
	});

};

connectDB();