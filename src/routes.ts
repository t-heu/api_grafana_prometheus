import express from 'express';

import {prometheus} from "./middlewares/prometheus"

const v1Router = express.Router();

const request_total_counter = new prometheus.Counter({
  name: 'request_total',
  help: 'Contador de Requisições',
  labelNames: ['method', 'statusCode'],
});

const request_time_histogram = new prometheus.Histogram({
  name: 'aula_request_time_seconds',
  help: 'Tempo de Resposta das Requisições',
  buckets: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
});

const request_time_summary = new prometheus.Summary({
  name: 'aula_summary_request_time_seconds',
  help: 'Tempo de Resposta das Requisições',
  percentiles: [0.01, 0.05, 0.5, 0.9, 0.95, 0.99, 0.999],
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

v1Router.get('/users', async (req, res, next) => {
  //const { name, age } = req.query;
  const success = req.query.success == null || req.query.success === 'true';
  const statusCode = success ? 200 : 500;
  request_total_counter.labels({ method: 'GET', statusCode: statusCode }).inc(); // Incrementando em 1 um contador da quantidade de requisições desta rota na aplicação

  const initialTime = Date.now();
  await sleep(100 * Math.random());
  const durationTime = Date.now() - initialTime;
  request_time_histogram.observe(durationTime); // Adicionando o tempo de resposta da requisição para visualização do histograma
  request_time_summary.observe(durationTime); // Adicionando o tempo de resposta da requisição para visualização dos percentis

  res.json({ message: 'Busca e filtro implementados!' });
});

export default v1Router;