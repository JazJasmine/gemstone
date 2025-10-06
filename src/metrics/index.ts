import prometheus from 'prom-client';
import express from 'express';

// Create a Registry which registers the metrics
export const register = new prometheus.Registry();

// Add default metrics to the registry
prometheus.collectDefaultMetrics({ register });

// Counters
export const failedVrcGroupRemovalCounter = new prometheus.Counter({
  name: 'gemstone_exception_vrc_group_remove_total',
  help: 'Total number of exceptions thrown during removing a user from the vrc group',
  registers: [register],
});

export const failedLinkRemovalCounter = new prometheus.Counter({
  name: 'gemstone_exception_link_remove_total',
  help: 'Total number of exceptions thrown during removing a link between discord and vrc',
  registers: [register],
});

export const failedGroupInstancePollCounter = new prometheus.Counter({
  name: 'gemstone_exception_polling_group_instance_total',
  help: 'Total number of exceptions thrown during polling for group instances',
  registers: [register],
});

export const polledGroupInstanceCounter = new prometheus.Counter({
  name: 'gemstone_polling_group_instance_total',
  help: 'Total number of polling for group instances',
  registers: [register],
});

export const metricServer = express();

metricServer.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
