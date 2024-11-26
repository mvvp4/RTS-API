import {Router} from 'express'
import pool from '../database.js'
import { methods as authorization } from '../middlewares/authorization.js'
const router = Router()
router.get('/admin/new-service',authorization.soloAdmin, (req,res)=>{
    res.render('services/add')
})
router.post('/admin/new-service',authorization.soloAdmin, async (req,res)=>{
    try{
        console.log(req.body);
        const {name,isactive,price,modality,content,introduction,available_days,schedule_description}= req.body
        const newservice = {
            name,
            isactive,
            modality,
            price,
            introduction,
            content,
            schedule_description
        }
        const [result] = await pool.query('INSERT INTO services SET ?;', [newservice]);
        const serviceId = result.insertId;
        console.log(serviceId)
        //días en la tabla service_days
        if (Array.isArray(available_days)) {
            const dayInsertPromises = available_days.map(day => 
                pool.query('INSERT INTO service_days (service_id, day) VALUES (?, ?)', [serviceId, day])
            );
            await Promise.all(dayInsertPromises);
        }
        
        res.redirect('/admin/services')
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
})
router.get('/admin/services',authorization.soloAdmin, async(req,res)=>{
    try{
        const [ result ] = await pool.query('SELECT * FROM services;')

        res.render('services/list', { services: result, section: 'services' });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
})
router.get('/admin/edit-service/:id',authorization.soloAdmin, async (req,res)=>{
    try{
        const {id}= req.params;
        const [servicio] = await pool.query('SELECT * FROM services WHERE id = ?;',[id]);
        const [dayservices] = await pool.query('SELECT * FROM service_days WHERE service_id = ?;',[id]);
        console.log(dayservices)
        const availableDays = dayservices.map(d => d.day);
        const serviceEdit= servicio[0];
        const days = {
            monday: availableDays.includes("Monday"),
            tuesday: availableDays.includes("Tuesday"),
            wednesday: availableDays.includes("Wednesday"),
            thursday: availableDays.includes("Thursday"),
            friday: availableDays.includes("Friday"),
            saturday: availableDays.includes("Saturday"),
            sunday: availableDays.includes("Sunday")
        };
        console.log(days)
        res.render('services/edit',{servicio: serviceEdit, days, section: 'services'});
        }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
})
router.post('/admin/edit-service/:id',authorization.soloAdmin,async (req,res)=>{
    try{
        const {name,isactive,price,modality,content,introduction,schedule_description,available_days}= req.body;
        const {id} = req.params
        const editService= {name,isactive,price,modality,content,introduction,schedule_description}
        await pool.query('DELETE FROM service_days WHERE service_id = ?', [id]);
        if (Array.isArray(available_days)) {
            const insertalldays = available_days.map(day =>
                pool.query('INSERT INTO service_days (service_id, day) VALUES (?, ?)', [id, day])
            );
            await Promise.all(insertalldays)
            }
        await pool.query('UPDATE services SET ? WHERE id= ?;',[editService,id])
        res.redirect('/admin/services')
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
})
router.get('/admin/delete-service/:id',authorization.soloAdmin,async (req,res)=>{
    try{
        const {id} = req.params
        await pool.query('DELETE FROM services WHERE id = ?;',[id])
        res.redirect('/admin/services')
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
})
router.get('/api/services',authorization.soloPublico, async(req,res)=>{
    try{
        const [result] = await pool.query('SELECT s.*, GROUP_CONCAT(sd.day ORDER BY sd.day ASC) AS service_days FROM services s LEFT JOIN service_days sd ON s.id = sd.service_id GROUP BY s.id;')  
        
        res.json(result)
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
})
router.get('/api/services/:id', authorization.soloPublico, async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `
            SELECT s.*, GROUP_CONCAT(sd.day ORDER BY sd.day ASC) AS service_days FROM services s LEFT JOIN service_days sd ON s.id = sd.service_id WHERE s.id = ? GROUP BY s.id;
            `, 
            [id]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.json(result[0]);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

export default router;