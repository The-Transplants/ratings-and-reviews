/* eslint-disable quotes */
/* eslint-disable func-names */
/* eslint-disable import/no-unresolved */
const http = require('k6/http');
const { sleep } = require('k6');

export const options = {
  vus: 100,
  duration: '5s',
};
export default function () {
  http.get('http://localhost:4000/reviews/?product_id=5');
  sleep(1);
}
