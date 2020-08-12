import React from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CForm,
  CToast,
  CToaster,
  CToastBody,
  CToastHeader
} from '@coreui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import axios from 'axios'

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
    case "Pending": return 'warning'
    case "Running": return 'primary'
    case "Failed": return 'danger'
    default: return 'secondary'
  }
}

const Dashboard = () => {
  const [jobList, setjobList] = React.useState([])

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
      { autohide: true && 2000, closeButton:true, fade:true, header:header, body:body, show:true }
    ])
  }

  const get_jobs = async () => {
    const result = await axios(
      'http://127.0.0.1:5000/',
    );

    setjobList(result.data.tasks);
  };

  const handleRemoveClick = (index) => {
    axios.post(
      'http://127.0.0.1:5555/api/task/revoke/' + jobList[index]._id,
      null, { params: { terminate : true }})
    .then(function (response) {
      let newJobs = jobList.slice()
      newJobs.splice(index, 1)
      setjobList([...newJobs])
    })
    .catch(function (error) {
      addToast('Error', 'Cancelling tasks not implemented yet. Coming soon.');
    })
  }

  React.useEffect(() => { 
    get_jobs();

    const interval = setInterval(() => {
      get_jobs();
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  return (
    <>
      <CCard>
        <CCardHeader>
          Job Status
        </CCardHeader>
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
