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
  const [cropCollapse, setCropCollapse] = React.useState(props.props.get(selectPresetValue).crop)
  const [videoCollapse, setVideoCollapse] = React.useState(props.props.get(selectPresetValue).video)
  const [tmpVideoSplit, setTmpVideoSplit] = React.useState(props.props.get(selectPresetValue).videoSplit)
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
    { key: 'Crop Images', _style: { width: '10%'} },
    { key: 'Save cropped masks', _style: { width: '10%'} },
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
  
  const getMaskBadge = (exp) => {
    switch (exp) {
      case "True": return 'success'
      case "False": return 'danger'
      default: return 'secondary'
    }
  }

  const switchCrop = () => {
    props.props.get(selectPresetValue).crop = !props.props.get(selectPresetValue).crop
    setCropCollapse(props.props.get(selectPresetValue).crop)
  }

  const switchVideo = () => {
    props.props.get(selectPresetValue).video = !props.props.get(selectPresetValue).video

    if (props.props.get(selectPresetValue).video === 'True') {
      props.props.get(selectPresetValue).videoSplit = tmpVideoSplit
    }
    else if (props.props.get(selectPresetValue).video === 'False') {
      setTmpVideoSplit(props.props.get(selectPresetValue).videoSplit)
      props.props.get(selectPresetValue).videoSplit = false
    }

    setVideoCollapse(props.props.get(selectPresetValue).video)
  }

  const switchVideoSplit = () => {
    props.props.get(selectPresetValue).videoSplit = !props.props.get(selectPresetValue).videoSplit
  }

  const setScoreThreshold =(value) => {
    props.props.get(selectPresetValue).scoreThreshold = value
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

  const toggleMaskStatus = (index) => {
    if (props.props.get(selectPresetValue).classes[index].Mask === 'True') {
      props.props.get(selectPresetValue).classes[index].Mask = 'False'
      props.props.get(selectPresetValue).classes = [...props.props.get(selectPresetValue).classes]
   }
    else if (props.props.get(selectPresetValue).classes[index].Mask === 'False') {
      props.props.get(selectPresetValue).classes[index].Mask = 'True'
      props.props.get(selectPresetValue).classes = [...props.props.get(selectPresetValue).classes]
    }
  };

  const handleChannelAdd = () => {
    props.props.get(selectPresetValue).classes.push({"Class ID": props.props.get(selectPresetValue).classes.length+1, 'Tag':"", 'Crop': "True", "Mask": "True"})
    props.props.get(selectPresetValue).classes = [...props.props.get(selectPresetValue).classes]
  }; 

  const handleChannelRemove = () => {
    props.props.get(selectPresetValue).classes.pop()
    props.props.get(selectPresetValue).classes = [...props.props.get(selectPresetValue).classes]
  };


  const handleAddPreset = () => {
    setModalAdd(false)

    const id = uuidv4()
    props.props.set(id, {
      name: NameInput,
      crop: props.props.get(selectPresetValue).crop,
      classes: props.props.get(selectPresetValue).classes,
      videoSplit: props.props.get(selectPresetValue).videoSplit,
      scoreThreshold: props.props.get(selectPresetValue).scoreThreshold
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
        <CCardHeader>Export Settings</CCardHeader>
        <CCardBody >
          <CForm encType="multipart/form-data" className="form-horizontal">
            <CFormGroup>
              <CLabel>Select Export Preset</CLabel>
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
              <CCol md="9">
                  <CLabel>Save crops of detected objects?</CLabel>
              </CCol>
              <CCol md="3">
                <CFormGroup>
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchCrop} checked={props.props.get(selectPresetValue).crop} id="cropYes"/>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CCollapse show={cropCollapse}>
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
                    'Crop Images':
                      (item)=>(
                        <td>
                          <CBadge color={getCropBadge(item.Crop)}>
                            {item.Crop}
                          </CBadge>
                        </td>
                      ),
                      'Save cropped masks':
                      (item)=>(
                        <td>
                          <CBadge color={getMaskBadge(item.Mask)}>
                            {item.Mask}
                          </CBadge>
                        </td>
                      ),
                      'Toggle':
                        (item, index)=>{
                          return (
                            <CButtonGroup>
                              <CButton onClick={()=>{toggleCropStatus(index)}} color="dark" size="md" variant="outline">
                                <FontAwesomeIcon icon="sync"/>   Crop
                              </CButton>
                              <CButton onClick={()=>{toggleMaskStatus(index)}} color="dark" size="md" variant="outline">
                                <FontAwesomeIcon icon="sync"/>   Mask
                              </CButton>
                            </CButtonGroup>
                        )
                      }
                    }
                  }
                />
                <CButton onClick={()=>{handleChannelAdd()}} color="success" size="sm">
                  <FontAwesomeIcon icon="plus"/>   Add Channel
                </CButton>
                <CButton onClick={()=>{handleChannelRemove()}} color="danger" size="sm">
                  <FontAwesomeIcon icon="ban"/>   Remove Channel
                </CButton>
              </CFormGroup>
              <CFormGroup><CLabel></CLabel></CFormGroup>
            </CCollapse>
            <CFormGroup row>
              <CCol md="9">
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
                <CCol md="9">
                    <CLabel>Save time-series frames as separate files (if image is a time-series)</CLabel>
                </CCol>
                <CCol md="3">
                  <CFormGroup>
                    <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchVideoSplit} checked={props.props.get(selectPresetValue).videoSplit} id="videoSplitYes"/>
                  </CFormGroup>
                </CCol>
              </CFormGroup>
            </CCollapse>
            <CFormGroup row>
                <CCol md="7">
                  <CLabel>Set threshold of detection score for exporting objects (between 0 and 1)</CLabel>
                </CCol>
                <CCol md="3">
                  <CInput type='number' min={0} max={1} step={0.05} defaultValue={props.props.get(selectPresetValue).scoreThreshold} onChange={(event) => setScoreThreshold(event)}/>
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

export default observer(ExportSettingsForm)
