const express = require('express');
const router = express.Router();
const {body, validationResult } = require('express-validator');

const connection = require('../config/db.js');

router.get('/', function (req, res){
    connection.query('select * from pelanggan order by id_pelanggan desc',
     function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status: true,
                message: 'Data Pelanggan',
                data: rows
            })
        }
    })
});

router.post('/store', [
    body('nama').notEmpty(),
    body('alamat').notEmpty(),
    body('no_hp').notEmpty()

],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let Data = {
        nama: req.body.nama,
        alamat: req.body.alamat,
        no_hp: req.body.no_hp

    }
    connection.query('insert into pelanggan set ?', Data, function(err, rows){
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
    connection.query(`select * from pelanggan where id_pelanggan = ${id}`, function (err, rows) {
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
                message: 'Data Pelanggan',
                data: rows[0]
            })
        }
    })
})

router.patch('/update/(:id)', [
    body('nama').notEmpty(),
    body('alamat').notEmpty(),
    body('no_hp').notEmpty()   
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
        alamat: req.body.alamat,
        no_hp: req.body.no_hp
    }
    connection.query(`update pelanggan set ? where id_pelanggan = ${id}`, Data, function (err, rows) {
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
    connection.query(`delete from pelanggan where id_pelanggan = ${id}`, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        }else{
            return res.status(200).json({
                status: true,
                message: 'Data berhasil di hapus!',
            })
        }
    })
})

module.exports = router;