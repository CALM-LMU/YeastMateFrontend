import React from 'react'
import { observer } from "mobx-react-lite"

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
  CInputGroupPrepend,
  CInputGroupAppend,
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

import { v4 as uuidv4 } from 'uuid';

const DetectionSettingsForm = (props) => {
  const [selectPresetValue, setselectPresetValue] = React.useState("a809ff23-4235-484f-86f2-e5d87da8333d")
  const [modalAdd, setModalAdd] = React.useState(false)
  const [boxCollapse, setBoxCollapse] = React.useState(props.props.get(selectPresetValue).boxExpansion);
  const [videoCollapse, setVideoCollapse] = React.useState(props.props.get(selectPresetValue).video);
  const [modalRemove, setModalRemove] = React.useState(false)
  const [NameInput, setNameInput] = React.useState("")

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
    props.props.get(selectPresetValue).zstack = !props.props.get(selectPresetValue).zstack
  }

  const switchVideo = () => {
    props.props.get(selectPresetValue).video = !props.props.get(selectPresetValue).video
    setVideoCollapse(props.props.get(selectPresetValue).video)
  }

  const switchBox = () => {
    props.props.get(selectPresetValue).boxExpansion = !props.props.get(selectPresetValue).boxExpansion
    setBoxCollapse(props.props.get(selectPresetValue).boxExpansion)
  }

  const setgraychannel = (value) => {
    props.props.get(selectPresetValue).graychannel = value
  }

  const setboxsize = (value) => {
    props.props.get(selectPresetValue).boxsize = value
  }

  const setIP = (value) => {
    props.props.get(selectPresetValue).ip = value
  }

  const handleLocalIPClick = () => {
    setIP("127.0.0.1:5000")
  }

  const handleAddPreset = () => {
    setModalAdd(false)

    const id = uuidv4()
    props.props.set(id, {
      name: NameInput,
      graychannel: props.props.get(selectPresetValue).graychannel,
      boxsize: props.props.get(selectPresetValue).boxsize,
      zstack: props.props.get(selectPresetValue).zstack,
      video: props.props.get(selectPresetValue).video,
      boxExpansion: props.props.get(selectPresetValue).boxExpansion, 
      frameSelection: props.props.get(selectPresetValue).frameSelection,
      ip: props.props.get(selectPresetValue).ip
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
            <CFormGroup><CLabel></CLabel></CFormGroup>
            <CFormGroup row>
              <CCol md="5">
                <CLabel>IP address and port of detection server.</CLabel>
              </CCol>
              <CCol sm="5">
                <CInputGroupPrepend>
                  <CButton onClick={handleLocalIPClick} type="add" size="sm" color="primary">Set local backend</CButton>
                  <CInput id="ipInput" onChange={(event) => setIP(event.currentTarget.value)} value={props.props.get(selectPresetValue).ip}></CInput>
                </CInputGroupPrepend>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="8">
                <CLabel>Axis of non-fluorescent (BF/DIC/PH) overview channel.</CLabel>
              </CCol>
              <CCol sm="2">
                <CInput type='number' min={0} defaultValue={props.props.get(selectPresetValue).graychannel} onChange={(event) => setgraychannel(event)}/>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="9">
                  <CLabel>Is the image a z-stack?</CLabel>
              </CCol>
              <CCol md="3">
                <CFormGroup>
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchStack} checked={props.props.get(selectPresetValue).zstack} id="stackYes"/>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="9">
                  <CLabel>Is the image a video?</CLabel>
              </CCol>
              <CCol md="3">
                <CFormGroup>
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchVideo} checked={props.props.get(selectPresetValue).video} id="videoYes"/>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CCollapse show={videoCollapse}>
              <CFormGroup row>
                <CCol md="6">
                    <CLabel>Run detection on each frame seperately or just a specific frame?</CLabel>
                </CCol>
                <CCol md="4">
                  <CFormGroup>
                    <CSelect custom value={props.props.get(selectPresetValue).frameSelection} name="select" id="selectDetection">
                      <option value={"all"} name='Detection on all frames'>Detection on all frames</option>
                      <option value={"first"} name='>Use first frame as reference.'>Use first frame as reference</option>
                      <option value={"last"} name='Use last frame as reference.'>Use last frame as reference</option>
                    </CSelect>
                  </CFormGroup>
                </CCol>
              </CFormGroup>
            </CCollapse>
            <CFormGroup row>
              <CCol md="9">
                  <CLabel>Expand detected bounding boxes to set static size?</CLabel>
              </CCol>
              <CCol md="3">
                <CFormGroup>
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchBox} checked={props.props.get(selectPresetValue).boxExpansion} id="boxYes"/>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CCollapse show={boxCollapse}> 
              <CFormGroup row>
                <CCol md="7">
                  <CLabel>Size of cropped boxes around detected objects.</CLabel>
                </CCol>
                <CCol md="3">
                  <CInput type='number' min={10} step={5} defaultValue={props.props.get(selectPresetValue).boxsize} onChange={(event) => setboxsize(event)}/>
                </CCol>
              </CFormGroup>
            </CCollapse>
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
