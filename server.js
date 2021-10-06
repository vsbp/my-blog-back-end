const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const app = express()
const { MongoClient, ObjectId } = require('mongodb');

const quotes = require('./blog')
const multerConfig = require('./multer')
const uploads = multer(multerConfig)

const url = 'mongodb+srv://admin:admin@cluster0.tqnhj.mongodb.net/test?retryWrites=true&w=majority';

  MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    // ...
    const db = client.db('globo')
    const quotesCollection = db.collection('quotes')
    app.use(express.static('public'))
    app.use(cors())
    app.use(express.json())
    app.use('/uploads', express.static(path.resolve(__dirname, './', 'uploads')))

    app.use(express.urlencoded({ extended: true }))

    app.get('/blog', (req, res) => {
       db.collection('quotes').find().toArray()
      .then(results => {
       return res.send (results)
      })
      .catch(error => console.error(error))
    })

    app.get('/blog/:id', (req, res) => {
      const { id } = req.params
      db.collection('quotes').find({_id: ObjectId(id)}).toArray()
     .then(results => {
      return res.send (results[0])
     })
     .catch(error => console.error(error))
   })

    app.post('/blog', uploads.single('file'), (req, res) => {
      console.log(req.body)
      const obj = {
        title: req.body.title,
        subTitle: req.body.subTitle,
        image: req.file.filename,
        texto: req.body.texto,
        autor: req.body.autor
      }
      quotesCollection.insertOne(obj)
    .then(result => {
      res.send(result)
    })
    .catch(error => console.error(error))
    })

    app.put('/blog/:id', uploads.single('file'), (req, res) => {
      const { id } = req.params
      quotesCollection.updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            'title': req.body.title,
            'subTitle': req.body.subTitle,
            'image': req.file.filename,
            'texto': req.body.texto,
            'autor': req.body.autor
          }
        },
        {
          upsert: true
        }
      )
      .then(result => {
        res.json('Success')
     })
    .catch(error => console.error(error))
    })

   
    app.delete('/blog/:id', (req, res) => {
      const {id} = req.params;
      quotesCollection.deleteOne(
        { _id: ObjectId(id) }
      )
      .then(result => {
        if (result.deletedCount === 0) {
          return res.json('Não foi deletado')
        }
        res.json(`Deletado`)
      })
      .catch(error => console.error(error))
  })

  app.listen(3001, function() {
    console.log('listening on 3001')
  })

  })
  .catch(console.error)