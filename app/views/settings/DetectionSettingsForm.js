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
  const [channelCollapse, setChannelCollapse] = React.useState(props.props.get(selectPresetValue).channelSwitch);
  const [zCollapse, setZCollapse] = React.useState(props.props.get(selectPresetValue).zstack);
  const [videoCollapse, setVideoCollapse] = React.useState(props.props.get(selectPresetValue).video);
  const [advancedCollapse, setAdvancedCollapse] = React.useState(props.props.get(selectPresetValue).advancedSettings);
  const [superAdvancedCollapse, setSuperAdvancedCollapse] = React.useState(props.props.get(selectPresetValue).superAdvancedSettings);
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

  const switchChannel = () => {
    props.props.get(selectPresetValue).channelSwitch = !props.props.get(selectPresetValue).channelSwitch
    setChannelCollapse(props.props.get(selectPresetValue).channelSwitch)
  }
  
  const switchStack = () => {
    props.props.get(selectPresetValue).zstack = !props.props.get(selectPresetValue).zstack
    setZCollapse(props.props.get(selectPresetValue).zstack)
  }

  const switchVideo = () => {
    props.props.get(selectPresetValue).video = !props.props.get(selectPresetValue).video
    setVideoCollapse(props.props.get(selectPresetValue).video)
  }

  const switchAdvanced = () => {
    props.props.get(selectPresetValue).advancedSettings = !props.props.get(selectPresetValue).advancedSettings

    setAdvancedCollapse(props.props.get(selectPresetValue).advancedSettings)
  };

  const switchSuperAdvanced = () => {
    props.props.get(selectPresetValue).superAdvancedSettings = !props.props.get(selectPresetValue).superAdvancedSettings

    setSuperAdvancedCollapse(props.props.get(selectPresetValue).superAdvancedSettings)
  };

  const setGrayChannel = (value) => {
    props.props.get(selectPresetValue).graychannel = value
  }

  const setPixelSize = (value) => {
    props.props.get(selectPresetValue).pixelSize = value
  }

  const setReferencePixelSize = (value) => {
    props.props.get(selectPresetValue).referencePixelSize = value
  }

  const setIP = (value) => {
    props.props.get(selectPresetValue).ip = value
  }

  const setLowerQuantile = (value) => {
    props.props.get(selectPresetValue).lowerQuantile = value
  }

  const setUpperQuantile = (value) => {
    props.props.get(selectPresetValue).upperQuantile = value
  }

  const setSingleThreshold = (value) => {
    props.props.get(selectPresetValue).singleThreshold = value
  }

  const setMatingThreshold = (value) => {
    props.props.get(selectPresetValue).matingThreshold = value
  }

  const setBuddingThreshold = (value) => {
    props.props.get(selectPresetValue).buddingThreshold = value
  }

  const setZSlice = (value) => {
    props.props.get(selectPresetValue).zSlice = value
  }

  const handleLocalIPClick = () => {
    setIP("127.0.0.1:5000")
  }

  const setFrameSelection = (value) => {
    props.props.get(selectPresetValue).frameSelection = value
  }

  const handleAddPreset = () => {
    setModalAdd(false)

    const id = uuidv4()
    props.props.set(id, {
      name: NameInput,
      channelSwitch: props.props.get(selectPresetValue).channelSwitch,
      graychannel: props.props.get(selectPresetValue).graychannel,
      pixelSize: props.props.get(selectPresetValue).pixelSize,
      referencePixelSize: props.props.get(selectPresetValue).referencePixelSize,
      advancedSettings: props.props.get(selectPresetValue).advancedSettings,
      superAdvancedSettings: props.props.get(selectPresetValue).superAdvancedSettings,
      singleThreshold: props.props.get(selectPresetValue).singleThreshold,
      matingThreshold: props.props.get(selectPresetValue).matingThreshold,
      buddingThreshold: props.props.get(selectPresetValue).buddingThreshold,
      lowerQuantile: props.props.get(selectPresetValue).lowerQuantile,
      upperQuantile: props.props.get(selectPresetValue).upperQuantile,
      zstack: props.props.get(selectPresetValue).zstack,
      zSlice: props.props.get(selectPresetValue).zSlice,
      video: props.props.get(selectPresetValue).video,
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
                  <CButton onClick={handleLocalIPClick} size="sm" color="primary">Set local backend</CButton>
                  <CInput id="ipInput" onChange={(event) => setIP(event.currentTarget.value)} value={props.props.get(selectPresetValue).ip}></CInput>
                </CInputGroupPrepend>
              </CCol>
            </CFormGroup>
            <CFormGroup><CLabel></CLabel></CFormGroup>
            <CFormGroup row>
              <CCol md="8">
                  <CLabel>Does the image have multiple channels?</CLabel>
              </CCol>
              <CCol md="3">
                <CFormGroup>
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchChannel} checked={props.props.get(selectPresetValue).channelSwitch} id="stackYes"/>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CCollapse show={channelCollapse}>
              <CFormGroup row>
                <CCol md="8">
                  <CLabel>Axis of non-fluorescent (BF/DIC/PH) overview channel.</CLabel>
                </CCol>
                <CCol sm="2">
                  <CInput type='number' min={0} defaultValue={props.props.get(selectPresetValue).graychannel} onChange={(event) => setGrayChannel(event.currentTarget.value)}/>
                </CCol>
              </CFormGroup>
            </CCollapse>
            <CLabel></CLabel>
            <CFormGroup row>
              <CCol md="8">
                  <CLabel>Is the image a z-stack?</CLabel>
              </CCol>
              <CCol md="3">
                <CFormGroup>
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchStack} checked={props.props.get(selectPresetValue).zstack} id="stackYes"/>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CCollapse show={zCollapse}>
              <CFormGroup row>
                  <CCol md="8">
                    <CLabel>Set position of z slice for detection in %.</CLabel>
                  </CCol>
                  <CCol md="2">
                    <CInput type='number' min={0} max={100} step={5} defaultValue={props.props.get(selectPresetValue).zSlice} onChange={(event) => setZSlice(event.currentTarget.value)}/>
                  </CCol>
                </CFormGroup>
              </CCollapse>
            <CLabel></CLabel>
            <CFormGroup row>
              <CCol md="8">
                  <CLabel>Is the image a time-series?</CLabel>
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
                    <CSelect custom onChange={(event) => setFrameSelection(event.currentTarget.value)} value={props.props.get(selectPresetValue).frameSelection} name="select" id="selectDetection">
                      <option value={"first"} name='>Use first frame as reference.'>Use first frame as reference</option>
                      <option value={"last"} name='Use last frame as reference.'>Use last frame as reference</option>
                    </CSelect>
                  </CFormGroup>
                </CCol>
              </CFormGroup>
            </CCollapse>
            <CLabel></CLabel>
            <CFormGroup row>
              <CCol md="8">
                <CLabel></CLabel>
                <CLabel>Do you want to change advanced settings?</CLabel>
              </CCol>
              <CCol md="2">
                <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchAdvanced} checked={props.props.get(selectPresetValue).advancedSettings} id="differentThresholds" />
              </CCol>
            </CFormGroup>
            <CCollapse show={advancedCollapse}>
              <CFormGroup row>
                <CCol md="8">
                  <CLabel>Set pixel size of image in nm.  Images are resized to a reference pixel size of 110nm.</CLabel>
                </CCol>
                <CCol sm="2">
                  <CInput type='number' min={10} max={1000} step={1} defaultValue={props.props.get(selectPresetValue).pixelSize} onChange={(event) => setPixelSize(event.currentTarget.value)}/>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="8">
                  <CLabel>Set lower quantile for normalization in %.</CLabel>
                </CCol>
                <CCol md="2">
                  <CInput type='number' min={0} max={50} step={0.5} defaultValue={props.props.get(selectPresetValue).lowerQuantile} onChange={(event) => setLowerQuantile(event.currentTarget.value)}/>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="8">
                  <CLabel>Set upper quantile for normalization in %.</CLabel>
                </CCol>
                <CCol md="2">
                  <CInput type='number' min={50} max={100} step={0.5} defaultValue={props.props.get(selectPresetValue).upperQuantile} onChange={(event) => setUpperQuantile(event.currentTarget.value)}/>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="8">
                  <CLabel>Set score threshold for single cells in %.</CLabel>
                </CCol>
                <CCol md="2">
                  <CInput type='number' min={0} max={100} step={1} defaultValue={props.props.get(selectPresetValue).singleThreshold} onChange={(event) => setSingleThreshold(event.currentTarget.value)}/>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="8">
                  <CLabel>Set score threshold for mating cells in %.</CLabel>
                </CCol>
                <CCol md="2">
                  <CInput type='number' min={0} max={100} step={1} defaultValue={props.props.get(selectPresetValue).matingThreshold} onChange={(event) => setMatingThreshold(event.currentTarget.value)}/>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="8">
                  <CLabel>Set score threshold for budding events in %.</CLabel>
                </CCol>
                <CCol md="2">
                  <CInput type='number' min={0} max={100} step={1} defaultValue={props.props.get(selectPresetValue).buddingThreshold} onChange={(event) => setBuddingThreshold(event.currentTarget.value)}/>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="8">
                  <CLabel></CLabel>
                  <CLabel>Did you train your own model?</CLabel>
                </CCol>
                <CCol md="2">
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchSuperAdvanced} checked={props.props.get(selectPresetValue).superAdvancedSettings} id="superAdvancedSettingsSwitch" />
                </CCol>
            </CFormGroup>
            <CCollapse show={superAdvancedCollapse}>
              <CFormGroup row>
                  <CCol md="8">
                    <CLabel>Set the reference pixel size of your training images in nm.</CLabel>
                  </CCol>
                  <CCol sm="2">
                    <CInput type='number' min={1} max={1000} step={1} defaultValue={props.props.get(selectPresetValue).referencePixelSize} onChange={(event) => setReferencePixelSize(event.currentTarget.value)}/>
                  </CCol>
                </CFormGroup>
            </CCollapse>
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
              <CButton onClick={handleAddPreset} color="primary"><FontAwesomeIcon icon="plus" />   Add Preset</CButton>
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
