import React, { useState, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import './ModalComponent.css'
import axios from "axios";
import Button from 'react-bootstrap/Button';
import { Form } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'

function ModalComponent({ show, setShow, showAlert, setShowAlert }) {

    const [inputs, setInputs] = useState({});
    const [fileName, setFileName] = useState('Choose File');
    const [image, setImage] = useState(null);

    const handleClose = () => {
        inputs.productName = null;
        inputs.productImage = null;
        inputs.productDescription = null;
        setFileName('Choose File');
        setShow(false);
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setInputs(values => ({ ...values, [name]: value }));

    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        //check if fields are empty
        if (inputs.productName == null || inputs.productName == "" ||
            image == null ||
            inputs.productDescription == null || inputs.productDescription == "") {
            setShowAlert(true);
        } else {
            const formData = new FormData();
            formData.append("productName", inputs.productName);
            formData.append("productDescription", inputs.productDescription);
            formData.append("productImage", image);

            try {
                const response = await axios.post("http://localhost:80/wakilniApi/product/save", formData);
                console.log("Product created:", response.data);
            } catch (error) {
                console.error(error);
            }
            inputs.productName = null;
            inputs.productImage = null;
            inputs.productDescription = null;
            setFileName('Choose File');
            setShow(false);
        }
    }

    const handleImageChange = (event) => {
        setFileName("File has been added");
        setImage(event.target.files[0]);
    }

    return (
        <div className="modalBackgSround">
            <Modal show={show} onHide={handleClose} className='modal-sm'>
                <Modal.Header closeButton >
                    <Modal.Title className='title'>Add Product</Modal.Title>
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
                                            <label>Product Name: </label>
                                        </th>
                                        <td>
                                            <input type="text" name="productName" onChange={handleChange} maxLength={150} />
                                        </td>
                                    </tr>
                                    <tr className="input-container">
                                        <th>
                                            <label>Product Description: </label>
                                        </th>
                                        <td>
                                            <Form.Group as="textarea" name="productDescription" onChange={handleChange} className="textarea" rows={3} maxLength={500} />
                                        </td>
                                    </tr>
                                    <tr className="input-container">
                                        <th>
                                            <label>Upload Product Image: </label>
                                        </th>
                                        <td >
                                            <label htmlFor="file-input" className="custom-file-input">{fileName}</label>
                                            <input type="file" id="file-input" className="custom-file-input" name="productImage" onChange={handleImageChange} />

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