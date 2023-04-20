const { getAccessToken, getBhSign, postRef, postInf, getCompainInf, solveCaptcha, verifyMail, setAvatar, getConfirmLink, confirmRef } = require('../controllers/controllers');

const { generateUser, generateWallet, getMailContent } = require('../utils/generateInfo');
const { insertUserData, insertConfirmLink } = require('../utils/mongodb_connection');

const refId = '6426b05f4b6e60ebf52ac69a';

(async () => {
    const { userName, mailName, mailPass, mailObj } = await generateUser();
    const { privateKey, walletAddress } = await generateWallet();

    let accessToken;
    try {
        //get access token
        const getaccessTokenRs = await getAccessToken(walletAddress, getBhSign());
        accessToken = await getaccessTokenRs.access_token;
        if (accessToken !== undefined) { console.log('get access token success!') };
        await timer(1000);
        //post ref
        const postRefRs = await postRef(refId, accessToken.replace(/"/g, ""), getBhSign());
        if (postRefRs) { console.log("post ref:", postRefRs); };
        await timer(1000);
        // post information
        const postInfRs = await postInf(userName, mailName, accessToken.replace(/"/g, ""), getBhSign());
        if (postInfRs) { console.log('get access token success!') };
        console.log("post information:", postInfRs);
    } catch (error) {
        console.log(error);
        process.exit();
    }

    let sessionId;
    try {
        await timer(1000);
        const getaccessTokenRs = await getAccessToken(walletAddress, getBhSign());
        accessToken = await getaccessTokenRs.access_token;
        if (accessToken) {
            console.log('get access token 2nd success!');
            //solve captcha
            sessionId = await getCompainInf(accessToken.replace(/"/g, ""), getBhSign());
            console.log("get session id Sucess");
            let captchaRs, captchaSession, isSovled = null;
            const max = 5;
            const maxTry = 0;
            // Loop through each captcha combination
            for (let i = 0; i <= max; i++) {
                for (let j = 1; j <= max; j++) {
                    // Check if the combination is valid
                    if (i < j) {
                        // Solve the captcha
                        captchaRs = await solveCaptcha(i, j, sessionId.replace(/"/g, ""), accessToken.replace(/"/g, ""), getBhSign());
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
        }

        //set avatar
        await timer(1000);
        try {
            const setAvatarRs = await setAvatar(accessToken, getBhSign());
            if (setAvatarRs) console.log(`set avatar success`);
        } catch (error) {
            console.log(error);
            process.exit();
        }

        //get new token
        await timer(1000);
        try {
            const getaccessTokenRs = await getAccessToken(walletAddress, getBhSign());
            accessToken = await getaccessTokenRs.access_token;
            if (getaccessTokenRs) console.log(`get 3rd token success`);
        } catch (error) {
            console.log(error);
            process.exit();
        }

        // verify mail
        await timer(1000);
        try {
            const verifyMailRs = await verifyMail(getBhSign(), accessToken.replace(/"/g, ""));
            if (verifyMailRs) {
                console.log(verifyMailRs);
                console.log(`request verifycation mail success!`);
            }
        } catch (error) {
            console.log(error);
            process.exit();
        }

        // confirm mail
        let contentMess = null;
        await timer(1000);
        try {
            console.log({ mailName, mailPass });
            contentMess = await getMailContent(mailObj);
            if (contentMess) {
                console.log(`get confirm link success`);
            } else {
                return;
            }

        } catch (error) {
            console.log(error);
            process.exit();
        }

        //get confirm link
        try {
            const getConfirmLinkRs = await getConfirmLink(contentMess);
            const regex = /token=([\w-]+)/;
            const match = regex.exec(getConfirmLinkRs);
            let confirmToken = null;
            if (match) {
                confirmToken = match[1];
                console.log(confirmToken); // Output: b1e88e7f87164b500c84ab78f7c00b99
                const confirmRefRs = await confirmRef(confirmToken, getBhSign(), accessToken);
                console.log(confirmRefRs);
            } else {
                console.log('Token not found');
            }
        } catch (error) {
            console.log(error);
            process.exit();
        }

        console.log('done');
    } catch (error) {
        console.log(error);
        process.exit();
    }

})();

const timer = ms => new Promise(res => setTimeout(res, ms));
