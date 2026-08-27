import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.PERF_BASE_URL || 'https://restful-booker.herokuapp.com';
const VUS = Number(__ENV.K6_VUS || 5);
const DURATION = __ENV.K6_DURATION || '30s';

export const options = {
  scenarios: {
    booking_list_load: {
      executor: 'ramping-vus',
      startVUs: 5,
      stages: [
        //Base
        { duration: '30s', target: 5 },

        { duration: '10s', target: 10 },
        { duration: '30s', target: 10 },

        { duration: '10s', target: 15 },
        { duration: '30s', target: 15 },

        { duration: '10s', target: 20 },
        { duration: '30s', target: 20 },

        { duration: '10s', target: 25 },
        { duration: '30s', target: 25 },
        
        //Rap Down
        { duration: '20s', target: 0 },
        
      ],
      gracefulStop: '10s'
    }
  },

  thresholds: {

    http_req_failed: [
      'rate<0.05'
    ],

    http_req_duration: [
      'p(95)<2000',
      'p(99)<3000'
    ],

    checks: [
      'rate>0.95'
    ]
  },

  summaryTrendStats: [
    'avg',
    'min',
    'med',
    'max',
    'p(90)',
    'p(95)',
    'p(99)'
  ]
};

export default function () {
  const response = http.get(`${BASE_URL}/booking`, {
    headers: {
      Accept: 'application/json'
    },
    tags: {
      endpoint: 'GET /booking'
    }
  });

  check(response, {
    'status deve ser 200': (res) => res.status === 200,
    'content-type deve ser JSON': (res) =>
      res.headers['Content-Type']?.includes('application/json') ?? false,
    'body deve retornar uma lista de reservas': (res) => {
      try {
        const body = res.json();
        return Array.isArray(body);
      } catch {
        return false;
      }
    }
  });

  // Think time para evitar rajadas artificiais contra a API pública.
  sleep(1);
}
