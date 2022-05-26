import { render, screen, fireEvent, act } from '@testing-library/react';
import add from '../assets/add.png'
import SignatureImgSlot from '../SignatureImgSlot';

class AppService {
    _buildBlobForProperties(app:any): Blob {
      return new Blob([JSON.stringify({ name: app.name, description: app.description })], { type: 'application/json' });
    }
  }


const img = {
    data: {data:add, width:150, height:150},
    cropData: null,
    title: "Signature"
}

it("renders, uploads", ()=>{
    const {getByTestId} =  render(
    <SignatureImgSlot 
        data={img}
        imgSize={{width:img.data.width, height:img.data.height}}
        current={img.data.data}
        h={150}
        w={150}
        updateImages={()=>{}}
        acceptedFormat={"image/png"}
        sizeBenchUpdate={()=>{}}
        closeModal={()=>{}}

        />
        )
    const appService = new AppService();
    const app = {result:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACRcAAAW+CAYAAAD3TIWkAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOxAAADsQBlSsOGwAAIABJREFUeJzsvUmTJDmyrXdUzW"}
    const blob: BlobPart = appService._buildBlobForProperties(app);
    const event = {
        target: {
            files: [new File([new Blob([blob])], "app", {type: "image/png", lastModified:9988})]
        },
      }
      act(() => {
        fireEvent.change(getByTestId('manual'), event)
      })
 
})