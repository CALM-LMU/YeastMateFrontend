import React from 'react'

import { observer } from "mobx-react-lite"
const path = require('path');
const { dialog } = require('electron').remote;
const { ipcRenderer } = require('electron')

import {
  CButton,
  CButtonGroup,
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

const Annotate = (props) => {
  const [selectPresetValue, setselectPresetValue] = React.useState("821198b7-83e5-4ccb-9579-48f5f7849221");
  const [modalAdd, setModalAdd] = React.useState(false);
  const [modalRemove, setModalRemove] = React.useState(false);
  const [NameInput, setNameInput] = React.useState("");
  const [thresholdCollapse, setThresholdCollapse] = React.useState(props.props.get(selectPresetValue).differentThresholds);

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
    props.props.get(selectPresetValue).path = value
  }

  const submitJob = () => {
    var scoreThresholds = "1=0;2=0";

    if (props.props.get(selectPresetValue).path == "") {
      addToast('Error', 'Path to images must be set.');
      return
    }

    if (props.props.get(selectPresetValue).differentClasses === true) {
      let matingThreshold = props.props.get(selectPresetValue).matingThreshold / 100; 
      let buddingThreshold = props.props.get(selectPresetValue).buddingThreshold / 100; 

      scoreThresholds = "1S" + matingThreshold.toString() + "C2S" + buddingThreshold.toString()
    }

    ipcRenderer.send('start-napari', props.props.get(selectPresetValue).path, scoreThresholds)
  };

  const switchThresholds = () => {
    props.props.get(selectPresetValue).differentThresholds = !props.props.get(selectPresetValue).differentThresholds

    setThresholdCollapse(props.props.get(selectPresetValue).differentThresholds)
  };

  const setMatingThreshold = (value) => {
    props.props.get(selectPresetValue).matingThreshold = value
  }

  const setBuddingThreshold = (value) => {
    props.props.get(selectPresetValue).buddingThreshold = value
  }

  const handleAddPreset = () => {
    setModalAdd(false)

    var id = uuidv4()

    props.props.set(id, {
      name: NameInput,
      path: props.props.get(selectPresetValue).path,
      differentThresholds: props.props.get(selectPresetValue).differentThresholds,
      matingThreshold: props.props.get(selectPresetValue).matingThreshold,
      buddingThreshold: props.props.get(selectPresetValue).buddingThreshold
    })

    setselectPresetValue(id)
    setNameInput("")
  };

  const handleRemovePreset = async () => {
    if (selectPresetValue !== "821198b7-83e5-4ccb-9579-48f5f7849221") {
      setModalRemove(false)
      props.props.delete(selectPresetValue)
      setselectPresetValue("821198b7-83e5-4ccb-9579-48f5f7849221")
    }
    else {
      setModalRemove(false)
      addToast('Error', 'Default preset can not be deleted.');
    }
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
              <CLabel>Select Annotation Preset</CLabel>
              <CSelect value={selectPresetValue} onChange={(event) => setselectPresetValue(event.currentTarget.value)} custom id="selectPreset">
                {Array.from(props.props).map(([key, value]) => {
                  return props.props.get(key).name &&
                    (<option
                      value={key}
                      name={props.props.get(key).name}
                    >
                      {props.props.get(key).name}
                    </option>
                    )
                })}
              </CSelect>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Path:</CLabel>
              <CInputGroupAppend>
                <CInput id="pathInput" onChange={(event) => setPathInput(event.currentTarget.value)} value={props.props.get(selectPresetValue).path}></CInput>
                <CButton onClick={handleAddPathClick} size="sm" color="primary"><FontAwesomeIcon icon="plus" /> Select Path</CButton>
              </CInputGroupAppend>
            </CFormGroup>
            <CFormGroup>
              <CCol md="8">
                <CLabel></CLabel>
                <CLabel>Do you want to check your results with a different score threshold?</CLabel>
              </CCol>
              <CCol md="2">
                <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchThresholds} checked={props.props.get(selectPresetValue).differentThresholds} id="differentThresholds" />
              </CCol>
            </CFormGroup>
            <CCollapse show={thresholdCollapse}>
              <CFormGroup>
                <CCol md="8">
                  <CLabel>Set score threshold for mating cells in %.</CLabel>
                </CCol>
                <CCol md="2">
                  <CInput type='number' min={0} max={100} step={1} defaultValue={props.props.get(selectPresetValue).matingThreshold} onChange={(event) => setMatingThreshold(event.currentTarget.value)}/>
                </CCol>
              </CFormGroup>
              <CFormGroup>
                <CCol md="8">
                  <CLabel>Set score threshold for budding events in %.</CLabel>
                </CCol>
                <CCol md="2">
                  <CInput type='number' min={0} max={100} step={1} defaultValue={props.props.get(selectPresetValue).buddingThreshold} onChange={(event) => setBuddingThreshold(event.currentTarget.value)}/>
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
              ><FontAwesomeIcon icon="undo" />Cancel</CButton>
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
          <div className="d-flex justify-content-between">
            <CButton type="add" onClick={submitJob} size="sm" color="success"><FontAwesomeIcon icon="plus" /> Start annotation process</CButton>
            <CButtonGroup>
              <CButton type="add" onClick={setModalAdd} size="sm" color="success"><FontAwesomeIcon icon="plus" /> Add new preset</CButton>
              <CButton type="add" onClick={setModalRemove} size="sm" color="danger"><FontAwesomeIcon icon="ban" /> Remove current preset</CButton>
            </CButtonGroup>
          </div>
        </CCardFooter>
      </CCard>
    </>
  )
}

export default observer(Annotate)
