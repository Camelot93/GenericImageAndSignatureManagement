import { useEffect, useRef, useState, useLayoutEffect } from "react";
import EdImg from './assets/edit-image.png'
import { SigMain, sigImgProp, bench } from './genTypes'
import Image from 'next/image'
import './sig.css'
import { getBase64, getFileInfo, textSize } from './alreadyExistant'
import SignatureCanvas from "./SignatureCanvas";
import SignatureImageSlot from "./SignatureImgSlot";
import Dropzone from 'react-dropzone'
import signIcon from './assets/SignIcon.png'
import imageIcon from './assets/imageIcon.png'

type SigOpt = {
    title: string
    image: string
    enabled: boolean
}

type property = {
    attribute: SigMain
}




const Signature = (props: property) => {

    const [hoveredTitle, setHoveredTitle] = useState<string | null>(null)
    const sizeBench = useRef<bench>({ width: 0, height: 0 }) // in case needs to write conditional changes on top level and to avoid overendering
    const [flag, set] = useState<boolean>(false)
    const [img, setImg] = useState<sigImgProp>({
        data: null,
        cropData: null,
        title: "Signature"
    })
    const options: SigOpt[] = [
        {
            title: "Image",
            image: imageIcon,
            enabled: true
        },
        {
            title: "Sign",
            image: signIcon,
            enabled: true
        },
    ]
    const selectedOpt = useRef<string>(props.attribute.startingOptions)


    useEffect(() => {
        return () => {
            if (sessionStorage.getItem('signatureDraw')) sessionStorage.removeItem('signatureDraw')
            if (sessionStorage.getItem('signatureType')) sessionStorage.removeItem('signatureType')
        }
    }, [])

    useEffect(() => {
       console.log("ic87890-", img!.cropData !== null ? img!.cropData?.data : img!.data !== null ? img!.data?.data : props.attribute.defaultFile)
    }, [img])

    function updateImages(index: number | undefined, val: File | File[] | string | null, width?: number, height?: number, name?: string): void {
        if (index !== undefined) {
            if (val !== undefined) {
                if (val !== null) {
                    if(typeof val === "string") setImg({ ...img, cropData:{data:val, width: width!, height:height!} })
                        else getBase64(val, (t: any) => setImg({ data: { data: t, width: width!, height: height! }, cropData: null, title: img.title }))
                }
                else setImg({ data: val, cropData: val, title: img.title })
            }
        } else { if (typeof val === "string") setImg({ data: { data: val, width: width!, height: height! }, cropData: null, title: img.title }) }
    }

    function sizeBenchUpdate(w: number, h: number) {
        sizeBench.current = { width: w, height: h }
    }

    function changeOptions(title: string, enabled: boolean) {
        if (enabled) {
            selectedOpt.current = title;
            set(!flag)
        }
    }

    return (
        <div className="mainCont">
            {props.attribute.closeModal !== undefined && (props.attribute.contHeight! < 100 || props.attribute.contWidth! < 100) ? <h4 style={{ cursor: "pointer", left: "90%", top: "-2.5%", color: "white", position: "absolute" }} onClick={() => props.attribute.closeModal !== undefined ? props.attribute.closeModal(false) : null}>close</h4> : null}
            <div className="secondSigCont"
                style={{
                    width: `${typeof props.attribute.contWidth === "number" ? props.attribute.contWidth : 100}%`,
                    height: `${typeof props.attribute.contHeight === "number" ? props.attribute.contHeight : 100}%`,
                    left: `${typeof props.attribute.contWidth === "number" ? 50 - props.attribute.contWidth! * 0.5 : 0}%`,
                    top: `${typeof props.attribute.contHeight === "number" ? 50 - props.attribute.contHeight! * 0.5 : 0}%`
                }}>
                <div className="sigOptionCont">
                    {options.map((el,i) => {
                        return (
                            <div key={i}
                                className="optionDiv"
                                onClick={() => { changeOptions(el.title, el.enabled) }}
                                style={{ backgroundColor: selectedOpt.current === el.title ? "white" : "transparent" }}
                            >
                                <span key={i}
                                 className="optionSpan"
                                 onMouseEnter={_ => { setHoveredTitle(el.title) }}
                                 onMouseLeave={_ => { setHoveredTitle(null) }}
                                 >
                                    <Image key={i}
                                        src={el.image}
                                        unoptimized
                                        width={35}
                                        height={35} />
                                </span>

                            </div>
                        )
                    })
                    }
        <div  className="titleDisplay" 
      style={{
          top:"20%",
         color: "white" , 
         fontSize:15, 
         marginLeft: sizeBench.current.width*(props.attribute.contWidth as number*0.01) *0.1
        
         }}>
        {hoveredTitle}
      </div>
                </div>
                {selectedOpt.current === "Image" ?
                    <Dropzone accept={props.attribute.acceptedFormat}
                        onDrop={acceptedImg => {
                            getFileInfo(acceptedImg, (res: any | null) => {
                                updateImages(1, acceptedImg[0], res.width, res.height, res.name);
                            })
                        }}
                    >
                        {({ getRootProps }) => (
                            <div
                                className="sigContentCont"
                                {...getRootProps()}
                            >
                                <SignatureImageSlot
                                    data={img}
                                    imgSize={img.data !== null  ? { width:  img.cropData !== null ? img.cropData?.width! : img.data.width, height: img.cropData !== null ? img.cropData?.height! : img.data.height } : null}
                                    current={img!.cropData !== null ? img!.cropData?.data : img!.data !== null ? img!.data?.data : props.attribute.defaultFile}
                                    h={props.attribute.contHeight as number}
                                    w={props.attribute.contWidth as number}
                                    updateImages={updateImages}
                                    acceptedFormat={props.attribute.acceptedFormat}
                                    sizeBenchUpdate={sizeBenchUpdate}
                                    closeModal={props.attribute.closeModal}
                                />
                            </div>
                        )}
                    </Dropzone>
                    :
                    <div className="sigContentCont">
                        <SignatureCanvas
                            updateImages={updateImages}
                            bench={sizeBench.current}
                            changeOption={changeOptions}
                            imgEnabled={options[0].enabled}
                            h={props.attribute.contHeight as number}
                            w={props.attribute.contWidth as number}
                            sizeBenchUpdate={sizeBenchUpdate}
                        />
                    </div>
                }



            </div>
        </div>
    )


}

export default Signature