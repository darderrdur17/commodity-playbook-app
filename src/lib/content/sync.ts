/**
 * CMS-backed pages and mobile APIs must use inline route config:
 *   export const dynamic = "force-dynamic";
 *   export const revalidate = 0;
 * so admin edits are live for all users without a rebuild.
 */
