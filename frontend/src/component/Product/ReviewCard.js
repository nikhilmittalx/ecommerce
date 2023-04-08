import React from 'react'
import ReactStars from 'react-rating-stars-component'

const ReviewCard = ({review}) => {
    const options = {
        edit:false,
        color:"grey",
        activeColor:"tomato",
        size: window.innerWidth < 600 ? 20 : 25,
        value:review.rating,
        isHalf:true
      }
  return (
    <div className="ReviewCard">
        <img src="{profilepng}" alt="user" />
        <p>{review.name}</p>
        <ReactStars {...options} />
        <span>{review.comment}</span>
    </div>
  )
}

export default ReviewCard