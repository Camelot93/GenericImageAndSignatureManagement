export type categoryCount = {
    mandatoryTitles: string[]
    optionalAmount?: number | null
    acceptedFormat: string
    defaultFile: string
    currentState: ImgObj[] | null
    width: number
    height: number
    contHeight?: Number | null
    contWidth?: Number | null
    closeModal?:any
}


export type SigMain = {
    defaultFile: string
    currentState: sigImgProp[] | null
    acceptedFormat: string
    startingOptions:string
    contHeight?: Number | null
    contWidth?: Number | null
    closeModal?:any
}


export type sigImgProp = {
    data: dataObject | null
    cropData: dataObject | null
    title: string
}

export type bench = {
    width:number
    height:number
}

export type ImgObj = {
    data: dataObject | null
    title: string  // if title not equal to mandatory title or title slot data !== null than add to the lowest index option
    cropData: string | null
    type: string
}

export type dataObject = {
    data: string
    width: number
    height: number
}

export type ControlObj = {
    data: string | null
    title: string
}



