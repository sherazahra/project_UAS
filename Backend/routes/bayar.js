const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const connection = require("../config/db.js");

const authenticateToken = require("../routes/auth/midleware/authenticateToken");

router.get("/", authenticateToken, function (req, res) {
  connection.query(
    "SELECT l.*, k.*, m.*,b.*, l.nama as nama_pelanggan, k.nama as nama_kasir, m.nama as nama_menu FROM bayar AS b INNER JOIN pelanggan AS l ON b.id_pelanggan = l.id_pelanggan INNER JOIN kasir AS k ON b.id_kasir = k.id_kasir INNER JOIN menu AS m ON b.id_menu = m.id_menu ORDER BY b.id_bayar DESC",
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Failed",
          error: err,
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data bayar",
          data: rows,
        });
      }
    }
  );
});

router.post(
  "/store",
  authenticateToken,
  [
    body("id_pelanggan").notEmpty(),
    body("id_kasir").notEmpty(),
    body("id_menu").notEmpty(),
    body("jumlah").notEmpty(),
    body("total_bayar").notEmpty(),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array(),
      });
    }
    let Data = {
      id_pelanggan: req.body.id_pelanggan,
      id_kasir: req.body.id_kasir,
      id_menu: req.body.id_menu,
      jumlah: req.body.jumlah,
      total_bayar: req.body.total_bayar,
    };
    connection.query("insert into bayar set ?", Data, function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
          error: err,
        });
      } else {
        return res.status(201).json({
          satus: true,
          message: "Success..!",
          data: rows[0],
        });
      }
    });
  }
);

router.get("/(:id)", function (req, res) {
  let id = req.params.id;
  connection.query(
    `SELECT l.*, k.*, m.*,b.*, l.nama as nama_pelanggan, k.nama as nama_kasir, m.nama as nama_menu FROM bayar AS b INNER JOIN pelanggan AS l ON b.id_pelanggan = l.id_pelanggan INNER JOIN kasir AS k ON b.id_kasir = k.id_kasir INNER JOIN menu AS m ON b.id_menu = m.id_menu where id_bayar = ${id}`,
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      }
      if (rows.length <= 0) {
        return res.status(404).json({
          status: false,
          message: "Not Found",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data bayar",
          data: rows[0],
        });
      }
    }
  );
});

router.patch(
  "/update/(:id)",
  authenticateToken,
  [
    body("id_pelanggan").notEmpty(),
    body("id_kasir").notEmpty(),
    body("id_menu").notEmpty(),
    body("jumlah").notEmpty(),
    body("total_bayar").notEmpty(),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array(),
      });
    }
    let id = req.params.id;
    let Data = {
      id_pelanggan: req.body.id_pelanggan,
      id_kasir: req.body.id_kasir,
      id_menu: req.body.id_menu,
      jumlah: req.body.jumlah,
      total_bayar: req.body.total_bayar,
    };
    connection.query(
      `update bayar set ? where id_bayar = ${id}`,
      Data,
      function (err, rows) {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Server Error",
          });
        } else {
          return res.status(200).json({
            status: true,
            message: "Update Success..!",
          });
        }
      }
    );
  }
);

router.delete("/delete/(:id)", authenticateToken, function (req, res) {
  let id = req.params.id;
  connection.query(
    `delete from bayar where id_bayar = ${id}`,
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data berhasil di hapus!",
        });
      }
    }
  );
});

module.exports = router;
