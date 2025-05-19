import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.render("index");
});

app.post("/joke", async (req, res) => {
    let { category, name } = req.body;
    category = category && category.trim() ? category.trim() : "Any";

    name = name && name.trim() ? name.trim() : "";

    const url = `https://v2.jokeapi.dev/joke/${category}?safe-mode`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        let joke = "";

        if (data.type === "single") {
            joke = data.joke;
        } else if (data.type === "twopart") {
            joke = `${data.setup} - ${data.delivery}`;
        } else {
            joke = "No jokes found.";
        }

        if (name.length > 0) {
            const regex = /Chuck Norris/gi;
            joke = joke.replace(regex, name);
        }

        res.render("jokes", { name, joke });
    }
    catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
            error: "No Jokes that match your criteria."
        });
    }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
