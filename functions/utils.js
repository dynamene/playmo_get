const axios = require('axios');

const BASE_URL = 'https://us-central1-play-mo.cloudfunctions.net/';
const PLATFORMS = [
  { name: 'Spotify', link: 'spotify.com' },
  { name: 'Tidal', link: 'tidal.com' },
];

async function getToken(funcName) {
  const metadataServerURL =
    'http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=';
  const url = `${metadataServerURL}${BASE_URL}${funcName}`;
  const headers = { 'Metadata-Flavor': 'Google' };
  const res = await axios.get(url, { headers });
  return res.data;
}

function validateLink(link) {
  if (!link) {
    return { isValid: false };
  }

  let platformName = '';
  for (let platform of PLATFORMS) {
    if (link.includes(platform.link)) {
      platformName = platform.name;
      break;
    }
  }
  if (!platformName) {
    return { isValid: false };
  }

  switch (platformName) {
    case 'Spotify': {
      const regex = new RegExp('https://open.spotify.com/playlist/');
      if (!regex.test(link)) {
        return { isValid: false };
      }
      return { isValid: true, platform: 'spotify' };
    }
    case 'Tidal': {
      const regex = new RegExp('https://tidal.com/browse/playlist/');
      const otherRegex = new RegExp('https://tidal.com/playlist/');
      if (!(regex.test(link) || otherRegex.test(link))) {
        return { isValid: false };
      }
      return { isValid: true, platform: 'tidal' };
    }
  }
}

module.exports = { BASE_URL, getToken, validateLink };
