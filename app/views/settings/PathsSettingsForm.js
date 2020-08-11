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
  {
    key: 'toggle',
    label: '',
    _style: { width: '20%' },
    sorter: false,
    filter: false
  }
]

const PathsSettingsForm = (props) => {
  const handleAddClick = () => {
    var path = dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (typeof path !== 'undefined') {
      console.log(props.props.get('pathList'))
      props.props.get('pathList').push({_id: uuidv4(), Path:path})
      props.props.set('pathList', [...props.props.get('pathList')])
      console.log(props.props.get('pathList'))
    }
  };

  const handleRemoveClick = (index) => {
    props.props.get('pathList').pop(index)
    props.props.set('pathList', [...props.props.get('pathList')])
  };

  return (
    <>
      <CCard>
        <CCardHeader>Path Settings</CCardHeader>
        <CCardBody >
          <CForm encType="multipart/form-data" className="form-horizontal">
            <CFormGroup>
              <CDataTable
                items={props.props.get('pathList')}
                fields={fields}
                itemsPerPage={100}
                hover
                scopedSlots = {{
                  'toggle':
                      (item, index)=>{
                        return (
                          <CButton onClick={()=>{handleRemoveClick(index)}} color="danger" size="sm" variant="outline">
                            <FontAwesomeIcon icon="ban" />   Delete
                          </CButton>
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
