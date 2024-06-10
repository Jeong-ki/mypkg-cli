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

function formatLibraryOutput(library) {
  if (library.isEmpty) {
    return `- ${colorize(library.name, "cyan")}\n\n`;
  } else {
    return (
      `- ${colorize(library.name, "cyan")}\n` +
      `  ${colorize("Description:", "bold")} ${colorize(
        library?.description || "-",
        "green"
      )}\n` +
      `  ${colorize("Homepage:", "bold")} ${colorize(
        library.homepage || "-",
        "blue"
      )}\n` +
      `  ${colorize("Repository:", "bold")} ${colorize(
        library.repository || "-",
        "blue"
      )}\n` +
      `  ${colorize("Author:", "bold")} ${colorize(
        library.author?.name || "-",
        "yellow"
      )}\n` +
      `  ${colorize("Last Publish:", "bold")} ${colorize(
        library.lastPublish || "-",
        "magenta"
      )}\n\n`
    );
  }
}

async function analyzeLibraryGroup(libraryGroup, groupName) {
  const libraryNames = Object.keys(libraryGroup);
  const libraryPromises = libraryNames.map(fetchLibraryInfo);
  const libraries = await Promise.all(libraryPromises);

  if (libraries.length > 0) {
    let outputText = `${colorize(`[${groupName}]`, "bold")}\n`;
    outputText += libraries.map(formatLibraryOutput).join("");
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
    outputText += await analyzeLibraryGroup(dependencies, "Dependencies");
  }

  if (!options.noDev) {
    outputText += await analyzeLibraryGroup(devDependencies, "devDependencies");
  }

  stopLoadingAnimation(intervalId);
  console.log(outputText);
}

export default function analyzePackage(options) {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  analyzeLibraries(packageJsonPath, options);
}
