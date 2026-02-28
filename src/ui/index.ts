export const styles = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cosmos API</title>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --bg-page: #FFFFFF;
      --bg-secondary: #F7F7F5;
      --bg-hover: #EFEEF0;
      --bg-code: #F7F6F3;
      --text-primary: #37352F;
      --text-secondary: #9B9A97;
      --text-muted: #EBECED;
      --border: #E9E9E7;
      --border-hover: #D3D3D0;
      --accent: #2383E2;
      --accent-light: #E8F4FD;
      --success: #0F7B6C;
      --error: #E03E3E;
      --radius: 1.34rem;
      --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
    }

    html, body {
      height: 100%;
      font-family: var(--font);
      font-size: 14px;
      line-height: 1.5;
      color: var(--text-primary);
      background: var(--bg-page);
    }

    a {
      color: var(--accent);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .app {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    /* Sidebar */
    .sidebar {
      width: 240px;
      background: var(--bg-secondary);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .sidebar-header {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border);
    }

    .sidebar-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sidebar-title .icon {
      width: 20px;
      height: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 11px;
      font-weight: 700;
    }

    .sidebar-nav {
      flex: 1;
      padding: 8px;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 10px;
      border-radius: var(--radius);
      cursor: pointer;
      color: var(--text-secondary);
      font-size: 14px;
      transition: background 0.15s, color 0.15s;
    }

    .nav-item:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }

    .nav-item.active {
      background: var(--bg-hover);
      color: var(--text-primary);
      font-weight: 500;
    }

    .nav-item .emoji {
      font-size: 16px;
      width: 20px;
      text-align: center;
    }

    /* Main Content */
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Header */
    .header {
      height: 45px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      flex-shrink: 0;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--text-secondary);
      font-size: 14px;
    }

    .breadcrumb-sep {
      color: var(--text-muted);
    }

    .breadcrumb-current {
      color: var(--text-primary);
      font-weight: 500;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: var(--radius);
      color: var(--text-secondary);
      font-size: 14px;
      cursor: pointer;
      transition: background 0.15s;
    }

    .header-btn:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }

    /* Content Area */
    .content {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    .page {
      display: none;
      height: 100%;
    }

    .page.active {
      display: block;
    }

    .page-header {
      padding: 24px 32px 16px;
      border-bottom: 1px solid var(--border);
    }

    .page-title {
      font-size: 24px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .page-body {
      padding: 24px 32px;
    }

    /* Status Cards */
    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .status-card {
      background: var(--bg-page);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .status-card:hover {
      border-color: var(--border-hover);
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }

    .status-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .status-card-title {
      font-weight: 500;
      color: var(--text-primary);
      font-size: 14px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--text-muted);
    }

    .status-dot.online {
      background: var(--success);
    }

    .status-dot.offline {
      background: var(--error);
    }

    .status-card-path {
      font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
      font-size: 12px;
      color: var(--text-secondary);
      background: var(--bg-secondary);
      padding: 4px 8px;
      border-radius: 3px;
      margin-bottom: 12px;
    }

    .status-card-actions {
      display: flex;
      gap: 8px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: var(--radius);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      border: 1px solid transparent;
    }

    .btn-primary {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }

    .btn-primary:hover {
      background: #1a6fc4;
      border-color: #1a6fc4;
    }

    .btn-secondary {
      background: var(--bg-secondary);
      color: var(--text-primary);
      border-color: var(--border);
    }

    .btn-secondary:hover {
      background: var(--bg-hover);
      border-color: var(--border-hover);
    }

    .btn-sm {
      padding: 4px 10px;
      font-size: 12px;
    }

    .status-card-result {
      margin-top: 12px;
      padding: 10px;
      background: var(--bg-code);
      border-radius: 4px;
      font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
      font-size: 11px;
      color: var(--text-secondary);
      max-height: 80px;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* Explorer */
    .endpoint-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .endpoint-item {
      background: var(--bg-page);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
    }

    .endpoint-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: background 0.15s;
    }

    .endpoint-header:hover {
      background: var(--bg-secondary);
    }

    .method-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 3px;
      background: var(--accent-light);
      color: var(--accent);
    }

    .endpoint-path {
      flex: 1;
      font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
      font-size: 13px;
      color: var(--text-primary);
    }

    .endpoint-toggle {
      color: var(--text-secondary);
      font-size: 12px;
      transition: transform 0.2s;
    }

    .endpoint-item.expanded .endpoint-toggle {
      transform: rotate(90deg);
    }

    .endpoint-body {
      display: none;
      padding: 16px;
      border-top: 1px solid var(--border);
      background: var(--bg-secondary);
    }

    .endpoint-item.expanded .endpoint-body {
      display: block;
    }

    .param-group {
      margin-bottom: 16px;
    }

    .param-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 6px;
    }

    .param-input {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-size: 13px;
      font-family: inherit;
      color: var(--text-primary);
      background: var(--bg-page);
      transition: border-color 0.15s;
    }

    .param-input:focus {
      outline: none;
      border-color: var(--accent);
    }

    .param-input::placeholder {
      color: var(--text-muted);
    }

    .param-row {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }

    .param-row .param-group {
      flex: 1;
      margin-bottom: 0;
    }

    .endpoint-actions {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .response-block {
      background: #1e1e1e;
      border-radius: 6px;
      overflow: hidden;
    }

    .response-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: #2d2d2d;
      border-bottom: 1px solid #3d3d3d;
    }

    .response-status {
      font-size: 12px;
      font-weight: 500;
      color: #aaa;
    }

    .response-status.success {
      color: #4ec9b0;
    }

    .response-status.error {
      color: #f44747;
    }

    .copy-btn {
      font-size: 11px;
      color: #888;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 3px;
      transition: background 0.15s, color 0.15s;
    }

    .copy-btn:hover {
      background: #444;
      color: #aaa;
    }

    .response-body {
      padding: 12px;
      font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
      font-size: 12px;
      color: #d4d4d4;
      max-height: 300px;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* Docs */
    .docs-layout {
      display: flex;
      gap: 32px;
      height: 100%;
    }

    .docs-sidebar {
      width: 200px;
      flex-shrink: 0;
      border-right: 1px solid var(--border);
      padding-right: 16px;
    }

    .docs-nav {
      position: sticky;
      top: 0;
    }

    .docs-nav-item {
      display: block;
      padding: 6px 0;
      color: var(--text-secondary);
      font-size: 13px;
      transition: color 0.15s;
    }

    .docs-nav-item:hover {
      color: var(--text-primary);
    }

    .docs-nav-item.active {
      color: var(--accent);
    }

    .docs-content {
      flex: 1;
      overflow-y: auto;
      padding-bottom: 64px;
    }

    .docs-content h1 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 16px;
      color: var(--text-primary);
    }

    .docs-content h2 {
      font-size: 20px;
      font-weight: 600;
      margin: 24px 0 12px;
      color: var(--text-primary);
    }

    .docs-content h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 20px 0 8px;
      color: var(--text-primary);
    }

    .docs-content p {
      margin-bottom: 12px;
      color: var(--text-primary);
      line-height: 1.6;
    }

    .docs-content ul, .docs-content ol {
      margin-bottom: 12px;
      padding-left: 24px;
    }

    .docs-content li {
      margin-bottom: 6px;
    }

    .docs-content code {
      font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
      font-size: 13px;
      background: var(--bg-code);
      padding: 2px 6px;
      border-radius: 3px;
      color: #e01e5a;
    }

    .docs-content pre {
      background: #1e1e1e;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 16px;
      overflow-x: auto;
    }

    .docs-content pre code {
      background: none;
      padding: 0;
      color: #d4d4d4;
      font-size: 13px;
      line-height: 1.5;
    }

    .docs-content table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }

    .docs-content th, .docs-content td {
      padding: 8px 12px;
      border: 1px solid var(--border);
      text-align: left;
      font-size: 13px;
    }

    .docs-content th {
      background: var(--bg-secondary);
      font-weight: 600;
    }

    .docs-content blockquote {
      border-left: 3px solid var(--accent);
      padding-left: 16px;
      margin: 16px 0;
      color: var(--text-secondary);
    }

    .docs-content hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 24px 0;
    }

    /* Examples */
    .examples-tabs {
      display: flex;
      gap: 0;
      border-bottom: 1px solid var(--border);
      margin-bottom: 0;
    }

    .examples-tab {
      padding: 10px 16px;
      font-size: 13px;
      color: var(--text-secondary);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.15s;
    }

    .examples-tab:hover {
      color: var(--text-primary);
    }

    .examples-tab.active {
      color: var(--accent);
      border-bottom-color: var(--accent);
    }

    .examples-content {
      background: #1e1e1e;
      border-radius: 6px;
      overflow: hidden;
    }

    .examples-code {
      display: none;
      position: relative;
    }

    .examples-code.active {
      display: block;
    }

    .examples-code pre {
      margin: 0;
      padding: 20px;
      overflow-x: auto;
    }

    .examples-code code {
      font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #d4d4d4;
      background: none;
      padding: 0;
    }

    .examples-code .copy-all {
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 11px;
      color: #888;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 3px;
      background: rgba(255,255,255,0.1);
      transition: background 0.15s;
    }

    .examples-code .copy-all:hover {
      background: rgba(255,255,255,0.2);
    }

    /* Loading */
    .loading {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid var(--border);
      border-radius: 50%;
      border-top-color: var(--accent);
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 32px;
      color: var(--text-secondary);
    }

    /* Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: var(--border-hover);
    }
  </style>
</head>
<body>
  <div class="app">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-title">
          <span class="icon">C</span>
          Cosmos API
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-item active" data-page="status">
          <span class="emoji">🔵</span>
          Status
        </div>
        <div class="nav-item" data-page="explorer">
          <span class="emoji">⚡</span>
          Explorer
        </div>
        <div class="nav-item" data-page="docs">
          <span class="emoji">📄</span>
          Docs
        </div>
        <div class="nav-item" data-page="examples">
          <span class="emoji">💻</span>
          Examples
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <div class="breadcrumb">
            <span>Cosmos API</span>
            <span class="breadcrumb-sep">›</span>
            <span class="breadcrumb-current" id="breadcrumb-text">Status</span>
          </div>
        </div>
        <div class="header-right">
          <a href="https://github.com" target="_blank" class="header-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
        </div>
      </header>

      <!-- Content -->
      <div class="content">
        <!-- Status Page -->
        <div class="page active" id="page-status">
          <div class="page-header">
            <h1 class="page-title">API Status</h1>
          </div>
          <div class="page-body">
            <p style="margin-bottom: 20px; color: var(--text-secondary);">
              Check the status of each API endpoint. Click "Check" to test each endpoint.
            </p>
            <div class="status-grid" id="status-grid">
              <!-- Status cards will be rendered here -->
            </div>
          </div>
        </div>

        <!-- Explorer Page -->
        <div class="page" id="page-explorer">
          <div class="page-header">
            <h1 class="page-title">API Explorer</h1>
          </div>
          <div class="page-body">
            <p style="margin-bottom: 20px; color: var(--text-secondary);">
              Test each API endpoint directly from your browser. Fill in the parameters and click "Execute" to see the response.
            </p>
            <div class="endpoint-list" id="endpoint-list">
              <!-- Endpoints will be rendered here -->
            </div>
          </div>
        </div>

        <!-- Docs Page -->
        <div class="page" id="page-docs">
          <div class="page-header">
            <h1 class="page-title">Documentation</h1>
          </div>
          <div class="page-body">
            <div class="docs-layout">
              <aside class="docs-sidebar">
                <nav class="docs-nav" id="docs-nav">
                  <!-- Doc nav items will be rendered here -->
                </nav>
              </aside>
              <div class="docs-content" id="docs-content">
                <!-- Doc content will be rendered here -->
              </div>
            </div>
          </div>
        </div>

        <!-- Examples Page -->
        <div class="page" id="page-examples">
          <div class="page-header">
            <h1 class="page-title">Code Examples</h1>
          </div>
          <div class="page-body">
            <p style="margin-bottom: 20px; color: var(--text-secondary);">
              Copy and paste these examples to integrate the Cosmos API into your project.
            </p>
            <div class="examples-tabs" id="examples-tabs">
              <div class="examples-tab active" data-tab="curl">cURL</div>
              <div class="examples-tab" data-tab="javascript">JavaScript</div>
              <div class="examples-tab" data-tab="react">React</div>
              <div class="examples-tab" data-tab="vue">Vue</div>
            </div>
            <div class="examples-content" id="examples-content">
              <!-- Examples will be rendered here -->
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <script>
    // Data
    const endpoints = [
      {
        name: 'Search Anime',
        path: '/api/v1/search',
        method: 'GET',
        params: [
          { name: 'q', label: 'Query', type: 'text', default: 'naruto', placeholder: 'Search term...' },
          { name: 'page', label: 'Page', type: 'number', default: '1', placeholder: 'Page number' }
        ]
      },
      {
        name: 'Anime Details',
        path: '/api/v1/anime/:id',
        method: 'GET',
        params: [
          { name: 'id', label: 'Anime ID', type: 'text', default: '18220', placeholder: 'Anime ID' }
        ]
      },
      {
        name: 'Episodes List',
        path: '/api/v1/episodes/:id',
        method: 'GET',
        params: [
          { name: 'id', label: 'Anime ID', type: 'text', default: '18220', placeholder: 'Anime ID' }
        ]
      },
      {
        name: 'Episode Servers',
        path: '/api/v1/servers',
        method: 'GET',
        params: [
          { name: 'episodeId', label: 'Episode ID', type: 'text', default: '110478', placeholder: 'Episode ID' }
        ]
      },
      {
        name: 'Get Stream',
        path: '/api/v1/stream',
        method: 'GET',
        params: [
          { name: 'episodeId', label: 'Episode ID', type: 'text', default: '110478', placeholder: 'Episode ID' },
          { name: 'server', label: 'Server', type: 'select', default: 'hd-1', options: ['hd-1', 'hd-2', 'hd-3', 'hd-4', 'hd-5'] },
          { name: 'type', label: 'Type', type: 'select', default: 'sub', options: ['sub', 'dub'] }
        ]
      },
      {
        name: 'M3U8 Proxy',
        path: '/api/v1/proxy',
        method: 'GET',
        params: [
          { name: 'url', label: 'M3U8 URL', type: 'text', default: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', placeholder: 'M3U8 URL to proxy' }
        ]
      }
    ];

    const docs = [
      {
        title: 'Getting Started',
        slug: 'getting-started',
        content: \`# Getting Started with Cosmos API

Welcome to the Cosmos API documentation. This guide will help you integrate our anime streaming API into your frontend application.

## Base URL

\`\`\`
Production: https://your-api-domain.com (when deployed)
Development: http://localhost:3000 (local development)
\`\`\`

## Authentication

No authentication is required. Each self-hosted instance is its own API - users host their own and use their deployment URL.

## Response Format

All API responses follow a consistent JSON structure:

\`\`\`json
{
  "success": true,
  "data": { ... },
  "error": null
}
\`\`\`

### Success Response

\`\`\`json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "18220",
        "title": "Naruto",
        "image": "https://example.com/image.jpg",
        "status": "Completed",
        "episodes": 220
      }
    ]
  },
  "error": null
}
\`\`\`

### Error Response

\`\`\`json
{
  "success": false,
  "data": null,
  "error": {
    "code": "FETCH_ERROR",
    "message": "Failed to fetch data from source"
  }
}
\`\`\`

## HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |

## Rate Limiting

- **Limit**: 60 requests per minute per IP
- **Headers**: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

## Quick Test

\`\`\`bash
curl http://localhost:3000/health
\`\`\`
\`
      },
      {
        title: 'Search Anime',
        slug: 'search',
        content: \`# Search Anime

Search for anime by title using the search endpoint.

## Endpoint

\`GET /api/v1/search\`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query |
| page | number | No | Page number (default: 1) |

## Example Request

\`\`\`bash
curl "http://localhost:3000/api/v1/search?q=naruto"
\`\`\`

## Response

\`\`\`json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "18220",
        "title": "Naruto",
        "image": "https://cdn.site.com/poster.jpg",
        "status": "Completed",
        "episodes": 220
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "perPage": 20
    }
  }
}
\`\`\`

## Notes

- Use the \`id\` for subsequent API calls
- Results are cached for 1 hour
- Consider debouncing search input
\`
      },
      {
        title: 'Anime Details',
        slug: 'anime-details',
        content: \`# Anime Details

Get detailed information about a specific anime.

## Endpoint

\`GET /api/v1/anime/:id\`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Anime ID from search |

## Example Request

\`\`\`bash
curl http://localhost:3000/api/v1/anime/18220
\`\`\`

## Response

\`\`\`json
{
  "success": true,
  "data": {
    "id": "18220",
    "title": "Naruto",
    "japaneseTitle": "ナルト",
    "image": "https://cdn.site.com/image.jpg",
    "description": "Naruto Uzumaki, a young ninja...",
    "genres": ["Action", "Adventure"],
    "status": "Completed",
    "releaseDate": "2002",
    "totalEpisodes": 220,
    "episodes": [...]
  }
}
\`\`\`
\`
      },
      {
        title: 'Episodes List',
        slug: 'episodes',
        content: \`# Episodes List

Fetch the list of episodes for an anime.

## Endpoint

\`GET /api/v1/episodes/:id\`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Anime ID |

## Example Request

\`\`\`bash
curl http://localhost:3000/api/v1/episodes/18220
\`\`\`

## Response

\`\`\`json
{
  "success": true,
  "data": {
    "animeId": "18220",
    "animeTitle": "Naruto",
    "episodes": [
      {
        "episodeId": "110478",
        "number": 1,
        "title": "Enter: Naruto Uzumaki!",
        "isFiller": false
      }
    ]
  }
}
\`\`\`
\`
      },
      {
        title: 'Streaming',
        slug: 'streaming',
        content: \`# Streaming

Get video stream URLs for playback.

## Endpoint

\`GET /api/v1/stream\`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| episodeId | string | Yes | Episode ID |
| server | string | No | Server (hd-1 to hd-5, default: hd-1) |
| type | string | No | sub or dub (default: sub) |

## Example Request

\`\`\`
/api/v1/stream?episodeId=110478&server=hd-1&type=sub
\`\`\`

## Response

\`\`\`json
{
  "success": true,
  "data": {
    "sources": [
      {
        "url": "https://example.com/stream.m3u8",
        "quality": "1080p"
      }
    ],
    "subtitle": [...],
    "referer": "https://hianime.to/"
  }
}
\`\`\`

## Using with Video Player

The stream URL is an M3U8 file. Use a player like Video.js or hls.js to play the video.
\`
      },
      {
        title: 'M3U8 Proxy',
        slug: 'proxy',
        content: \`# M3U8 Proxy

Proxy M3U8 files to bypass CORS restrictions in browsers.

## Endpoint

\`GET /api/v1/proxy\`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | Yes | M3U8 URL to proxy |

## Why Do You Need This?

Browsers block cross-origin requests to M3U8 files. This proxy rewrites the M3U8 URLs to allow playback.

## Example

\`\`\`
/api/v1/proxy?url=https://example.com/video.m3u8
\`\`\`

## Response

Returns the M3U8 content with rewritten URLs.
\`
      },
      {
        title: 'Complete Example',
        slug: 'example',
        content: \`# Complete Example

Here's a full example of integrating the Cosmos API into a web application.

## Workflow

1. **Search** for anime
2. Get **anime details** and episode list
3. Select an **episode**
4. Get **streaming URL**
5. Play video using a player

## JavaScript Example

\`\`\`javascript
const BASE_URL = 'http://localhost:3000';

// 1. Search
const search = await fetch(\`\${BASE_URL}/api/v1/search?q=naruto\`);
const { data: searchData } = await search.json();
const anime = searchData.results[0];

// 2. Get episodes
const episodes = await fetch(\`\${BASE_URL}/api/v1/episodes/\${anime.id}\`);
const { data: episodesData } = await episodes.json();
const firstEpisode = episodesData.episodes[0];

// 3. Get stream
const stream = await fetch(
  \`\${BASE_URL}/api/v1/stream?episodeId=\${firstEpisode.episodeId}\`
);
const { data: streamData } = await stream.json();

// 4. Use stream URL
const videoUrl = streamData.sources[0].url;
console.log('Play:', videoUrl);
\`\`\`
\`
      },
      {
        title: 'Configuration',
        slug: 'config',
        content: \`# Configuration

Customize your Cosmos API deployment with environment variables.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| RATE_LIMIT | 60 | Requests per minute |
| RATE_WINDOW | 60000 | Rate limit window (ms) |
| CACHE_TTL_SEARCH | 3600 | Search cache (seconds) |
| CACHE_TTL_ANIME | 86400 | Anime cache (seconds) |
| CACHE_TTL_EPISODES | 86400 | Episodes cache (seconds) |
| CACHE_TTL_SERVERS | 3600 | Servers cache (seconds) |
| CACHE_TTL_STREAM | 1800 | Stream cache (seconds) |
| CORS_ORIGIN | * | Allowed CORS origins |
| REQUEST_TIMEOUT | 10000 | Request timeout (ms) |
| RETRY_ATTEMPTS | 3 | Number of retry attempts |

## Setting Environment Variables

### Development (.env file)

\`\`\`
RATE_LIMIT=60
CACHE_TTL_SEARCH=3600
CORS_ORIGIN=*
\`\`\`

### Vercel

Add variables in Vercel Dashboard → Settings → Environment Variables.

## Production Tips

- Keep rate limit reasonable (60 is good)
- Longer cache TTLs = less upstream load
- Use * for CORS during development
\`
      }
    ];

    const examples = {
      curl: \`# Search anime
curl "http://localhost:3000/api/v1/search?q=naruto"

# Get anime details
curl http://localhost:3000/api/v1/anime/18220

# Get episodes
curl http://localhost:3000/api/v1/episodes/18220

# Get servers
curl "http://localhost:3000/api/v1/servers?episodeId=110478"

# Get stream
curl "http://localhost:3000/api/v1/stream?episodeId=110478&server=hd-1&type=sub"\`,
      javascript: \`const BASE_URL = 'http://localhost:3000';

async function searchAnime(query, page = 1) {
  const res = await fetch(\\\`\${BASE_URL}/api/v1/search?q=\\\${encodeURIComponent(query)}&page=\\\${page}\\\`);
  return res.json();
}

async function getAnime(id) {
  const res = await fetch(\\\`\${BASE_URL}/api/v1/anime/\\\${id}\\\`);
  return res.json();
}

async function getEpisodes(id) {
  const res = await fetch(\\\`\${BASE_URL}/api/v1/episodes/\\\${id}\\\`);
  return res.json();
}

async function getStream(episodeId, server = 'hd-1', type = 'sub') {
  const res = await fetch(\\\`\${BASE_URL}/api/v1/stream?episodeId=\\\${episodeId}&server=\\\${server}&type=\\\${type}\\\`);
  return res.json();
}

// Usage
searchAnime('naruto').then(console.log);\`,
      react: \`import { useState } from 'react';

const BASE_URL = 'http://localhost:3000';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(\\\`\${BASE_URL}/api/v1/search?q=\\\${encodeURIComponent(query)}\\\`);
    const data = await res.json();
    if (data.success) setResults(data.data.results);
    setLoading(false);
  };

  return (
    <form onSubmit={search}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search anime..."
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      <div>
        {results.map(anime => (
          <div key={anime.id}>
            <img src={anime.image} alt={anime.title} />
            <h3>{anime.title}</h3>
          </div>
        ))}
      </div>
    </form>
  );
}\`,
      vue: \`<template>
  <form @submit.prevent="search">
    <input v-model="query" placeholder="Search anime..." />
    <button type="submit">Search</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const query = ref('');
const results = ref([]);
const BASE_URL = 'http://localhost:3000';

const search = async () => {
  const res = await fetch(\\\`\${BASE_URL}/api/v1/search?q=\\\${encodeURIComponent(query.value)}\\\`);
  const data = await res.json();
  if (data.success) results.value = data.data.results;
};
<\/script>\`
    };

    // State
    let currentDoc = 'getting-started';

    // Render Status Cards
    function renderStatusCards() {
      const grid = document.getElementById('status-grid');
      grid.innerHTML = endpoints.map(ep => \`
        <div class="status-card" data-endpoint="\${ep.path}">
          <div class="status-card-header">
            <span class="status-card-title">\${ep.name}</span>
            <span class="status-dot" id="dot-\${ep.path.replace(/\\//g, '-')}"></span>
          </div>
          <div class="status-card-path">\${ep.method} \${ep.path}</div>
          <div class="status-card-actions">
            <button class="btn btn-secondary btn-sm" onclick="checkEndpoint('\${ep.path}', '\${ep.name}')">
              Check
            </button>
          </div>
          <div class="status-card-result" id="result-\${ep.path.replace(/\\//g, '-')}" style="display: none;"></div>
        </div>
      \`).join('');
    }

    // Check endpoint
    async function checkEndpoint(path, name) {
      const dotId = 'dot-' + path.replace(/\\//g, '-');
      const resultId = 'result-' + path.replace(/\\//g, '-');
      const dot = document.getElementById(dotId);
      const resultEl = document.getElementById(resultId);
      
      dot.className = 'status-dot';
      dot.style.background = '#9B9A97';
      resultEl.style.display = 'block';
      resultEl.innerHTML = '<span class="loading"></span> Checking...';
      
      try {
        let url = path;
        if (path.includes(':id')) {
          url = path.replace(':id', '18220');
        }
        if (path.includes('episodeId')) {
          url = path.replace('episodeId=', 'episodeId=110478');
        }
        
        const fullUrl = url.startsWith('http') ? url : '' + url;
        const res = await fetch(url.startsWith('/api') ? '' + url : '');
        const data = await res.json();
        
        if (res.ok && data.success) {
          dot.className = 'status-dot online';
          resultEl.textContent = JSON.stringify(data.data, null, 2).substring(0, 200);
        } else {
          dot.className = 'status-dot offline';
          resultEl.textContent = data.error?.message || 'Error: ' + res.status;
        }
      } catch (err) {
        dot.className = 'status-dot offline';
        resultEl.textContent = 'Network error: ' + err.message;
      }
    }

    // Render Explorer
    function renderExplorer() {
      const list = document.getElementById('endpoint-list');
      list.innerHTML = endpoints.map((ep, idx) => \`
        <div class="endpoint-item" data-idx="\${idx}">
          <div class="endpoint-header" onclick="toggleEndpoint(\${idx})">
            <span class="method-badge">GET</span>
            <span class="endpoint-path">\${ep.path}</span>
            <span class="endpoint-toggle">▶</span>
          </div>
          <div class="endpoint-body">
            <div class="param-row">
              \${ep.params.map(p => \`
                <div class="param-group">
                  <div class="param-label">\${p.label}</div>
                  \${p.type === 'select' 
                    ? \`<select class="param-input" id="param-\${idx}-\${p.name}">
                        \${p.options.map(o => \`<option value="\${o}" \${o === p.default ? 'selected' : ''}>\${o}</option>\`).join('')}
                      </select>\`
                    : \`<input type="\${p.type}" class="param-input" id="param-\${idx}-\${p.name}" value="\${p.default}" placeholder="\${p.placeholder || ''}">\`
                  }
                </div>
              \`).join('')}
            </div>
            <div class="endpoint-actions">
              <button class="btn btn-primary" onclick="executeEndpoint(\${idx})">Execute</button>
            </div>
            <div class="response-block" id="response-\${idx}" style="display: none;">
              <div class="response-header">
                <span class="response-status" id="status-\${idx}"></span>
                <span class="copy-btn" onclick="copyResponse(\${idx})">Copy</span>
              </div>
              <pre class="response-body" id="response-body-\${idx}"></pre>
            </div>
          </div>
        </div>
      \`).join('');
    }

    function toggleEndpoint(idx) {
      const item = document.querySelector(\`.endpoint-item[data-idx="\${idx}"]\`);
      item.classList.toggle('expanded');
    }

    async function executeEndpoint(idx) {
      const ep = endpoints[idx];
      const responseBlock = document.getElementById('response-' + idx);
      const statusEl = document.getElementById('status-' + idx);
      const bodyEl = document.getElementById('response-body-' + idx);
      
      responseBlock.style.display = 'block';
      statusEl.innerHTML = '<span class="loading"></span> Loading...';
      
      let url = ep.path;
      let queryParams = [];
      
      for (const p of ep.params) {
        const el = document.getElementById('param-' + idx + '-' + p.name);
        const value = el.value || p.default;
        
        if (url.includes(':' + p.name)) {
          url = url.replace(':' + p.name, value);
        } else {
          queryParams.push(\`\${p.name}=\${encodeURIComponent(value)}\`);
        }
      }
      
      if (queryParams.length > 0) {
        url += '?' + queryParams.join('&');
      }
      
      try {
        const res = await fetch('' + url);
        const data = await res.json();
        
        statusEl.className = 'response-status ' + (data.success ? 'success' : 'error');
        statusEl.textContent = res.status + ' ' + res.statusText;
        
        bodyEl.textContent = JSON.stringify(data, null, 2);
      } catch (err) {
        statusEl.className = 'response-status error';
        statusEl.textContent = 'Error';
        bodyEl.textContent = err.message;
      }
    }

    function copyResponse(idx) {
      const bodyEl = document.getElementById('response-body-' + idx);
      navigator.clipboard.writeText(bodyEl.textContent);
    }

    // Render Docs
    function renderDocs() {
      const nav = document.getElementById('docs-nav');
      nav.innerHTML = docs.map(d => \`
        <a class="docs-nav-item \${d.slug === currentDoc ? 'active' : ''}" href="#" onclick="showDoc('\${d.slug}'); return false;">
          \${d.title}
        </a>
      \`).join('');
      
      const content = document.getElementById('docs-content');
      const doc = docs.find(d => d.slug === currentDoc);
      content.innerHTML = renderMarkdown(doc.content);
    }

    function showDoc(slug) {
      currentDoc = slug;
      renderDocs();
    }

    function renderMarkdown(text) {
      return text
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
        .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
        .replace(/\\\`\\\`\\\`(\\w+)?\\n([\\s\\S]*?)\\\`\\\`\\\`/g, '<pre><code>$2</code></pre>')
        .replace(/\\\`(.*?)\\\`/g, '<code>$1</code>')
        .replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2">$1</a>')
        .replace(/\\n\\n/g, '</p><p>')
        .replace(/\\n/g, '<br>');
    }

    // Render Examples
    function renderExamples() {
      const content = document.getElementById('examples-content');
      content.innerHTML = Object.entries(examples).map(([lang, code]) => \`
        <div class="examples-code" data-tab="\${lang}">
          <span class="copy-all" onclick="copyExample('\${lang}')">Copy</span>
          <pre><code>\${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
        </div>
      \`).join('');
      
      document.querySelector('.examples-code[data-tab="curl"]').classList.add('active');
    }

    function copyExample(lang) {
      const code = examples[lang];
      navigator.clipboard.writeText(code);
    }

    // Tab switching
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const page = item.dataset.page;
        
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-' + page).classList.add('active');
        
        const titles = { status: 'Status', explorer: 'API Explorer', docs: 'Documentation', examples: 'Examples' };
        document.getElementById('breadcrumb-text').textContent = titles[page];
      });
    });

    // Examples tabs
    document.querySelectorAll('.examples-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        document.querySelectorAll('.examples-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.examples-code').forEach(c => c.classList.remove('active'));
        document.querySelector('.examples-code[data-tab="' + tabName + '"]').classList.add('active');
      });
    });

    // Init
    renderStatusCards();
    renderExplorer();
    renderDocs();
    renderExamples();
  </script>
</body>
</html>
`;
