const app = require("./app");
const { PORT = 3000 } = process.env;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening on ${PORT}...`);
  }
});
