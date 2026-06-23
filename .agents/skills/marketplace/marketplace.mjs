#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { randomUUID } from "crypto";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MARKETPLACE_PATH = resolve(__dirname, "../../../public/marketplace.json");

function readMarketplace() {
  return JSON.parse(readFileSync(MARKETPLACE_PATH, "utf-8"));
}

function writeMarketplace(data) {
  data.products.sort((a, b) => a.title.localeCompare(b.title));
  writeFileSync(MARKETPLACE_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function findProductIndex(data, identifier) {
  return data.products.findIndex(
    (p) => p.uuid === identifier || p.title.toLowerCase() === identifier.toLowerCase()
  );
}

const [action, ...args] = process.argv.slice(2);

if (!action) {
  console.error("Usage: marketplace.mjs <add|edit|remove|notify|list> [args...]");
  process.exit(1);
}

const data = readMarketplace();

switch (action) {
  case "add": {
    const [title, url, coverImage] = args;
    if (!title || !url || !coverImage) {
      console.error("Usage: marketplace.mjs add <title> <url> <coverImage>");
      process.exit(1);
    }
    const product = { uuid: randomUUID(), title, url, coverImage };
    data.products.push(product);
    writeMarketplace(data);
    console.log(`Added: ${title} (${product.uuid})`);
    break;
  }

  case "edit": {
    const [identifier, field, ...valueParts] = args;
    const value = valueParts.join(" ");
    if (!identifier || !field || !value) {
      console.error("Usage: marketplace.mjs edit <uuid|title> <field> <value>");
      process.exit(1);
    }
    const idx = findProductIndex(data, identifier);
    if (idx === -1) {
      console.error(`Product not found: ${identifier}`);
      process.exit(1);
    }
    if (!["title", "url", "coverImage"].includes(field)) {
      console.error(`Invalid field: ${field}. Must be one of: title, url, coverImage`);
      process.exit(1);
    }
    data.products[idx][field] = value;
    writeMarketplace(data);
    console.log(`Updated ${field} for: ${data.products[idx].title}`);
    break;
  }

  case "remove": {
    const [identifier] = args;
    if (!identifier) {
      console.error("Usage: marketplace.mjs remove <uuid|title>");
      process.exit(1);
    }
    const idx = findProductIndex(data, identifier);
    if (idx === -1) {
      console.error(`Product not found: ${identifier}`);
      process.exit(1);
    }
    const removed = data.products.splice(idx, 1)[0];
    writeMarketplace(data);
    console.log(`Removed: ${removed.title}`);
    break;
  }

  case "notify": {
    const message = args.join(" ");
    data.notification = message;
    writeMarketplace(data);
    console.log(`Notification set: "${message}"`);
    break;
  }

  case "list": {
    console.log(JSON.stringify(data, null, 2));
    break;
  }

  default:
    console.error(`Unknown action: ${action}`);
    console.error("Available actions: add, edit, remove, notify, list");
    process.exit(1);
}
