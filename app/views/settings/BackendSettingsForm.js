import React from 'react'
import { observer } from "mobx-react-lite"

const remote = require('electron').remote;
const { dialog } = require('electron').remote;
const { ipcRenderer } = require('electron');

import axios from 'axios';
var portscanner = require('portscanner');

import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CButton,
  CForm,
  CFormGroup,
  CInput,
  CInputGroupAppend,
  CLabel,
  CLink,
  CSelect,
  CSwitch,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const BackendSettingsForm = (props) => {
  const selectPresetValue = 'f16dfd0d-39b0-4202-8fec-9ba7d3b0adea'
  const [ioBackendRunning, setIOBackendRunning] = React.useState(false)
  const [decBackendRunning, setDecBackendRunning] = React.useState(false)
  const [ioCollapse, setIOCollapse] = React.useState(props.props.backend.get(selectPresetValue).localIO);
  const [detectionCollapse, setDetectionCollapse] = React.useState(props.props.backend.get(selectPresetValue).localDetection);

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

  const switchIO = () => {
    props.props.backend.get(selectPresetValue).localIO =  !props.props.backend.get(selectPresetValue).localIO
    setIOCollapse(props.props.backend.get(selectPresetValue).localIO)
  }

  const switchDetection = () => {
    props.props.backend.get(selectPresetValue).localDetection =  !props.props.backend.get(selectPresetValue).localDetection
    setDetectionCollapse(props.props.backend.get(selectPresetValue).localDetection)
  }

  const setIOIP = (value) => {
    props.props.backend.get(selectPresetValue).ioIP = value
  }
  
  const setIOPort = (value) => {
    props.props.backend.get(selectPresetValue).ioIP = value
  }

  const setDetectionIP = (value) => {
    props.props.backend.get(selectPresetValue).detectionIP = value
  }
  
  const setDetectionPort = (value) => {
    props.props.backend.get(selectPresetValue).detectionPort = value
  }

  const handleGPUSelection = (value) => {
    props.props.backend.get(selectPresetValue).detectionDevice = value
  }

  const setConfigPath = (value) => {
    props.props.backend.get(selectPresetValue).configPath = value
  }

  const setModelPath = (value) => {
    props.props.backend.get(selectPresetValue).modelPath = value
  }

  const handleConfigPathClick = () => {
    var selectedPath = dialog.showOpenDialog({
      properties: ['openFile']
    });

    if (typeof selectedPath !== 'undefined') {
      props.props.backend.get(selectPresetValue).configPath = selectedPath[0]
    }
  };

  const handleModelPathClick = () => {
    var selectedPath = dialog.showOpenDialog({
      properties: ['openFile']
    });

    if (typeof selectedPath !== 'undefined') {
      props.props.backend.get(selectPresetValue).modelPath = selectedPath[0]
    }
  };

  const handleConfigResetClick = () => {
    props.props.backend.get(selectPresetValue).configPath = remote.getGlobal('resourcesPath') + '/python/YeastMate/yeastmate-artifacts/yeastmate.yaml';
  }

  const handleModelResetClick = () => {
    props.props.backend.get(selectPresetValue).modelPath = remote.getGlobal('resourcesPath') + '/python/YeastMate/yeastmate-artifacts/yeastmate_weights.pth';
  }

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
        <CCardBody>
          <CLabel>Check the documentation at <CLink target='_blank' href="https://yeastmate.readthedocs.org">yeastmate.readthedocs.org</CLink> for more details!</CLabel>
        </CCardBody>
      </CCard>
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
            <CButton size='sm' onClick={startBackends} color='success'><FontAwesomeIcon icon='upload' /> Start backends</CButton>
          </CFormGroup>
        </CCardFooter>
      </CCard>
      <CCard>
        <CCardHeader>Backend Settings</CCardHeader>
        <CCardBody >
          <CForm encType="multipart/form-data" className="form-horizontal">
            <CFormGroup><CLabel></CLabel></CFormGroup>
            <CFormGroup className="d-flex justify-content-between">
              <CLabel>Run local IO backend?</CLabel>
              <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchIO} checked={props.props.backend.get(selectPresetValue).localIO} id="boxYes"/>
            </CFormGroup>
            <CCollapse show={!ioCollapse}>
              <CFormGroup row>
                  <CCol md='8'>
                    <CLabel>Set IP adress of external IO server.</CLabel>
                  </CCol>
                  <CCol md='2'>
                    <CInput defaultValue={props.props.backend.get(selectPresetValue).ioIP} onChange={(event) => setIOIP(event.currentTarget.value)}/>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md='8'>
                    <CLabel>Set port of external IO server.</CLabel>
                  </CCol>
                  <CCol md='2'>
                    <CInput defaultValue={props.props.backend.get(selectPresetValue).ioPort} onChange={(event) => setIOPort(event.currentTarget.value)}/>
                  </CCol>
                </CFormGroup>
              </CCollapse>
            <CFormGroup><CLabel></CLabel></CFormGroup>
            <CFormGroup  className="d-flex justify-content-between">
              <CLabel>Run local detection backend?</CLabel>
              <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchDetection} checked={props.props.backend.get(selectPresetValue).localDetection} id="scaleYes"/>
            </CFormGroup>
            <CCollapse show={detectionCollapse}>
              <CFormGroup>
                <CLabel>Run local detection backend on GPU or CPU?</CLabel>
                <CSelect value={props.props.backend.get(selectPresetValue).detectionDevice} onChange={(event) => handleGPUSelection(event.currentTarget.value)} custom name='select' id='selectDevice'>
                  <option value={'gpu'} name={'GPU'}>
                    {'GPU'}
                  </option>
                  <option value={'cpu'} name={'CPU'}>
                    {'CPU'}
                  </option>
                </CSelect>
              </CFormGroup>
              <CFormGroup>
                <CLabel>Set path to model configuration file.</CLabel>
                <CInputGroupAppend>
                  <CInput id="pathInput" onChange={(event) => setConfigPath(event.currentTarget.value)} value={props.props.backend.get(selectPresetValue).configPath}></CInput>
                  <CButton onClick={handleConfigPathClick} size="sm" color="primary"><FontAwesomeIcon icon="plus" /> Select Path</CButton>
                  <CButton onClick={handleConfigResetClick} size="sm" color="success"><FontAwesomeIcon icon="sync" /> Reset Path</CButton>
                </CInputGroupAppend>
              </CFormGroup>
              <CFormGroup>
                <CLabel>Set path to model weight file.</CLabel>
                <CInputGroupAppend>
                  <CInput id="pathInput" onChange={(event) => setModelPath(event.currentTarget.value)} value={props.props.backend.get(selectPresetValue).modelPath}></CInput>
                  <CButton onClick={handleModelPathClick} size="sm" color="primary"><FontAwesomeIcon icon="plus" /> Select Path</CButton>
                  <CButton onClick={handleModelResetClick} size="sm" color="success"><FontAwesomeIcon icon="sync" /> Reset Path</CButton>
                </CInputGroupAppend>
              </CFormGroup>
            </CCollapse>
            <CCollapse show={!detectionCollapse}>
              <CFormGroup row>
                  <CCol md='8'>
                    <CLabel>Set IP adress of external detection server.</CLabel>
                  </CCol>
                  <CCol md='2'>
                    <CInput defaultValue={props.props.backend.get(selectPresetValue).detectionIP} onChange={(event) => setDetectionIP(event.currentTarget.value)}/>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md='8'>
                    <CLabel>Set port of external detection server.</CLabel>
                  </CCol>
                  <CCol md='2'>
                    <CInput defaultValue={props.props.backend.get(selectPresetValue).detectionPort} onChange={(event) => setDetectionPort(event.currentTarget.value)}/>
                  </CCol>
                </CFormGroup>
              </CCollapse>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default observer(BackendSettingsForm)
