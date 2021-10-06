/* eslint-disable func-names */
/* eslint-disable eqeqeq */
/* eslint-disable import/no-unresolved */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  duration: '10s',
  vus: 100,
};

export default function () {
  let res = http.get('https://localhost:4000/reviews/?product_id=5');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
