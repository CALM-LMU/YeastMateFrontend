import React from 'react'
import {
  CButtonGroup,
  CButton,
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CBreadcrumbRouter,
} from '@coreui/react'

import { toJS } from 'mobx';
import { observer } from "mobx-react-lite"
var remote = require('electron').remote; 

import CIcon from '@coreui/icons-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const TheHeader = (props) => {
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
    props.props.store.set('selection', toJS(props.props.lists.selection))
    props.props.store.set('preprocessing', toJS(props.props.lists.preprocessing))
    props.props.store.set('detection', toJS(props.props.lists.detection))
    props.props.store.set('export', toJS(props.props.lists.export))
    props.props.store.set('backend', toJS(props.props.lists.backend))

    var window = remote.getCurrentWindow();
    window.close();
  }
  
  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(props.props.sidebarShow.get("show")) ? false : 'responsive'
    props.props.sidebarShow.set('show', val)
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(props.props.sidebarShow.get("show")) ? true : 'responsive'
    props.props.sidebarShow.set('show', val)
  }

  return (
    <div id="title-bar">
      <CHeader withSubheader id="title-bar">
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
          <CIcon name="logo-negative" height="48" alt="logo-negative"/>
        </CHeaderBrand>
        <CHeaderNav className="d-md-down-none mr-auto">
          <CBreadcrumbRouter 
            className="border-0 c-subheader-nav m-0 px-0 px-md-3" 
            routes={props.routes} 
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

export default observer(TheHeader)
