---
name: marketplace
description: >-
  Manages public/marketplace.json: add, edit, remove products, or update the notification banner.
  Use this skill when the user wants to add a product, update product details (title, URL, cover image),
  remove a product from the marketplace, or modify the notification banner. Triggers on requests like
  "add a product to marketplace", "update marketplace", "remove product from marketplace",
  "change marketplace notification", or "edit marketplace.json".
---

# Marketplace

Manages `public/marketplace.json` via the helper script at `.agents/skills/marketplace/marketplace.mjs`.

## Script Usage

All operations auto-sort products A-Z by title after every change.

```bash
# List all products
node .agents/skills/marketplace/marketplace.mjs list

# Add a product
node .agents/skills/marketplace/marketplace.mjs add "<title>" "<url>" "<coverImage>"

# Edit a product (by uuid or title)
node .agents/skills/marketplace/marketplace.mjs edit "<uuid|title>" "<field>" "<value>"
# Fields: title, url, coverImage, featured (true/false)

# Remove a product (by uuid or title)
node .agents/skills/marketplace/marketplace.mjs remove "<uuid|title>"

# Set notification banner (empty string to clear)
node .agents/skills/marketplace/marketplace.mjs notify "<message>"
```

## Rules

- Always use the script for add/edit/remove/notify operations
- Products are automatically sorted A-Z by title after every write
- Preserve existing UUIDs when editing (never regenerate)
- Confirm changes with the user before writing when multiple products are affected
