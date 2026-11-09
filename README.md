# Learn Hypercore

An unofficial learning site for [Hypercore](https://github.com/holepunchto/hypercore), the secure, distributed append-only log. Not affiliated with Holepunch.

The home page is a live Merkle tree: append blocks, select one to see the hashes that verify it, forge one to see the signature check fail. The other pages cover the basics, the README's five features, getting started, a short API reference, runnable examples and advanced topics.

## Run it

```bash
npx serve .      # or: python3 -m http.server
```

Open the printed URL. Opening `index.html` directly will not work, because the data is loaded with `fetch`.

## How it is checked

```bash
npm install
npm run check
```

`scripts/check.mjs` fails the build if:

- an internal link points nowhere, a page requests an external font or script, or a banned phrase appears;
- an example in `data/examples.json` errors against the pinned hypercore, or prints something other than the output shown on the page (`npm run check:update` rewrites that output from a real run);
- a method, property or constant in `data/api.json` is missing from a real core;
- the demo's printed numbers (proof lengths, changed fingerprints) differ from the tree logic in `assets/merkle.js`.

The version the site was checked against is in `data/verified.json`. The demo uses SHA-256 so it runs in a browser; Hypercore uses BLAKE2b.

Design decisions and the review rounds are in [DESIGN-LOG.md](DESIGN-LOG.md).
