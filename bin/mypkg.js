#!/usr/bin/env node

import displayHelp from "../src/help.js";
import analyzePackage from "../src/index.js";

const options = {
  dev: process.argv.includes("--dev") || process.argv.includes("-D"),
  noDev: process.argv.includes("--no-dev") || process.argv.includes("-N"),
  desc: process.argv.includes("--desc") || process.argv.includes("-d"),
  link: process.argv.includes("--link") || process.argv.includes("-l"),
  author: process.argv.includes("--author") || process.argv.includes("-a"),
  publish: process.argv.includes("--publish") || process.argv.includes("-p"),
  help: process.argv.includes("--help") || process.argv.includes("-h"),
};

if (options.help) {
  displayHelp();
} else {
  analyzePackage(options);
}
