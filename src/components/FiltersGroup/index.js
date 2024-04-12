import './index.css'
import {MdSearch} from 'react-icons/md'

const FiltersGroup = props => {
  const onChangeInput = event => {
    const {getInputSearchFilterText} = props
    getInputSearchFilterText(event.target.value)
  }

  const onChangeInputOnKeyDown = event => {
    const {getInputSearchKey} = props
    if (event.key === 'Enter') {
      getInputSearchKey(event.key)
    }
  }

  const onClickResestBtn = () => {
    const {getResetTrigger} = props
    getResetTrigger()
  }

  const {categoryOptions, ratingsList, searchToFilter, category, rating} = props

  return (
    <div className="filters-group-container">
      <div className="search-input-container">
        <input
          className="search-input"
          type="search"
          onChange={onChangeInput}
          onKeyDown={onChangeInputOnKeyDown}
          value={searchToFilter}
          placeholder="Search"
        />{' '}
        <MdSearch />
      </div>
      <h1 className="head">Category</h1>
      <ul className="filter-uls">
        {categoryOptions.map(eachCategory => {
          const onChangeCategory = () => {
            const {getCategoryId} = props
            getCategoryId(eachCategory.categoryId)
          }

          return (
            <li className="li-category" key={eachCategory.categoryId}>
              <button
                className={
                  eachCategory.categoryId === category ? 'border' : 'li-btn btn'
                }
                onClick={onChangeCategory}
              >
                <p>{eachCategory.name}</p>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="head">Rating</p>
      <ul className="filter-uls">
        {ratingsList.map(eachRating => {
          const setRatingId = () => {
            const {getRatingId} = props
            getRatingId(eachRating.ratingId)
          }
          return (
            <li className="li-rating" key={eachRating.ratingId}>
              <img
                alt={`rating ${eachRating.ratingId}`}
                className="rating-image"
                src={eachRating.imageUrl}
              />
              <button
                className={eachRating.ratingId === rating ? 'border' : 'btn'}
                onClick={setRatingId}
              >
                & up
              </button>
            </li>
          )
        })}
      </ul>
      <button onClick={onClickResestBtn} className="clear-btn">
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
