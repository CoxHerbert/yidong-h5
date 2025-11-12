import type { App } from 'vue';

import http from '@/http/api.js';
import * as wxsdk from '@/utils/wxsdk.js';
import * as wwsdk from '@/utils/wwxsdk.js';
import { globalTools } from '../utils/global-tools';

const apiModules = import.meta.glob('@/api/*.js', { eager: true });

type ApiRegistry = Record<string, unknown>;

function resolveApiRegistry(): ApiRegistry {
  const registry: ApiRegistry = {};

  Object.values(apiModules).forEach((moduleExports) => {
    if (!moduleExports) return;

    const typedExports = moduleExports as Record<string, unknown> & { default?: Record<string, unknown> };

    if (typedExports.default && typeof typedExports.default === 'object') {
      Object.assign(registry, typedExports.default);
    }

    Object.keys(typedExports).forEach((key) => {
      if (key === 'default') return;
      registry[key] = typedExports[key];
    });
  });

  return registry;
}

export function installGlobalPlugins(app: App) {
  const apis = resolveApiRegistry();

  app.config.globalProperties.$http = http;
  app.config.globalProperties.$apis = apis;
  app.config.globalProperties.$wxsdk = wxsdk;
  app.config.globalProperties.$wwsdk = wwsdk;
  app.config.globalProperties.$globalTools = globalTools;

  app.provide('http', http);
  app.provide('apis', apis);
  app.provide('wxsdk', wxsdk);
  app.provide('wwsdk', wwsdk);
  app.provide('globalTools', globalTools);
}
