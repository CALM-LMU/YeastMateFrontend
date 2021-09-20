import React from 'react'

import { observer } from 'mobx-react-lite'
import { v4 as uuidv4 } from 'uuid';
const path = require('path');

const { dialog } = require('electron').remote;
const { ipcRenderer } = require('electron');

import axios from 'axios';
var portscanner = require('portscanner');

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CForm,
  CFormGroup,
  CInput,
  CInputGroupAppend,
  CLabel,
  CLink,
  CSelect,
  CSwitch,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NewJob = (props) => {
  const [toasts, setToasts] = React.useState([{}])
  const [ioBackendRunning, setIOBackendRunning] = React.useState(false)
  const [decBackendRunning, setDecBackendRunning] = React.useState(false)

  const handleAddPathClick = () => {
    var selectedPath = dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (typeof path !== 'undefined') {
      setPathInput(selectedPath[0])
    }
  };

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

  const setPathInput = (value) => {
    props.props.selection.set('path', value)
  }

  const setIncludeTagInput = (value) => {
    props.props.selection.set('includeTag', value)
  }

  const setExcludeTagInput = (value) => {
    props.props.selection.set('excludeTag', value)
  }

  const handlePreprocessingSelection = (value) => {
    props.props.selection.set('preprocessing', value)
  }

  const handleDetectionSelection = (value) => {
    props.props.selection.set('detection', value)
  }

  const handleExportSelection = (value) => {
    props.props.selection.set('export', value)
  }

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

  const submitJob = () => {
    if (ioBackendRunning === false) {
      addToast('IO Backend not connected.', 'Check Backend settings.');
      return
    }

    let ip = props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').ioIP
    let port = props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').ioPort
    
    let req = {
      _id: uuidv4(),
      path: path.normalize(props.props.selection.get('path')),
      includeTag: props.props.selection.get('includeTag'),
      excludeTag: props.props.selection.get('excludeTag'),
      backend: props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea'),
      preprocessing: props.props.preprocessing.get(props.props.selection.get('preprocessing')),
      detection: props.props.detection.get(props.props.selection.get('detection')),
      export: props.props.export.get(props.props.selection.get('export')),
    }

    axios.post(
      `http://${ip}:${port}/submit`, req
    ).then(function (response) {
      addToast('Job sent!', 'Job sent to backend.');
    })
    .catch(function (error) {
      addToast('Task failed!', 'Job could not be sent to backend.')
    })
  };

  React.useEffect(() => { 
    getBackendStatus();

    const interval = setInterval(() => {
      getBackendStatus();
    }, 2500);

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
          Start a new job!
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CFormGroup>
              <CLabel>Path:</CLabel>
              <CInputGroupAppend>
                <CInput id='pathInput' onChange={(event) => setPathInput(event.currentTarget.value)} value={props.props.selection.get('path')}></CInput>
                <CButton onClick={handleAddPathClick} size='sm' color='primary'><FontAwesomeIcon icon='plus' /> Select Path</CButton>
              </CInputGroupAppend>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Include only files containing:</CLabel>
              <CInput id='includeTagInput' onChange={(event) => setIncludeTagInput(event.currentTarget.value)} value={props.props.selection.get('includeTag')}></CInput>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Exclude files containing:</CLabel>
              <CInput id='excludeTagInput' onChange={(event) => setExcludeTagInput(event.currentTarget.value)} value={props.props.selection.get('excludeTag')}></CInput>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Select your preset for <CLink to="/detection"> detection settings.</CLink></CLabel>
              <CSelect value={props.props.selection.get('detection')} onChange={(event) => handleDetectionSelection(event.currentTarget.value)} custom name='select' id='selectDetection'>
                <option
                  value={null}
                  name='No detection'
                  >
                    No detection
                </option>
                {Array.from( props.props.detection ).map(([key, value]) => {
                    return props.props.detection.get(key).name &&
                    (<option
                    value={key}
                    name={props.props.detection.get(key).name}
                    >
                      {props.props.detection.get(key).name}
                    </option>
                  )})}
              </CSelect>
            </CFormGroup>
            <CFormGroup>
            <CLabel>Select your preset for <CLink to="/preprocessing"> preprocessing settings.</CLink></CLabel>
              <CSelect value={props.props.selection.get('preprocessing')} onChange={(event) => handlePreprocessingSelection(event.currentTarget.value)} custom name='select' id='selectPreprocessing'>
                <option
                  value={null}
                  name='No Preprocessing'
                  >
                    No Preprocessing
                </option>
                {Array.from( props.props.preprocessing ).map(([key, value]) => {
                    return props.props.preprocessing.get(key).name &&
                    (<option
                    value={key}
                    name={props.props.preprocessing.get(key).name}
                    >
                      {props.props.preprocessing.get(key).name}
                    </option>
                  )})}
              </CSelect>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Select your preset for <CLink to="/export"> crop settings.</CLink></CLabel>
              <CSelect value={props.props.selection.get('export')} onChange={(event) => handleExportSelection(event.currentTarget.value)} custom name='select' id='selectExport'>
                <option
                  value={null}
                  name='No export'
                  >
                    No Cropping
                </option>
                {Array.from( props.props.export ).map(([key, value]) => {
                    return props.props.export.get(key).name &&
                    (<option
                    value={key}
                    name={props.props.export.get(key).name}
                    >
                      {props.props.export.get(key).name}
                    </option>
                  )})}
              </CSelect>
            </CFormGroup>
          </CForm>
        </CCardBody>
        <CCardFooter>
          <CButton type='submit' size='sm' onClick={submitJob} color='success'><FontAwesomeIcon icon='upload' /> Submit</CButton>
        </CCardFooter>
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

export default observer(NewJob)
