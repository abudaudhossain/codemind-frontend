/**
 * Verified CAP (CodeMind AI Platform) API contracts used by the repository module.
 * Source: D:\project\CAP controllers/services/Prisma schema.
 *
 * Base URL: NEXT_PUBLIC_API_BASE_URL (default http://localhost:4000)
 * Auth: Authorization: Bearer <accessToken>
 * Envelope: { success, message, data, timestamp, path }
 *
 * === Integrated ===
 * GET  /github/install                         JWT redirect → GitHub App install
 * GET  /github/repositories                    JWT list { items, meta } query: page,limit,search,connected
 * PUT  /github/repositories/:id/connect        JWT
 * PUT  /github/repositories/:id/disconnect     JWT
 * PUT  /github/repositories/:id/sync           JWT tree sync
 * POST /github/repositories/:id/fetch-source   JWT
 * POST /github/repositories/:id/chunk-source   JWT
 * POST /github/repositories/:id/generate-embeddings JWT
 * POST /github/repositories/:id/ask            JWT { question }
 *
 * === Missing (UI uses isolated mocks / workarounds) ===
 * GET  /github/installation|status             connection status
 * POST /github/disconnect                      uninstall/revoke app
 * GET  /github/repositories/:id                repository details
 * GET  /github/repositories/:id/files          file tree
 * GET  /github/repositories/:id/files/*        file content
 * GET  /github/repositories/:id/indexing-status
 * Dedicated progress percent for indexing
 *
 * Indexing status enum (GithubSyncStatus): PENDING | INDEXING | COMPLETED | FAILED
 * OUTDATED is UI-only / unused repo.indexingStatus string on Prisma model.
 */

export const API_CONTRACT_VERSION = "cap-github-repositories-2026-11";
