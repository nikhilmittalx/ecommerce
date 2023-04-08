import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.js';
import './App.css';
import Header from "./component/layout/Header/Header.js"
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import React from 'react';
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home';
import ProductDetails from './component/Product/ProductDetails.js';
import Products from "./component/Product/Products"
import Search from "./component/Product/Search.js"
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store"
import { loadUser } from './actions/userAction';
import UserOptions from "./component/layout/Header/UserOptions";
import { useSelector } from 'react-redux';
import {Profile} from "./component/User/Profile";
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from './component/User/UpdateProfile.js';
import UpdatePassword from './component/User/UpdatePassword.js';
import ForgotPassword from './component/User/ForgotPassword.js';
import Cart from './component/Cart/Cart.js';
import INavbar from './component/layout/Navbar/Navbar';

function App() {

  const {isAuthenticated, user} = useSelector((state)=>state.user)

  React.useEffect(()=>{

    store.dispatch(loadUser())

  },[])
  return(
    <Router>
      <INavbar /> 
      {/* <Header/> */}
        {isAuthenticated && <UserOptions user={user}/>}
      <Routes>
        {/* <Route exact path="/" component={Home}/> */}
        <Route exact path="/" element={<Home/>}> </Route>
        <Route exact path="/product/:id" element={<ProductDetails/>}> </Route>
        <Route exact path="/products" element={<Products/>}> </Route>
        {/* <Route exact path="/search" element={<Search/>}> </Route> */}

        <Route exact path="/account" element={<ProtectedRoute> <Profile/> </ProtectedRoute>} > </Route>
        <Route exact path="/me/update" element={<ProtectedRoute> <UpdateProfile/> </ProtectedRoute>} > </Route>
        <Route exact path="/password/update" element={<ProtectedRoute> <UpdatePassword /> </ProtectedRoute>} > </Route>
        <Route exact path="/password/forgot" element={<ForgotPassword />} > </Route>
        {/* <Route exact path="/account" element={<Profile/>} > </Route> */}
        <Route path="/products/:keyword" element={<Products/>}> </Route>

        <Route exact path="/login" element={<LoginSignUp/>}> </Route>
        <Route exact path="/cart" element={<Cart/>}> </Route>

        {/* <Route path="/product/:id"><ProductDetails/></Route> */}
      </Routes>

      <Footer/>
    </Router>
  )
}

export default App;
