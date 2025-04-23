const express = require('express')
const mongoose = require('mongoose')
const cervicalRotationRoute = require('./routes/CervicalRotation')
const lumbarFlexionRoute = require('./routes/LumbarFlexion')
const intermalleolarRoute = require('./routes/IntermalleolarDistance')
const cors=require("cors");
const bodyParser = require("body-parser")



// mongoose.connect("mongodb+srv://manishamehra2903:vishal@axialspondylitis.1uuy2.mongodb.net/test?retryWrites=true&w=majority")
mongoose.connect("mongodb+srv://manishamehra2903:vishal@cluster0.znjw60g.mongodb.net/test?retryWrites=true&w=majority")
    .then(() => {
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        const corsOptions = {
            origin: '*',
            credentials: true,
            optionSuccessStatus: 200,
        };
        app.use(cors(corsOptions));
        // app.use(bodyParser.json());
        app.use(cervicalRotationRoute);
        app.use(lumbarFlexionRoute);
        app.use(intermalleolarRoute);

        app.listen("3001", () => {
            console.log("server created");
        });
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });





