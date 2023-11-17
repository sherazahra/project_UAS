import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Pelanggan(){
    const [pelanggan, setPelanggan] = useState([]);
    useEffect(() => {
        fectData();
    }, []);
    const fectData = async () => {
        const response1 = await axios.get('http://localhost:2000/api/pelanggan');
        const data1 = await response1.data.data;
        setPelanggan(data1);
    }
    return(
        <Container>
            <Row>
                <Col><h2>Data Pelanggan</h2></Col>
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">No</th>
                        <th scope="col">Nama</th>
                        <th scope="col">Alamat</th>
                        <th scope="col">No HP</th>
                        </tr>
                    </thead>
                    <tbody>
                        { pelanggan.map((mh, index)=> (
                            <tr>
                            <td>{index + 1}</td>
                            <td>{ mh.nama}</td>
                            <td>{ mh.alamat}</td>
                            <td>{ mh.no_hp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Row>
        </Container>
    );
}
export default Pelanggan;
