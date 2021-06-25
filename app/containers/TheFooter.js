import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a href="https://calm.bio.lmu.de" target="_blank" rel="noopener noreferrer">Center for Advanced Light Microscopy</a>
      </div>
      <div className="mfs-auto">
        <a>Version 0.9.6</a>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Contact me at </span>
        <a href="mailto:bunk@bio.lmu.de" target="_blank" rel="noopener noreferrer">bunk@bio.lmu.de</a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
