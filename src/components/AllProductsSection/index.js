import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]
const stateStatus = {
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
  listZero: 'ZEROLIST',
}
class AllProductsSection extends Component {
  state = {
    stateUpdate: stateStatus.loading,
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    searchToFilter: '',
    categoryId: '',
    gotRatingId: '',
    category: '',
    rating: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getCategoryId = id => {
    this.setState(
      {categoryId: id, category: id, stateUpdate: stateStatus.success},
      this.getProducts,
    )
  }

  getInputSearchFilterText = value => {
    this.setState({searchToFilter: value, stateUpdate: stateStatus.success})
  }

  getInputSearchKey = () => {
    this.getProducts()
  }

  getRatingId = value => {
    console.log(value)
    this.setState(
      {gotRatingId: value, rating: value, stateUpdate: stateStatus.success},
      this.getProducts,
    )
  }

  getResetTrigger = () => {
    this.setState(
      {
        searchToFilter: '',
        categoryId: '',
        gotRatingId: '',
        category: '',
        rating: '',
      },
      this.getProducts,
    )
  }

  getProducts = async () => {
    this.setState({stateUpdate: stateStatus.loading})
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, searchToFilter, categoryId, gotRatingId} = this.state

    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${categoryId}&title_search=${searchToFilter}&rating=${gotRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      if (updatedData.length === 0) {
        this.setState({
          productsList: updatedData,
          stateUpdate: stateStatus.listZero,
        })
      } else {
        this.setState({
          productsList: updatedData,
          stateUpdate: stateStatus.success,
        })
      }
    } else {
      this.setState({
        stateUpdate: stateStatus.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderZeroListView = () => (
    <div className="no-products-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
      />
      <h1>No Products Found</h1>
      <p>We could not find any products. Try other filters.</p>
    </div>
  )

  renderFailureView = () => (
    <div className="no-products-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1>Oops! Somthing Went Wrong</h1>
      <p>We are having some trouble processing your request.</p>
      <p>Please try again</p>
    </div>
  )

  getLoadingOrSuccessOrFailureViews = () => {
    const {stateUpdate} = this.state

    switch (stateUpdate) {
      case stateStatus.loading:
        return this.renderLoader()
      case stateStatus.success:
        return this.renderProductsList()
      case stateStatus.listZero:
        return this.renderZeroListView()
      case stateStatus.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchToFilter, category, rating} = this.state
    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          getInputSearchFilterText={this.getInputSearchFilterText}
          getCategoryId={this.getCategoryId}
          getRatingId={this.getRatingId}
          getResetTrigger={this.getResetTrigger}
          searchToFilter={searchToFilter}
          category={category}
          rating={rating}
          getInputSearchKey={this.getInputSearchKey}
        />
        {this.getLoadingOrSuccessOrFailureViews()}
      </div>
    )
  }
}

export default AllProductsSection
