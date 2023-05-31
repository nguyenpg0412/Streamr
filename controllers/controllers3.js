const request = require("request");

module.exports = {
  getBhSign: () => {
    let z = Math.floor(1e16 * Math.random()).toString();
    let n = Date.now();
    let o = Math.floor(1e16 * Math.random()).toString();
    const bhSign = (z + o).slice(-25) + "" + n + (o + z).slice(-15);
    return bhSign;
  },

  getAccessToken: (walletAddress, bhSign) => {
    try {
      const data = {
        project_id: "63456507ba638384ae7afd0f",
        client_id: "AdsQDSM3Ahge7BqaQ6Nhftq",
        client_secret: "NZbeT95tzAUqmsRh4ZpCVsPv",
        grant_type: "client_credentials",
        scope: "bounty user notification survey form",
        wallet_id: walletAddress,
        wallet: "metamask",
        token: "",
      };
      const options = {
        url: "https://frens-api.streamr.network/token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "bh-signature": bhSign,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
        },
        form: data,
        // Add the proxy here
        proxy: "http://192.168.101.10:10007",
        timeout: 10000,
        proxyTimeout: 5000,
      };

      return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            const data = JSON.parse(body);
            resolve(data);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  },

  postRef: async (refId, token, bhSign) => {
    const data = JSON.stringify({
      utm: "web",
      referral_id: refId,
    });

    const options = {
      method: "POST",
      url: "https://frens-api.streamr.network/User?campaign=634565c3ba638384ae7afd21",
      headers: {
        origin: "https://frens.streamr.network",
        "sec-fetch-mode": "cors",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "bh-signature": bhSign,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
      },
      body: data,
      proxy: "http://192.168.101.10:10007",
      timeout: 10000,
      proxyTimeout: 5000,
    };

    return new Promise((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  },

  postInf: async (userName, mailName, token, bhSign) => {
    const data = JSON.stringify({
      username: userName,
      email: mailName,
      recaptcha: null,
    });

    const options = {
      method: "PUT",
      url: "https://frens-api.streamr.network/User/update?campaign=634565c3ba638384ae7afd21",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "bh-signature": bhSign,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
      },
      body: data,
      proxy: "http://192.168.101.10:10007",
      timeout: 10000,
      proxyTimeout: 5000,
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          console.log(data);
          resolve(JSON.stringify(body));
        }
      });
    });
  },

  getCompainInf: async (token, bh_sign) => {
    const options = {
      method: "GET",
      url: "https://frens-api.streamr.network/User/information?campaign=634565c3ba638384ae7afd21",
      headers: {
        Authorization: `Bearer ${token}`,
        "bh-signature": bh_sign,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
      },
      proxy: "http://192.168.101.10:10007",
      timeout: 10000,
      proxyTimeout: 5000,
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(body).data);
        }
      });
    });
  },

  solveCaptcha: async (i, j, sessionId, token, bhSign) => {
    const data = JSON.stringify([`${i}`, `${j}`]);
    const options = {
      method: "POST",
      url: `https://frens-api.streamr.network/card?session_id=${sessionId}&campaign=634565c3ba638384ae7afd21`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "bh-signature": bhSign,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
      },
      body: data,
      proxy: "http://192.168.101.10:10007",
      timeout: 10000,
      proxyTimeout: 5000,
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(body));
        }
      });
    });
  },

  verifyMail: async (bhSign, token) => {
    const options = {
      method: "POST",
      url: "https://frens-api.streamr.network/send-confirmation-mail?campaign=634565c3ba638384ae7afd21",
      proxy: "http://192.168.101.10:10007",
      headers: {
        "bh-signature": bhSign,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({}),
      timeout: 10000,
      proxyTimeout: 5000,
    };
    return new Promise((resolve, reject) => {
      request(options, function (error, response) {
        if (error) {
          reject(error);
        } else {
          resolve(response.body);
        }
      });
    });
  },

  setAvatar: async (token, bhSign) => {
    const options = {
      method: "POST",
      url: "https://frens-api.streamr.network/User/avatar?avatar_number=1&campaign=634565c3ba638384ae7afd21",
      proxy: "http://192.168.101.10:10007",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
        "bh-signature": bhSign,
      },
      body: JSON.stringify({}),
      timeout: 10000,
      proxyTimeout: 5000,
    };

    // Wrapping the request in a Promise
    return new Promise(function (resolve, reject) {
      request(options, function (error, response) {
        if (error) {
          reject(error);
        } else {
          resolve(response.body);
        }
      });
    });
  },

  getConfirmLink: async (confirmLink) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/html");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "manual",
      timeout: 10000,
      proxyTimeout: 5000,
    };

    return new Promise(function (resolve, reject) {
      fetch(confirmLink, requestOptions)
        .then((response) => response.text())
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  },

  confirmRef: async (confirmToken, bhSign, accessToken) => {
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        url: `https://frens-api.streamr.network/user/confirm-mail?token=${confirmToken}&campaign=634565c3ba638384ae7afd21a`,
        headers: {
          "bh-signature": bhSign,
          authorization: `Bearer ${accessToken}`,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        },
        proxy: "http://192.168.101.10:10007",
        timeout: 10000,
        proxyTimeout: 5000,
      };

      request(options, function (error, response) {
        if (error) {
          reject(error);
        } else {
          resolve(response.body);
        }
      });
    });
  },

  spinReward: async (accessToken, bhSign) => {
    return new Promise((resolve, reject) => {
      var request = require("request");
      var options = {
        method: "POST",
        url: "https://frens-api.streamr.network/jackpot?campaign=634565c3ba638384ae7afd21",
        proxy: "http://192.168.101.10:10007",
        timeout: 10000,
        proxyTimeout: 5000,
        headers: {
          authorization: `Bearer ${accessToken}`,
          "bh-signature": bhSign,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      };
      request(options, function (error, response) {
        if (error) {
          reject(error);
        } else {
          resolve(response.body);
        }
      });
    });
  },
};
