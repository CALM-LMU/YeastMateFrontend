import React from 'react'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'
import { observer } from "mobx-react-lite"

import CIcon from '@coreui/icons-react'

// sidebar nav config
import navigation from './_nav'

const TheSidebar = (props) => {
  return (
    <CSidebar 
      show={props.props.sidebarShow.get("show")}
      onShowChange={(val) => props.props.sidebarShow.set('show', val)}
    > 
      <CSidebarBrand id="title-bar" className="d-md-down">
        <CIcon
          className="c-sidebar-brand-full"
          name="logo-negative"
          height={35}
        />
        <CIcon
          className="c-sidebar-brand-min"
          name="logo-negative"
          height={35}
        />
      </CSidebarBrand>
      <CSidebarNav >
        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down"/>
    </CSidebar>
  )
}

export default React.memo(observer(TheSidebar))
