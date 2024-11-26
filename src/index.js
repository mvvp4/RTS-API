import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser';
import servicesRoutes from './routes/services.routes.js'
import clientsRoutes from './routes/users.routes.js'
import { methods as authentication} from './controllers/authentication.controllers.js';
import { methods as authorization} from './middlewares/authorization.js';
//codigo para configurar el reconocimiento de las carpetas a partir de la ubicacion raiz de la aplicacion
import path, { extname, join } from 'path';
import {fileURLToPath} from 'url';
import { create } from 'express-handlebars';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//server
const app = express()
//para que express lea json
app.use(express.json());

app.use(cookieParser())

app.use(morgan('dev'))

app.use(cors())

app.set('port', process.env.PORT || 4000)
app.listen(app.get('port'), ()=>
    console.log('Server listening on port', app.get('port')))

//configuracion de estaticos (es decir que nose van a modificar)
app.use(express.static(__dirname + "/public"))
//configuracion de plantillas (a lo que entendi son como modulos pero de htmls)
app.set('views', join(__dirname, 'pages')); // la convención de Express
const hbs = create({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.use(express.urlencoded({
    extended: false
}))
//rutasssss

app.get("/",authorization.soloPublico,(req,res)=> res.sendFile(__dirname + '/index.html'))
app.get("/services",authorization.soloPublico,(req,res)=> res.sendFile(__dirname + '/pages/public-services.html'))
app.get("/login",authorization.soloPublico,(req,res)=> res.sendFile(__dirname + '/pages/login.html'))
app.get("/register",(req,res)=> res.sendFile(__dirname + '/pages/register.html'))
app.get("/employeer",authorization.soloPublico,(req,res)=> res.sendFile(__dirname + '/pages/login-employee.html'))
app.get("/admin",authorization.soloAdmin,(req,res)=> res.sendFile(__dirname + '/pages/admin/admin.html'))
//app.get("/admin/system-services",authorization.soloAdmin,(req,res)=> res.sendFile(__dirname + '/pages/admin/services.html'))

//app.get("/admin/system-services",authorization.soloAdmin,(req,res)=>{
//    res.render('index')
//})
app.use(clientsRoutes)
app.use(servicesRoutes)
app.post("/api/login",authentication.login)
app.post("/api/loginroot",authentication.loginemployee)