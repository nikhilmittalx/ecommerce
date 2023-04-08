import React, { Fragment, useEffect, useState} from 'react'
import Carousel from "react-material-ui-carousel"
import "./ProductDetails.css"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, getProductDetails } from '../../actions/productAction'
import { useAlert } from 'react-alert'
// import { Rating } from "@material-ui/lab";
import ReactStars from "react-rating-stars-component"
import { useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard.js"
import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader/Loader'
import {addItemsToCart} from "../../actions/cartAction"

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();
  const {id} = useParams();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  )

  const options = {
    edit:false,
    color:"grey",
    activeColor:"tomato",
    size: window.innerWidth < 600 ? 20 : 25,
    value:product.ratings,
    isHalf:true
  }

  const addToCartHandler = () => {
    dispatch(addItemsToCart(params.id, quantity))
    alert.success("Items added to cart")
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, error, alert])
  
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    if (product.stock <= quantity) return;

    const qty = quantity + 1;
    // console.log(qty)
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  return (
    <Fragment>
      {loading? <Loader/> : (
        <Fragment>
          <MetaData title={`${product.name}`} />
        <div className="ProductDetails">
          <div className='imgCarouselContainer'>
            <Carousel>
              {product.images && product.images.map((item, i) => (
                <img className="CarouselImage" src={item.url} key={i} alt={`${i} Slide`} />
              ))}
            </Carousel>
          </div>
  
          <div>
            <div className="detailsBlock-1">
              <h2>{product.name}</h2>
              <p>Product # {product._id}</p>
            </div>
            <div className="detailsBlock-2">
              <ReactStars {...options} />
              <span className="detailsBlock-2-span">
                ({product.numOfReviews} Reviews)
              </span>
            </div>
            <div className="detailsBlock-3">
              <h1>{`₹${product.price}`}</h1>
              <div className="detailsBlock-3-1">
                <div className="detailsBlock-3-1-1">
                  <button onClick={decreaseQuantity}>-</button>
                  <input readOnly type="number" value={quantity} />
                  <button onClick={increaseQuantity}>+</button>
                </div>
                <button disabled={product.Stock < 1 ? true : false} onClick={addToCartHandler}>
                  Add to Cart
                </button>
              </div>
  
              <p>
                Status:
                <b className={product.stock < 1 ? "redColor" : "greenColor"} >
                  {product.stock < 1 ? "OutOfStock" : "In Stock"}
                </b>
              </p>  
            </div>
            <div className='detailsBlock-4'>
              Description: <p>{product.description}</p>
            </div>
            
            <button className='submitReview'>Submit Review</button>
          </div>
  
        </div>
        <h3 className='reviewsHeading'>REVIEWS</h3>
        {product.reviews && product.reviews[0] ? (
          <div className="reviews">
            {product.reviews && product.reviews.map((review)=> <ReviewCard review={review}/> )}
          </div>
        ):(
          <p className='noReviews'>No Reviews Yet</p>
        )}
      </Fragment>
      )}
    </Fragment>
  )
}

export default ProductDetails