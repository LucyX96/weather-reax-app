require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { WeatherRepository } = require('./repositories');
const { GeocodingService, ForecastService } = require('./services');
const { GeocodingController, ForecastController } = require('./controllers');
const {
  validateGeocode,
  validateWeather,
  validateForecast,
  handleValidationErrors,
  errorHandler,
} = require('./middleware');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Initialize repositories, services, and controllers
const weatherRepository = new WeatherRepository(
  process.env.WEATHER_API_KEY,
  process.env.WEATHER_API_URL || 'https://api.open-meteo.com',
  process.env.WEATHER_GEOCODE_URL || 'https://geocoding-api.open-meteo.com'
);

const geocodingService = new GeocodingService(weatherRepository);
const forecastService = new ForecastService(weatherRepository);

const geocodingController = new GeocodingController(geocodingService);
const forecastController = new ForecastController(forecastService);

// Routes
app.get(
  '/api/geocode',
  validateGeocode,
  handleValidationErrors,
  (req, res, next) => geocodingController.geocode(req, res, next)
);

app.get(
  '/api/weather',
  validateWeather,
  handleValidationErrors,
  (req, res, next) => forecastController.getWeather(req, res, next)
);

app.get(
  '/v1/forecast',
  validateForecast,
  handleValidationErrors,
  (req, res, next) => forecastController.getForecast(req, res, next)
);

// Global error handler
app.use(errorHandler);

module.exports = app;
