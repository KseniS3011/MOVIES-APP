import PropTypes from 'prop-types'

import './SearchField.css'

// const debounce = (fn, debounceTime) => {
//   let timer
//   // eslint-disable-next-line func-names
//   return function (...args) {
//     clearTimeout(timer)
//     timer = setTimeout(() => {
//       fn.apply(this, args)
//     }, debounceTime)
//   }
// }

function SearchFiled(props) {
  const { handleInputChange, inputValue } = props
  SearchFiled.defaultProps = {
    inputValue: '',
    handleInputChange: () => {},
  }
  SearchFiled.propTypes = {
    inputValue: PropTypes.string,
    handleInputChange: PropTypes.func,
  }
  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <label>
        <input
          type="text"
          value={inputValue}
          className="search-field"
          placeholder="Type to search..."
          onChange={handleInputChange}
          autoFocus
        />
      </label>
    </form>
  )
}

export default SearchFiled
