import './Header.css'

function Header(props) {
  const { content, handleClick } = props

  return (
    <ul className="header">
      {content.map((item) => {
        return (
          <li key={item.id}>
            <button type="button" className="header__item" onClick={handleClick}>
              {item.value}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default Header
