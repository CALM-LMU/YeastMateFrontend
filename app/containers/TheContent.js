import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'
  
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const TheContent = (props) => {
  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {props.props.map((routes, idx) => {
              return routes.component && (
                <Route
                  key={idx}
                  path={routes.path}
                  exact={routes.exact}
                  name={routes.name}
                  render={props => (
                    <CFade>
                      <routes.component props={routes.data} />
                    </CFade>
                  )} />
              )
            })}
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)
