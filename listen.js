const app = require("./app");

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("listening on 3000");
  }
});
