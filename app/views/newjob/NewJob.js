import React from 'react'

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CFormText,
  CInput,
  CLabel,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CRow,
  CSelect,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NewJob = () => {
  const [mountList, setmountList] = React.useState([])
  const [modalMount, setModalMount] = React.useState(false)
  const [user, setuser] = React.useState("")
  const [password, setpassword] = React.useState("")
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
      { position:'top-right', autohide: true && 5000, closeButton:true, fade:true, header:header, body:body, show:true }
    ])
  }

  const modalCancel = () => {
    setModalMount(false)
    setpassword("")
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
                {mountList.map((mount, idx) => {
                  return mount &&
                  (<option
                  value={mount._id}
                  >
                    {mount.Path}
                  </option>
                )})}
              </CSelect>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Select your settings preset. You can set your preset at the respective settings sites.</CLabel>
              <CSelect custom name="select" id="selectAlign">
                {alignpresetList.map((alignpreset, idx) => {
                  return alignpreset &&
                  (<option
                  value={alignpreset._id}
                  >
                    {alignpreset.name}
                  </option>
                )})}
              </CSelect>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Detection Preset.</CLabel>
              <CSelect custom name="select" id="selectDetection">
                {detectionpresetList.map((detectionpreset, idx) => {
                  return detectionpreset &&
                  (<option
                  value={detectionpreset._id}
                  >
                    {detectionpreset.name}
                  </option>
                )})}
              </CSelect>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Mask Preset.</CLabel>
              <CSelect custom name="select" id="selectMask">
                {maskpresetList.map((maskpreset, idx) => {
                  return maskpreset &&
                  (<option
                  value={maskpreset._id}
                  >
                    {maskpreset.name}
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
      <CModal 
        show={modalMount} 
        onClose={setModalMount}
      >
        <CModalHeader closeButton>
          <CModalTitle>Set username and password as they are on the fileserver.</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol sm="12">
              <CForm action="" method="post">
                <CFormGroup>
                  <CLabel htmlFor="nf-user">Username</CLabel>
                  <CInput
                    type="user"
                    id="nf-user"
                    name="nf-user"
                    placeholder="Enter User.."
                    onChange={(event) => setuser(event.currentTarget.value)} value={user}
                  />
                  <CFormText className="help-block">Please enter your username</CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-password">Password</CLabel>
                  <CInput
                    type="password"
                    id="nf-password"
                    name="nf-password"
                    placeholder="Enter Password.."
                    onChange={(event) => setpassword(event.currentTarget.value)} value={password}
                  />
                  <CFormText className="help-block">Please enter your password</CFormText>
                </CFormGroup>
              </CForm>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={submitJob} color="primary"><FontAwesomeIcon icon="sync" />   Submit</CButton>{' '}
          <CButton 
            color="secondary" 
            onClick={() => modalCancel()}
          ><FontAwesomeIcon icon="undo" />   Cancel</CButton>
        </CModalFooter>
      </CModal>
      {Object.keys(toasters).map((toasterKey) => (
            <CToaster
              position={toasterKey}
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

export default NewJob
