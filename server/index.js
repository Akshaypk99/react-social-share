const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const PORT = process.env.PORT || 3000;

const app = express();
const BaseURL = "https://zogglobaltest.com"

function replacePlaceholders(data, title, description, metaImage, metaSiteName) {
  return data
    .replace(/__TITLE__/g, title)
    .replace(/__DESCRIPTION__/g, description)
    .replace(/__META_IMAGE__/g, metaImage)
    .replace(/__SITE_NAME__/g, metaSiteName);
}

// Example blog data (replace it with your actual data fetching logic)
const metaData = {
    title: "Zog Global",
    description: "Zog Global",
    metaImage: "",
    metaSiteName: "@zogglobal",
};

app.get("*", async (req, res, next) => {
  // If the request is for a static file, skip processing and serve the file directly
  if (req.url.includes(".")) {
    return next();
  }

  const filePath = path.resolve(__dirname, "..", "build", "index.html");
  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      return console.log(err);
    }

    let title = metaData.title;
    let description = metaData.description;
    let metaImage = metaData.metaImage;
    let metaSiteName = metaData.metaSiteName;

    // Get the title and description based on the route
    if (req.path.startsWith("/page1/")) {
      const id = req.path.split("/")[2]; // Get the id from the path
      try {
        const response = await axios.get(`${BaseURL}/blogs/${id}`);
        // console.log(response.data);
        title = response.data.title;
        metaImage = response.data.image_url;
        description = response.data.description; // Assuming there's a description
        
      } catch (error) {
        console.error("Error fetching page data:", error);
      }
    }

    console.log(title, description, metaImage, metaSiteName)
    const modifiedData = replacePlaceholders(data, title, description,metaImage, metaSiteName);
    res.send(modifiedData);
  });
});

// Serve static files
app.use(express.static(path.resolve(__dirname, "..", "build")));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
