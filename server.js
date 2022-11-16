const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

mongoose.connect('mongodb://0.0.0.0/quotes_db', {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


const UserSchema = new mongoose.Schema({
    yourName: String,
    yourQuote: String
}, {timestamps: true})
const User = mongoose.model('User', UserSchema)


app.get('/', (req, res) => {
    res.render('index', {error: ''})
})

app.get('/quotes', (req, res) => {
    User.find().sort([['createdAt', 'descending']]).then(
        data => {
            res.render('quotes', {data})
        }
    )
})

app.post('/quotes', (req, res) => {
    console.log(req.body)
    const {yourName, yourQuote} = req.body
    const user = User()
    user.yourName = yourName
    user.yourQuote = yourQuote

    user.save()
        .then(
            () => {
                console.log('save')
                res.redirect('/quotes')
            }
        )
        .catch(
            (error) => {console.log(error)
            res.render('index', {error: error.message})
            })
})


let port = 8000

app.listen(port);
console.log(`server is listening on port ${port}`)
