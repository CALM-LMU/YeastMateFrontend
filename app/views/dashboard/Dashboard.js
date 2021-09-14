import React from 'react'

const { ipcRenderer } = require('electron');

import { observer } from "mobx-react-lite"

import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CDataTable,
  CForm,
  CFormGroup,
  CLabel,
  CSwitch,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import axios from 'axios';
var portscanner = require('portscanner');


const fields = [
  { key: 'Job', _style: { width: '25%'} },
  { key: 'Path', _style: { width: '50%'} },
  { key: 'status', _style: { width: '30%' } }
]

const getStatusBadge = (status)=>{
  switch (status) {
    case "Pending": return 'warning'
    case "Running": return 'primary'
    case "Failed": return 'danger'
    default: return 'secondary'
  }
}

const Dashboard = (props) => {
  const [toasts, setToasts] = React.useState([{}])
  const [ioBackendRunning, setIOBackendRunning] = React.useState(false)
  const [decBackendRunning, setDecBackendRunning] = React.useState(false)
  const [jobList, setjobList] = React.useState([])

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
      { autohide: true && 5000, closeButton:true, fade:true, header:header, body:body, show:true }
    ])
  }

  const getBackendStatus = async () => {
    let ioIP = props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').ioIP
    let ioPort = props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').ioPort

    let decIP = props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').detectionIP
    let decPort = props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').detectionPort

    try {
      const result = await axios(
        `http://${ioIP}:${ioPort}/status`
      );
      setIOBackendRunning(true);
    } catch (error) {
      setIOBackendRunning(false);
    }

    try {
      const result = await axios(
        `http://${decIP}:${decPort}/status`
      );
      setDecBackendRunning(true);
    } catch (error) {
      setDecBackendRunning(false);
    }
  };

  const startBackends = () => {
    if (
      props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').localIO === false &&
      props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').localDetection === false
    ) {
      addToast('External backends set.', 'Start external backends manually.');
      return
    }

    if (props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').localIO === true) {      
      if (ioBackendRunning === true) {
        addToast('IO backend already connected.', 'Change backend settings if you want to change backends.');
      }
      else {
        portscanner.findAPortNotInUse(11002, 12002, '127.0.0.1', function(error, freePort) {
          props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').ioPort = freePort
        })

        ipcRenderer.send('start-io-backend', props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').ioPort)
        addToast('Starting local IO Backend.', 'A console windows should appear soon!');
      }
    }
    
    if (props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').localDetection === true) {
      if (decBackendRunning === true) {
        addToast('Detection backend already connected.', 'Change backend settings if you want to change backends.');
      }
      else {
        let port = props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').ioPort
        let device = props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').detectionDevice
        let config = props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').configPath
        let model = props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').modelPath

        portscanner.findAPortNotInUse(port+1, port+201, '127.0.0.1', function(error, freePort) {
          props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').detectionPort = freePort

          ipcRenderer.send('start-detection-backend', device, freePort, config, model)
          addToast('Starting local Detection Backend.', 'A console windows should appear soon!');
        })      
      }
    }
  };

  const getJobs = async () => {
    let ip = props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').ioIP
    let port = props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').ioPort

    try {
      const result = await axios(
        `http://${ip}:${port}/tasks`,
      );
      setjobList(result.data.tasks);
    } catch (error) {
      setjobList([]);
    }
  };

  React.useEffect(() => { 
    getBackendStatus();

    const interval = setInterval(() => {
      getBackendStatus();
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => { 
    getJobs();

    const interval = setInterval(() => {
      getJobs();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <CCard>
        <CCardHeader>
          Backend Status:
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CFormGroup className="d-flex justify-content-between">
              <CLabel>IO Backend</CLabel>
              <CSwitch className={'mx-1'} color={'success'} disabled={true} checked={ioBackendRunning}  id="ioYes"/>
            </CFormGroup>
            <CFormGroup className="d-flex justify-content-between">
              <CLabel>Detection Backend</CLabel>
              <CSwitch className={'mx-1'} color={'success'} disabled={true} checked={decBackendRunning}  id="decYes"/>
            </CFormGroup>
          </CForm>
        </CCardBody>
        <CCardFooter>
          <CFormGroup className="d-flex justify-content-between">
            <CButton size='sm' to="/backend"  color='primary'><FontAwesomeIcon icon='cog' /> Setup backends</CButton>
            <CButton size='sm' onClick={startBackends} color='success'><FontAwesomeIcon icon='upload' /> Start backends</CButton>
          </CFormGroup>
        </CCardFooter>
      </CCard>
      <CCard>
        <CCardHeader>
          You can find your queued and running tasks here.
        </CCardHeader>
        <CCardBody >
          <CForm>
            <CDataTable
              items={jobList}
              fields={fields}
              itemsPerPage={10}
              hover
              pagination
              scopedSlots = {{
                'status':
                    (item)=>{
                      return (
                        <td>
                          <CBadge color={getStatusBadge(item.Status)}>
                            {item.Status}
                          </CBadge>
                        </td>
                     )},
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

export default observer(Dashboard)
