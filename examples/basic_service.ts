import { nh_server as nhserver } from "../src/app.ts";

const app = new nhserver("rest");

app.get("/", (_request, response) => {
    response.send(
        "hola desde nhserver :)"
    );
});

app.get("/user", (req, res) => {
    res.json({
        "name": "andrew",
        "age": 20
    })
})

await app.listen(1899);

console.log("Sever running on http://localhost:1899");
