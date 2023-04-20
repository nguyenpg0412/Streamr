const str = '<a href="https://frens.streamr.network/mail/activation?token=6c11ad24ffde5bac2e0be87ff228894b">Found</a>';

const regex = /<a href="(.*?)">.*?<\/a>/;
const match = str.match(regex);

if (match && match[1]) {
  const href = match[1];
  console.log(href); // Output: https://frens.streamr.network/mail/activation?token=6c11ad24ffde5bac2e0be87ff228894b
} else {
  console.log('No link found.');
}