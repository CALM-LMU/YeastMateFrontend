import React from 'react'
import { observer } from "mobx-react-lite"

import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardText,
  CCol,
  CCollapse,
  CDataTable,
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

import { v4 as uuidv4 } from 'uuid';

const cameraFields = [
  { key: 'Channel', _style: { width: '30%'} },
  { key: 'Camera', _style: { width: '10%'} },
  { key: 'Reference channel', _style: { width: '10%'} },
  { key: 'Delete', _style: { width: '15%'} },
  {
    key: 'toggle',
    label: '',
    _style: { width: '20%' },
    sorter: false,
    filter: false
  }
]

const getDICBadge = (DIC) => {
  switch (DIC) {
    case "True": return 'success'
    case "False": return 'secondary'
    default: return 'primary'
  }
}

const getCameraBadge = (Camera) => {
  switch (Camera) {
    case 1: return 'warning'
    case 2: return 'info'
    default: return 'primary'
  }
}

const getDeleteBadge = (Delete) => {
  switch (Delete) {
    case 'Keep': return 'secondary'
    case 'Delete': return 'danger'
    default: return 'primary'
  }
}

const PreprocessingSettingsForm = (props) => {
  const [selectPresetValue, setselectPresetValue] = React.useState("1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed")
  const [modalAdd, setModalAdd] = React.useState(false)
  const [modalRemove, setModalRemove] = React.useState(false)
  const [NameInput, setNameInput] = React.useState("")
  const [alignCollapse, setAlignCollapse] = React.useState(props.props.get(selectPresetValue).alignment);

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
  
  const toggleCameraStatus = (index) => {
    if (props.props.get(selectPresetValue).channels[index].Camera === 1) {
      props.props.get(selectPresetValue).channels[index].Camera = 2
      props.props.get(selectPresetValue).channels = [...props.props.get(selectPresetValue).channels]
    }
    else if (props.props.get(selectPresetValue).channels[index].Camera === 2) {
      props.props.get(selectPresetValue).channels[index].Camera = 1
      props.props.get(selectPresetValue).channels = [...props.props.get(selectPresetValue).channels]
    }
  };

  const toggleDICStatus = (index) => {
    if (props.props.get(selectPresetValue).channels[index].DIC === "True") {
      props.props.get(selectPresetValue).channels[index].DIC = "False"
      props.props.get(selectPresetValue).channels = [...props.props.get(selectPresetValue).channels]
    }
    else if (props.props.get(selectPresetValue).channels[index].DIC === "False") {
      props.props.get(selectPresetValue).channels[index].DIC = "True"
      props.props.get(selectPresetValue).channels = [...props.props.get(selectPresetValue).channels]
    }
  };
  
  const toggleDeleteStatus = (index) => {
    if (props.props.get(selectPresetValue).channels[index].Delete === 'Keep') {
      props.props.get(selectPresetValue).channels[index].Delete = 'Delete'
      props.props.get(selectPresetValue).channels = [...props.props.get(selectPresetValue).channels]
    }
    else if (props.props.get(selectPresetValue).channels[index].Delete === 'Delete') {
      props.props.get(selectPresetValue).channels[index].Delete = 'Keep'
      props.props.get(selectPresetValue).channels = [...props.props.get(selectPresetValue).channels]
    }
   }; 

  const handleChannelAdd = () => {
    props.props.get(selectPresetValue).channels.push({"Channel": props.props.get(selectPresetValue).channels.length+1, 'DIC':"False", 'Camera': 1, 'Delete':'Keep'})
    props.props.get(selectPresetValue).channels = [...props.props.get(selectPresetValue).channels]
  }; 

  const handleChannelRemove = () => {
    props.props.get(selectPresetValue).channels.pop()
    props.props.get(selectPresetValue).channels = [...props.props.get(selectPresetValue).channels]
  };

  const switchAlignment = () => {
    props.props.get(selectPresetValue).alignment = !props.props.get(selectPresetValue).alignment
    
    setAlignCollapse(props.props.get(selectPresetValue).alignment)
  }

  const switchVideoSplit = () => {
    props.props.get(selectPresetValue).videoSplit = !props.props.get(selectPresetValue).videoSplit
    }

  const handleAddPreset = () => {
    setModalAdd(false)

    var id = uuidv4()

    props.props.set(id, {
      name: NameInput,
      alignment: props.props.get(selectPresetValue).alignment,
      videoSplit: props.props.get(selectPresetValue).videoSplit,
      channels: props.props.get(selectPresetValue).channels,
    })

    setselectPresetValue(id)
    setNameInput("")
  };

  const handleRemovePreset = async () => {
    if (selectPresetValue !== "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed") {
      setModalRemove(false)
      props.props.delete(selectPresetValue)
      setselectPresetValue("1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed")   
    }
    else {
      setModalRemove(false)
      addToast('Error', 'Default preset can not be deleted.');
    }
  }; 

  return (
    <>
      <CCard>
        <CCardHeader>Preprocessing Settings</CCardHeader>
        <CCardBody >
          <CForm encType="multipart/form-data" className="form-horizontal">
            <CFormGroup>
              <CLabel>Select Processing Preset</CLabel>
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
            <CFormGroup>
              <CLabel>Preprocessing can convert Bioformats-compatible image files into detection-compatible .tif files.</CLabel>
            </CFormGroup>
            <CFormGroup>
              <CLabel>It can also perform additional alignment of different image channels if they were acquired with multiple microscope cameras.</CLabel>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="3">
                  <CLabel>Perform alignment?</CLabel>
              </CCol>
              <CCol md="9">
                <CFormGroup>
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchAlignment} checked={props.props.get(selectPresetValue).alignment} id="alignmentYes"/>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CCollapse show={alignCollapse}>
              <CFormGroup>
                <CCardText>
                  Select which channels belong to which camera, and which ones to use for alignment.
                </CCardText>
                <CDataTable
                  items={props.props.get(selectPresetValue).channels}
                  fields={cameraFields}
                  itemsPerPage={100}
                  hover
                  scopedSlots = {{
                    'Reference channel':
                      (item)=>(
                        <td>
                          <CBadge color={getDICBadge(item.DIC)}>
                            {item.DIC}
                          </CBadge>
                        </td>
                      ),
                    'Camera':
                      (item)=>(
                        <td>
                          <CBadge color={getCameraBadge(item.Camera)}>
                            {item.Camera}
                          </CBadge>
                        </td>
                      ),
                      'Delete':
                      (item)=>(
                        <td>
                          <CBadge color={getDeleteBadge(item.Delete)}>
                            {item.Delete}
                          </CBadge>
                        </td>
                      ),
                      'toggle':
                        (item, index)=>{
                          return (
                            <CButtonGroup>
                              <CButton onClick={()=>{toggleCameraStatus(index)}} color="dark" size="sm" variant="outline">
                                <FontAwesomeIcon icon="sync"/>   Change Camera
                              </CButton>
                              <CButton onClick={()=>{toggleDICStatus(index)}} color="dark" size="sm" variant="outline">
                                <FontAwesomeIcon icon="sync"/>   Toggle DIC
                              </CButton>
                              <CButton onClick={()=>{toggleDeleteStatus(index)}} color="danger" size="sm" variant="outline">
                                <FontAwesomeIcon icon="ban"/>   Toggle Delete
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
              <CCol md="3">
                  <CLabel>Split videos into single frames?</CLabel>
              </CCol>
              <CCol md="9">
                <CFormGroup>
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchVideoSplit} checked={props.props.get(selectPresetValue).videoSplit} id="videoSplitYes"/>
                </CFormGroup>
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
          <CButton type="add" onClick={setModalAdd} size="sm" color="success"><FontAwesomeIcon icon="plus" /> Add new preset</CButton>
          <CButton type="add" onClick={setModalRemove} size="sm" color="danger"><FontAwesomeIcon icon="ban" /> Remove current preset</CButton>
        </CCardFooter>
      </CCard>
    </>
  )
}

export default observer(PreprocessingSettingsForm)
