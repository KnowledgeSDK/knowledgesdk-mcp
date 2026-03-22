<p align="center">
  <img src="https://knowledgesdk.com/knowledgesdk_light.svg" alt="KnowledgeSDK" width="300" />
</p>

<p align="center">
  <b>Official MCP Server for <a href="https://knowledgesdk.com">KnowledgeSDK</a></b><br/>
  Give AI assistants the power to extract knowledge from any website via the Model Context Protocol.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@knowledgesdk/mcp">
    <img src="https://img.shields.io/npm/v/@knowledgesdk/mcp.svg?style=flat-square" alt="NPM Version" />
  </a>
  <a href="https://github.com/KnowledgeSDK/knowledgesdk-mcp/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/KnowledgeSDK/knowledgesdk-mcp.svg?style=flat-square" alt="License" />
  </a>
</p>

# KnowledgeSDK MCP Server

## What is KnowledgeSDK?

**KnowledgeSDK** is an API that turns any website into structured, searchable knowledge — built for developers, AI agents, and data pipelines.

- 🔍 **Extract** — Crawl & extract structured knowledge from any website
- 📄 **Scrape** — Convert any URL to clean Markdown
- 🏢 **Classify** — AI-powered business classification from a URL
- 📸 **Screenshot** — Full-page screenshots of any website
- 🗺️ **Sitemap** — Discover all URLs on a domain
- 🧠 **Search** — Semantic search across your extracted knowledge base

> [Get your API key](https://knowledgesdk.com/connect)

## Tools

| Tool | Description |
|---|---|
| `extract_knowledge` | Extract structured knowledge from any website URL. Returns business classification, product features, pricing, and key insights. |
| `scrape_page` | Scrape any webpage and return clean markdown content. Perfect for reading documentation, articles, or any web content. |
| `classify_business` | Classify a business from its website URL. Returns type, industry, target audience, value proposition, and key insights. |
| `get_sitemap` | Discover all pages on a website via its sitemap. Returns a list of URLs for further processing. |
| `take_screenshot` | Take a full-page screenshot of any URL. Returns a base64-encoded PNG image. |
| `search_knowledge` | Search your extracted knowledge base using natural language. Returns relevant knowledge items ranked by semantic similarity. |

## Requirements

- Node.js >= 18
- A KnowledgeSDK API key — get one at [knowledgesdk.com/dashboard](https://knowledgesdk.com/dashboard)

---

## Setup with Claude Desktop

1. Open your Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the following to the `mcpServers` section:

```json
{
  "mcpServers": {
    "knowledgesdk": {
      "command": "npx",
      "args": ["-y", "@knowledgesdk/mcp"],
      "env": {
        "KNOWLEDGESDK_API_KEY": "sk_ks_your_key_here"
      }
    }
  }
}
```

3. Restart Claude Desktop.

You should now see the KnowledgeSDK tools available in your Claude Desktop conversations.

---

## Setup with Cursor

1. Open Cursor Settings → Features → MCP Servers.
2. Click **+ Add new MCP server**.
3. Choose **stdio** as the transport type.
4. Enter the following command:

```
npx -y @knowledgesdk/mcp
```

5. Add the environment variable:

```
KNOWLEDGESDK_API_KEY=sk_ks_your_key_here
```

Alternatively, edit `~/.cursor/mcp.json` directly:

```json
{
  "mcpServers": {
    "knowledgesdk": {
      "command": "npx",
      "args": ["-y", "@knowledgesdk/mcp"],
      "env": {
        "KNOWLEDGESDK_API_KEY": "sk_ks_your_key_here"
      }
    }
  }
}
```

---

## Setup with Windsurf

1. Open Windsurf Settings → Cascade → MCP Servers.
2. Click **Add Server** and select **Command**.
3. Configure as follows:

```json
{
  "mcpServers": {
    "knowledgesdk": {
      "command": "npx",
      "args": ["-y", "@knowledgesdk/mcp"],
      "env": {
        "KNOWLEDGESDK_API_KEY": "sk_ks_your_key_here"
      }
    }
  }
}
```

Or edit `~/.codeium/windsurf/mcp_config.json` directly with the same JSON block above.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `KNOWLEDGESDK_API_KEY` | Yes | Your KnowledgeSDK API key |
| `KNOWLEDGESDK_BASE_URL` | No | Override the API base URL (default: `https://api.knowledgesdk.com`) |

---

## Example Usage

Once configured, you can ask your AI assistant:

- "Extract knowledge from https://stripe.com"
- "Scrape the page at https://docs.stripe.com/get-started"
- "Classify the business at https://linear.app"
- "Get the sitemap for https://vercel.com"
- "Take a screenshot of https://github.com"
- "Search my knowledge base for 'pricing plans'"

---

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Test the stdio server locally (requires KNOWLEDGESDK_API_KEY)
KNOWLEDGESDK_API_KEY=sk_ks_your_key npm run test:local
```

---

## Documentation

Full API reference → **<https://knowledgesdk.com/docs>**

## Contributing

We ❤️ PRs!

1. **Fork** → `git checkout -b feat/awesome`
2. Add tests & docs
3. **PR** against `main`

## License

[MIT](LICENSE)
