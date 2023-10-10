import rss from '@astrojs/rss';
import creativityTools from "../../public/creativity-tools/data.json";
import metadata from "../site-metadata.json";
import fs from 'fs';

export async function get(context) {
  return rss({
    title: metadata.title,
    description: metadata.description,
    site: metadata.baseUrl,
    customData: `<language>en-us</language>`,
    items: await Promise.all(creativityTools.map(async (tool) => ({
      title: tool.name,
      description: tool.description,
      pubDate: tool.dateAdded,
      link: tool.link,
      enclosure: {
        url: `${metadata.baseUrl}/${tool.image || "default.png"}`,
        type: "image/png",
        // "length" is the number of bytes in the image file
        length: (await fs.promises.stat(`./public/creativity-tools/${tool.image || "default.png"}`)).size,
      }
      // Placeholder, in case I ever add categories:
      // categories: ['Category 1', 'Category 2', 'Category 3'],
    }))),
  });
}
