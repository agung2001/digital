---
name: update-marketplace
description: >-
  Updates public/marketplace.json with new products, edits existing entries, or removes items.
  Use this skill when the user wants to add a product, update product details (title, URL, cover image),
  remove a product from the marketplace, or modify the notification banner. Triggers on requests like
  "add a product to marketplace", "update marketplace", "remove product from marketplace",
  "change marketplace notification", or "edit marketplace.json".
---

# Update Marketplace

This skill manages the `public/marketplace.json` file which stores product listings for the marketplace page.

## File Structure

`public/marketplace.json` has this schema:

```json
{
  "notification": "string",
  "products": [
    {
      "uuid": "string (UUID v4)",
      "title": "string",
      "url": "string (product URL)",
      "coverImage": "string (image URL)"
    }
  ]
}
```

## Workflows

### Add a Product

1. Read `public/marketplace.json`
2. Generate a new UUID v4 for the product
3. Collect required fields from user: `title`, `url`, `coverImage`
4. Append the new product object to the `products` array
5. Write the updated JSON back to the file with 2-space indentation

### Edit a Product

1. Read `public/marketplace.json`
2. Identify the product to edit by matching `uuid`, `title`, or array index
3. Update the specified fields (`title`, `url`, `coverImage`)
4. Write the updated JSON back to the file with 2-space indentation

### Remove a Product

1. Read `public/marketplace.json`
2. Identify the product to remove by matching `uuid`, `title`, or array index
3. Remove the product from the `products` array
4. Write the updated JSON back to the file with 2-space indentation

### Update Notification

1. Read `public/marketplace.json`
2. Set the `notification` field to the new value (empty string to clear)
3. Write the updated JSON back to the file with 2-space indentation

## Rules

- Always read the current file before making changes
- Preserve existing UUIDs when editing (never regenerate)
- Maintain the existing order of products unless explicitly asked to reorder
- Use 2-space indentation for JSON output
- Ensure valid JSON output (no trailing commas, proper escaping)
- Confirm changes with the user before writing when multiple products are affected
