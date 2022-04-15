import sha256 from 'crypto-js/sha256'

// 得到hash字符串
const getHash = (str) => {
  return sha256(str);
};

export default {
  getHash,
};
