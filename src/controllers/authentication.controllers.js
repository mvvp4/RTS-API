import bcryptjs from  "bcryptjs";
import JsonWebTokenError from "jsonwebtoken";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv"
 
dotenv.config()
 
export const usuarios = [{
    //no confundir user, user es el email
    name:'a',
    user:'a@gmail.com',
    password:'$2a$05$bSPe1GgU5ClPoRa4lV7JFeV2TTu13MJA6yxr6LNmY0w3iDX1CG.xe'
}]
export const usuariosroot = [{
    name:'a',
    user:'b@gmail.com',
    password:'$2a$05$bSPe1GgU5ClPoRa4lV7JFeV2TTu13MJA6yxr6LNmY0w3iDX1CG.xe',
    tokenaccess:'holanda'
}]
async function loginemployee(req,res){
    console.log(req.body)
    const user = req.body.user;
    const password = req.body.password;
    const tokenaccess= req.body.tokenaccess;
    if(!user || !password || !tokenaccess){
        return res.status(400).send({status:"Error",message:"Los campos estan incompletos"})
    }
    const usuarioRevisar = usuariosroot.find(usuario => usuario.user === user)
    if(!usuarioRevisar){ 
        return res.status(400).send({status:"Error",message:"Error durante el login"})
    }
    const loginCorrecto = await bcryptjs.compare(password,usuarioRevisar.password)
    if(!loginCorrecto){
        return res.status(400).send({status:"Error",message:"Error durante el login, revisar contraseña"})
    }
    const tokenCorrecto = tokenaccess === usuarioRevisar.tokenaccess
    if(!tokenCorrecto){
        return res.status(400).send({status:"Error",message:"Error durante el login"})
    }
    const token= jsonwebtoken.sign({user:usuarioRevisar.user},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRATION}
    )
    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path: "/"
    }
    res.cookie("jwt",token,cookieOption)
    res.send({status:"ok",message:"Usuario Logeado",redirect:"/admin"})
}
async function login(req,res){
    console.log(req.body)
    const user = req.body.user;
    const password = req.body.password;
    if(!user || !password){
        return res.status(400).send({status:"Error",message:"Los campos estan incompletos"})
    }
    const usuarioRevisar = usuarios.find(usuario => usuario.user === user)
    if(!usuarioRevisar){ 
        return res.status(400).send({status:"Error",message:"Error durante el login, revisar usuario"})
    }
    const loginCorrecto = await bcryptjs.compare(password,usuarioRevisar.password)
    if(!loginCorrecto){
        return res.status(400).send({status:"Error",message:"Error durante el login, revisar contraseña"})
    }
    const token= jsonwebtoken.sign({user:usuarioRevisar.user},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRATION}
    )
    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path: "/"
    }
    res.cookie("jwt",token,cookieOption)
    res.send({status:"ok",message:"Usuario Logeado",redirect:"/admin"})
}
async function register(req,res){
    const { user, name, password, dni, genre, phone, adress } = req.body;
    if(!user || !password || !name || !dni || !genre || !phone || !adress )
    {
        return res.status(400).send({status:"Error", message: "Los campos estan incompletos"})
    }
    /*const usuarioRevisar = usuarios.find(usuario => usuario.user === user);
    if(usuarioRevisar){
        return res.status(400).send({status:"Error",message:"Este email ya esta registrado"})
    }
    const salt = await bcryptjs.genSalt(5)
    const hashPassword= await bcryptjs.hash(password,salt)
    const nuevoUsuario = {
        user, name, password: hashPassword, dni, genre, phone,adress
    }
    usuarios.push(nuevoUsuario)
    console.log(usuarios);
    res.status(201).send({status:"ok",message:`Usuario ${nuevoUsuario.user} agregado`,redirect:"/login"})*/

    try {
        const [existeElUser] = await pool.query('SELECT * FROM clients WHERE user = ?;', [user]);
        if (existeElUser.length > 0) {
            return res.status(400).send({ status: "Error", message: "Este email ya está registrado" });
        }

        const salt = await bcryptjs.genSalt(5);
        const hashPassword = await bcryptjs.hash(password, salt);

        const newclient = { user, name, password: hashPassword, dni, genre, phone, adress };
        await pool.query('INSERT INTO clients SET ?;', [newclient]);

        res.status(201).send({ status: "ok", message: `Usuario ${user} agregado`, redirect: "/login" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

export const methods ={
    login,
    register,
    loginemployee

}