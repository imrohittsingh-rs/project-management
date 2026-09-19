import dotenv from "dotenv";
import app from "./app.js";
import connectToDB from "./db/index.js";
import dns from "node:dns";

// console.log(await dns.getServers());
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 8000;

connectToDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });
