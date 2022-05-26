import React,{ useState, useEffect, useRef, ReactElement, useLayoutEffect } from "react";
import { categoryCount, ImgObj } from './genTypes'
import Image from 'next/image'
import './img.css'
import Controller from './ImgControlSection'
import { getBase64, getFileInfo } from './alreadyExistant'
import Dropzone from 'react-dropzone'
import Cropping from "./Cropping";
import add from './assets/add.png'

type property = {
    attribute: categoryCount
}

const ImageSlots = (props: property) => {

    const addButtonSize = props.attribute.width < 100 ? props.attribute.width / 2.2 : 50
    const [imgObj, setImgObj] = useState<ImgObj[]>()
    const [flag, setFlag] = useState<boolean>(false)
    const clickedImgIdx = useRef<number | null>(null)
    const [showCrop, setShowCrop] = useState<boolean>(false)
    const editTitle = useRef<boolean>(false)
    const disableCrop = useRef<boolean>(false)


    useEffect(() => {
        let arr: ImgObj[] = []
        let i = 0
        let offset = 0
        // if title not equal to mandatory title or title slot data !== null than add to the lowest index option
        while (i < props.attribute.mandatoryTitles.length) {
            let none = false
            let n = 0
            if (props.attribute.currentState! !== null)
           { 
               while(n<props.attribute.currentState!.length){
               const condition = props.attribute.currentState![n].title === props.attribute.mandatoryTitles[i] && props.attribute.currentState![n].type === "Mandatory"
               if (condition){
                arr.push(props.attribute.currentState![n])
                none = true
                offset++
              }
                n++
                }
           }
            if(!none){
            arr.push({
                data: null, //here currentState
                title: props.attribute.mandatoryTitles[i],
                cropData: null, //here currentState
                type: "Mandatory"
            })
        }
            i++
        }

        i = 0

        while (i < props.attribute.optionalAmount!) {
            if(props.attribute.currentState! !== null && offset < props.attribute.currentState!.length && props.attribute.currentState![offset].type !== "Mandatory"){
                arr.push(props.attribute.currentState![offset]);
                offset++
            } else {
            arr.push({
                data: null, //here currentState
                title: `Image ${i + 1}`,
                cropData: null, //here currentState
                type: "Optional"
            })
        }
            i++
        }
        setImgObj([...arr])
    }, [])




    function updateImages(index: number | undefined, val: File | File[] | string | null, width?: number, height?: number, name?: string): void {
        const condition = (index! + 1) - props.attribute.mandatoryTitles.length
        if (val !== undefined) {
            if (val !== null) {
                typeof val === "string" ? setImgObj(imgObj!.map((el, i) => i === index ? { ...el, cropData: val } : el))
                    : getBase64(val, (t: any) =>{ setImgObj(imgObj!.map((el, i) => i === index ? { ...el, data: { data: t, width: width!, height: height! }, title: el.type !== "Mandatory" && name !== undefined ? name! : el.title , cropData: null } : el))})
            }
            else setImgObj(imgObj!.map((el, i) => i === index ? { data: val, title: condition > 0 ? `Image ${condition}` : el.title, cropData: val, type: el.type } : el))
        }
    }

    function showCropCall(crop: boolean) {
        console.log("showCrop called")
        crop ? disableCrop.current = false : disableCrop.current = true
        setShowCrop(!showCrop)
    }

    function mappedBody(el: ImgObj, i: number, styleCondition: boolean): ReactElement {
        return (<Dropzone key={i} accept={props.attribute.acceptedFormat}
            onDrop={acceptedImg => {
                console.log("drop event triggered with data: ", acceptedImg )
                clickedImgIdx.current = i
                getFileInfo(acceptedImg, (res: any | null) => {
                    updateImages(i, acceptedImg[0], res.width, res.height, res.name);
                })
            }}
        >
            {({ getRootProps }) => (

                <div key={i}
                    data-testid={`imgCont ${i}`}
                    id={`${i}`}
                    {...getRootProps()}
                    className="imgCont"
                    style={{ display: "inline-block", marginBottom: 30 + (clickedImgIdx.current === i ? 30 : 0) }}
                >
                    {i === 0 || styleCondition ? <h3 style={{ cursor: "default" }}>{imgObj![i].type}</h3> : null}

                    <label
                        onClick={() => {if (clickedImgIdx.current !== i) {clickedImgIdx.current = i; setFlag(!flag)} }} 
                        style={{ width: props.attribute.width, height: props.attribute.height, cursor: "pointer" }} 
                        className="imgStyle"
                        data-testid={`Label ${i}`}
                    >
                        <Image key={i}
                            unoptimized
                            priority={clickedImgIdx.current === i ? true : false}
                            data-testid={`Img ${i}`}
                            onLoad={(e) => { }}
                            src={el.data === null ? props.attribute.defaultFile : el.cropData !== null && el.data !== null ? el.cropData : el.data?.data}
                            width={props.attribute.width}
                            height={props.attribute.height}
                        />
                        {el.data === null ? <input
                            id="retrieveFile"
                            data-testid={`manual ${i}`}
                            className="imgSelect"
                            type="file"
                            name="upload"
                            accept={props.attribute.acceptedFormat}
                            onChange={e => {
                                console.log("upload event triggered with data: ", e)
                                getFileInfo(e.target.files!, (res: any | null) => {
                                    updateImages(clickedImgIdx.current!, e.target.files![0], res.width, res.height, res.name);
                                    e.target.value = ''
                                })
                            }}
                        /> : null}
                    </label>


                    <form onSubmit={(e) => { e.preventDefault(); (document.activeElement! as HTMLElement).blur() }}>
                        <input
                            data-testid={`Inpt ${i}`}
                            style={{
                                cursor: el.type === "Mandatory" ? "default" : "text",
                                fontSize: "1em",
                                textAlign: "center",
                                fontWeight: "bolder", border: "none",
                                width: props.attribute.width
                            }}
                            value={el.title}
                            readOnly={el.type === "Mandatory" ? true : false}
                            onChange={(e) => { editTitle.current = true; setImgObj(imgObj!.map((element, idx) => idx === i ? { ...el, title: e.target.value } : element)) }}
                        />
                    </form>

                    {clickedImgIdx.current === i && el.data !== null ?
                        <Controller key={i}
                            data={el.data?.data!}
                            index={i}
                            width={props.attribute.width}
                            height={props.attribute.height}
                            acceptedFormat={props.attribute.acceptedFormat}
                            imgUpdate={updateImages}
                            showCrop={showCropCall} />
                        :
                        null
                    }

                </div>
            )}
        </Dropzone>
        )
    }

    return (
        <>
        {showCrop ? <Cropping
            data={clickedImgIdx.current !== null ? imgObj![clickedImgIdx.current] : null}
            clickedIndex={clickedImgIdx.current}
            imgUpdate={updateImages}
            showCrop={showCropCall}
            disable={disableCrop.current}
            width={props.attribute.width}
            height={props.attribute.height}
        /> : null}
        <div className="mainCont"
        >
            {props.attribute.closeModal !== undefined && (props.attribute.contHeight! < 100 || props.attribute.contWidth! < 100) ? <h4 style={{ cursor: "pointer", left:"90%", top:"-2.5%", color:"white", position:"absolute" }} onClick={() =>props.attribute.closeModal !== undefined ? props.attribute.closeModal(false) : null}>close</h4> : null}
            <div className="secondCont"
                style={{
                    width: `${typeof props.attribute.contWidth === "number" ? props.attribute.contWidth : 100}%`,
                    height: `${typeof props.attribute.contHeight === "number" ? props.attribute.contHeight : 100}%`,
                    left: `${typeof props.attribute.contWidth === "number" ? 50 - props.attribute.contWidth!*0.5 : 0 }%`,
                    top: `${typeof props.attribute.contHeight === "number" ? 50 - props.attribute.contHeight!*0.5 : 0 }%`
                }}>
       {/*init showcrop call */}
                {imgObj?.map((el, i) => {
                    const styleCondition = i !== 0 && imgObj![i - 1].type !== imgObj![i].type
                    return (
                        styleCondition ? <React.Fragment key={i}> <br />  {mappedBody(el, i, styleCondition)} </React.Fragment> : <React.Fragment key={i}> {mappedBody(el, i, styleCondition)} </React.Fragment>
                    )
                })
                }
                <div
                    id="addButton"
                    onClick={(e) => {
                        setImgObj([...imgObj!, {
                            data: null,
                            title: `Image ${imgObj?.length! - props.attribute.mandatoryTitles.length + 1}`,
                            cropData: null,
                            type: "Optional",
                        }])
                    }}

                    className="addButton"
                    style={{ width: props.attribute.width, height: props.attribute.height, position: "relative" }}
                >
                    <Image
                        key={imgObj?.length! - props.attribute.mandatoryTitles.length + 1}
                        unoptimized
                        data-testid={`Img Add`}
                        onLoad={(e) => { }}
                        src={add}
                        width={addButtonSize}
                        height={addButtonSize}
                    />

                </div>

            </div>
        </div>
        </>
    )
}

export default ImageSlots