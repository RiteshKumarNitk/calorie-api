"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(function () {
    console.log('MongoDB connected successfully');
    var port = parseInt(process.env.PORT || '3000');
    app.listen(port, function () {
        console.log("Server listening on port ".concat(port));
    });
})
    .catch(function (err) {
    console.error('MongoDB connection error:', err);
});
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
//# sourceMappingURL=index.js.map