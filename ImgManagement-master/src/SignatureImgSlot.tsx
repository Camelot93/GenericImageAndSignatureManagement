import { useState, useLayoutEffect, useEffect, useRef } from "react";
import Image from 'next/image';
import { getFileInfo } from './alreadyExistant';
import { sigImgProp } from './genTypes';
import './sig.css';
import Controller from "./ImgControlSection";
import Cropping from "./Cropping";

type SizeWH = {
    width: number
    height: number
}
type imgSlot = {
    data: sigImgProp
    imgSize: SizeWH | null
    current: string
    h: number
    w: number
    updateImages: (index: number | undefined, val: string | File | File[] | null, width?: number | undefined, height?: number | undefined, name?: string | undefined) => void
    sizeBenchUpdate: (w: number, h: number) => void
    acceptedFormat: string
    closeModal: (val: boolean) => void
}

const SignatureImgSlot = (props: imgSlot) => {

    const [size, setSize] = useState<number[]>([window.innerWidth, window.innerHeight]);
    const disableCrop = useRef<boolean>(false)
    const [showCrop, setShowCrop] = useState<boolean>(false)
    const sizeHBench = size[1] * (props.h * 0.01) * 0.7
    const sizeWBench = size[0] * (props.w * 0.01)
    const defaultSize = sizeHBench <= sizeWBench ? sizeHBench : sizeWBench
    const imgSizeW = props.imgSize === null ? defaultSize : sizeHBench * (props.imgSize?.width! / props.imgSize?.height!) >= sizeWBench ? sizeWBench : sizeHBench * (props.imgSize?.width! / props.imgSize?.height!)
    const imgSizeH = props.imgSize === null ? defaultSize : sizeWBench * (props.imgSize?.height! / props.imgSize?.width!) >= sizeHBench ? sizeHBench : sizeWBench * (props.imgSize?.height! / props.imgSize?.width!)


    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        props.sizeBenchUpdate(sizeWBench, sizeHBench)
    }, [size])

    function showCropCall(crop: boolean) {
        crop ? disableCrop.current = false : disableCrop.current = true
        setShowCrop(!showCrop)
    }

    function sendAndClose() {
        // send to db use Session storage to store previous call to avoid multiple calls
        const date = new Date
        // send to db use Session storage to store previous call to avoid multiple calls
                // navigator.geolocation.getCurrentPosition(function showPosition(position) {
                //     console.log("location", position.coords.latitude,  position.coords.longitude) 
                //      send call here to backend with date and object
                //   })
        if (props.closeModal !== undefined) props.closeModal(false)
    }
    return (
        <>
            {showCrop ? <Cropping
                data={props.imgSize !== null ? props.data : null}
                clickedIndex={null}
                imgUpdate={props.updateImages}
                showCrop={showCropCall}
                disable={disableCrop.current}
                width={imgSizeW}
                height={imgSizeH}
            /> : null}

            <label
                id="sigImgCont"
                className="sigImgCont"
                data-testid="label"
                style={{
                    left: `calc(50% - ${imgSizeW * 0.5}px)`,
                    top: `calc(50% - ${imgSizeH * 0.5}px)`,
                    // left: 0,
                    // top: `calc(50% - 130px)`,
                    cursor: "pointer"

                }}
            >
                <Image
                    priority
                    unoptimized
                    src={props.current}
                    onLoad={() => { }}
                    width={imgSizeW}
                    height={imgSizeH}
                // width={30}
                // height={30}
                />
                <input
                    id="retrieveFile"
                    className="sigSelect"
                    data-testid="manual"
                    type="file"
                    name="upload"
                    accept={props.acceptedFormat}
                    onChange={e => {
                        console.log("drop event triggered with data: ", e )
                        getFileInfo(e.target.files!, (res: any | null) => {
                            props.updateImages(1, e.target.files![0], res.width, res.height);
                            e.target.value = ''
                        })
                    }}
                />
            </label>
            {props.imgSize !== null ?
                <div className="controllerPosition">
                    <Controller
                        index={null}
                        data={props.current}
                        acceptedFormat={props.acceptedFormat}
                        imgUpdate={props.updateImages}
                        showCrop={showCropCall}
                        width={sizeWBench * 0.4}
                        height={sizeHBench}
                    />
                </div> : null}
            <span className="save" onClick={() => { sendAndClose() }} >Save and close</span>
        </>
    )
}

export default SignatureImgSlot