const express = require('express');
const router = express.Router();
const {body, validationResult } = require('express-validator');

const connection = require('../config/db.js');

router.get('/', function (req, res){
    connection.query('select * from kasir order by id_kasir desc',
     function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status: true,
                message: 'Data kasir',
                data: rows
            })
        }
    })
});

router.post('/store', [
    body('nama').notEmpty(),
    body('jenis_kelamin').notEmpty()

],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let Data = {
        nama: req.body.nama,
        jenis_kelamin: req.body.jenis_kelamin

    }
    connection.query('insert into kasir set ?', Data, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        }else{
            return res.status(201).json({
                satus: true,
                message: 'Success..!',
                data: rows[0]
            })
        }
    })
})

router.get('/(:id)', function (req, res) {
    let id = req.params.id;
    connection.query(`select * from kasir where id_kasir = ${id}`, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        }
        if(rows.length <=0){
            return res.status(404).json({
                status: false,
                message: 'Not Found',
            })
        }
        else{
            return res.status(200).json({
                status: true,
                message: 'Data kasir',
                data: rows[0]
            })
        }
    })
})

router.patch('/update/(:id)', [
    body('nama').notEmpty(),
    body('jenis_kelamin').notEmpty()   
], (req,res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let Data = {
        nama: req.body.nama,
        jenis_kelamin: req.body.jenis_kelamin
    }
    connection.query(`update kasir set ? where id_kasir = ${id}`, Data, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        }else {
            return res.status(200).json({
                status: true,
                message: 'Update Success..!'
            })
        }
    })
})

router.delete('/delete/(:id)', function(req, res){
    let id = req.params.id;
    connection.query(`delete from kasir where id_kasir = ${id}`, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        }else{
            return res.status(500).json({
                status: true,
                message: 'Data berhasil di hapus!',
            })
        }
    })
})

module.exports = router;