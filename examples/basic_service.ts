import { nh_server as nhserver } from "../src/app.ts";

const app = new nhserver("rest");

// Global middleware example
app.use(async (req, res, next) => {
    res.set_header("X-Powered-By", "NHSERVER");
    await next();
});


app.get("/", (_request, response) => {
    response.send(
        "hola desde nhserver :)"
    );
});

app.get("/user", (req, res) => {
    res.json({
        "name": "andrew",
        "age": 20
    });
});

app.post("/user", async (req, res) => {
    const data = await req.json<{ name: string; age: number }>();

    res.status(201).json({
        message: "User created successfully",
        received: data,
    });
});

app.get("/search", (req, res) => {
    res.json({
        query: req.query,
    });
});

app.get("/user/:id", (req, res) => {
    res.json({
        user_id: req.params.id,
        status: "found",
    });
});



await app.listen(1899);

console.log("Sever running on http://localhost:1899");

