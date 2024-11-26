import {Router} from 'express'
import bcryptjs from  "bcryptjs";
import pool from '../database.js'
import { methods as authorization } from '../middlewares/authorization.js'
const router = Router()
router.get('/admin/new-client',authorization.soloAdmin, (req,res)=>{
    res.render('clients/add')
})
router.get('/register'), (req,res) =>{
    res.redirect('/register')
}
router.post('/register', async (req, res) => {
    try {
        console.log(req.body);
        const { user, password, name, dni, genre, phone, adress } = req.body;

        if (!user || !password || !name || !dni || !genre || !phone || !adress) {
            return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
        }
        const [existingUser] = await pool.query('SELECT * FROM clients WHERE user = ?;', [user]);
        if (existingUser.length > 0) {
            return res.status(400).send({ status: "Error", message: "Este email ya está registrado" });
        }
        const [existingDNI] = await pool.query('SELECT * FROM clients WHERE user = ?;', [dni]);
        if (existingDNI.length > 0) {
            return res.status(400).send({ status: "Error", message: "Este documento ya está registrado, verifica si ya creaste una cuenta anteriormente" });
        }
        const salt = await bcryptjs.genSalt(5);
        const hashPassword = await bcryptjs.hash(password, salt);
        const newclient = {
            user,
            password: hashPassword,
            name,
            dni,
            genre,
            phone,
            adress
        };
        await pool.query('INSERT INTO clients SET ?;', [newclient]);
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
router.get('/admin/clients',authorization.soloAdmin, async(req,res)=>{
    try{
        const [ result ] = await pool.query('SELECT * FROM clients;')
        res.render('clients/list', { clients: result, section: 'clients' });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
})
router.get('/admin/edit-client/:id',authorization.soloAdmin, async (req,res)=>{
    try{
        const {id}= req.params;
        const [cliente] = await pool.query('SELECT * FROM clients WHERE user = ?;',[id]);
        const clientEdit= cliente[0];
        res.render('clients/edit',{client: clientEdit,section: 'clients'});
        }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
})
router.post('/admin/edit-client/:id',authorization.soloAdmin,async (req,res)=>{
    try{
        const {user,password,name,dni,genre,phone,adress}= req.body;
        const editClient= {user,name,dni,genre,phone,adress};
        const {id} = req.params;
        if (password) {
            const salt = await bcryptjs.genSalt(5);
            editClient.password = await bcryptjs.hash(password, salt);
        }
        await pool.query('UPDATE clients SET ? WHERE user= ?;',[editClient,id])
        res.redirect('/admin/clients')
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
})
router.get('/admin/delete-client/:user',authorization.soloAdmin,async (req,res)=>{
    try{
        const {user} = req.params
        await pool.query('DELETE FROM clients WHERE user = ?;',[user])
        res.redirect('/admin/clients',{section: 'clients'})
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
})
export default router;