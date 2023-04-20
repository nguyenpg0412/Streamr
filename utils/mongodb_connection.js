const MongoClient = require('mongodb').MongoClient;

// Connection URL and database name
const uri = 'mongodb://0.0.0.0:27017';
const dbName = 'streamr';

// Create a new MongoClient
const client = new MongoClient(uri, { useUnifiedTopology: true })

// Connect to the MongoDB server
async function connect() {
    return new Promise((resolve, reject) => {
        client.connect()
            .then(() => {
                resolve(console.log("Connect Success!"));
            })
            .catch(function (error) {
                reject(error);
                client.close();
            });
    });
};

async function insertUserData(document) {
    try {
        const db = client.db(dbName);
        const result = await db.collection('users').insertOne(document);
        console.log(`Inserted document with _id: ${result.insertedId}`);
    } catch (error) {
        console.log(error);
        await client.close()
    }
}

async function getConfirmLink() {
    try {
        const db = client.db(dbName);
        const collection = db.collection("confirm_link");
        const documents = await collection.find({}).toArray();
        await client.close();
        return documents;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

async function insertConfirmLink(document) {
    try {
        const db = client.db(dbName);
        const result = await db.collection('confirm_link').insertOne(document);
        console.log(`Inserted document with _id: ${result.insertedId}`);
    } catch (error) {
        console.log(error);
        await client.close();
    }
}



module.exports = { connect, insertUserData, getConfirmLink, insertConfirmLink };
