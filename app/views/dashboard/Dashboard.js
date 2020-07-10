import React, { lazy } from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CForm,
  CProgress,
  CRow,
  CSwitch,
  CToast,
  CToaster,
  CToastBody,
  CToastHeader
} from '@coreui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const fields = [
  { key: 'Job', _style: { width: '15%'} },
  { key: 'Path', _style: { width: '50%'} },
  {
    key: 'status', _style: { width: '25%' },
  },
  {
    key: 'delete',
    label: '',
    _style: { width: '20%' },
    sorter: false,
    filter: false
  }
]

const getStatusBadge = (status)=>{
  switch (status) {
    case "RECEIVED": return 'info'
    case "PENDING": return 'warning'
    case "PROGRESS": return 'primary'
    case "SUCCESS": return 'success'
    case "FAILURE": return 'danger'
    default: return 'primary'
  }
}

const Dashboard = () => {
  const [isConnected, setisConnected] = React.useState(false)
  const [jobList, setjobList] = React.useState([])
  const [jobProgress, setjobProgress] = React.useState(0)
  const [jobType, setjobType] = React.useState()
  const [jobPath, setjobPath] = React.useState()

  const [toasts, setToasts] = React.useState([
    {}
  ])

  const toasters = (()=>{
    return toasts.reduce((toasters, toast) => {
      toasters[toast.position] = toasters[toast.position] || []
      toasters[toast.position].push(toast)
      return toasters
    }, {})
  })()

  const addToast = (header, body) => {
    setToasts([
      ...toasts, 
      { position:'top-right', autohide: true && 2000, closeButton:true, fade:true, header:header, body:body, show:true }
    ])
  }

  const get_jobs = async () => {
    
  };

  const handleRemoveClick = (index) => {
  }


  return (
    <>
      <CCard>
        <CCardHeader>Job Status</CCardHeader>
        <CCardBody >
          <CForm>
            <CDataTable
              items={jobList}
              fields={fields}
              tableFilter
              itemsPerPageSelect
              itemsPerPage={5}
              hover
              sorter
              pagination
              scopedSlots = {{
                'status':
                    (item, index)=>{
                      return (
                        <CBadge color={getStatusBadge(item.Status)}>
                          {item.Status}
                        </CBadge>
                    )},
                'delete':
                    (item, index)=>{
                      return (
                        <CButton onClick={()=>{handleRemoveClick(index)}} color="danger" size="sm" variant="outline" shape="square">
                          <FontAwesomeIcon icon="ban" />   Abort
                        </CButton>
                    )
                  }
              }}
            />
          </CForm>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader>
          Progress: {jobType} in {jobPath}
        </CCardHeader>
        <CCardBody>
          <CProgress animated value={jobProgress} className="mb-3" />
        </CCardBody>
      </CCard>
      {Object.keys(toasters).map((toasterKey) => (
            <CToaster
              position={'top-right'}
              key={'toaster' + toasterKey}
            >
              {
                toasters[toasterKey].map((toast, key)=>{
                return(
                  <CToast
                    key={'toast' + key}
                    show={toast.show}
                    autohide={toast.autohide}
                    fade={toast.fade}
                  >
                  <CToastHeader closeButton={toast.closeButton}>
                    {toast.header}
                  </CToastHeader>
                  <CToastBody >
                    {toast.body}
                  </CToastBody>
              </CToast>
              )
            })
            }
          </CToaster>
          ))}
    </>
  )
}

export default Dashboard
