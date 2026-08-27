import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL =
  __ENV.PERF_BASE_URL ||
  'https://restful-booker.herokuapp.com';

const PROFILE =
  (__ENV.K6_PROFILE || 'ramp').toLowerCase();

function parsePositiveInteger(value, variableName) {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(
      `${variableName} deve ser um número inteiro maior que zero.`
    );
  }

  return parsedValue;
}

function createRampingScenario() {
  const startVUs = parsePositiveInteger(
    __ENV.K6_START_VUS || '5',
    'K6_START_VUS'
  );

  const stepVUs = parsePositiveInteger(
    __ENV.K6_STEP_VUS || '5',
    'K6_STEP_VUS'
  );

  const maxVUs = parsePositiveInteger(
    __ENV.K6_MAX_VUS || '25',
    'K6_MAX_VUS'
  );

  if (startVUs > maxVUs) {
    throw new Error(
      'K6_START_VUS não pode ser maior que K6_MAX_VUS.'
    );
  }

  const holdDuration =
    __ENV.K6_HOLD_DURATION || '30s';

  const rampDuration =
    __ENV.K6_RAMP_DURATION || '10s';

  const rampDownDuration =
    __ENV.K6_RAMP_DOWN_DURATION || '20s';

  const targets = [];

  for (
    let target = startVUs;
    target <= maxVUs;
    target += stepVUs
  ) {
    targets.push(target);
  }

  if (targets[targets.length - 1] !== maxVUs) {
    targets.push(maxVUs);
  }

  const stages = [
    {
      duration: holdDuration,
      target: targets[0]
    }
  ];

  for (const target of targets.slice(1)) {
    stages.push(
      {
        duration: rampDuration,
        target
      },
      {
        duration: holdDuration,
        target
      }
    );
  }

  stages.push({
    duration: rampDownDuration,
    target: 0
  });

  return {
    executor: 'ramping-vus',
    startVUs,
    stages,
    gracefulRampDown: '30s',
    gracefulStop: '10s'
  };
}

function createConstantScenario() {
  const vus = parsePositiveInteger(
    __ENV.K6_VUS || '500',
    'K6_VUS'
  );

  const duration =
    __ENV.K6_DURATION || '5m';

  return {
    executor: 'constant-vus',
    vus,
    duration,
    gracefulStop: '10s'
  };
}

if (!['ramp', 'constant'].includes(PROFILE)) {
  throw new Error(
    'K6_PROFILE deve ser "ramp" ou "constant".'
  );
}

export const options = {
  scenarios: {
    booking_list_load:
      PROFILE === 'constant'
        ? createConstantScenario()
        : createRampingScenario()
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
  const response = http.get(
    `${BASE_URL}/booking`,
    {
      headers: {
        Accept: 'application/json'
      },
      tags: {
        endpoint: 'GET /booking',
        profile: PROFILE
      }
    }
  );

  check(response, {
    'status deve ser 200': (res) =>
      res.status === 200,

    'content-type deve ser JSON': (res) =>
      res.headers['Content-Type']
        ?.includes('application/json') ?? false,

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
