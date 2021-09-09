import React from 'react'

import { observer } from 'mobx-react-lite'
import { v4 as uuidv4 } from 'uuid';
const path = require('path');

var electron = require('electron')
const { dialog } = require('electron').remote;
const { ipcRenderer } = require('electron')

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
  const [ioBackendRunning, setIOBackendRunning] = React.useState(electron.remote.getGlobal('ioBackendRunning'))
  const [decBackendRunning, setDecBackendRunning] = React.useState(electron.remote.getGlobal('decBackendRunning'))

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
    try {
      const result = await axios(
        props.props.detection.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea') + ":" + props.props.get('port'),
      );
      setIOBackendRunning(true);
    } catch (error) {
      setIOBackendRunning(false);
    }

    try {
      const result = await axios(
        props.props.get('ip') + ":" + props.props.get('port'),
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
    portscanner.findAPortNotInUse(11002, 11201, '127.0.0.1', function(error, freePort) {
      let newport = freePort
    })
    if (
      props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').localIO === false &&
      props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').localDetection === false
    ) {
      addToast('External backends set.', 'Start external backends manually.');
      return
    }

    if (props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').localIO === true) {
      if (ioBackendRunning === true) {
        addToast('Local IO Backend running.', 'Local IO Backend is running.');
      }
      else {
        ipcRenderer.send('start-io-backend', ip, port, gpu)
        addToast('Starting local IO Backend.', 'A console windows should appear soon!');
      }
    }
    
    if (props.props.backend.get('f16dfd0d-39b0-4202-8fec-9ba7d3b0adea').localDetection === true) {
      if (decBackendRunning === true) {
        addToast('Local Detection Backend running.', 'Local Detection Backend is running.');
      }
      else {
        ipcRenderer.send('start-detection-backend', ip, port, gpu)
        addToast('Starting local Detection Backend.', 'A console windows should appear soon!');
      }
    }
  };

  const submitJob = () => {
    
    let req = {
      _id: uuidv4(),
      path: path.normalize(props.props.selection.get('path')),
      includeTag: props.props.selection.get('includeTag'),
      excludeTag: props.props.selection.get('excludeTag'),
      preprocessing: props.props.preprocessing.get(props.props.selection.get('preprocessing')),
      detection: props.props.detection.get(props.props.selection.get('detection')),
      export: props.props.export.get(props.props.selection.get('export')),
    }

    axios.post(
      'http://' + ip + ':' + port, req
    ).then(function (response) {
      console.log('big success!');
    })
    .catch(function (error) {
      console.log('Error when sending cached request');
    })

    addToast('Starting Backend!', '1-2 console windows should appear soon!');
  };

  React.useEffect(() => { 
    getBackendStatus();

    const interval = setInterval(() => {
      getBackendStatus();
    }, 1000);

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
            <CButton size='sm' onClick={startBackends} color='success'><FontAwesomeIcon icon='submit' /> Start backends</CButton>
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
              <CLabel>Select your preset for <CLink to="/export"> export settings.</CLink></CLabel>
              <CSelect value={props.props.selection.get('export')} onChange={(event) => handleExportSelection(event.currentTarget.value)} custom name='select' id='selectExport'>
                <option
                  value={null}
                  name='No export'
                  >
                    No export
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
