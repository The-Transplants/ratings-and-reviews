const { client } = require('../../../server/');

exports.report = (req, res) => {
  const query = `UPDATE reviews SET reported = true WHERE id = $1;`;
  client.query(query, [req.params.review_id])
    .then(response => res.sendStatus(200))
    .catch(err => console.log(err))
};