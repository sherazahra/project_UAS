const express = require('express');
const router = express.Router();

const {body, validationResult } = require('express-validator');

const connection = require('../config/db.js');
const fs = require('fs')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Jenis file tidak diizinkan'), false);
    }
};

const upload = multer({storage: storage, fileFilter: fileFilter})

router.get('/', function (req, res){
    connection.query('select * from menu order by id_menu desc', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
                error: err
            })
        }else{
            return res.status(200).json({
                status: true,
                message: 'Data Menu',
                data: rows
            })
        }
    })
});

router.post('/store', upload.fields([{name: 'gambar', maxCount: 1}]), [
    body('nama').notEmpty(),
    body('harga').notEmpty(),   
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }
    let Data = {
        nama: req.body.nama,
        harga: req.body.harga,
        gambar: req.files.gambar[0].filename, 
    }
    connection.query('INSERT INTO menu SET ?', Data, function(err, result){
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        } else {
            return res.status(201).json({
                status: true,
                message: 'Success..!',
                data: Data 
            })
        }
    })
})


router.get('/(:id)', function (req, res) {
    let id = req.params.id;
    connection.query(`select * from menu where id_menu = ${id}`, function (err, rows) {
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
                message: 'Data menu',
                data: rows[0]
            })
        }
    })
})

router.patch('/update/(:id)',upload.fields([{ name: 'gambar', maxCount: 1 }]), [
    body('nama').notEmpty(),
    body('harga').notEmpty(), 
], (req,res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let gambar = req.files['gambar'] ? req.files['gambar'][0].filename : null;
    
    connection.query(`select * from menu where id_menu = ${id}`, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
                error: err
            })
        }
        if(rows.length <=0){
            return res.status(404).json({
                status: false,
                message: 'Not Found',
            })
        }
        const gambarLama = rows[0].gambar; 

        if (gambarLama && gambar){
            const pathGambar = path.join(__dirname, '../public', gambarLama); 
            fs.unlinkSync(pathGambar);
        }
    let Data = {
        nama: req.body.nama,
        harga: req.body.harga,
    }
    if (gambar) {
        Data.gambar = gambar;
    }


    connection.query(`update menu set ? where id_menu = ${id}`, Data, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
                error: err  
            })
        }else {
            return res.status(200).json({
                status: true,
                message: 'Update Success..!'
            })
        }
    })
})
})

router.delete("/delete/(:id)", function (req, res) {
    let id = req.params.id;
  
    connection.query(
      `select * from menu where id_menu = ${id}`,
      function (err, rows) {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "server error",
          });
        }
        if (rows.length === 0) {
          return res.status(404).json({
            status: false,
            message: "not found",
          });
        }
        const namaFileLama = rows[0].gambar;
        if (namaFileLama) {
          const patchFileLama = path.join(
            __dirname,
            "../public",
            namaFileLama
          );
          fs.unlinkSync(patchFileLama);
        }
        connection.query(
          `delete from menu where id_menu = ${id}`,
          function (err, rows) {
            if (err) {
              return res.status(500).json({
                status: false,
                message: "server error",
              });
            } else {
              return res.status(200).json({
                status: true,
                message: "data berhasil dihapus",
              });
            }
          }
        );
      }
    );
  });
module.exports = router;