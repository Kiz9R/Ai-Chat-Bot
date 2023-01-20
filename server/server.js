import express from "express";
import * as dotevn from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotevn.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello Cheater",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 512,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // REMAINING TIME
    var resetTime = response.headers["x-ratelimit-reset"];
    var remaining = response.headers["x-ratelimit-remaining"];
    if (resetTime)
      console.log("Rate limit will reset at " + new Date(resetTime * 1000));
    if (remaining) console.log("Remaining requests: " + remaining);
    else console.log("Remaining requests: not provided by the API");

    // CALLING THE CHOICE
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({ err });
  }
});

app.listen(5000, () =>
  console.log("Server is running on port http://localhost:5000")
);
