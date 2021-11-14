const { Schema, model } = require("mongoose");
const getproperties = require("./getProperties");

const MonitoringSchema = new Schema(getproperties(), {
  timestamps: true,
});

module.exports = model("Monitoring", MonitoringSchema);
