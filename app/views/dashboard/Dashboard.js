import React from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CForm,
  CProgress,
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
    case "RECEIVED": return 'info'
    case "PENDING": return 'warning'
    case "PROGRESS": return 'primary'
    case "SUCCESS": return 'success'
    case "FAILURE": return 'danger'
    default: return 'primary'
  }
}

const Dashboard = () => {
  const [jobList, setjobList] = React.useState([])
  const [jobProgress, setjobProgress] = React.useState(0)
  const [jobType, setjobType] = React.useState('Nothing')
  const [jobPath, setjobPath] = React.useState('nowhere')

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
      'http://127.0.0.1:5555/api/tasks',
    );

    var taskList = []
    var path = 'nowhere'
    var type = 'No task running'

    for (const [key, value] of Object.entries(result.data)) {
      if (value.state === 'PENDING') {
        var kwargs = value.kwargs.split("'")[3]
      }
      else {
        var kwargs = value.kwargs

        if (value.state === 'PROGRESS') {
          var path = value.kwargs
          if (value.name === 'tasks.align'){
            var type = 'Alignment'
          }
          if (value.name === 'tasks.detect'){
            var type = 'Detection'
          }
          if (value.name === 'tasks.mask'){
            var type = 'Masking'
          }
        }  
      }

      if (value['state'] === 'PROGRESS') {
        var progress = value.result
        var truncated_kwargs = kwargs.replace(kwargs.split('\\').pop().split('/').pop(), '')
      }
      else {
        var truncated_kwargs = kwargs
      }
      
      if (value.name === 'tasks.align') {
        var tmpDict = {"_id": key, "Job": 'Alignment', "Path": truncated_kwargs, 'Status': value.state}
      }
      else if (value.name === 'tasks.detect') {
        var tmpDict = {"_id": key, "Job": 'Detection', "Path": truncated_kwargs, 'Status': value.state}
      }
      else if (value.name === 'tasks.mask') {
        var tmpDict = {"_id": key, "Job": 'Mask', "Path": truncated_kwargs, 'Status': value.state}
      }

      taskList.push(tmpDict)
    }

    setjobList(taskList);
    setjobType(type);
    setjobPath(path);
    setjobProgress(progress);
  };

  const handleRemoveClick = (index) => {
    axios.post(
      'http://127.0.0.1:5555/api/task/revoke/' + jobList[index]._id,
      null, { params: { terminate : true }})
    .then(function (response) {
      let newJobs = jobList.slice()
      newJobs.splice(index, 1)
      setjobList([...newJobs])

      setjobType('No task running');
      setjobPath('nowhere');
      setjobProgress(0);
    })
    .catch(function (error) {
      addToast('Error', 'Unable to connect to server, try again. A bug report was sent.');
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
