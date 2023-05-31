
const request = require('request');

// var options = {
//   'method': 'GET',
//   'url': 'https://api.internal.temp-mail.io/api/v3/email/a6v25xahxk@dishcatfish.com/messages',
//   'headers': {
//   }
// };
// request(options, function (error, response) {
//   if (error) throw new Error(error);
//   const htmlArr = JSON.parse(response.body)[0].body_text;
//   const hrefValues = htmlArr.slice(htmlArr.indexOf('Verify your email ( ') + 19, htmlArr.indexOf(')\n\n('));
//   console.log(hrefValues.trim());
// });

// async function generateMail() {
//   let mailName = null;
// const options = {
//   'method': 'POST',
//   'url': 'https://api.internal.temp-mail.io/api/v3/email/new',
//   'headers': {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     "min_name_length": 10,
//     "max_name_length": 10
//   })

// };
// request(options, function (error, response) {
//   if (error) throw new Error(error);
//   console.log(parseObj(response.body));
// });

// }
const parseObj = obj => { return JSON.parse(obj) };

function generateMail() {
  let mailName = null;
  const options = {
    'method': 'POST',
    'url': 'https://api.internal.temp-mail.io/api/v3/email/new',
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "min_name_length": 10,
      "max_name_length": 10
    })

  };
  return new Promise((resolve, reject) => {
    request(options, (result, err) => {
      if (result) resolve(parseObj(result.body));
      reject(err);
    })
  })



}

(async () => {
  try {
    console.log(await generateMail())
  } catch (error) {
    console.log(error);
  }
})();