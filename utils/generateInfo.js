const random_name = require("node-random-name");
const crypto = require("crypto");
const { ethers } = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/"
);
const request = require("request");

const mailJs = require("@cemalgnlts/mailjs");
const parseObj = (obj) => {
  return JSON.parse(obj);
};

async function generateMail() {
  let mailName = null;
  const options = {
    method: "POST",
    url: "https://api.internal.temp-mail.io/api/v3/email/new",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      min_name_length: 10,
      max_name_length: 10,
    }),
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    mailName = parseObj(response.body);
  });

  return mailName;
}

async function generateUser() {
  try {
    const userName = random_name({ first: true }) + random_name({ last: true });
    const mailObj = new mailJs();
    const jsonObj = await mailObj.createOneAccount();
    const mailName = await jsonObj.data.username;
    const mailPass = await jsonObj.data.password;
    if ((userName, mailName, mailPass))
      return { userName, mailName, mailPass, mailObj };
  } catch (error) {
    console.log(error);
  }
}

async function generateWallet() {
  const id = crypto.randomBytes(32).toString("hex");
  const privateKey = "0x" + id;
  try {
    const signer = new ethers.Wallet(privateKey, provider);
    const walletAddress = signer.address;
    if (signer) return { privateKey, walletAddress };
  } catch (error) {
    console.log(error);
  }
}

async function getMailContent(mailObj) {
  for (let i = 0; i < 6; i++) {
    const getMsg = await mailObj.getMessages();
    const [msg] = await getMsg.data;
    if (msg == undefined) {
      console.log("Getting Message...");
      await timer(1500);
    } else {
      console.log("Get Message Success!");
      const msgIdd = await msg.id;
      const getMsgById = await mailObj.getMessage(msgIdd);
      const htmlArr = await getMsgById.data.html;
      const hrefRegex = /href=(["'])(.*?)\1/g;
      const hrefValues = htmlArr
        .join("")
        .match(hrefRegex)
        .map((match) => match.slice(6, -1));
      return hrefValues[1];
    }
    if (i == 5) {
      console.log("danm, captcha is sucked");
      return false;
    }
  }
}

// async function getMailContentV2() {

// }
const timer = (ms) => new Promise((res) => setTimeout(res, ms));

module.exports = { generateUser, generateWallet, getMailContent, generateMail };
