import { nh_server } from "../src/app.js";

const app = new nh_server("rest");

app.get("/", (_req, res) => {
    res.json({
        message: "NHSERVER is running",
        version: "1.0.0",
    });
});

app.get("/health", (_req, res) => {
    res.status(200).send("OK");
});

app.post("/users", (_req, res) => {
    res.status(201).json({
        id: 1,
        name: "Developer",
    });
});

const PORT = 3000;

await app.listen(PORT);
console.log(`Server listening on http://localhost:${PORT}`);
