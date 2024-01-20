const mongoose = require('mongoose');
const dbConnect = require('./db');
const ApiKey = require('./models/apikey');

// dbConnect.on("connected", () => {
//     const user = new ApiKey({ user: "admin" });
//     user.save((err, user) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(user + "Apikey: " + user.apiKey);
//         }
//         dbConnect.disconnect();
//     });
// });

const mongoose = require('mongoose');
const dbConnect = require('./db');
const ApiKey = require('./models/apikey');

dbConnect.on("connected", async () => {
    try {
        const user = new ApiKey({ user: "admin" });
        await user.save();
        console.log("ApiKey: " + user.apiKey);
    } catch (err) {
        console.error(err);
    }
});
