"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ioredis_1 = __importDefault(require("ioredis"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const express_session_1 = __importDefault(require("express-session"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const hello_1 = require("./resolvers/hello");
const constant_1 = require("./constant");
const User_1 = require("./entities/User");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield new typeorm_1.DataSource({
        type: 'postgres',
        database: 'discussme',
        username: 'postgres',
        password: 'root',
        logging: true,
        synchronize: true,
        entities: [User_1.User]
    });
    const app = (0, express_1.default)();
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redisClient = new ioredis_1.default();
    app.use((0, cors_1.default)({
        origin: 'http://localhost:3000',
        credentials: true
    }));
    app.use((0, express_session_1.default)({
        name: 'blablabla',
        store: new RedisStore({
            client: redisClient,
            disableTouch: true
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            secure: constant_1.__prod__,
            sameSite: 'lax'
        },
        secret: 'XQvnheUkLbeBqvhCjvLQsdPYP7vT9yGCL4bExbcmN5p',
        resave: false,
        saveUninitialized: false
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ req, res })
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });
    app.listen(5000, () => console.log(`Server is running on PORT 5000.`));
});
main().catch(err => {
    console.log(err);
});
