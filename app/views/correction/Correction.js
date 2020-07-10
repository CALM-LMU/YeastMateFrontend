import React, { lazy } from 'react'
import { observer } from "mobx-react-lite"
import  Annotation  from 'react-image-annotation'

var fs = require('fs');
var path = require('path');

const { ipcRenderer } = require('electron')

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
} from '@coreui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Correction = () => {
  const isFirstRun = React.useRef(true);
  const [counter, setcounter] = React.useState(0)
  const [image, setimage] = React.useState("https://davidbunk.github.io/bubu.jpeg")
  const [imagePaths, setimagePaths] = React.useState([])
  const [labelPaths, setlabelPaths] = React.useState([])
  const [annotations, setannotations] = React.useState([])
  const [annotation, setannotation] = React.useState({})

  const onSubmit = (annotation) => {
    const { geometry, data } = annotation
 
    setannotation({});
    setannotations(annotations.concat({
      geometry,
      data: {
        ...data,
        id: Math.random()
      }
    }))
  }

  const get_files = (dir) => {
    let tmpArr = []
    fs.readdir(dir, function(err, files) {
      files.forEach(async (file) => file.indexOf('.png') !== -1 && tmpArr.push('file:///' + path.join(dir, file)))
      setimage(tmpArr[0])
      setimagePaths(tmpArr)
      setcounter(counter+1)
    })  
  };
    
  const post_img = (event) => {
    setimage(imagePaths[counter])
    setcounter(counter+1)
  }

  React.useEffect(() => { 
    if (isFirstRun.current) {
      isFirstRun.current = false

      const loadButton = document.getElementById('load-btn');

      loadButton.addEventListener('click', function (event) {
      ipcRenderer.send('open-file-dialog-for-file')
      });

      ipcRenderer.on('selected-file', function (event, dir) {
        get_files(dir)
      });

      return
    }

    return () => {
      
    }
  }, []);

  return (
    <>
      <CCard>
        <CCardHeader>Correct detections</CCardHeader>
        <CCardBody >
          <Annotation
            src={image}
            annotations={annotations}
            value={annotation}
            onChange={setannotation}
            onSubmit={onSubmit}
          />
        </CCardBody>
        <CCardFooter>
          <CButton type="add" id='load-btn' size="sm" color="secondary"><FontAwesomeIcon icon="plus" /> Load images</CButton>
          <CButton type="add" size="sm" color="secondary"><FontAwesomeIcon icon="plus" /> Go back</CButton>
          <CButton type="add" onClick={post_img} value={false} size="sm" color="danger"><FontAwesomeIcon icon="ban" /> Incorrect</CButton>
          <CButton type="add" onClick={post_img} value={true} size="sm" color="success"><FontAwesomeIcon icon="plus" /> Correct</CButton>
        </CCardFooter>
      </CCard>
    </>
  )
}

export default Correction