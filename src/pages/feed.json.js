import creativityTools from "../../public/creativity-tools/data.json";
import metadata from "../site-metadata.json";

export async function get(context) {
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    home_page_url: metadata.baseUrl,
    title: metadata.title,
    description: metadata.description,
    feed_url: `${metadata.baseUrl}/feed.json`,
    favicon: `${metadata.baseUrl}/favicon.svg`,
    // @TODO: UPDATE THIS ICON URL
    icon: `${metadata.baseUrl}/favicon.svg`,
    language: "en-US",
    authors: [{
      name: "Bryan Braun"
    }],

    items: creativityTools.sort((a, b) => {
        return a.dateAdded.replace('-', '').localeCompare(b.dateAdded.replace('-', ''));
      }).map(tool => ({
        id: tool.name,
        external_url: tool.link,
        title: tool.name,
        summary: tool.description,
        content_text: tool.description,
        image: `${metadata.baseUrl}/${tool.image || "default.png"}`,
        date_published: new Date(tool.dateAdded).toISOString(),
        // Placeholder, in case I ever add categories:
        // tags: ['tag1', 'tag2', 'tag3']
    })),
  };

  return {
    body: JSON.stringify(feed, null, 2)
  };
}
