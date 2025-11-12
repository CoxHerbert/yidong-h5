import http from '@/http/api.js';
import * as wxsdk from '@/utils/wxsdk.js';
import * as wwsdk from '@/utils/wwxsdk.js';
import { globalTools } from '../utils/global-tools';

const apiModules = import.meta.glob('@/api/*.js', { eager: true });

function resolveApiRegistry() {
  const registry = {};

  Object.values(apiModules).forEach((moduleExports) => {
    if (!moduleExports) return;

    const exportsObject =
      moduleExports && typeof moduleExports === 'object' ? { ...moduleExports } : {};

    if (exportsObject.default && typeof exportsObject.default === 'object') {
      Object.assign(registry, exportsObject.default);
    }

    Object.keys(exportsObject).forEach((key) => {
      if (key === 'default') return;
      registry[key] = exportsObject[key];
    });
  });

  return registry;
}

export function installGlobalPlugins(app) {
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
