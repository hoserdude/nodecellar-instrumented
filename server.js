var express = require('express'),
    path = require('path'),
    http = require('http'),
    winston = require('winston'),
    Scarlet = require('scarlet'),
    wine = require('./routes/wines');

//Instrumentation Stuff

//Express Logger Setup
express.logger.token('rid', function (req, res) {
    if (!req.rid) {
        req.rid = Math.floor(Math.random() * 100000);
    } else {
        return req.rid;
    }
    return req.rid;
})

express.logger.token('sid', function (req, res) {
    return req.sessionID;
});
//Fix the formatting of the date to ISO/UTC
express.logger.token('date', function (req, res) {
    return new Date().toISOString();
});

express.logger.format('instrumented', ':date; sid=:sid; rid=:rid; ip=:remote-addr; m=:method; ' +
                        'u=:url; s=:status; ref=:referrer; ua=:user-agent; t=:response-time');

//Winston setup
winston.loggers.add('app', {
    console: {
        timestamp: true,
        colorize: false
    }
});

var winstonLogger = winston.loggers.get('app');

/*
 args - the arguments passed into the method
 methodName - the method name being intercepted
 object - the this context of the called method
 objectName - the name of the this context object
 executionEndDate - the start datetime of the method execution
 executionStartDate - the start datetime of the method execution
 result - result of the method called (populated after main method gets called)
 */
function methodInterceptor(proceed, invocation) {
    var result = proceed();
    var time = invocation.executionEndDate - invocation.executionStartDate;
    winstonLogger.info("object=" + invocation.objectName
        + "; method=" + invocation.methodName
        + "; time=" + time);
}

var notFound = function (req, res, next) {
    winstonLogger.warn('something embarrassing happened - page not found: ' + req.url);
    res.send("404", "Custom 404 page goes here");
};

var errorHandler = function (err, req, res, next) {
    winstonLogger.error('something terrible happened');
    res.send("500", "Custom 500 page goes here");
};

var app = express();
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.cookieParser("instrumented"));
    app.use(express.session({secret: "instrumented"}));
    app.use(express.logger('instrumented'));
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(notFound);
    app.use(errorHandler);
});

//Scarlet setup
var scarlet = new Scarlet('scarlet-winston');
//Intercept calls to the wine
scarlet.intercept(wine).using(methodInterceptor);

app.get('/populateDb', wine.populateDb);
app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
