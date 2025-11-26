const app = require("./app");
const { port } = require("./config");

app.listen(port, "0.0.0.0", () => {
  console.log("Servidor escuchando en http://0.0.0.0:3000");
});
