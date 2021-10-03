const { client } = require('../../../server/');

exports.helpful = (req, res) => {
  const query = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = $1;`;
  client.query(query, [req.params.review_id])
    .then(response => res.sendStatus(200))
    .catch(err => console.log(err))
};