import './index.css'

const SimilarProductItem = props => {
  const {item} = props
  const {id, imageUrl, title, brand, price, rating} = item
  return (
    <li className="eachProduct">
      <img src={imageUrl} className="card1" alt={`similar product ${title}`} />
      <p>{title}</p>
      <p>by {brand}</p>
      <div className="ratingCard2">
        <p>Rs {price}/-</p>
        <div className="rating2">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
