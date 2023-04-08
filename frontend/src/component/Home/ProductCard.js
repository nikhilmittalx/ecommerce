import React from 'react'
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component"
// import { Rating } from "@material-ui/lab";


const ProductCard = ({product}) => {
  const options = {
      edit:false,
      color:"grey",
      activeColor:"tomato",
      size: window.innerWidth < 600 ? 20 : 25,
      value:product.ratings,
      isHalf:true,
  }
  return (
    // console.log(`/product/${product._id}`);
    <Link className='productCard' to={`/product/${product._id}`}>
        <img src={product.images[0].url} alt={product.name} />
        <p>{product.name}</p>
        <div>
            <ReactStars {...options} />
            <span>({product.numOfReviews} Reviews)</span>
        </div>
        <span>{`₹${product.price}`}</span>
    </Link>
  )
}

export default ProductCard 