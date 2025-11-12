const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const PAGES_CONFIG_PATH = path.join(REPO_ROOT, 'pages.json');
const WORKFLOW_ROOT = path.join(REPO_ROOT, 'pages', 'plugin', 'workflow');
const ROUTER_OUTPUT_PATH = path.join(WORKFLOW_ROOT, 'router', 'workflow-routes.ts');

function stripJsonComments(json) {
  return json
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/([^:\\])\/\/.*$/gm, '$1');
}

function readPagesConfig() {
  const raw = fs.readFileSync(PAGES_CONFIG_PATH, 'utf8');
  try {
    return JSON.parse(stripJsonComments(raw));
  } catch (error) {
    throw new Error(`无法解析 pages.json: ${error.message}`);
  }
}

function ensureWorkflowFolder() {
  const routerDir = path.dirname(ROUTER_OUTPUT_PATH);
  if (!fs.existsSync(routerDir)) {
    fs.mkdirSync(routerDir, { recursive: true });
  }
}

function resolveComponentPath(relativeWorkflowPath) {
  const candidate = path.join(WORKFLOW_ROOT, 'pages', `${relativeWorkflowPath}.vue`);
  if (fs.existsSync(candidate)) {
    return `../pages/${relativeWorkflowPath}.vue`;
  }

  const indexCandidate = path.join(WORKFLOW_ROOT, 'pages', relativeWorkflowPath, 'index.vue');
  if (fs.existsSync(indexCandidate)) {
    return `../pages/${relativeWorkflowPath}/index.vue`;
  }

  throw new Error(
    `未找到与路径 "${relativeWorkflowPath}" 对应的 Vue 组件，请检查 pages.json 与目录结构是否匹配。`
  );
}

function toPascalCase(segment) {
  return segment
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function buildRouteName(relativeWorkflowPath) {
  const segments = relativeWorkflowPath.split('/').filter(Boolean);
  if (segments[segments.length - 1] === 'index') {
    segments.pop();
  }
  return ['workflow', ...segments].map(toPascalCase).join('');
}

function buildRoutePath(relativeWorkflowPath) {
  const segments = relativeWorkflowPath.split('/').filter(Boolean);
  if (segments[0] === 'pages') {
    segments.shift();
  }
  if (segments[segments.length - 1] === 'index') {
    segments.pop();
  }
  return '/' + ['workflow', ...segments].join('/');
}

function stringifyMeta(style, indent) {
  const entries = Object.entries(style || {});
  if (!entries.length) {
    return '{}';
  }
  const indentStr = ' '.repeat(indent);
  const innerIndentStr = ' '.repeat(indent + 2);
  const lines = entries.map(([key, value]) => {
    const serializedValue = JSON.stringify(value);
    return `${innerIndentStr}${key}: ${serializedValue}`;
  });
  return `{
${lines.join(',\n')}
${indentStr}}`;
}

function createRouteRecord(pageConfig) {
  const workflowPrefix = 'pages/plugin/workflow/';
  const relative = pageConfig.path.replace(workflowPrefix, '');
  const relativeWithoutPages = relative.replace(/^pages\//, '');
  const componentPath = resolveComponentPath(relativeWithoutPages);
  const routePath = buildRoutePath(relativeWithoutPages);
  const name = buildRouteName(relativeWithoutPages);
  const meta = stringifyMeta(pageConfig.style, 4);

  return `  {
    path: '${routePath}',
    name: '${name}',
    component: () => import('${componentPath}'),
    meta: ${meta}
  }`;
}

function formatRoutes(routes) {
  return routes.join(',\n');
}

function generateWorkflowRoutes() {
  const pagesConfig = readPagesConfig();
  const routes = (pagesConfig.pages || [])
    .filter((page) => typeof page.path === 'string' && page.path.startsWith('pages/plugin/workflow/'))
    .map(createRouteRecord);

  const content = `/**
 * 此文件由 scripts/generate-workflow-routes.js 自动生成。
 *
 * 运行 \`node scripts/generate-workflow-routes.js\` 以重新生成。
 */
import type { RouteRecordRaw } from 'vue-router';

export const workflowRoutes: RouteRecordRaw[] = [
${formatRoutes(routes)}
];

export default workflowRoutes;
`;

  ensureWorkflowFolder();
  fs.writeFileSync(ROUTER_OUTPUT_PATH, content);
}

generateWorkflowRoutes();
