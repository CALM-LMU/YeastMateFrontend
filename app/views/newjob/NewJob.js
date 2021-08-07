import React from 'react'

import { observer } from 'mobx-react-lite'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
const path = require('path');
const { dialog } = require('electron').remote;

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CForm,
  CFormGroup,
  CInput,
  CInputGroupAppend,
  CLabel,
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
  const [tempIP, setTempIP] = React.useState(props.props.selection.get('ip'));
  const [externalCollapse, setExternalCollapse] = React.useState(props.props.selection.get('external'));

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

  const switchExternal = () => {
    props.props.selection.set('external', !props.props.selection.get('external'))

    if (props.props.selection.get('external') === false) {
      setTempIP(props.props.selection.get('ip'))
      props.props.selection.set('ip', '127.0.0.1')
    }
    else {
      props.props.selection.set('ip', tempIP)
    }

    setExternalCollapse(props.props.selection.get('external'))
  }

  const setIP = (value) => {
    props.props.selection.set('ip', value)
  }

  const submitJob = () => {
    console.log(props.props.selection.get('ip'))
    axios.post(
      'http://' + props.props.selection.get('ip') + ':' + props.props.selection.get('port'),
      {
        _id: uuidv4(),
        path: path.normalize(props.props.selection.get('path')),
        includeTag: props.props.selection.get('includeTag'),
        excludeTag: props.props.selection.get('excludeTag'),
        preprocessing: props.props.preprocessing.get(props.props.selection.get('preprocessing')),
        detection: props.props.detection.get(props.props.selection.get('detection')),
        export: props.props.export.get(props.props.selection.get('export')),
      }
    ).then(function (response) {
      addToast('Success', 'Job succesfully submitted to backend.');
    })
    .catch(function (error) {
      addToast('Error', 'Job could not be sent to backend.');
    })
  };

  return (
    <>
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
              <CLabel>Include only files with following tag:</CLabel>
              <CInput id='includeTagInput' onChange={(event) => setIncludeTagInput(event.currentTarget.value)} value={props.props.selection.get('includeTag')}></CInput>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Exclude files with following tag:</CLabel>
              <CInput id='excludeTagInput' onChange={(event) => setExcludeTagInput(event.currentTarget.value)} value={props.props.selection.get('excludeTag')}></CInput>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Select your preset for detecting cells.</CLabel>
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
              <CLabel>Select your preprocessing preset if you want to align or load nd2 files.</CLabel>
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
              <CLabel>Select your preset for exporting detections.</CLabel>
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
            <CFormGroup><CLabel></CLabel></CFormGroup>
            <CFormGroup row>
              <CCol md='8'>
                  <CLabel>Do you run the python backend on an external system?</CLabel>
              </CCol>
              <CCol md='3'>
                <CFormGroup>
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchExternal} checked={props.props.selection.get('external')} id='stackYes'/>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CCollapse show={externalCollapse}>
              <CFormGroup row>
                  <CCol md='8'>
                    <CLabel>Set IP adress of external server.</CLabel>
                  </CCol>
                  <CCol md='2'>
                    <CInput defaultValue={props.props.selection.get('ip')} onChange={(event) => setIP(event.currentTarget.value)}/>
                  </CCol>
                </CFormGroup>
              </CCollapse>
          </CForm>
        </CCardBody>
        <CCardFooter>
          <CButton type='submit' size='sm' onClick={submitJob} color='primary'><FontAwesomeIcon icon='upload' /> Submit</CButton>
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
