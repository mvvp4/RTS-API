import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv"
import { usuarios,usuariosroot } from "../controllers/authentication.controllers.js";

dotenv.config()

function soloAdmin(req,res,next){
    const Logeado = revisarCookieROOT(req)
    if(Logeado) return next()
    return res.redirect("/")
}
function soloPublico(req,res,next){
    const LogeadoROOT = revisarCookieROOT(req)
    const Logeado = revisarCookie(req)
    if(!LogeadoROOT) return next()
    if(LogeadoROOT) return res.redirect("/admin")
    if(!Logeado) return next()
    if(Logeado) return res.redirect("/")
}
function revisarCookie(req,res,next){
    try{
        const cookieJWT = req.headers.cookie?.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4)
        console.log("COOKIE",cookieJWT)
        const decodificada = jsonwebtoken.verify(cookieJWT,process.env.JWT_SECRET)
        console.log(decodificada)
        const usuarioRevisar = usuarios.find(usuario => usuario.user === decodificada.user)
        console.log(usuarioRevisar)
        if(!usuarioRevisar){ 
            return false;
        }
        return true;
    }
    catch{
        return false
    }
}
function revisarCookieROOT(req,res,next){
    try{
        const cookieJWT = req.headers.cookie?.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4)
        console.log("COOKIE",cookieJWT)
        const decodificada = jsonwebtoken.verify(cookieJWT,process.env.JWT_SECRET)
        console.log(decodificada)
        const usuarioRevisar = usuariosroot.find(usuario => usuario.user === decodificada.user)
        console.log(usuarioRevisar)
        if(!usuarioRevisar){ 
            return false;
        }
        return true;
    }
    catch{
        return false
    }
}
export const methods ={
    soloAdmin,
    soloPublico
}