import { useEffect, useState } from 'react';
import './App.css';
import './img.css'
import ImgSlots from './ImgSlots';
import { categoryCount, SigMain } from './genTypes'
import EdImg from './assets/edit-image.png'
import imgDef from './assets/imgTemp.jpg'
import { textSize } from './alreadyExistant'
import Signature from './Signature';



export default function App() {
  function close() {
    setModal(false)
  }
  const [modal, setModal] = useState<boolean>(false)
  const [mainProps, set] = useState<categoryCount>({
    mandatoryTitles: ["Loft", "Pipes", "Floor"],
    optionalAmount: 10,
    acceptedFormat: "image/png, image/jpg, image/jpeg",
    defaultFile: imgDef,
    currentState: null, // for db data
    width: 150,
    height: 150,
    contHeight: 80,// 100 safari
    contWidth: 80,// 100 safari
    closeModal: close
  })

  const [sigProps, setSig] = useState<SigMain>({
    contHeight: 80,
    contWidth: 80,
    acceptedFormat: "image/png, image/jpg, image/jpeg",
    startingOptions: "Image",
    currentState: null,
    defaultFile: imgDef,
    closeModal: close
  })



  return (
    <div className="App">

      <div
        className="openTrigger"
        style={{ opacity: modal ? 0.3 : 1 }}
        onClick={() => setModal(true)}

      >
        <img className="cropTrigImg" src={EdImg} />
        <h4
          className="cropTitle"
          style={{ color: "white", float: "left", top: 10, marginLeft: (window.innerWidth * 0.15 - textSize(20, modal ? "Close" : "Open", true)) * 0.5 - 15 }}
        >
          Open
        </h4>
      </div>

      {/* {modal ? <ImgSlots attribute={mainProps} /> : null}  */}
      {modal ? <Signature attribute={sigProps} /> : null}



    </div>
  );
}

;
