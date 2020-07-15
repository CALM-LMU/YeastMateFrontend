import React from 'react'

import { observer } from "mobx-react-lite"

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CForm,
  CFormGroup,
  CLabel,
  CSelect,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NewJob = (props) => {
  const [alignpresetList, setalignpresetList] = React.useState([{_id: 'null', name: "No Alignment"}])
  const [detectionpresetList, setdetectionpresetList] = React.useState([{_id: 'null', name: "No Detection"}])
  const [maskpresetList, setmaskpresetList] = React.useState([{_id: 'null', name: "No Mask Generation"}])

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
      { autohide: true && 5000, closeButton:true, fade:true, header:header, body:body, show:true }
    ])
  }

  const modalCancel = () => {
    setModalMount(false)
    setpassword("")
  }

  const handleSubmitClick = () => {
    const idx = mountList.findIndex(p => p._id === document.getElementById("selectPath").value)
    
    if (mountList[idx].Server == 'True') {
      setModalMount(true)
    }
    else {
      submitJob();
    }
  }

  const submitJob = () => {
    
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
              <CLabel>Select the mounted folder to your data. If your folder has not been mounted yet, mount it under Paths Settings</CLabel>
              <CSelect custom name="select" id="selectPath">
                {props.props.paths.get('pathList').pathList.map((path, idx) => {
                    return path &&
                    (<option
                    value={path._id}
                    >
                      {path.Path}
                    </option>
                  )})}
              </CSelect>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Select your settings preset. You can set your preset at the respective settings sites.</CLabel>
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
              <CLabel>Detection Preset.</CLabel>
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
                    value={key}
                    name={props.props.detection.get(key).name}
                    >
                      {props.props.detection.get(key).name}
                    </option>
                  )})}
              </CSelect>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Mask Preset.</CLabel>
              <CSelect custom name="select" id="selectMask">
                <option
                  value={null}
                  name='No mask generation'
                  >
                    No mask generation
                </option>
                {Array.from( props.props.mask ).map(([key, value]) => {
                    return props.props.mask.get(key).name &&
                    (<option
                    value={key}
                    name={props.props.mask.get(key).name}
                    >
                      {props.props.mask.get(key).name}
                    </option>
                  )})}
              </CSelect>
            </CFormGroup>
          </CForm>
        </CCardBody>
        <CCardFooter>
          <CButton type="submit" size="sm" onClick={handleSubmitClick} color="primary"><FontAwesomeIcon icon="upload" /> Submit</CButton>
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
