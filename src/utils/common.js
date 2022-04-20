import md5 from 'crypto-js/md5'

// 得到hash字符串
const getHash = (str) => {
  return md5(str);
};

export default {
  getHash,
};
