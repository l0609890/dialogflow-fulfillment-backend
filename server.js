const express = require("express");
const app = express();
const axios = require("axios");

//bodyparser middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to the dialogflow weather bot");
});

app.post("/", (req, res) => {
  let city = req.body.queryResult.parameters["geo-city"];
  let url = `https://samples.openweathermap.org/data/2.5/weather?q=${city}&appid=908e350e0f54feebb119c17739cd2e1b`;
  axios
    .get(url)
    .then(response => {
      let conditions = response.data.weather[0].main;
      let temp = response.data.main.temp;
      let textResponse = `In ${city}, it is ${temp} degrees Kelvin and ${conditions}`;
      res.send(createTextResponse(textResponse));
    })
    .catch(err => console.log(err));
});

//create text response that will be a way for dialog to accept as a reponse

function createTextResponse(textResponse) {
  let response = {
    fulfillmentText: "This is a text response",
    fulfillmentMessages: [
      {
        text: {
          text: [textResponse]
        }
      }
    ],
    source: "example.com",
    payload: {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [
            {
              simpleResponse: {
                textToSpeech: "this is a simple response"
              }
            }
          ]
        }
      },
      facebook: {
        text: "Hello, Facebook!"
      },
      slack: {
        text: "This is a text response for Slack."
      }
    }
  };
  return response;
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server has started at port 3000");
});

//key for the open weather
//1537c438c10baa46c61b7ac56b1048ee
