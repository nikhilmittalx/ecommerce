import React, { Fragment, useState } from 'react'
import MetaData from '../layout/MetaData';
import "./Search.css"
import {useNavigate} from "react-router-dom"

// import { createHashHistory } from 'history'
// export const history = createHashHistory()


const Search = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    // console.log(typeof(history));
    const searchSubmitHandler = (e)=>{
        e.preventDefault();
        if(keyword.trim()){
            navigate(`/products/${keyword}`);
        }
        else{
            navigate(`/products`);
        }
    }
  return (
    <Fragment>
        <MetaData title="Search A Product -- ECOMMERCE" />
        <form className='searchBox' onSubmit={searchSubmitHandler}>
            <input 
                type="text"
                placeholder='Search a product...' 
                onChange={(e)=>setKeyword(e.target.value)}
            />
            <input type="submit" value="Search" />
        </form>
    </Fragment>
  )
}

export default Search