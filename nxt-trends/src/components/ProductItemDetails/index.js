import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    count: 1,
    isLoading: false,
    apiStatus: apiStatusConstants.initial,
    cart: [], // Added cart state
  }

  componentDidMount() {
    this.fetchItemData()
  }

  fetchItemData = async () => {
    this.setState({isLoading: true, apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    if (!jwtToken) {
      const {history} = this.props
      history.replace('/login')
      return
    }
    try {
      const apiUrl = `https://apis.ccbp.in/products/${id}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(apiUrl, options)
      const data = await response.json()
      if (response.ok) {
        const updateData = {
          id: data.id,
          imageUrl: data.image_url,
          title: data.title,
          price: data.price,
          description: data.description,
          brand: data.brand,
          totalReviews: data.total_reviews,
          rating: data.rating,
          availability: data.availability,
          similarProducts: data.similar_products.map(product => ({
            id: product.id,
            imageUrl: product.image_url,
            title: product.title,
            style: product.style,
            price: product.price,
            description: product.description,
            brand: product.brand,
            totalReviews: product.total_reviews,
            rating: product.rating,
            availability: product.availability,
          })),
        }
        this.setState({
          productData: updateData,
          isLoading: false,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure, isLoading: false})
      }
    } catch {
      this.setState({apiStatus: apiStatusConstants.failure, isLoading: false})
    }
  }

  increaseCount = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  decreaseCount = () => {
    this.setState(prevState => ({
      count: prevState.count > 1 ? prevState.count - 1 : 1,
    }))
  }

  navigateProducts = () => {
    const {history} = this.props
    history.push('/products')
  }

  addToCart = () => {
    const {productData, count} = this.state
    const {id, title, brand, imageUrl, rating, price} = productData

    const cart = JSON.parse(localStorage.getItem('cart')) || []

    // Optional: Check if already added, then update quantity
    const existingIndex = cart.findIndex(item => item.id === id)
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += count
    } else {
      cart.push({...productData, quantity: count})
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Product added to cart!')
  }

  apiFailView = () => (
    <div>
      <Header />
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <button onClick={this.navigateProducts} type="button" className="addTo">
        Continue Shopping
      </button>
    </div>
  )

  apiSuccessView = () => {
    const {productData, count} = this.state
    const {
      id,
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
      similarProducts = [],
    } = productData
    return (
      <div className="mainCard">
        <Header />
        <div className="productCard">
          <img src={imageUrl} alt="product" className="productImg" />
          <div className="productData">
            <h1 className="productTitle">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="ratingCard">
              <div className="rating">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p>{totalReviews}</p>
            </div>
            <p>{description}</p>
            <p>Available: {availability}</p>
            <p>Brand: {brand}</p>
            <hr className="line" />
            <div className="addCart">
              <button
                onClick={this.increaseCount}
                type="button"
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
              <p>{count}</p>
              <button
                onClick={this.decreaseCount}
                type="button"
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
            </div>
            <button
              type="button"
              className="addTo"
              onClick={this.addToCart} // Added onClick handler
            >
              ADD TO CART
            </button>
          </div>
        </div>
        <h1>Similar Products</h1>
        <ul className="similarProducts">
          {similarProducts.map(each => (
            <SimilarProductItem item={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  apiLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.apiSuccessView()
      case apiStatusConstants.failure:
        return this.apiFailView()
      case apiStatusConstants.inProgress:
        return this.apiLoadingView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
