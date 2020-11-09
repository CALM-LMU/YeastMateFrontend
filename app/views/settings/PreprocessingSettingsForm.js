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

const dimensionFields = [
  { key: 'Dimension', _style: { width: '53%'} },
  { key: 'status', _style: { width: '18%'} },
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

const getDimensionBadge = (status) => {
  switch (status) {
    case 'Existing': return 'success'
    case 'Not Existing': return 'secondary'
    default: return 'primary'
  }
}

const PreprocessingSettingsForm = (props) => {
  const [modalAdd, setModalAdd] = React.useState(false)
  const [modalRemove, setModalRemove] = React.useState(false)
  const [NameInput, setNameInput] = React.useState("")
  const [collapse, setCollapse] = React.useState(false);
  const [selectPresetValue, setselectPresetValue] = React.useState("1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed")

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
  
  const array_move = (arr, old_index, new_index) => {
    if (new_index <= arr.length) {
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    }
  };
  
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

  const toggleDimensionStatus = (index) => {
    if (props.props.get(selectPresetValue).dimensions[index].status === 'Not Existing') {
      props.props.get(selectPresetValue).dimensions[index].status = 'Existing'
      props.props.get(selectPresetValue).dimensions = [...props.props.get(selectPresetValue).dimensions]
   }
    else if (props.props.get(selectPresetValue).dimensions[index].status === 'Existing') {
      props.props.get(selectPresetValue).dimensions[index].status = 'Not Existing'
      props.props.get(selectPresetValue).dimensions = [...props.props.get(selectPresetValue).dimensions]
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

  const handleUp = (index) => {
    if (index-1 >= 0) {
      array_move(props.props.get(selectPresetValue).dimensions, index, index-1)
      props.props.get(selectPresetValue).dimensions = [...props.props.get(selectPresetValue).dimensions]
    } 
  };

  const handleDown = (index) => {
    if (index+1 <= props.props.get(selectPresetValue).dimensions.length) {
      array_move(props.props.get(selectPresetValue).dimensions, index, index+1)
      props.props.get(selectPresetValue).dimensions = [...props.props.get(selectPresetValue).dimensions]
    }
  };

  const switchAlignment = () => {
    props.props.get(selectPresetValue).alignment = !props.props.get(selectPresetValue).alignment
  }

  const handleAddPreset = () => {
    setModalAdd(false)

    var id = uuidv4()

    props.props.set(id, {
      name: NameInput,
      alignment: true,
      inputFileFormat: '.nd2',
      channels: [
        {"Camera":1,"Channel":1,"DIC":"True","Delete":"Keep"},
        {"Camera":2,"Channel":2,"DIC":"True","Delete":"Delete"},
        {"Camera":1,"Channel":3,"DIC":"False","Delete":"Keep"},
        {"Camera":2,"Channel":4,"DIC":"False","Delete":"Keep"}
      ],
      dimensions: [
        {"Dimension":"FOV","index":0,"status":"Existing"},
        {"Dimension":"Time","index":1,"status":"Existing"},
        {"Dimension":"Z-Stack","index":2,"status":"Existing"},
        {"Dimension":"Channels","index":3,"status":"Existing"},
        {"Dimension":"Height","index":4,"status":"Existing"},
        {"Dimension":"Width","index":5,"status":"Existing"}
      ] 
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

  React.useEffect(() => {
    if (props.props.get(selectPresetValue).inputFileFormat === '.nd2') {
      setCollapse(false)
    }
    else if (props.props.get(selectPresetValue).inputFileFormat === '.tif') {
      setCollapse(true)
    }
  }, [props.props.get(selectPresetValue).inputFileFormat])

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
            <CFormGroup>
              <CLabel>Preprocessing will convert nd2 or tif files into detection-compatible tif files.</CLabel>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Select input image file type.</CLabel>
              <CSelect onChange={(event) => props.props.get(selectPresetValue).inputFileFormat = event.currentTarget.value} value={props.props.get(selectPresetValue).inputFileFormat} custom name="select" id="select">
                <option>.nd2</option>
                <option>.tif</option>
              </CSelect>
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
            <CCollapse show={collapse}>
              <CFormGroup>
                <CLabel>Select the order of dimensions within the tiff stack.</CLabel>
              </CFormGroup>
              <CFormGroup>
                <CDataTable
                items={props.props.get(selectPresetValue).dimensions}
                fields={dimensionFields}
                itemsPerPage={10}
                hover
                scopedSlots = {{
                  'status':
                    (item)=>(
                      <td>
                        <CBadge color={getDimensionBadge(item.status)}>
                          {item.status}
                        </CBadge>
                      </td>
                    ),
                    'toggle':
                      (item, index)=>{
                        return (
                          <CButtonGroup>
                            <CButton onClick={()=>{toggleDimensionStatus(index)}} color="dark" size="sm" variant="outline">
                              <FontAwesomeIcon icon="sync"/>   Toggle Status
                            </CButton>
                            <CButton onClick={()=>{handleUp(index)}} color="dark" size="sm" variant="outline">
                              <FontAwesomeIcon icon="arrow-up"/>   Move Up
                            </CButton>
                            <CButton onClick={()=>{handleDown(index)}} color="dark" size="sm" variant="outline">
                              <FontAwesomeIcon icon="arrow-down"/>   Move Down
                            </CButton>
                          </CButtonGroup>
                      )
                    }
                  }}
                />
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
          <CButton type="add" onClick={setModalAdd} size="sm" color="success"><FontAwesomeIcon icon="plus" /> Add new preset</CButton>
          <CButton type="add" onClick={setModalRemove} size="sm" color="danger"><FontAwesomeIcon icon="ban" /> Remove current preset</CButton>
        </CCardFooter>
      </CCard>
    </>
  )
}

export default observer(PreprocessingSettingsForm)
