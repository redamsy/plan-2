import express from "express";
import bodyParser from "body-parser";
import pino from "express-pino-logger";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";

import userRoute from "./src/routes/user.route.js";
import productRoute from "./src/routes/product.route.js";
import catRoute from "./src/routes/cat.route.js";

const router = express.Router();

router.use("/user", userRoute);
router.use("/products", productRoute);
router.use("/cats", catRoute);

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino());

app.use("/api", router);

// app.get('/api/greeting', (req, res) => {
//   try {
//     console.log("app.js: req.query", req.query);
//     console.log("app.js: req.query.name", req.query.name);
//     const name = req.query.name || 'catalogue World';
//     res.setHeader('Content-Type', 'application/json');
//     // res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
//     res.send({ greeting: `Hello ${name}!` });
//   } catch (error) {
//     var errMessage = `${error}`;
//     processErrorResponse(res, 500, errMessage);    
//   }
// });

// function processErrorResponse(res, statusCode, message) {
// 	console.log(`${statusCode} ${message}`);
// 	res.status(statusCode).send({
// 		error: {
// 			status: statusCode,
// 			message: message
// 		},
// 	});
// }

// app.listen(app.get('port'), () =>
//   console.log('Express server is running on', app.get('port'))
// );

const port = process.env.API_PORT || 3001;

const server = http.createServer(app);

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Mongodb connected");
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}).catch((err) => {
  console.log({ err });
  process.exit(1);
});


// export default app;