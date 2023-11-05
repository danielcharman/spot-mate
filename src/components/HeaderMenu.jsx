import { FaBars, FaDesktop, FaDumbbell } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

function HeaderMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const location = useLocation()

  const onToggle = () => {
    setIsOpen(!isOpen)
  }

  const isCurrentRoute = (route) => {
    if(route === location.pathname) return true
  }

  return (
    <div className="headerMenu">
      <FaBars className='headerMenuIcon' onClick={onToggle} />
      <ul className={'headerMenuItems ' + ((isOpen) && 'open')}>
        {/* <li className={'headerMenuItem ' + ((isCurrentRoute('/')) && 'active')}>
          <Link to='/' onClick={onToggle}>
            <FaDesktop className='headerMenuItemIcon' />
            <span className='headerMenuItemLabel'>Overview</span>
          </Link>
        </li> */}
        <li className={'headerMenuItem ' + ((isCurrentRoute('/workouts')) && 'active')}>
          <Link to='/' onClick={onToggle}>
            <FaDumbbell className='headerMenuItemIcon' />
            <span className='headerMenuItemLabel'>Workouts</span>
          </Link>
        </li>
        <li className={'headerMenuItem ' + ((isCurrentRoute('/settings')) && 'active')}>
          <Link to='/settings' onClick={onToggle}>
            <FaDumbbell className='headerMenuItemIcon' />
            <span className='headerMenuItemLabel'>Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default HeaderMenu
