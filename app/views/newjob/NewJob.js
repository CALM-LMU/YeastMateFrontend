import React from 'react'

import { observer } from "mobx-react-lite"
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
  CForm,
  CFormGroup,
  CInput,
  CInputGroupAppend,
  CLabel,
  CSelect,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NewJob = (props) => {
  const [toasts, setToasts] = React.useState([{}])
  const [pathInput, setPathInput] = React.useState("")

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

  const handlePreprocessingSelection = (value) => {
    props.props.selection.set('preprocessing', value)
  }

  const handleDetectionSelection = (value) => {
    props.props.selection.set('detection', value)
  }

  const handleExportSelection = (value) => {
    props.props.selection.set('export', value)
  }

  const submitJob = () => {
    axios.post(
      'http://127.0.0.1:5005/',
      {
        _id: uuidv4(),
        path: path.normalize(pathInput),
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
                <CInput id="pathInput" onChange={(event) => setPathInput(event.currentTarget.value)} value={pathInput}></CInput>
                <CButton type="add" onClick={handleAddPathClick} size="sm" color="primary"><FontAwesomeIcon icon="plus" /> Select Path</CButton>
              </CInputGroupAppend>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Select your preprocessing preset if you want to align or load nd2 files.</CLabel>
              <CSelect value={props.props.selection.get('preprocessing')} onChange={(event) => handlePreprocessingSelection(event.currentTarget.value)} custom name="select" id="selectPreprocessing">
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
              <CLabel>Select your preset for detecting cells.</CLabel>
              <CSelect value={props.props.selection.get('detection')} onChange={(event) => handleDetectionSelection(event.currentTarget.value)} custom name="select" id="selectDetection">
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
              <CLabel>Select your preset for exporting detections.</CLabel>
              <CSelect value={props.props.selection.get('export')} onChange={(event) => handleExportSelection(event.currentTarget.value)} custom name="select" id="selectExport">
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
          <CButton type="submit" size="sm" onClick={submitJob} color="primary"><FontAwesomeIcon icon="upload" /> Submit</CButton>
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
