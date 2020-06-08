const axios = require('axios');
const functions = require('firebase-functions');

const { BASE_URL, getToken, validateLink } = require('./utils');

exports.getPlaylistInfo = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(400).json({ message: 'Invalid request' });
  }

  const link = req.query.link;
  const result = validateLink(link);
  if (!result.isValid) {
    return res.status(400).json({ message: 'Invalid link' });
  }

  const platform = result.platform;
  const token = await getToken(platform);
  const headers = { Authorization: `bearer ${token}` };
  const url = `${BASE_URL}${platform}/?link=${link}`;

  const response = await axios.get(url, { headers });
  if (!response.data.isValid) {
    return res.status(400).json({ message: 'Invalid link' });
  }
  return res.status(200).json(response.data.playlist);
});
