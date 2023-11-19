const express = require('express')
const app = express()
const port = 2000
const cors = require('cors')

app.use(cors())

const bodyPs = require('body-parser');
app.use(bodyPs.urlencoded({ extended: false}));
app.use(bodyPs.json());
app.use('/static', express.static("public"));

app.get('/', (req, res) => {
    res.send("Halo Shera!")
}); 

const pelangganRouter = require('./routes/pelanggan');
app.use('/api/pelanggan', pelangganRouter);

const kasirRouter = require('./routes/kasir');
app.use('/api/kasir', kasirRouter);

const menuRouter = require('./routes/menu');
app.use('/api/menu', menuRouter);

const bayarRouter = require('./routes/bayar');
app.use('/api/bayar', bayarRouter);

app.listen(port, () => {
    console.log(`aplikasi berjalan di http:://localhost:${port}`)
})