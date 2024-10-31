const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const secret = 'mysecret';

app.use(bodyParser.json());
app.use(cookieParser());

function isAuth(req, res, next){

    if(!req.cookies['token']){
        return res.json({
            'success': false,
        }, 401);
    }

    const token = req.cookies['token'];

    jwt.verify(token, secret, (error, decoded) => {
        if(error){
            return res.json({
                'success': false,
            }, 401);
        }

        req.sub = decoded.sub;
        next();
    });
}

app.get('/', isAuth, (req, res) => {
    res.send('Hello World');
});

app.post('/register', async (req, res)=>{
    const user = req.body;
    try{
        await User.create(user).then((user)=>{
            res.send({
                name: user.name,
                email: user.email,
                password: user.password
            });
        });
    }catch(error){
        res.send(error);
    }
});

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    await User.findOne({where: {email, password}}).then((user) => {
        if(user){
            const token = jwt.sign({sub: user.id}, secret);
            res.cookie('token', token);
            res.json({
                'success': true,
            }, 200);
        }else{
            res.json({
                'success': false,
            }, 401);
        }
    });
});

app.get('/users/:id', isAuth, async (req, res) => {
    const {id} = req.params;
    // strict comparison: !== (valor + o tipo da string)
    // loose comparison: != (valor, somente o valor em si) 
    if(req.sub != id){ 
        return res.json({
            'success': false,
        }, 403);
    }

    await User.findByPk(id).then((user) => { //Pk: Primary Key
        if(user){
            res.json({
                name: user.name,
                email: user.email,
                createAt: user.createAt,
            });
        }else{
            res.json({
                'error': 'User not found',
            }, 404);
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});