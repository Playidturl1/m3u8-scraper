const { firefox } = require("playwright");
const express = require("express");
const app = express()

app.use(express.json())


function getM3u8(url) {
  return new Promise(async (resolve, reject) => {
    const browser = await firefox.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setExtraHTTPHeaders({
      Referer: url,
    });
    page.on("request", async (request) => {
      const URL = request.url();
      if (URL.endsWith(".m3u8")) {
        await browser.close();
        resolve(URL);
      }
    });
    console.log("fetching page");
    await page.goto(url);
    console.log("Waiting for m3u8 link");
    setTimeout(() => {
      reject("Timeout")
    }, 10000);
  });
}

app.get("/", async (req, res) => {
  res.send({
    success: true,
  });
})
app.get("/getm3u8", async (req, res) => {
  const m3u8 = await getM3u8(req.query.url);
  res.send({
    success: true,
    meu8: m3u8,
  });
})

app.listen(5555, () => {
  console.log("server is running on port 5555");
})