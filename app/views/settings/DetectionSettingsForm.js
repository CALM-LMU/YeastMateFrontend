import React from 'react'
import { observer } from "mobx-react-lite"

import NumericInput from 'react-numeric-input';

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CSelect,
  CSwitch,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const uuidv4 = require("uuid/v4")


const DetectionSettingsForm = (props) => {
  const [modalAdd, setModalAdd] = React.useState(false)
  const [modalRemove, setModalRemove] = React.useState(false)
  const [NameInput, setNameInput] = React.useState("")
  const [selectPresetValue, setselectPresetValue] = React.useState("a809ff23-4235-484f-86f2-e5d87da8333d")

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
  
  const switchStack = () => {
    if (props.props.get(selectPresetValue).zstack === true) {
      props.props.get(selectPresetValue).zstack = false
    }
    else {
      props.props.get(selectPresetValue).zstack = true
    }
  }

  const switchVideo = () => {
    if (props.props.get(selectPresetValue).video === true) {
      props.props.get(selectPresetValue).video = false
    }
    else {
      props.props.get(selectPresetValue).video = true
    }
  }

  const switchVideoSplit = () => {
    if (props.props.get(selectPresetValue).videoSplit === true) {
      props.props.get(selectPresetValue).videoSplit = false
    }
    else {
      props.props.get(selectPresetValue).videoSplit = true
    }
  }

  const switchFiji = () => {
    if (props.props.get(selectPresetValue).fiji === true) {
      props.props.get(selectPresetValue).fiji = false
    }
    else {
      props.props.get(selectPresetValue).fiji = true
    }
  }

  const setgraychannel = (value) => {
    props.props.get(selectPresetValue).graychannel = value
  }

  const setIP = (value) => {
    props.props.get(selectPresetValue).ip = value
  }

  const handleAddPreset = () => {
    setModalAdd(false)

    const id = uuidv4()
    props.props.set(id, {
      name: NameInput,
      graychannel: 0,
      video: false,
      videoSplit: true, 
      fiji: true,
      ip: '127.0.0.1:5000'
    })

    setselectPresetValue(id)
  };

  const handleRemovePreset = async () => {
    if (selectPresetValue !== "a809ff23-4235-484f-86f2-e5d87da8333d") {
      setModalRemove(false)
      props.props.delete(selectPresetValue)
      setselectPresetValue("a809ff23-4235-484f-86f2-e5d87da8333d")   
    }
    else {
      setModalRemove(false)
      addToast('Error', 'Default preset can not be deleted.');
    }
  }; 

  return (
    <>
      <CCard>
        <CCardHeader>Detection Settings</CCardHeader>
        <CCardBody >
          <CForm encType="multipart/form-data" className="form-horizontal">
            <CFormGroup>
              <CLabel>Select Detection Preset</CLabel>
              <CSelect value={selectPresetValue} onChange={(event) => setselectPresetValue(event.currentTarget.value)} custom id="selectPreset">
                {Array.from( props.props ).map(([key, value]) => {
                  return props.props.get(key).name &&
                  (<option
                  value={key}
                  name={props.props.get(key).name}
                  >
                    {props.props.get(key).name}
                  </option>
                )})}
              </CSelect>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="5">
                  <CLabel>Detection on z-stacks?</CLabel>
              </CCol>
              <CCol md="5">
                <CFormGroup>
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchStack} checked={props.props.get(selectPresetValue).zstack} id="stackYes"/>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="5">
                  <CLabel>Detection on videos?</CLabel>
              </CCol>
              <CCol md="5">
                <CFormGroup>
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchVideo} checked={props.props.get(selectPresetValue).video} id="videoYes"/>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="5">
                  <CLabel>Split videos into single files?</CLabel>
              </CCol>
              <CCol md="5">
                <CFormGroup>
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchVideoSplit} checked={props.props.get(selectPresetValue).videoSplit} id="videoSplitYes"/>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="5">
                  <CLabel>Convert into Fiji-compatible image format?</CLabel>
              </CCol>
              <CCol md="5">
                <CFormGroup>
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchFiji} checked={props.props.get(selectPresetValue).fiji} id="fijiYes"/>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="5">
                <CLabel>Axis of gray (BF/DIC) overview channel.</CLabel>
              </CCol>
              <CCol sm="1">
                <NumericInput min={0} max={10} step={1} value={props.props.get(selectPresetValue).graychannel} onChange={(event) => setgraychannel(event)}/>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="5">
                <CLabel>IP address and port of detection server.</CLabel>
              </CCol>
              <CCol sm="6">
                <CInput id="ipInput" onChange={(event) => setIP(event.currentTarget.value)} value={props.props.get(selectPresetValue).ip}></CInput>
              </CCol>
            </CFormGroup>
          </CForm>
          <CModal 
              show={modalAdd} 
              onClose={setModalAdd}
          >
            <CModalHeader closeButton>
              <CModalTitle>Set preset name.</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CInput id="nameInput" onChange={(event) => setNameInput(event.currentTarget.value)} value={NameInput}></CInput>
            </CModalBody>
            <CModalFooter>
              <CButton onClick={handleAddPreset} color="primary"><FontAwesomeIcon icon="plus" />   Add Preset</CButton>{' '}
              <CButton 
                color="secondary" 
                onClick={() => setModalAdd(false)}
              ><FontAwesomeIcon icon="undo" />   Cancel</CButton>
            </CModalFooter>
          </CModal>
          <CModal 
              show={modalRemove} 
              onClose={setModalRemove}
          >
            <CModalHeader closeButton>
              <CModalTitle>Delete preset?</CModalTitle>
            </CModalHeader>
            <CModalFooter>
              <CButton onClick={handleRemovePreset} color="danger"><FontAwesomeIcon icon="exclamation" />   Delete Preset</CButton>{' '}
              <CButton 
                color="secondary" 
                onClick={() => setModalRemove(false)}
              ><FontAwesomeIcon icon="undo" />   Cancel</CButton>
            </CModalFooter>
          </CModal>
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
          <CButton type="add" onClick={setModalAdd} size="sm" color="success"><FontAwesomeIcon icon="plus" /> Add new preset</CButton>
          <CButton type="add" onClick={setModalRemove} size="sm" color="danger"><FontAwesomeIcon icon="ban" /> Remove current preset</CButton>
        </CCardFooter>
      </CCard>
    </>
  )
}

export default observer(DetectionSettingsForm)
