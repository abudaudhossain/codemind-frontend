/**
 * Isolated mock for repository file tree + content.
 * CAP has no HTTP endpoints to list files or fetch file content.
 * Do not import this from `services/repository.service.ts`.
 */

import type { FileTreeNode, RepositoryFileContent } from "@/types";

const SAMPLE_FILES: Record<string, RepositoryFileContent> = {
  "src/index.ts": {
    path: "src/index.ts",
    language: "typescript",
    size: 420,
    isIndexed: true,
    content: `import { createApp } from "./app";
import { loadConfig } from "./config";

async function main() {
  const config = loadConfig();
  const app = createApp(config);
  await app.listen(config.port);
  console.log(\`Listening on \${config.port}\`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
`,
  },
  "src/app.ts": {
    path: "src/app.ts",
    language: "typescript",
    size: 680,
    isIndexed: true,
    content: `import express from "express";
import { authRouter } from "./routes/auth";
import { billingRouter } from "./routes/billing";

export function createApp(config: { corsOrigin: string }) {
  const app = express();
  app.use(express.json());
  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });
  app.use("/auth", authRouter);
  app.use("/billing", billingRouter);
  return app;
}
`,
  },
  "src/routes/billing.ts": {
    path: "src/routes/billing.ts",
    language: "typescript",
    size: 910,
    isIndexed: true,
    content: `import { Router } from "express";
import { createInvoice } from "../services/invoices";

export const billingRouter = Router();

billingRouter.post("/invoices", async (req, res, next) => {
  try {
    const invoice = await createInvoice(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
});

billingRouter.get("/invoices/:id", async (req, res, next) => {
  try {
    res.json({ id: req.params.id, status: "open" });
  } catch (error) {
    next(error);
  }
});
`,
  },
  "README.md": {
    path: "README.md",
    language: "markdown",
    size: 320,
    isIndexed: true,
    content: `# Sample repository

Temporary mock source used while CAP exposes no file-list API.

- Connect a repository
- Run sync → fetch-source → chunk → embeddings
- Ask CodeMind about the codebase
`,
  },
  "package.json": {
    path: "package.json",
    language: "json",
    size: 280,
    isIndexed: true,
    content: `{
  "name": "payments-service",
  "version": "1.4.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js"
  }
}
`,
  },
};

function buildTree(): FileTreeNode[] {
  return [
    {
      id: "folder-src",
      name: "src",
      path: "src",
      type: "folder",
      children: [
        {
          id: "file-src-index",
          name: "index.ts",
          path: "src/index.ts",
          type: "file",
          language: "typescript",
          size: SAMPLE_FILES["src/index.ts"].size,
        },
        {
          id: "file-src-app",
          name: "app.ts",
          path: "src/app.ts",
          type: "file",
          language: "typescript",
          size: SAMPLE_FILES["src/app.ts"].size,
        },
        {
          id: "folder-routes",
          name: "routes",
          path: "src/routes",
          type: "folder",
          children: [
            {
              id: "file-billing",
              name: "billing.ts",
              path: "src/routes/billing.ts",
              type: "file",
              language: "typescript",
              size: SAMPLE_FILES["src/routes/billing.ts"].size,
            },
          ],
        },
      ],
    },
    {
      id: "file-readme",
      name: "README.md",
      path: "README.md",
      type: "file",
      language: "markdown",
      size: SAMPLE_FILES["README.md"].size,
    },
    {
      id: "file-package",
      name: "package.json",
      path: "package.json",
      type: "file",
      language: "json",
      size: SAMPLE_FILES["package.json"].size,
    },
  ];
}

export const repositoryFilesMock = {
  async getFileTree(repositoryId: string): Promise<FileTreeNode[]> {
    void repositoryId;
    await delay(320);
    return buildTree();
  },

  async getFileContent(
    repositoryId: string,
    path: string
  ): Promise<RepositoryFileContent | null> {
    void repositoryId;
    await delay(280);
    return SAMPLE_FILES[path] ?? null;
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
