import React, { useState, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import './ModalComponent.css'
import axios from "axios";
import Button from 'react-bootstrap/Button';
import { Form } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'

function ModalComponent({ show, setShow, showAlert, setShowAlert, id }) {

    const [inputs, setInputs] = useState({});

    const handleClose = () => {
        console.log(id);
        inputs.serialNumber = null;
        setShow(false);
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setInputs(values => ({ ...values, [name]: value }));

    }

    const handleSubmit = (event) => {
        event.preventDefault();

        //check if fields are empty
        if (inputs.serialNumber == null || inputs.serialNumber == "") {
            setShowAlert(true);
        } else {
            const data = { ...inputs, productId: id };
            axios.post('http://localhost:80/wakilniApi/items/item/save', data);
            inputs.serialNumber = null;
            setShow(false);
        }
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose} className='modal-sm'>
                <Modal.Header closeButton >
                    <Modal.Title className='title'>Add Item</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div className='centering'>
                            <div>
                                <Alert show={showAlert} variant='primary' onClose={() => setShowAlert(false)} dismissible>
                                    Please enter all fields!
                                </Alert>
                            </div>
                            <table>
                                <tbody>
                                    <tr className="input-container">
                                        <th>
                                            <label>Serial Number: </label>
                                        </th>
                                        <td>
                                            <input type="text" name="serialNumber" onChange={handleChange} maxLength={150} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button type="submit">
                            Save
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}

export default ModalComponent