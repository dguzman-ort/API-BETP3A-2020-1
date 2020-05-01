const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

// Path to your file permissions provided by Firebase (need to get the credentials in configuration)
var serviceAccount = require("./permissions.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://be-tp3-a.firebaseio.com"
});
const db = admin.firestore();


app.get('/hello-world', (req, res) => {
    return res.status(200).send('Hello World!');
});

// create
app.post('/api/create', (req, res) => {
    (async () => {
        try {
            await db.collection('items').doc('/' + req.body.id + '/')
                .create(req.body);
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// read item
app.get('/api/read/:item_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('items').doc(req.params.item_id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// read all
app.get('/api/read', (req, res) => {
    (async () => {
        try {
            let query = db.collection('items');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                // eslint-disable-next-line promise/always-return
                for (let doc of docs) {
                    /* const selectedItem = {
                        id: doc.id,
                        item: doc.data().item
                    }; */
                    const selectedItem = doc.data()
                    selectedItem.id = doc.id
                    response.push(selectedItem);
                }
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// update
app.put('/api/update/:item_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('items').doc(req.params.item_id);
            await document.update(req.body);
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// delete
app.delete('/api/delete/:item_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('items').doc(req.params.item_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

exports.app = functions.https.onRequest(app);