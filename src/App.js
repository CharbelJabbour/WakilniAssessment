import { BrowserRouter, Routes, Route, Link, Router } from 'react-router-dom';
import './App.css';
import Products from './Pages/Products'
import Items from'./Pages/Items'

function App() {

  return (
    <div className="App">
      <BrowserRouter>
      <Link to="/"><img src={require('./Images/ShopLogo.png')} width={450} height={220} alt="Logo" /></Link>
        <Routes>
          <Route index element={<Products />} /> 
          <Route path="/product/items/:id" element={<Items/>}/>
          {/* <Route path="user/:id/edit" element={<EditUser/>}/> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
