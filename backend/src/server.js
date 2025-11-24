const app = require("./app");
const { port } = require("./config");

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}/`);
});
