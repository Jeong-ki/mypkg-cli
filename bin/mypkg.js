#!/usr/bin/env node

import analyzePackage from "../src/index.js";

const options = {
  dev: process.argv.includes("--dev"),
  noDev: process.argv.includes("--no-dev"),
};

analyzePackage(options);
