const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4zx1pf4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();

        const chefCollection = client.db('restaurent-food').collection('chef');

        const bookingCollection = client.db('restaurent-food').collection('booking');

        const sharedReceipeCollection = client.db('restaurent-food').collection('sharedReceipe');

        const dailyFoodCollection = client.db('restaurent-food').collection('dailyFood');

        const reviewCollection = client.db('restaurent-food').collection('review');

        const menuCollection = client.db('restaurent-food').collection('menu');


        // const indexKeys = { category: 1, name: 1 };

        // const indexOptions = { name: 'nameCategory' };

        // const result = await menuCollection.createIndex(indexKeys, indexOptions);


        // Search
        app.get('/menuSearch/:text', async (req, res) => {
            const searchText = req.params.text;
            const result = await menuCollection
                .find({
                    $or: [
                        { category: { $regex: searchText, $options: 'i' } },
                        { name: { $regex: searchText, $options: 'i' } }
                    ]
                })
                .toArray();
            res.send(result);
        });



        // get chef
        app.get('/chef', async (req, res) => {
            const result = await chefCollection.find().toArray();
            res.send(result);
        })

        // get daily food
        app.get('/dailyFood', async (req, res) => {
            const result = await dailyFoodCollection.find().toArray();
            res.send(result);
        })

        // get review
        app.get('/review', async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result);
        })

        // get menu
        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result);
        })


        // single data load from journal Data
        app.get('/chef/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const options = {
                projection: {
                    img: 1,
                    name: 1,
                    email: 1,
                    first_receipe: 1,
                    second_receipe: 1,
                    third_receipe: 1,
                    img1: 1,
                    img2: 1,
                    img3: 1,
                    description1: 1,
                    description2: 1,
                    description3: 1

                }
            }

            const result = await chefCollection.findOne(query, options);
            res.send(result);
        });


        // post booking
        app.post('/booking', async (req, res) => {
            const newItem = req.body;
            newItem.createdAt = new Date(); // Fix the typo (new(Data()) to new Date())
            const result = await bookingCollection.insertOne(newItem);
            res.send(result); // Send back the inserted document
        });



        // get booking
        app.get('/bookingData', async (req, res) => {
            const result = await bookingCollection.find().sort({ createdAt: -1 }).toArray();
            res.send(result);
        })

        // get some booking
        app.get('/booking', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await bookingCollection.find(query).sort({ createdAt: -1 }).toArray();
            res.send(result);
        })


        // delete booking
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })

        // get single booking
        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await bookingCollection.findOne(query);
            res.send(result);

        })


        // update booking
        app.put('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedBooking = req.body;

            const booking = {
                $set: {
                    date: updatedBooking.date,
                    number: updatedBooking.number,
                    table: updatedBooking.table,
                    message: updatedBooking.message
                }
            }

            const result = await bookingCollection.updateOne(filter, booking, options);
            res.send(result)

        })


        // post shared receipe
        app.post('/sharedReceipe', async (req, res) => {
            const newItem = req.body;
            newItem.createdAt = new Date();
            const result = await sharedReceipeCollection.insertOne(newItem);
            res.send(result);
        })


        // get some shared receipe
        app.get('/sharedReceipe', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await sharedReceipeCollection.find(query).sort({ createdAt: -1 }).toArray();
            res.send(result);
        })


        // get shared receipe
        app.get('/sharedReceipeAll', async (req, res) => {
            const result = await sharedReceipeCollection.find().sort({ createdAt: -1 }).toArray();
            res.send(result);
        })

        // delete shared receipe
        app.delete('/sharedReceipe/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await sharedReceipeCollection.deleteOne(query);
            res.send(result);
        })


        // get single shared receipe
        app.get('/sharedReceipe/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await sharedReceipeCollection.findOne(query);
            res.send(result);

        })


        // update booking
        app.put('/sharedReceipe/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedShare = req.body;

            const share = {
                $set: {
                    photo: updatedShare.photo,
                    name: updatedShare.name,
                    description: updatedShare.description,
                    ingredient: updatedShare.ingredient
                }
            }

            const result = await sharedReceipeCollection.updateOne(filter, share, options);
            res.send(result)

        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Nabila is comming');
})

app.listen(port, () => {
    console.log(`Nabila is sitting soon ${port}`)
})