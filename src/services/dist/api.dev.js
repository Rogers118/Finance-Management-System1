"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.aiApi = exports.generalApi = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

var api = _axios["default"].create({
  baseURL: "".concat(API_URL, "/api")
});

api.interceptors.request.use(function (config) {
  var token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = "Bearer ".concat(token);
  }

  return config;
});
var generalApi = api;
exports.generalApi = generalApi;
var aiApi = {
  getOverview: function getOverview(token) {
    return _axios["default"].get("".concat(API_URL, "/api/ai/overview"), {
      headers: {
        Authorization: "Bearer ".concat(token)
      }
    });
  },
  getForecast: function getForecast(data, token) {
    return _axios["default"].post("".concat(API_URL, "/api/ai/forecast"), data, {
      headers: {
        Authorization: "Bearer ".concat(token)
      }
    });
  },
  getAdvice: function getAdvice(data, token) {
    return _axios["default"].post("".concat(API_URL, "/api/ai/advice"), data, {
      headers: {
        Authorization: "Bearer ".concat(token)
      }
    });
  }
};
exports.aiApi = aiApi;
var _default = api;
exports["default"] = _default;