import { PORT } from "./config/config.js";
import app from "./app.js";

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
