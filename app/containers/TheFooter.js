import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div className="ltr">
        <span className="ml-1">Contact me at </span>
        <a href="mailto:bunk@bio.lmu.de" target="_blank" rel="noopener noreferrer">bunk@bio.lmu.de</a>
      </div>
      <div className="mfs-auto">
        <a>Version 0.10.3</a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
