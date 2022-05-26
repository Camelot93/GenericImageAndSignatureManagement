import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import ImgSlot from '../ImgSlots';
import user from '@testing-library/user-event';
import Controller from  '../ImgControlSection'
import imgDef from '../assets/imgTemp.jpg'
import { getBase64 } from '../alreadyExistant'
import add from '../assets/add.png'

class AppService {
    _buildBlobForProperties(app:any): Blob {
      return new Blob([JSON.stringify({ name: app.name, description: app.description })], { type: 'application/json' });
    }
  }

let mandTitles=["Loft", "Pipes", "Floor"]
let optAmount = 10
const limit = optAmount + mandTitles.length -1
const obj = { mandatoryTitles: mandTitles,
    optionalAmount: optAmount,
    acceptedFormat: "image/png, image/jpg, image/jpeg",
    defaultFile: add,
    currentState: null, // for db data
    width: 150,
    height: 150,
    contHeight: 80,
    contWidth: 80,
    closeModal: close}


describe("All image rendered successfully with same default image, ability to upload and drop ",()=>{

    it("has attributed all mandatory types in array and amount of optional types with src = default Image for all if no image added to slot",()=>{
    const {getByTestId, queryByTestId, rerender} = render(<ImgSlot attribute={obj}/>)
    let i = 0

    while(i<limit){
        expect(getByTestId(`Img ${i}`)).toHaveAttribute('src') 
        console.log("Image displayed with base64 of",getByTestId(`Img ${i}`)?.getAttribute('src'))
        console.log("Image src is the same for all", i !== 0 ? getByTestId(`Img ${i-1}`)?.getAttribute('src') === getByTestId(`Img ${i}`)?.getAttribute('src') : " this is the first index")
        expect(queryByTestId(`Img ${limit + 1}`)).not.toBeInTheDocument()
        console.log("doesnt go beyond limit")
        i++
    }
    })
    

it("uploads and drops", ()=>{
    const {getByTestId} =  render(<ImgSlot attribute={obj}/>)
    const appService = new AppService();
    const app = {result:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACRcAAAW+CAYAAAD3TIWkAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOxAAADsQBlSsOGwAAIABJREFUeJzsvUmTJDmyrXdUzW"}
    const blob: BlobPart = appService._buildBlobForProperties(app);
    const event = {
        target: {
            files: [new File([new Blob([blob])], "app", {type: "image/png", lastModified:9988})]
        },
      }
      act(() => {
        fireEvent.change(getByTestId('manual 0'), event)
        fireEvent.drop(getByTestId('Label 0'), event)
      })
 

    
    })
})



it("can change optional titles",()=>{
    const {getByTestId, queryByTestId, rerender} = render(<ImgSlot attribute={obj}/>)

    console.log("input value on render is default title", getByTestId(`Inpt ${mandTitles.length}`).getAttribute("value"))

    fireEvent.change(getByTestId(`Inpt ${mandTitles.length}`), { target: { value: 'test' } })
    
    console.log("input value on change is chosen input", getByTestId(`Inpt ${mandTitles.length}`).getAttribute("value"))
})

it("can add new optional slots",()=>{

    const {getByTestId, queryByTestId, rerender} = render(<ImgSlot attribute={obj}/>)

    expect(queryByTestId(`Img ${limit}`)).toBeInTheDocument()
    expect(queryByTestId(`Img ${limit + 1}`)).not.toBeInTheDocument()
    console.log("limited to initial props")

    fireEvent.click(getByTestId("Img Add"))
    console.log("add additional image clicked")

    expect(queryByTestId(`Img ${limit + 1}`)).toBeInTheDocument()
    expect(getByTestId(`Inpt ${limit + 1}`).getAttribute("value")).toBe(`Image ${optAmount + 1}`)

    console.log("additional optional image added")


})