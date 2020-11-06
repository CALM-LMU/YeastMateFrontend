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

  const submitJob = () => {
    axios.post(
      'http://127.0.0.1:5005/',
      {
        _id: uuidv4(),
        path: path.normalize(pathInput),
        align: props.props.alignment.get(document.getElementById("selectAlign").value),
        detect: props.props.detection.get(document.getElementById("selectDetection").value),
        export: props.props.detection.get(document.getElementById("selectExport").value),
      }
    ).then(function (response) {
      addToast('Success', 'Job succesfully submitted to server.');
    })
    .catch(function (error) {
      addToast('Error', 'Job could not be sent to server. A bug report was sent.');
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
              <CSelect custom name="select" id="selectAlign">
                <option
                  value={null}
                  name='No alignment'
                  >
                    No alignment
                </option>
                {Array.from( props.props.alignment ).map(([key, value]) => {
                    return props.props.alignment.get(key).name &&
                    (<option
                    value={key}
                    name={props.props.alignment.get(key).name}
                    >
                      {props.props.alignment.get(key).name}
                    </option>
                  )})}
              </CSelect>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Select your preset for detecting cells.</CLabel>
              <CSelect custom name="select" id="selectDetection">
                <option
                  value={null}
                  name='No detection'
                  >
                    No detection
                </option>
                {Array.from( props.props.detection ).map(([key, value]) => {
                    return props.props.detection.get(key).name &&
                    (<option
                    selected
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
              <CSelect custom name="select" id="selectExport">
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
