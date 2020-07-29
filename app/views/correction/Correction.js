import React, { lazy } from 'react'
import ReactImageAnnotate from "react-image-annotate"

var fs = require('fs');
var path = require('path');

const { ipcRenderer } = require('electron')

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CCardText
} from '@coreui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// , regions: [{cls: "Mitosis", color: "#f44336", h: 0.08316782442253823, highlighted: false, id: "80511864713799", type: "box", w: 0.028778973652664575, x: 0.2829494, y: 0.7200156294294208}]

const Correction = () => {
  const isFirstRun = React.useRef(true);
  const imageDir = React.useRef('');
  const [imagesLoaded, setimagesLoaded] = React.useState(false);  
  const [imagesSaved, setimagesSaved] = React.useState(true);
  const [imagePaths, setimagePaths] = React.useState([])

  const get_files = (dir) => {
    fs.readdir(dir, function(err, files) {
      files.forEach(async (file) => {
        if (file.indexOf('.png') !== -1 | file.indexOf('.tif') !== -1 | file.indexOf('.jpg') !== -1) {
          var imageSrc = path.join(dir, file)
          imagePaths.push({src: imageSrc, name: file})
          setimagePaths([...imagePaths])
        }
      })

      imageDir.current = dir
      setimagesLoaded(true)
      setimagesSaved(false)
    })  
  };

  const saveJSON = (res) => {
    var json = JSON.stringify(res.images);

    console.log(res)

    fs.writeFile(imageDir.current + '/groundtruth.json', json, 'utf8', (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });

    setimagesSaved(true)
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
          {imagesLoaded &&
            <CCardBody >
              <ReactImageAnnotate
              taskDescription="Draw boxes around all mito events."
              images={imagePaths}
              regionClsList={["Mitosis"]}
              enabledTools={["select", "create-box"]}
              onExit={(res) => saveJSON(res)}
              />
            </CCardBody>
          }
        <CCardFooter>
          {imagesSaved &&
            <CButton type="add" id='load-btn' size="sm" color="secondary"><FontAwesomeIcon icon="plus" /> Load new images</CButton>
          }
          {!imagesSaved &&
            <CCardText>
              Save annotations to load new images!
            </CCardText>
          }
        </CCardFooter>
      </CCard>
    </>
  )
}

export default Correction