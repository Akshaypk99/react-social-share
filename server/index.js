const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const BaseURL = "https://zogglobaltest.com"
const PORT = process.env.PORT || 3000;

const app = express();


const metaData = {
    title: "Zog Global",
    description: "Zog Global",
    metaImage: "",
    metaSiteName: "@zogglobal",
};

app.get("*", async (req, res, next) => {
  if (req.url.includes(".")) {
    return next();
  }

  console.log(req.path);
  const filePath = path.resolve(__dirname, "..", "build", "index.html");
  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      return console.log(err);
    }

    let title = metaData.title;
    let description = metaData.description;
    let metaImage = metaData.metaImage;
    let metaSiteName = metaData.metaSiteName;

    
    if (req.path.startsWith("/page1/")) {
      const id = req.path.split("/")[2]; // Get the id from the path
      if (id && id !=='undefined') {
        try {
          const response = await axios.get(`${BaseURL}/blogs/${id}`);
          title = response.data.title;
          metaImage = response.data.image_url;
          description = response.data.description;
          
        } catch (error) {
          console.error("Error fetching page data:", error.message);
        }
      }
    }

    // Append additional meta tags
    let modifiedData = data.replace("</head>", `
      <meta name="description" content="${description}"/>
      <meta property="og:description" content="${description}"/>
      <meta property="og:title" content="${title}"/>
      <meta property="og:image" content="${metaImage}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="${metaSiteName}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${metaImage}" />
      <meta name="twitter:image:width" content="1200" />
      <meta name="twitter:image:height" content="630" />
    </head>`);

    res.type('text/html').send(modifiedData);
  });
});


app.use(express.static(path.resolve(__dirname, "..", "build")));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
