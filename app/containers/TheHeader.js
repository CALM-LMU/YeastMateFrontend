import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CButtonGroup,
  CButton,
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CBreadcrumbRouter,
} from '@coreui/react'

var remote = require('electron').remote; 

import CIcon from '@coreui/icons-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// routes config
import routes from '../routes'

const TheHeader = () => {
  const minWin = () => {
    var window = remote.getCurrentWindow();
    window.minimize(); 
  }

  const maxWin = () => {
    var window = remote.getCurrentWindow();
      if (!window.isMaximized()) {
          window.maximize();          
      } else {
          window.unmaximize();
      }
  }

  const closeWin = () => {
    var window = remote.getCurrentWindow();
    window.close();
  }
  
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  return (
    <div id="title-bar">
      <CHeader withSubheader>
        <CToggler
          inHeader
          id="no-title-bar"
          className="ml-md-3 d-lg-none"
          onClick={toggleSidebarMobile}
        />
        <CToggler
          inHeader
          id="no-title-bar"
          className="ml-3 d-md-down-none"
          onClick={toggleSidebar}
        />
        <CHeaderBrand className="mx-auto d-lg-none" to="/">
          <CIcon name="logo" height="48" alt="Logo"/>
        </CHeaderBrand>
        <CHeaderNav className="d-md-down-none mr-auto">
          <CBreadcrumbRouter 
            className="border-0 c-subheader-nav m-0 px-0 px-md-3" 
            routes={routes} 
          />
        </CHeaderNav>
        <CButtonGroup id="no-title-bar" size="sm">
          <CButton id='min-btn' onClick={minWin}><FontAwesomeIcon icon="window-minimize"/></CButton>
          <CButton id='max-btn'  onClick={maxWin}><FontAwesomeIcon icon="window-restore"/></CButton>
          <CButton id='close-btn'  onClick={closeWin}><FontAwesomeIcon icon="window-close"/></CButton>
        </CButtonGroup>
      </CHeader>  
    </div>
  )
}

export default TheHeader
