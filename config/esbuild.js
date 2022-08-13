import esbuild from "esbuild";

const entryPoints = [
  "src/sw.ts",
  "src/scripts/scrapper.ts",
  "src/scripts/scrapCandidates.ts",
  "src/scripts/popup.ts",
];

const { DEPLOYMENT } = process.env;

esbuild
  .build({
    entryPoints,
    watch: DEPLOYMENT === "DEV",
    bundle: true,
    outdir: "dist",

    minify: true,

    allowOverwrite: true,
    logLevel: DEPLOYMENT === "DEV" ? "debug" : "silent",
  })
  .then((response) => console.log(JSON.stringify(response)))
  .catch((err) => console.log(err));
