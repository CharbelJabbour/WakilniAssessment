import axios from "axios"
import { useEffect, useState } from "react";
import PlusButton from "../Components/PlusButton"
import ModalAddProduct from "../Components/ModalAddProduct";
import ModalEditProduct from "../Components/ModalEditProduct";
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route, Link, Router, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import './Products.css'
import "../Components/SearchBar.css"

export default function Products() {
    const [show, setShow] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [showEdit, setShowEdit] = useState(false);
    const [showAlertEdit, setShowAlertEdit] = useState();
    const [id, setId] = useState();
    const navigate = useNavigate();
    const [value, setValue] = useState('');

    const openAddProduct = () => {
        setShowAlert(false);
        setShow(true);
    }

    const openEditProduct = (id) => {
        setId(id);
        setShowAlertEdit(false);
        setShowEdit(true);
    }

    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts();
    }, []);

    function getProducts() {
        axios.get('http://localhost:80/wakilniApi/products/').then(function (response) {
            console.log(response.data);
            setProducts(response.data);
        });
    }

    const deleteProduct = (id) => {
        axios.delete(`http://localhost:80/wakilniApi/product/${id}/delete`).then(function (response) {
            console.log(response.data);
            getProducts();
        });
    }

    const openItems = (id) => {
        console.log(id);
        navigate(`/product/items/${id}`);
    }

    const onChange = (event) => {
        setValue(event.target.value);
    }

    const onSearch = (searchTerm, searchId) => {
        setValue(searchTerm);
        console.log(searchId);
        axios.get(`http://localhost:80/wakilniApi/product/${searchId}`).then(function (response) {
            console.log(response.data);
            setProducts(response.data);
        }).catch(function (error) {
            console.log(error);
        });

    }

    return (
        <div>
            <div className="main">
                <div className='search-container'>
                    <div className='search-inner'>
                        <input type="text" value={value} onChange={onChange} placeholder="Search..." />
                        <label className="showAll" onClick={() => getProducts()}>Show all</label>
                    </div>
                    <div className='dropdown'>
                        {products.filter(item => {
                            const searchTerm = value.toLowerCase();
                            const fullName = item.product_type_name.toLowerCase()

                            return searchTerm && fullName.startsWith(searchTerm) && fullName !== searchTerm;
                        }).slice(0, 4)
                            .map((item) => (
                                <div className='dropdown-row' onClick={() => onSearch(item.product_type_name, item.id)}
                                    key={item.id}>
                                    {item.product_type_name}
                                </div>))}
                    </div>
                </div>
            </div>
            <div>
                <table className="tableProducts">
                    <tbody>
                        {products.map((product, key) =>
                            <tr key={key} onClick={() => openItems(product.id)} className="tableTr">
                                <td className="tdImage"><img src={`data:image/jpeg;base64,${product.product_image}`} alt={product.product_type_name} width="200px" height="120px" /></td>
                                <td className="tableTd">
                                    <div className="productDetails">
                                        <div className="productId">{product.id}</div>
                                        <div className="productName">{product.product_type_name}</div>
                                    </div>
                                    <div className="productDescription">{product.product_description}</div>
                                    <div className="productCount">Count: {product.count}</div>
                                </td>
                                <td className="btns tableTd"><img src={require('../Images/editIcon.png')} width="35px" height="35px" onClick={(e) => {
                                    e.stopPropagation(); openEditProduct(product.id);
                                }} />
                                    <img src={require('../Images/deleteIcon.png')} width="35px" height="35px" onClick={(e) => {
                                        e.stopPropagation(); deleteProduct(product.id);
                                    }} />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div onClick={() => openAddProduct()}>
                <PlusButton />
            </div>
            <ModalAddProduct show={show} setShow={setShow} setShowAlert={setShowAlert} showAlert={showAlert} />
            <ModalEditProduct showEdit={showEdit} setShowEdit={setShowEdit} showAlertEdit={showAlertEdit} setShowAlertEdit={setShowAlertEdit} productId={id} />
        </div>

    )
}