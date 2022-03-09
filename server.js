require('dotenv').config()
const express = require('express');
const app = express();
const fruits = require('./models/fruits.js'); //NOTE: it must start with ./ if it's just a file, not an NPM package
const mongoose = require('mongoose');
const Fruit = require('./models/fruits.js');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 3000


//Must be first
//middleware
app.use((req, res, next) => {
       console.log('I run for all routes')
       next()
})
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.use(express.static('public')); //tells express to try to match requests with files in the directory called 'public'

//set up view engine
app.set('view engine', 'jsx')
app.engine('jsx', require('express-react-views').createEngine())

app.get('/fruits/seed', (req, res) => {
       Fruit.create([
              {
                     name: 'grapefruit',
                     color: 'pink',
                     readyToEat: true
              },
              {
                     name: 'grape',
                     color: 'purple',
                     readyToEat: false
              },
              {
                     name: 'avocado',
                     color: 'green',
                     readyToEat: true
              }
       ], (err, data) => {
              res.redirect('/fruits');
       })
});


//index route
app.get('/fruits', function (req, res) {
       Fruit.find({}, (error, allFruits) => {
              res.render('Index', {
                     fruits: allFruits
              })
       })
})


// app.get('/fruits/:indexOfFruitsArray', (req, res) => {
//        res.render('Show', {
//               fruit: fruits[req.params.indexOfFruitsArray]
//        })
// })

// //create a page that will allow us to create a new fruit
app.get('/fruits/new', (req, res) => {
       res.render('New');
});

//form POST/create route

app.post('/fruits/', (req, res) => {
       if (req.body.readyToEat === 'on') { //if checked, req.body.readyToEat is set to 'on'
              req.body.readyToEat = true; //do some data correction
       } else { //if not checked, req.body.readyToEat is undefined
              req.body.readyToEat = false; //do some data correction
       }
       //after mangoo db

       Fruit.create(req.body, (error, createdFruit) => {
              res.redirect('/fruits');
       });
});

app.delete('/fruits/:id', (req, res) => {
       Fruit.findByIdAndRemove(req.params.id, (err, data) => {
              res.redirect('/fruits');//redirect back to fruits index
       });
});


// app.get('/fruits/:id', (req, res) => {
//        Fruit.findById(req.params.id, (err, foundFruit) => {
//               res.send(foundFruit);
//        });
// });

app.get('/fruits/:id', (req, res) => {
       Fruit.findById(req.params.id, (err, foundFruit) => {
              res.render('Show', {
                     fruit: foundFruit
              });
       });
});
// fruits.push(req.body);
// console.log(fruits);
// res.send('data received');

//res.redirect('/fruits') //send the user back to fruits
//  });

// app.get('/fruits', (req, res) => {
//        res.render('Index');
// });

//get index:show all
// app.get('/fruits', (req, res) => {
//        Fruit.find({}, (error, allFruits) => {
//               res.render('Index', {
//                      fruits: allFruits
//               });
//        });
// });

// app.delete('/fruits/:id', (req, res) => {
//        res.send('deleting...');
// });

app.delete('/fruits/:id', (req, res) => {
       Fruit.findByIdAndRemove(req.params.id, (err, data) => {
              res.redirect('/fruits');//redirect back to fruits index
       });
});

//create a edit route
app.get('/fruits/:id/edit', (req, res) => {
       Fruit.findById(req.params.id, (err, foundFruit) => { //find the fruit
              if (!err) {
                     res.render(
                            'Edit',
                            {
                                   fruit: foundFruit //pass in found fruit
                            }
                     );
              } else {
                     res.send({ msg: err.message })
              }
       });
});

//PUT :send the edited form
app.put('/fruits/:id', (req, res) => {
       if (req.body.readyToEat === 'on') {
              req.body.readyToEat = true;
       } else {
              req.body.readyToEat = false;
       }
       // Fruit.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedModel) => {
       //        res.send(updatedModel);
       // });
       Fruit.findByIdAndUpdate(req.params.id, req.body, (err, updatedModel) => {
              res.redirect('/fruits');
       });
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
       console.log('connected to mongo');
});

app.listen(PORT, () => {
       console.log('listening');
});