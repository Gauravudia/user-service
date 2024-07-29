const express = require('express');
const routes = require('./routes');

const app = express();
app.use(express.json());
// app.use((req, res, next) => {
//     console.log('Incoming request:', req.method, req.originalUrl);
//     next();
// });
app.use('/users', routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
});
