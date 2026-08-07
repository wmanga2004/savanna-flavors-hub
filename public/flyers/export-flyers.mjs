import { chromium } from "playwright";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const files = [
  ["flyer-market.html", "flyer-market.png"],
  ["flyer-community.html", "flyer-community.png"],
];

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });

for (const [html, png] of files) {
  const url = pathToFileURL(path.join(dir, html)).href;
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.locator(".flyer").screenshot({
    path: path.join(dir, png),
    type: "png",
  });
  console.log("wrote", png);
}

await browser.close();
