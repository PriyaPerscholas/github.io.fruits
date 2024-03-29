const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
       name: { type: String, required: true },
       color: { type: String, required: true },
       readyToEat: Boolean
});

const Fruit = mongoose.model('Fruit', fruitSchema);

module.exports = Fruit;

//this is done before mangoose db class
// const fruits = [
//        {
//               name: 'apple',
//               color: 'red',
//               readyToEat: true
//        },
//        {
//               name: 'pear',
//               color: 'green',
//               readyToEat: false
//        },
//        {
//               name: 'banana',
//               color: 'yellow',
//               readyToEat: true
//        }
// ];
// //at the bottom of /models/fruits.js
// module.exports = fruits;