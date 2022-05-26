import { useEffect, useRef, useState, useLayoutEffect } from "react";
import SignaturePad from "react-signature-canvas";
import './sig.css'
import { bench } from './genTypes'
import eraser from './assets/eraser.png'
import sigTypeIcon from './assets/sigTypeIcon.png'
import { Stage, Layer, Text, Rect } from 'react-konva';
import sidDrawIcon from './assets/sigDrawIcon.png'


type SigCanvProps = {
    updateImages: (index: number | undefined, val: string | null, width?: number, height?: number) => void
    bench: bench
    changeOption: (title: string, enabled: boolean) => void
    imgEnabled: boolean
    sizeBenchUpdate: (w: number, h: number) => void
    h: number
    w: number
}

const SignatureCanvas = (props: SigCanvProps) => {

    const [hoveredTitle, setHoveredTitle] = useState<string | null>(null)
    const [size, setSize] = useState<number[]>([window.innerWidth, window.innerHeight]);
    const [typeValue, setTypeValue] = useState<string>("")
    const [mode, setMode] = useState<string>("Draw")
    const [flag, set] = useState(false)
    const sigCanvas = useRef(null);
    const sizeHBench = size[1] * (props.h * 0.01) * 0.7
    const sizeWBench = size[0] * (props.w * 0.01)
    const sigOptions = [
        {
            title: "Draw",
            img: sidDrawIcon

        },
        {
            title: "Type",
            img: sigTypeIcon
        }
    ]


    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        //@ts-ignore
        if (sessionStorage.getItem('signatureDraw') && JSON.parse(sessionStorage.getItem('signatureDraw')!).length > 0 && sigCanvas.current._sigPad) {(sigCanvas.current! as SignaturePad).fromData(JSON.parse(sessionStorage.getItem('signatureDraw')!))}
        props.sizeBenchUpdate(sizeWBench, sizeHBench)
    }, [size])



    useEffect(() => {
        if (mode !== "Draw") {
            if (typeValue === "") sessionStorage.removeItem("signatureType");
            else sessionStorage.setItem('signatureType', JSON.stringify(typeValue));
        }
    }, [typeValue])

    useEffect(() => {
        if (mode === "Draw") {
            //@ts-ignore
            if (sessionStorage.getItem('signatureDraw') && JSON.parse(sessionStorage.getItem('signatureDraw')).length > 0) (sigCanvas.current! as SignaturePad).fromData(JSON.parse(sessionStorage.getItem('signatureDraw')))
        } else if (sessionStorage.getItem('signatureType')) setTypeValue(JSON.parse(sessionStorage.getItem('signatureType')!))
    }, [mode])

    function clear() {
        if (mode === "Draw") {
            if (sessionStorage.getItem('signatureDraw')) sessionStorage.removeItem('signatureDraw');
            (sigCanvas.current! as SignaturePad).clear(); set(!flag)
        }
        else  setTypeValue("") 

    }

    function localSave() {
        //@ts-ignore
        sessionStorage.setItem('signatureDraw', JSON.stringify(sigCanvas.current!.toData()))
        set(!flag)
    }

    function updateImg() {
        //@ts-ignore
        const date = new Date
        if (mode === "Draw") {
            //@ts-ignore
            if (sessionStorage.getItem('signatureDraw') && JSON.parse(sessionStorage.getItem('signatureDraw')).length > 0) {
                props.updateImages(undefined, (sigCanvas.current! as SignaturePad).getTrimmedCanvas().toDataURL("image/png"), props.bench.width, props.bench.height);
                // send to db use Session storage to store previous call to avoid multiple calls
                // navigator.geolocation.getCurrentPosition(function showPosition(position) {
                //     console.log("location", position.coords.latitude,  position.coords.longitude) 
                //      send call here to backend with date and object
                //   })
                props.changeOption("Image", props.imgEnabled)
            }
        }
        else {
            //@ts-ignore
            if (typeof JSON.parse(sessionStorage.getItem('signatureType')) === "string") {
                //@ts-ignore
                props.updateImages(undefined, (sigCanvas.current as HTMLCanvasElement).toDataURL({ mimeType: 'image/png', width: sizeWBench, height: sizeHBench * 0.215, quality: 2, pixelRadio: 1, }), sizeWBench, sizeHBench * 0.215);
                // send to db use Session storage to store previous call to avoid multiple calls
                // navigator.geolocation.getCurrentPosition(function showPosition(position) {
                //     console.log("location", position.coords.latitude,  position.coords.longitude) 
                //      send call here to backend with date and object
                //   })
                props.changeOption("Image", props.imgEnabled)
            }
        }

    }


    return (
        <>
            {mode === "Draw" ? <SignaturePad
                ref={sigCanvas}
                onEnd={() => { localSave() }}
                clearOnResize={true}
                backgroundColor={"white"}
                canvasProps={{
                    className: "signatureCanvas"
                }} /> :
                <div className="signatureCanvas">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="text"
                            value={typeValue}
                            onChange={(e) => setTypeValue(e.target.value)}
                            className="typeInp"
                            placeholder="Text here"
                        />
                    </form>
                    <Stage
                        id="Stage"
                        ref={sigCanvas}
                        className="typeStage"
                        x={0}
                        width={sizeWBench}
                        height={sizeHBench * 0.215}

                    >
                        <Layer>
                            <Rect
                                width={sizeWBench}
                                height={sizeHBench * 0.195}
                                x={0}
                                y={0}
                                fill={"white"}
                            />
                            <Text
                                fontSize={sizeHBench * 0.195}
                                text={typeValue}
                                x={0}
                                y={5}
                                fontFamily="Tangerine"
                                wrap="char"
                                align="center"
                                width={sizeWBench}
                            />
                        </Layer>
                    </Stage>
                </div>
            }

            <img src={eraser} className="clear" onClick={clear} />
            <div
                className="titleDisplay"
                style={{
                    top: "108%",
                    color: "white",
                    fontSize: 15,
                    marginLeft: "8%"
                }}>
                {hoveredTitle}
            </div>
            <div className="sigModeCont">
                {
                    sigOptions.map((el,i) => {
                        return (
                            <div key={i}
                                className="optionDiv"
                                style={{ backgroundColor: mode === el.title ? "white" : "transparent" }}
                            >
                                <img key={i}
                                    src={el.img}
                                    onClick={() => { setMode(el.title) }}
                                    className="sigOptions"
                                    onMouseEnter={_ => { setHoveredTitle(el.title) }}
                                    onMouseLeave={_ => { setHoveredTitle(null) }}
                                />
                            </div>
                        )
                    })
                }
            </div>

            <span className="save"
                style={{ backgroundColor: (mode === "Draw" && sessionStorage.getItem('signatureDraw') && JSON.parse(sessionStorage.getItem('signatureDraw')!).length > 0) || (mode === "Type" && sessionStorage.getItem('signatureType') &&  typeValue !== "") ? "rgb(42, 173, 190)" : "silver" }}
                onClick={updateImg}
            >
                Save and view
            </span>


        </>
    )


}

export default SignatureCanvas