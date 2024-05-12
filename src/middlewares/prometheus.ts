import prometheus from 'prom-client';

const collectDefaultMetrics = prometheus.collectDefaultMetrics;
const register = prometheus.register;
collectDefaultMetrics({ register });

export {register, prometheus};
