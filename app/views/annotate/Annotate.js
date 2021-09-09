import React from 'react'

import { observer } from "mobx-react-lite"
const { dialog } = require('electron').remote;
const { ipcRenderer } = require('electron')

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
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Annotate = (props) => {
  const [path, setPath] = React.useState("")
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

  const handleAddPathClick = () => {
    var selectedPath = dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (typeof path !== 'undefined') {
      setPathInput(selectedPath[0])
    }
  };

  const setPathInput = (value) => {
    setPath(value)
  }

  const submitJob = () => {
    if (path == "") {
      addToast('Error', 'Path to images must be set.');
      return
    }

    ipcRenderer.send('start-napari', path)
  };

  return (
    <>
      <CCard>
        <CCardHeader>
          Annotate and correct your data!
        </CCardHeader>
        <CCardBody>
          <CForm encType="multipart/form-data" className="form-horizontal">
            <CFormGroup>
              <CLabel>Path:</CLabel>
              <CInputGroupAppend>
                <CInput id="pathInput" onChange={(event) => setPathInput(event.currentTarget.value)} value={path}></CInput>
                <CButton onClick={handleAddPathClick} size="sm" color="primary"><FontAwesomeIcon icon="plus" /> Select Path</CButton>
              </CInputGroupAppend>
            </CFormGroup>
          </CForm>
          {Object.keys(toasters).map((toasterKey) => (
            <CToaster
              position='top-right'
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
        </CCardBody>
        <CCardFooter>
          <div className="d-flex justify-content-between">
            <CButton type="add" onClick={submitJob} size="sm" color="success"><FontAwesomeIcon icon="plus" /> Start annotation process</CButton>
          </div>
        </CCardFooter>
      </CCard>
    </>
  )
}

export default observer(Annotate)
