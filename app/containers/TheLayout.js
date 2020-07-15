import React from 'react'
import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader
} from './index'

// routes config
import prop from '../routes'

const TheLayout = () => {

  return (
    <div className="c-app c-default-layout">
      <TheSidebar props={prop}/>
      <div className="c-wrapper">
        <TheHeader props={prop}/>
        <div className="c-body">
          <TheContent props={prop.routes}/>
        </div>
        <TheFooter/>
      </div>
    </div>
  )
}

export default TheLayout
