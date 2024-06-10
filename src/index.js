import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { startLoadingAnimation, stopLoadingAnimation } from "./loading.js";
import { colorize } from "./color.js";

async function fetchLibraryInfo(libraryName) {
  try {
    const response = await fetch(
      `https://api.npms.io/v2/package/${libraryName}`
    );
    const data = await response.json();
    const { description, author, links, date } = data.collected.metadata;
    return {
      name: libraryName,
      description: description,
      author: author,
      homepage: links.homepage,
      repository: links.repository,
      lastPublish: date,
      isEmpty: false,
    };
  } catch (error) {
    return {
      name: libraryName,
      isEmpty: true,
    };
  }
}

function formatLibraryOutput(library, options) {
  let outputText = `- ${colorize(library.name, "cyan")}\n`;

  if (library.isEmpty) {
    return outputText + "\n";
  }
  if (options.desc) {
    outputText += `  Description: ${colorize(
      library?.description || "-",
      "green"
    )}\n`;
  }
  if (options.link) {
    outputText += `  Homepage: ${colorize(library.homepage || "-", "blue")}\n`;
    outputText += `  Repository: ${colorize(
      library.repository || "-",
      "blue"
    )}\n`;
  }
  if (options.author) {
    outputText += `  Author: ${colorize(
      library.author?.name || "-",
      "yellow"
    )}\n`;
  }
  if (options.publish) {
    outputText += `  Last Publish: ${colorize(
      library.lastPublish || "-",
      "magenta"
    )}\n`;
  }
  return outputText + "\n";
}

async function analyzeLibraryGroup(libraryGroup, groupName, options) {
  const libraryNames = Object.keys(libraryGroup);
  const libraryPromises = libraryNames.map(fetchLibraryInfo);
  const libraries = await Promise.all(libraryPromises);

  if (libraries.length > 0) {
    let outputText = `${colorize(`[${groupName}]`, "bold")}\n`;
    outputText += libraries
      .map((library) => formatLibraryOutput(library, options))
      .join("");
    return outputText;
  }

  return "";
}

async function analyzeLibraries(packageJsonPath, options) {
  const intervalId = startLoadingAnimation();
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  let outputText = "";

  if (!options.dev) {
    outputText += await analyzeLibraryGroup(
      dependencies,
      "Dependencies",
      options
    );
  }

  if (!options.noDev) {
    outputText += await analyzeLibraryGroup(
      devDependencies,
      "devDependencies",
      options
    );
  }

  stopLoadingAnimation(intervalId);
  console.log(outputText);
}

export default function analyzePackage(options) {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  analyzeLibraries(packageJsonPath, {
    ...options,
    desc: options.desc || !(options.link || options.author || options.publish),
    link: options.link || !(options.desc || options.author || options.publish),
    author:
      options.author || !(options.desc || options.link || options.publish),
    publish:
      options.publish || !(options.desc || options.link || options.author),
  });
}
