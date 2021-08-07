import React from 'react'

import { observer } from "mobx-react-lite"

import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CForm,
} from '@coreui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import axios from 'axios'

const fields = [
  { key: 'Job', _style: { width: '25%'} },
  { key: 'Path', _style: { width: '50%'} },
  { key: 'status', _style: { width: '30%' } }
]

const getStatusBadge = (status)=>{
  switch (status) {
    case "Pending": return 'warning'
    case "Running": return 'primary'
    case "Failed": return 'danger'
    default: return 'secondary'
  }
}

const Dashboard = (props) => {
  const [jobList, setjobList] = React.useState([])

  const get_jobs = async () => {
    console.log(props.props.get('ip')  + ":" + props.props.get('port'))
    try {
      const result = await axios(
        props.props.get('ip') + ":" + props.props.get('port'),
      );
      setjobList(result.data.tasks);
    } catch (error) {
      setjobList([]);
    }
  };

  React.useEffect(() => { 
    get_jobs();

    const interval = setInterval(() => {
      get_jobs();
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  return (
    <>
      <CCard>
        <CCardHeader>
          You can find your queued and running tasks here.
        </CCardHeader>
        <CCardBody >
          <CForm>
            <CDataTable
              items={jobList}
              fields={fields}
              itemsPerPage={10}
              hover
              pagination
              scopedSlots = {{
                'status':
                    (item)=>{
                      return (
                        <td>
                          <CBadge color={getStatusBadge(item.Status)}>
                            {item.Status}
                          </CBadge>
                        </td>
                     )},
              }}
            />
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default observer(Dashboard)
