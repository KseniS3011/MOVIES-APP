import './SearchField.css'

function SearchFiled(props) {
  const { handleInputChange, handleSubmit, inputValue } = props
  return (
    <form className="form" onSubmit={handleSubmit}>
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
