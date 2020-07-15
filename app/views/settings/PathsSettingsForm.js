import React from 'react'
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CDataTable,
  CForm,
  CFormGroup
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { observer } from "mobx-react-lite"

const { dialog } = require('electron').remote;

const uuidv4 = require("uuid/v4")

const fields = [
  { key: 'Path', _style: { width: '53%'} },
  { key: 'Server', _style: { width: '18%'} },
  {
    key: 'toggle',
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
    if (props.props.get('pathList').pathList[index].Server === 'True') {
      props.props.get('pathList').pathList[index].Server = 'False'
      props.props.set('pathList', {pathList: [...props.props.get('pathList').pathList]})
    }
    else if (props.props.get('pathList').pathList[index].Server === 'False') {
      props.props.get('pathList').pathList[index].Server = 'True'
      props.props.set('pathList', {pathList: [...props.props.get('pathList').pathList]})
    }
   }; 
  
  const handleAddClick = () => {
    var path = dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (typeof path !== 'undefined') {
      props.props.get('pathList').pathList.push({_id: uuidv4(), Path:path, Server: "False"})
      props.props.set('pathList', {pathList: [...props.props.get('pathList').pathList]})
    }
  };

  const handleRemoveClick = (index) => {
    props.props.get('pathList').pathList.pop(index)
    props.props.set('pathList', {pathList: [...props.props.get('pathList').pathList]})
  };

  return (
    <>
      <CCard>
        <CCardHeader>Path Settings</CCardHeader>
        <CCardBody >
          <CForm encType="multipart/form-data" className="form-horizontal">
            <CFormGroup>
              <CDataTable
                items={props.props.get('pathList').pathList}
                fields={fields}
                itemsPerPage={100}
                hover
                scopedSlots = {{
                  'Server':
                    (item)=>(
                      <td>
                        <CBadge color={getServerBadge(item.Server)}>
                          {item.Server}
                        </CBadge>
                      </td>
                    ),
                  'toggle':
                      (item, index)=>{
                        return (
                          <CButtonGroup>
                            <CButton onClick={()=>{toggleServerStatus(index)}} color="dark" size="sm" variant="outline">
                              <FontAwesomeIcon icon="sync" />   Toggle Server
                            </CButton>
                            <CButton onClick={()=>{handleRemoveClick(index)}} color="danger" size="sm" variant="outline">
                              <FontAwesomeIcon icon="ban" />   Delete
                            </CButton>
                          </CButtonGroup>
                      )}
                  }}
              />
            </CFormGroup>
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
