# Contributing

## Contributing a creativity tool

You can recommend a tool by [opening an issue](https://github.com/bryanbraun/lets-get-creative/issues/new), or (even better) creating a pull request adding it to [the data file](https://github.com/bryanbraun/lets-get-creative/blob/main/public/creativity-tools/data.json).

Each recommendation should include a tool name, short description, link, and image (800x200px).

### Criteria

In order for a tool to be added to this collection, it must meet the following criteria:

* Online: accessible at a URL and usable in your web-browser (Chromebook-friendly!)
  * ❌ [The Powder Toy](https://powdertoy.co.uk/), [Algodoo](http://www.algodoo.com/)
  * ✅ [Sandspiel](https://sandspiel.club/), [The Blob Toy](https://oimo.io/works/blob/)
* Low friction: free to use and doesn't require an account (at least for basic functionality)
  * ❌ [Scratch](https://scratch.mit.edu/), [TinkerCad](https://www.tinkercad.com/)
  * ✅ [MakeCode Arcade](https://arcade.makecode.com/), [Blockbench](https://web.blockbench.net/)
* Shareable: creations can be saved or shared (via share url, downloadable image, etc)
  * ❌ [Beat Maker](https://beatmaker.keenweb.io/), [Fluid Simulation](https://paveldogreat.github.io/WebGL-Fluid-Simulation/)
  * ✅ [Song Maker](https://musiclab.chromeexperiments.com/Song-Maker), [Sand Art](https://sandart.app/)
* High-quality: the tool is safe for all ages and doesn't have pop-ups or excessive ads
  * ❌ [ChangeFaces](https://www.changefaces.com/)
  * ✅ [Kid Pix](https://kidpix.app/)

Also consider these guidelines:

* Tools should be focused on user-creation, not consumption or interactive learning
  * ❌ [slither.io](https://slither.io/), [NandGame](https://nandgame.com/)
  * ✅ [Line Rider](https://www.linerider.com/)
* Tools should allow "demo-worthy" creative expression (avoid adding design utilities or work tools)
  * ❌ [Gradient Maker](https://coolors.co/gradient-maker), [Regex 101](https://regex101.com/)
  * ✅ [iiisometric](https://fffuel.co/iiisometric/), [ShaderToy](https://www.shadertoy.com/new)

I understand that these criteria are somewhat subjective and there are exceptions. If you're not sure if something qualifies, just submit it and I'll let you know. I try to err on the side of accepting submissions.

## Running this site locally

1. Pull down the branch with git
2. Install dependencies: `npm install`
3. Run the site: `npm start`

Here's the full list of commands:

| Command                   | Action                                       |
| :------------------------ | :------------------------------------------- |
| `npm install`             | Installs dependencies                        |
| `npm start`               | Starts local dev server at `localhost:3000`  |
| `npm run build`           | Build your production site to `./dist/`      |
| `npm run preview`         | Preview your build locally, before deploying |
| `npm run astro -- --help` | Get help using the Astro CLI                 |

