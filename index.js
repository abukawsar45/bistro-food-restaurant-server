const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 4700;

// middleware
app.use(cors());
app.use(express.json());

// const uri = 'mongodb://0.0.0.0:27017'
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9lqzgjv.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const menuCollection = client.db('bistroDb').collection('menu')
    const reviewCollection = client.db('bistroDb').collection('reviews')
    const cartCollection = client.db('bistroDb').collection('carts')

    app.get('/menu', async (req, res) => {
      const result = await menuCollection.find().toArray()
      // console.log(result)
      res.send(result)
    })
    
    app.get('/reviews', async (req, res) => {
      const result = await reviewCollection.find().toArray()
      // console.log(result)
      res.send(result)
    })
    
    // cart collection apis

    app.get('/carts', async (req, res) => {
      const email = req.query.email
      // console.log(email);
      if(!email){
        return res.send([]);
        // console.log('---52');
      }
       const query = { email: email };
       const result = await cartCollection.find(query).toArray();
       res.send(result);
      //  console.log('----56',result);
    })

    app.post('/carts', async (req, res) => {
      const item = req.body;
      // console.log(item);
      const result = await cartCollection.insertOne(item);
      res.send(result);
    })

    app.delete('/carts/:id' , async (req, res) => {
      const id = req.params.id;
      // console.log({id});
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })
    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('all done')
})

app.listen(port, () => {
  console.log(`bistro boss server listening on port ${port}`);
})