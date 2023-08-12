import rss from '@astrojs/rss';
import creativityTools from "../creativity-tools.json";
import metadata from "../site-metadata.json";
import fs from 'fs';

export async function get(context) {
  return rss({
    title: metadata.title,
    description: metadata.description,
    site: context.site,
    customData: `<language>en-us</language>`,
    items: await Promise.all(creativityTools.map(async (tool) => ({
      title: tool.name,
      description: tool.description,
      pubDate: tool.dateAdded,
      link: tool.link,
      enclosure: {
        url: `${context.site}${tool.image}`,
        type: "image/png",
        // "length" is the number of bytes in the image file
        length: (await fs.promises.stat(`./public/${tool.image}`)).size,
      }
      // Placeholder, in case I ever add categories:
      // categories: ['Category 1', 'Category 2', 'Category 3'],
    }))),
  });
}
