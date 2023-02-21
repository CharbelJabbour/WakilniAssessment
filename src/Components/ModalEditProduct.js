import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import './ModalComponent.css'
import axios from "axios";
import { Form } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useParams } from 'react-router-dom';

function ModalComponent({ showEdit, setShowEdit, showAlertEdit, setShowAlertEdit, productId }) {

    const [inputs, setInputs] = useState({});
    const [fileName, setFileName] = useState('Change Image');
    const [image, setImage] = useState(null);

    const handleClose = () => {
        console.log(inputs.product_type_name);
        inputs.productName = null;
        inputs.productImage = null;
        inputs.productDescription = null;
        setFileName('Change Image');
        setShowEdit(false);
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setInputs(values => ({ ...values, [name]: value }));

    }

    useEffect(() => {
        getProducts();
    }, [productId]);

    function getProducts() {
        axios.get(`http://localhost:80/wakilniApi/product/${productId}`).then(function (response) {
            console.log(response.data);
            setInputs(response.data);
            console.log(inputs);
        });
    }

    

    const handleSubmit = async (event) => {
        event.preventDefault();

        axios.put(`http://localhost:80/wakilniApi/product/${productId}/edit`).then(function (response) {
            console.log(response.data);
            //getProducts();
        });

        // const formData = new FormData();
        // formData.append("productId", productId);
        // formData.append("product_type_name", inputs.product_type_name);
        // formData.append("product_description", inputs.product_description);
        
        // console.log("FormData:", formData);
        // console.log("productId:", productId);
        // console.log("inputs:", inputs);

        // try {
        //     const response = await axios.put(`http://localhost:80/wakilniApi/product/${productId}/edit`, formData);
        //     console.log("Product created:", response.data);
        // } catch (error) {
        //     console.error(error);
        // }

        //check if fields are empty
        // if (inputs.productName == null || inputs.productName == "" ||
        //     image == null ||
        //     inputs.productDescription == null || inputs.productDescription == "") {
        //     setShowAlertEdit(true);
        // } else {
        //     const formData = new FormData();
        //     formData.append("productId", productId);
        //     formData.append("productName", inputs.productName);
        //     formData.append("productDescription", inputs.productDescription);
        //     formData.append("productImage", image);

        //     try {
        //         const response = await axios.put("http://localhost:80/wakilniApi/product/save", formData);
        //         console.log("Product created:", response.data);
        //     } catch (error) {
        //         console.error(error);
        //     }
        //     inputs.productName = null;
        //     inputs.productImage = null;
        //     inputs.productDescription = null;
        //     setFileName('Choose File');
        //     setShowEdit(false);
        // }
    }

    const handleImageChange = (event) => {
        setFileName("File has been added");
        setImage(event.target.files[0]);
    }

    return (
        <div className="modalBackgSround">
            <Modal show={showEdit} onHide={handleClose} className='modal-sm'>
                <Modal.Header closeButton >
                    <Modal.Title className='title'>Edit Product</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div className='centering'>
                            <div>
                                <Alert show={showAlertEdit} variant='primary' onClose={() => setShowAlertEdit(false)} dismissible>
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
                                            <input value={inputs.product_type_name} type="text" name="productName" onChange={handleChange} maxLength={150} />
                                        </td>
                                    </tr>
                                    <tr className="input-container">
                                        <th>
                                            <label>Product Description: </label>
                                        </th>
                                        <td>
                                            <Form.Group value={inputs.product_description} as="textarea" name="product_description" onChange={handleChange} className="textarea" rows={3} maxLength={500} />
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