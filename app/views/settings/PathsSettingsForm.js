import React from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CDataTable,
  CForm,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { observer } from "mobx-react-lite"

const { dialog } = require('electron').remote;

const uuidv4 = require("uuid/v4")

const fields = [
  { key: 'Path', _style: { width: '53%'} },
  { key: 'Server' ,_style: { width: '18%' } },
  {
    key: 'toggleserver',
    label: '',
    _style: { width: '15%' },
    sorter: false,
    filter: false
  },
  {
    key: 'delete',
    label: '',
    _style: { width: '20%' },
    sorter: false,
    filter: false
  }
]

const getServerBadge = (server)=>{
  switch (server) {
    case "True": return 'success'
    case "False": return 'secondary'
    default: return 'primary'
  }
}

const PathsSettingsForm = (props) => {
  const toggleServerStatus = (index) => {
    if (props.props.get("paths")[index].Server === 'True') {
      props.props.get("paths")[index].Server = 'False'
      props.props.set("paths", [...props.props.get("paths")])
    }
    else if (props.props.get("paths")[index].Server === 'False') {
      props.props.get("paths")[index].Server = 'True'
      props.props.set("paths", [...props.props.get("paths")])
    }
   }; 
  
  const handleAddClick = () => {
    var path = dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (typeof path !== 'undefined') {
      props.props.get("paths").push({_id: uuidv4(), Path:path, Server: "False"})
      props.props.set("paths", [...props.props.get("paths")])
    }
  };

  const handleRemoveClick = (index) => {
    props.props.get("paths").pop(index)
    props.props.set("paths", [...props.props.get("paths")])
  };
  
  return (
    <>
      <CCard>
        <CCardHeader>Path Settings</CCardHeader>
        <CCardBody >
          <CForm>
          <CDataTable
              items={props.props.get("paths")}
              fields={fields}
              tableFilter
              itemsPerPageSelect
              itemsPerPage={5}
              hover
              sorter
              pagination
              scopedSlots = {{
                'Server':
                    (item, index)=>{
                      return (
                        <CBadge color={getServerBadge(item.Server)}>
                          {item.Server}
                        </CBadge>
                    )},
                'toggleserver':
                    (item, index)=>{
                      return (
                        <CButton onClick={()=>{toggleServerStatus(index)}} color="primary" size="sm" variant="outline" shape="square">
                          <FontAwesomeIcon icon="sync" />   Toggle Server
                        </CButton>
                    )},
                'delete':
                    (item, index)=>{
                      return (
                        <CButton onClick={()=>{handleRemoveClick(index)}} color="danger" size="sm" variant="outline" shape="square">
                          <FontAwesomeIcon icon="ban" />   Delete
                        </CButton>
                    )}
                }}
            />
          </CForm>
        </CCardBody>
        <CCardFooter>
          <CButton type="add" onClick={handleAddClick} size="sm" color="primary"><FontAwesomeIcon icon="plus" />   Add path</CButton>
        </CCardFooter>
      </CCard>
    </>
  )
}

export default observer(PathsSettingsForm)
