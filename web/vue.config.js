const port = 8080; // dev port
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  devServer: {
    port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
  },
};