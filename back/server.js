const express = require("express");
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.post("/review", (req, res) => {
  const { reviewerName, productId, rating, comment} = req.body;
  const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

  if(!data.users[reviewerName]) {
    data.users[reviewerName] = [];
  }

  data.users[reviewerName].push({
    productId,
    rating, 
    comment,
    date: new Date().toISOString()
  });

  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
  res.send("review is saved!");
});

app.get("/reviews/product/:productId", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  const allReviews = [];

  for(const reviewerName in data.users) {
    const userReviews = data.users[reviewerName];

    userReviews.forEach(rev => {
      if(rev.productId == req.params.productId) {
        allReviews.push({
          ...rev,
          reviewerName
        });
      }
    });
  }
  res.json(allReviews);
});

app.get("/reviews/user/:user", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

    const user = req.params.user;

    const userReviews = data.users[user];

    
  res.json(userReviews);
});



app.listen(PORT, () => {
  console.log(`server is running`);
})