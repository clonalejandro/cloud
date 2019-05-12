"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./App"));
const express_1 = __importDefault(require("express"));
const server = express_1.default();
const app = new App_1.default(server);
app.start(3000);
