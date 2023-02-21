import axios from "axios"
import { useEffect, useState } from "react";
import PlusButton from "../Components/PlusButton"
import ModalAddItem from "../Components/ModalAddItem";
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route, Link, Router, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import "../Components/SearchBar.css"

export default function Items() {
    const [show, setShow] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [items, setItems] = useState([]);
    const { id } = useParams();
    const [valueSearch, setValueSearch] = useState('');

    const openAddItem = () => {
        setShowAlert(false);
        setShow(true);
    }

    useEffect(() => {
        getItems();
    }, []);

    function getItems() {
        axios.get(`http://localhost:80/wakilniApi/items/items?productId=${id}`).then(function (response) {
            console.log(response.data);
            setItems(response.data);
        });
    }

    const deleteItem = (itemId) => {
        axios.delete(`http://localhost/wakilniApi/items/items/${itemId}/delete?productId=${id}`).then(function (response) {
            console.log(response.data);
            getItems();
        });
    }

    const onChange = (event) => {
        setValueSearch(event.target.value);
    }

    const onSearch = (searchTerm, searchId) => {
        setValueSearch(searchTerm);
        console.log(searchId);
        axios.get(`http://localhost:80/wakilniApi/items?productId=${searchId}&search=${searchTerm}`).then(function (response) {
            console.log(response.data);
            setItems(response.data);
        }).catch(function (error) {
            console.log(error);
        });

    }

    function handleCheckboxChange(event, itemId, itemSold) {

        const isChecked = event.target.checked;
        if (itemSold == true) {

        } else {
            fetch(`http://localhost:80/wakilniApi/items/update_count.php?productId=${id}&itemId=${itemId}`, {
                method: 'PUT',
                body: JSON.stringify({ isChecked }),
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error(error));
            getItems();
        }

    }

    return (
        <div>
            <div className="main">
                <div className='search-container'>
                    <div className='search-inner'>
                        <input type="text" value={valueSearch} onChange={onChange} placeholder="Search..." />
                        <label className="showAll" onClick={() => getItems()}>Show all</label>
                    </div>
                    <div className='dropdown'>
                        {items.filter(item => {
                            const searchTerm = valueSearch.toLowerCase();
                            const serialNumber = item.serialNumber.toLowerCase();

                            return searchTerm && serialNumber.startsWith(searchTerm) && serialNumber !== searchTerm;
                        }).slice(0, 4)
                            .map((item) => (
                                <div className='dropdown-row' onClick={() => onSearch(item.serialNumber, item.id)}
                                    key={item.id}>
                                    {item.serialNumber}
                                </div>))}
                    </div>
                </div>
            </div>
            <div>
                <table className="tableProducts">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>SerialNumber</th>
                            <th>Sold</th>
                            <th>Tools</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, key) =>
                            <tr key={key}>
                                <td>{item.id}</td>
                                <td>{item.serialNumber}</td>
                                <td><label className="checkbox">
                                    <input type="checkbox" disabled={item.sold == 1} defaultChecked={item.sold == 1} onChange={(e) => handleCheckboxChange(e, item.id, item.sold)} />
                                    <span className="checkmark"></span></label></td>
                                <td className="btns tableTd">
                                    <img src={require('../Images/deleteIcon.png')} width="35px" height="35px" onClick={(e) => {
                                        e.stopPropagation(); deleteItem(item.id);
                                    }} />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div onClick={() => openAddItem()}>
                <PlusButton />
            </div>
            <ModalAddItem show={show} setShow={setShow} setShowAlert={setShowAlert} showAlert={showAlert} id={id} />
        </div>
    )
}