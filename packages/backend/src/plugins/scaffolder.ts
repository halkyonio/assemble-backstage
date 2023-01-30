import { createBuiltinActions, createRouter } from '@backstage/plugin-scaffolder-backend';

import { CatalogClient } from '@backstage/catalog-client';
import type { PluginEnvironment } from '../types';
import { Router } from 'express';
import { ScmIntegrations } from '@backstage/integration';
import { createArgoCdResources } from '@roadiehq/scaffolder-backend-argocd';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });
  const integrations = ScmIntegrations.fromConfig(env.config);

  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });

  const actions = [...builtInActions, createArgoCdResources( env.config, env.logger)];

  return await createRouter({
    actions,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
  });
}
