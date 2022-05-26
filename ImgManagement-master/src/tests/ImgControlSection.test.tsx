import { render, screen, fireEvent, act } from '@testing-library/react';
import ImgSlot from '../ImgSlots';
import Controller from  '../ImgControlSection'
import add from '../assets/add.png'
import userEvent from '@testing-library/user-event';


let current = [
    {
    data:{
      data:add,
      width:150,
      height:150
    },
      title:"Loft",
      cropData:null,
      type:"Mandatory"
  },
]
let mandTitles=["Loft", "Pipes", "Floor"]
let optAmount = 10
const limit = optAmount + mandTitles.length -1
const obj = { mandatoryTitles: mandTitles,
    optionalAmount: optAmount,
    acceptedFormat: "image/png, image/jpg, image/jpeg",
    defaultFile: add,
    currentState: current, // for db data
    width: 150,
    height: 150,
    contHeight: 80,
    contWidth: 80,
    closeModal: close}

test("ImgControlSection appears when index match",async ()=>{
    const {getByTestId, queryByTestId, rerender} = render(<ImgSlot attribute={obj}/>)
    render(<Controller
        data={null}
        index={1}
        width={150}
        height={150}
        acceptedFormat={"image/png"}
        imgUpdate={()=>{}}
        showCrop={()=>{}} 
       />)
    expect(queryByTestId(`Img 0`)).toBeInTheDocument()
    expect(queryByTestId(`Controller 0`)).not.toBeInTheDocument()
    console.log("controller not visible")

    userEvent.click(getByTestId(`Img 0`))
    expect(queryByTestId(`Controller 0`)).toBeInTheDocument()
    console.log("controller visible")




})

describe("all ImgControlSection events are triggering", ()=>{
    it("trigers upload event",()=>{
         render(<ImgSlot attribute={obj}/>)
         const {getByTestId, queryByTestId, rerender} =render(<Controller
            data={null}
            index={0}
            width={150}
            height={150}
            acceptedFormat={"image/png"}
            imgUpdate={()=>{}}
            showCrop={()=>{}} 
           />)
           expect(queryByTestId(`retrieveFile`)).toBeInTheDocument()
           act( () => {
            fireEvent.change(getByTestId("retrieveFile"),{target:{files:""}})
          })
    })

    it("triggers fullscreen event",()=>{
        render(<ImgSlot attribute={obj}/>)
         const {getByTestId, queryByTestId, rerender} =render(<Controller
            data={null}
            index={0}
            width={150}
            height={150}
            acceptedFormat={"image/png"}
            imgUpdate={()=>{}}
            showCrop={()=>{}} 
           />)
           expect(queryByTestId(`Full screen`)).toBeInTheDocument()
           act( () => {
            fireEvent.click(getByTestId("Full screen"),{target:{files:""}})
          })
    })

    it("triggers crop event and showcropCall",()=>{
        const {getByTestId, queryByTestId, rerender} = render(<ImgSlot attribute={obj}/>)
        render(<Controller
            data={null}
            index={0}
            width={150}
            height={150}
            acceptedFormat={"image/png"}
            imgUpdate={()=>{}}
            showCrop={()=>{}} 
           />)

           expect(queryByTestId(`Crop`)).toBeInTheDocument()
  
            userEvent.click(getByTestId("Crop"))
    })

    it("triggers delete event",()=>{
        const {getByTestId, queryByTestId, rerender} = render(<ImgSlot attribute={obj}/>)
        render(<Controller
            data={null}
            index={0}
            width={150}
            height={150}
            acceptedFormat={"image/png"}
            imgUpdate={()=>{}}
            showCrop={()=>{}} 
           />)
           expect(queryByTestId(`Delete`)).toBeInTheDocument()
           act( () => {
            fireEvent.click(getByTestId("Delete"),{target:{files:""}})
          })
    })
})