const express = require('express');
const bodyParser = require('body-parser')
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

/*
  Global MiddleWares
*/
app.use(express.static("public"));
app.use(cors);
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(compression());
app.use(bodyParser.json()); // to support JSON-encoded bodies  
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString;
});
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/*
  Routes
*/
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/*
  Global Error Handler/Controller
*/
app.use(globalErrorHandler);

module.exports = app;