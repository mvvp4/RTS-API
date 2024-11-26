const express= require('express')
const {PrismaClient} = require('@prisma/client')
const app=express()

app.use(express.json())

app.get('/',(req,res)=>
{
    res.send('Hola mundo')
}
)
//crear un registro
app.post('/register-service', async(req, res)=>{
    const {Servicio,Modalidad,Contenido,Cuota,Disponibilidad} = req.body
    const result= await prisma.servicios.create({
        data: {
            Servicio,
            Modalidad,
            Contenido,
            Cuota,
            Disponibilidad
        }
        
    })
    return res.json(result)
})
app.get("/services",async(req,res)=>{
    const posts = await prisma.servicios.findMany()
    res.json(posts)
})
app.put("/update-service/:Id",async(req,res)=>{
    const {Id} = req.params
    const {Servicio,Modalidad,Contenido,Cuota,Disponibilidad} = req.body
    const post = await prisma.servicios.update({
        where: {id: Number(id)},
        data: {Servicio,Modalidad,Contenido,Cuota,Disponibilidad}
    })
    return res.json(post)
})
app.listen(3000, ()=>{
    console.log('Server ready at: htt://localhost:3000')
})