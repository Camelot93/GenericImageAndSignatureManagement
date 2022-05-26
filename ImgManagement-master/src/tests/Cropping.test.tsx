import { render, screen } from '@testing-library/react';
import Cropping from '../Cropping';
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

it("can trigger the close button on crop and fullscreen",()=>{
    const {getByTestId, queryByTestId, rerender} = render(<Cropping 
                    data={current[0]}
                    clickedIndex={0}
                    imgUpdate={()=>{}}
                    showCrop={()=>{}}
                    disable={true}
                    width={500}
                    height={500}
        />)
        userEvent.click(getByTestId("closeButton"))
})

it("can trigger crop button",()=>{
    const {getByTestId, queryByTestId, rerender} = render(<Cropping 
        data={current[0]}
        clickedIndex={0}
        imgUpdate={()=>{}}
        showCrop={()=>{}}
        disable={true}
        width={500}
        height={500}
/>)
expect(queryByTestId("cropTrigger")).not.toBeInTheDocument
console.log("in fullscreen there is no crop button")

rerender(<Cropping 
    data={current[0]}
    clickedIndex={0}
    imgUpdate={()=>{}}
    showCrop={()=>{}}
    disable={false}
    width={500}
    height={500}
/>)
expect(queryByTestId("cropTrigger")).toBeInTheDocument
console.log("in crop there is crop button")
userEvent.click(getByTestId("cropTrigger"))
})
