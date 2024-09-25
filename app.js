const express= require('express')
const {PrismaClient} = require('@prisma/client')

const prisma= new PrismaClient()
const app=express()

app.use(express.json())

app.get('/',(req,res)=>
{
    res.send('Hola mundo')
}
)
//crear un registro
app.post('/register', async(req, res)=>{
    const {Email,Password,Nombreyapellido,Direccion,Contacto,BilleteraPago,DNI} = req.body
    const result= await prisma.Registrar.create({
        data: {
            Email,
            Password,
            Nombreyapellido,
            Direccion,
            Contacto,
            BilleteraPago,
            DNI
        }
        
    })
    res.json(result)
})
app.get("/clients",async(req,res)=>{
    const posts = await prisma.Registrar.findMany()
    res.json(posts)
})
app.put("/register:Id",async(req,res)=>{
    const {Id} = req.params
    const {Email,Password,Nombreyapellido,Direccion,Contacto,BilleteraPago,DNI} = req.body
    const post = await prisma.Registrar.update({
        where: {id: Number(id)},
        data: {Email,Password,Nombreyapellido,Direccion,Contacto,BilleteraPago,DNI}
    })
    res.json(post)
})
app.listen(3000, ()=>{
    console.log('Server ready at: htt://localhost:3000')
})