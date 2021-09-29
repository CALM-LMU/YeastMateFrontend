import React from 'react'
import { observer } from "mobx-react-lite"

import {
  CBadge,
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
  CLabel,
  CLink,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CSelect,
  CSwitch,
  CDataTable,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CButtonGroup,
} from '@coreui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { v4 as uuidv4 } from 'uuid';

const ExportSettingsForm = (props) => {
  const [selectPresetValue, setselectPresetValue] = React.useState("1ed8c0c5-a4d9-4e63-a43b-b3bdaddd970f")
  const [modalAdd, setModalAdd] = React.useState(false)
  const [scaleCollapse, setScaleCollapse] = React.useState(props.props.get(selectPresetValue).boxScaleSwitch);
  const [boxCollapse, setBoxCollapse] = React.useState(props.props.get(selectPresetValue).boxExpansion);
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

  const classFields = [
    { key: 'Class ID', _style: { width: '10%'} },
    { key: 'Tag', _style: { width: '20%'}},
    { key: 'Save crops', _style: { width: '10%'} },
    {
      key: 'Toggle',
      _style: { width: '1%' },
      sorter: false,
      filter: false
    }
  ]
  
  const getCropBadge = (exp) => {
    switch (exp) {
      case "True": return 'success'
      case "False": return 'danger'
      default: return 'secondary'
    }
  }

  const switchID = () => {
    props.props.get(selectPresetValue).keepID = !props.props.get(selectPresetValue).keepID
  }

  const switchBox = () => {
    if (props.props.get(selectPresetValue).boxExpansion === false && props.props.get(selectPresetValue).boxScaleSwitch === true) {
      props.props.get(selectPresetValue).boxScaleSwitch = false
      setScaleCollapse(props.props.get(selectPresetValue).boxScaleSwitch)
  }

    props.props.get(selectPresetValue).boxExpansion = !props.props.get(selectPresetValue).boxExpansion
    setBoxCollapse(props.props.get(selectPresetValue).boxExpansion)
  }

  const setBoxSize = (value) => {
    props.props.get(selectPresetValue).boxSize = value
  }

  const switchScale = () => {
    if (props.props.get(selectPresetValue).boxScaleSwitch === false && props.props.get(selectPresetValue).boxExpansion === true) {
      props.props.get(selectPresetValue).boxExpansion = false
      setBoxCollapse(props.props.get(selectPresetValue).boxExpansion)
    }

    props.props.get(selectPresetValue).boxScaleSwitch = !props.props.get(selectPresetValue).boxScaleSwitch
    setScaleCollapse(props.props.get(selectPresetValue).boxScaleSwitch)
  }

  const setBoxScale = (value) => {
    props.props.get(selectPresetValue).boxScale = value
  }

  const getDisabled = (index) => {
    if (index === 0) {
      return true
    }
    return false
  }

  const setTag = (index, value) => {
      props.props.get(selectPresetValue).classes[index].Tag = value
      props.props.get(selectPresetValue).classes = [...props.props.get(selectPresetValue).classes]
  };

  const toggleCropStatus = (index) => {
    if (props.props.get(selectPresetValue).classes[index].Crop === 'True') {
      props.props.get(selectPresetValue).classes[index].Crop = 'False'
      props.props.get(selectPresetValue).classes = [...props.props.get(selectPresetValue).classes]
   }
    else if (props.props.get(selectPresetValue).classes[index].Crop === 'False') {
      props.props.get(selectPresetValue).classes[index].Crop = 'True'
      props.props.get(selectPresetValue).classes = [...props.props.get(selectPresetValue).classes]
    }
  };

  const handleAddPreset = () => {
    setModalAdd(false)

    const id = uuidv4()
    props.props.set(id, {
      name: NameInput,
      classes: props.props.get(selectPresetValue).classes,
      keepID: props.props.get(selectPresetValue).keepID,
      boxSize: props.props.get(selectPresetValue).boxSize,
      boxExpansion: props.props.get(selectPresetValue).boxExpansion,
      boxScaleSwitch: props.props.get(selectPresetValue).boxScaleSwitch,
      boxScale: props.props.get(selectPresetValue).boxScale
    })

    setselectPresetValue(id)
  };
 
  const handleRemovePreset = async () => {
    if (selectPresetValue !== "1ed8c0c5-a4d9-4e63-a43b-b3bdaddd970f") {
      setModalRemove(false)
      props.props.delete(selectPresetValue)
      setselectPresetValue("1ed8c0c5-a4d9-4e63-a43b-b3bdaddd970f")   
    }
    else {
      setModalRemove(false)
      addToast('Error', 'Default preset can not be deleted.');
    }
  }; 

  return (
    <>
     <CCard>
        <CCardBody>
          <CLabel>Check the documentation at <CLink target='_blank' href="https://yeastmate.readthedocs.org">yeastmate.readthedocs.org</CLink> for more details!</CLabel>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader>Crop Settings</CCardHeader>
        <CCardBody >
          <CForm encType="multipart/form-data" className="form-horizontal">
            <CFormGroup>
              <CLabel>Select Crop Preset</CLabel>
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
            <CFormGroup  className="d-flex justify-content-between">
              <CLabel>Reassign labels (mating: 1/2=mother 3=daughter, budding: 1: mother 2: daughter) in every crop</CLabel>
              <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchID} checked={!props.props.get(selectPresetValue).keepID} id="idYes"/>
            </CFormGroup>
            <CFormGroup  className="d-flex justify-content-between">
              <CLabel>Generate crops of fixed size?</CLabel>
              <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchBox} checked={props.props.get(selectPresetValue).boxExpansion} id="boxYes"/>
            </CFormGroup>
            <CCollapse show={boxCollapse}> 
              <CFormGroup row>
                <CCol md="7">
                  <CLabel>Size of cropped boxes around detected objects (in pixel).</CLabel>
                </CCol>
                <CCol md="3">
                  <CInput type='number' min={10} step={5} defaultValue={props.props.get(selectPresetValue).boxSize} onChange={(event) => setBoxSize(event.currentTarget.value)}/>
                </CCol>
              </CFormGroup>
            </CCollapse>
            <CFormGroup  className="d-flex justify-content-between">
              <CLabel>Scale bounding boxes of detected cells?</CLabel>
              <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchScale} checked={props.props.get(selectPresetValue).boxScaleSwitch} id="scaleYes"/>
            </CFormGroup>
            <CCollapse show={scaleCollapse}> 
              <CFormGroup row>
                <CCol md="7">
                  <CLabel>Factor to scale boxes by.</CLabel>
                </CCol>
                <CCol md="3">
                  <CInput type='number' min={0} step={0.05} defaultValue={props.props.get(selectPresetValue).boxScale} onChange={(event) => setBoxScale(event.currentTarget.value)}/>
                </CCol>
              </CFormGroup>
            </CCollapse>
            <CFormGroup><CLabel></CLabel></CFormGroup>
            <CFormGroup>
              <CDataTable
                items={props.props.get(selectPresetValue).classes}
                fields={classFields}
                itemsPerPage={100}
                hover
                scopedSlots = {{
                  'Tag':
                    (item, index)=>(
                      <td>
                        <CInput value={item.Tag} onChange={(event) => setTag(index, event.currentTarget.value)}/>
                      </td>
                    ),
                  'Save crops':
                    (item)=>(
                      <td style={{"text-align":"center", "vertical-align":"center"}}>
                        <CBadge color={getCropBadge(item.Crop)} shape='rounded-pill'>
                          {item.Crop}
                        </CBadge>
                      </td>
                    ),
                    'Toggle':
                      (item, index)=>{
                        return (
                          <td>
                            <CButton disabled={getDisabled(index)} onClick={()=>{toggleCropStatus(index)}} color="dark" size="sm" variant="outline">
                              <FontAwesomeIcon icon="sync"/>   Crop
                            </CButton>
                          </td>
                      )
                    }
                  }
                }
              />
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

export default observer(ExportSettingsForm)
