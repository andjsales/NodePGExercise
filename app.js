/** BizTime express application. */
const express = require("express");
const app = express();
const ExpressError = require("./expressError");
const invoiceRoutes = require('./routes/invoices');
const companyRoutes = require('./routes/companies');
const industryRoutes = require('./routes/industries');

app.use(express.json());
app.use('/invoices', invoiceRoutes);
app.use('/companies', companyRoutes);
app.use('/industries', industryRoutes);

/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

// app.listen(3000, function () {
//   console.log('Server is running on port 3000');
// });

module.exports = app;
