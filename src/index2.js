const {
  getAccessToken,
  getBhSign,
  postRef,
  postInf,
  getCompainInf,
  solveCaptcha,
  verifyMail,
  setAvatar,
  getConfirmLink,
  confirmRef,
  spinReward,
} = require("../controllers/controllers2");

const {
  generateUser,
  generateWallet,
  getMailContent,
} = require("../utils/generateInfo");
const { connectToMongoDB, addUser } = require("../utils/mongodb.connect");

const refId = "6476f22d0c7c48e4f6193afa";

async function main() {
  const { userName, mailName, mailPass, mailObj } = await generateUser();
  const { privateKey, walletAddress } = await generateWallet();

  let accessToken;
  try {
    //get access token
    const getaccessTokenRs = await getAccessToken(walletAddress, getBhSign());
    accessToken = await getaccessTokenRs.access_token;
    if (!accessToken) {
      console.log("the proxy connection has not been connected");
      return;
    }
    await timer(1000);
    //post ref
    const postRefRs = await postRef(
      refId,
      accessToken.replace(/"/g, ""),
      getBhSign()
    );
    if (!postRefRs) {
      console.log("post ref:", postRefRs);
    }
    await timer(1000);
    // post information
    const postInfRs = await postInf(
      userName,
      mailName,
      accessToken.replace(/"/g, ""),
      getBhSign()
    );
    if (postInfRs) {
      console.log("get access token success!");
    }
    console.log("post information:", postInfRs);

    let sessionId;
    await timer(1000);
    const getaccessTokenRs1 = await getAccessToken(walletAddress, getBhSign());
    accessToken = await getaccessTokenRs1.access_token;
    if (!accessToken) {
      console.log("get access token 2nd success!");
      return;
    }
    // console.log("accesstoken", accessToken);
    // console.log("bh sign", getBhSign());
    await timer(1000);
    const getSessionId = await getCompainInf(
      accessToken.replace(/"/g, ""),
      getBhSign()
    );
    if (!getSessionId) {
      console.log("cannot get session id");
      return;
    }
    sessionId = getSessionId.session_id;
    const userId = getSessionId.id;
    console.log("userid", userId);
    console.log("sessionId", sessionId);
    console.log("get session id Sucess");
    let captchaRs,
      captchaSession,
      isSovled = null;
    const max = 5;
    // Loop through each captcha combination
    for (let i = 0; i <= max; i++) {
      for (let j = 1; j <= max; j++) {
        // Check if the combination is valid
        if (i < j) {
          // Solve the captcha
          captchaRs = await solveCaptcha(
            i,
            j,
            sessionId.replace(/"/g, ""),
            accessToken.replace(/"/g, ""),
            getBhSign()
          );
          isSovled = await captchaRs.data.is_winner;
          captchaSession = captchaRs.data.session_id;

          // Check if the captcha was solved or if the session has changed
          if (isSovled == false && captchaSession == sessionId) {
            console.log("Trying Solve Captcha...");
            await timer(1000);
          } else if (isSovled == false && captchaSession !== sessionId) {
            sessionId = captchaSession;
            console.log("Session has Changed");
          } else if (isSovled == true) {
            console.log("solve captcha success!");
          }
          await timer(1000);
        }
        // Break out of the loop if the captcha has been solved
        if (isSovled == true) {
          break;
        }
      }
      await timer(1000);
    }

    //set avatar
    await timer(1000);

    const setAvatarRs = await setAvatar(accessToken, getBhSign());
    if (!setAvatarRs) {
      console.log("error");
      return;
    }
    console.log(`set avatar success`);

    //get new token
    await timer(1000);

    const getaccessTokenRs2 = await getAccessToken(walletAddress, getBhSign());
    accessToken = await getaccessTokenRs2.access_token;
    if (!accessToken) return;

    // verify mail
    await timer(1000);

    const verifyMailRs = await verifyMail(
      getBhSign(),
      accessToken.replace(/"/g, "")
    );
    if (!verifyMailRs) {
      console.log(verifyMailRs);
      console.log(`request verifycation mail failed success!`);
      return;
    }

    // confirm mail
    let contentMess = null;
    await timer(1000);

    // console.log({ mailName, mailPass });
    contentMess = await getMailContent(mailObj);
    if (contentMess) {
      console.log(`get confirm link success`);
    } else {
      return;
    }

    //get confirm link
    const getConfirmLinkRs = await getConfirmLink(contentMess);
    const regex = /token=([\w-]+)/;
    const match = regex.exec(getConfirmLinkRs);
    let confirmToken = null;
    if (!match) {
      console.log("confirm token failed");
      return;
    }
    confirmToken = match[1];
    console.log(confirmToken); // Output: b1e88e7f87164b500c84ab78f7c00b99
    const confirmRefRs = await confirmRef(
      confirmToken,
      getBhSign(),
      accessToken
    );
    console.log(confirmRefRs);

    for (let i = 0; i < 3; i++) {
      const spinRewardRs = await spinReward(accessToken, getBhSign());
      const spinRs = JSON.parse(spinRewardRs).data;
      const { slot_1, slot_2, slot_3 } = spinRs;

      if ((slot_1 === slot_2) === slot_3 && slot_1 <= 11) {
        const reward = slot_1;
        await connectToMongoDB();
        await addUser(userId, walletAddress, privateKey, mailName, mailPass, reward);
      }
      console.log("spinning turn:", spinRs);
    }

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
}

main();

// module.exports = { main };

const timer = (ms) => new Promise((res) => setTimeout(res, ms));
