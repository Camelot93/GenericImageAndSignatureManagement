# Get started

download the code, run npm i then run npm start and finally click on the open Button

# Functionality

## Image Component

0. this component is responsive

1. ImgSlot is the main component, it holds an array of imgSlots that allows images to be dragged n dropped and well as manually adding an image. 

2. When an image is added or when a slot with a none default image is selected, options will appear below. If a slot has a default image and is clicked upon, manually selection appears

3. The options are
    - edit image
    - full screen
    - crop
    - remove  

4. Cropping is a fixed modal that offers the option to crop or close and is responsive to almost bare minimum size

5. the component also has the ability to add more otional images and edit their title

## Signature Component

All the above for one slot with the ability to sign on canvas or type signature

# Usage

## Image Component

Simply add the component and pass an object of props to the **attribute** prop

Here are the props below:

   - mandatoryTitles: Array of string,
   - optionalAmount: number,
   - acceptedFormat: string,
   - defaultFile: string as image path,
   - currentState: to be used when connecting to backend is null for now, 
   - width: number,
   - height: number,
   - contHeight:can be null or 100 for full screen its in percentage,
   - contWidth:can be null or 100 for full screen its in percentage,
   - closeModale: () => void

## Signature Component

Here are the props below:

   - contHeight:can be null or 100 for full screen its in percentage,
   - contWidth:can be null or 100 for full screen its in percentage
   - acceptedFormat: string,
   - startingOptions: string
   - currentState: to be used when connecting to backend is null for now, 
   - defaultFile: string as image path,
   - closeModale: () => void

## PS

you can just comment in and out both component on App.tsx

# Testing

## Image Component

   - App is rendered
   - All image rendered successfully with same default image, ability to upload and drop
   - can change optional titles
   - can add new optional slots
   - ImgControlSection appears when index match
   - all ImgControlSection events are triggering
   - can trigger the close button on crop and fullscreen

## Signature Component

only image rendering and upload are tested, due to signature pad component jest is unable to recognize it as plain JS and fails to test it

# Important

The signature component resizes well in tested browsers such as Chrome and Edge but in Safari due to safari's different response to dynamic rerendering it fails to render changed props accurately, even using memoization doesnt cope. Solving this programmatically will cause extra rerenderings and possible leaks, thus hindering the performance. But it can be solved by adding your image and if the size doesnt fit just click on the sign option and then back to the image option.
Cropping in safari also shows a resize issue but only when your window width becomes approximately half of 13 inch which can be resolved by making the window bigger. Note: If this needs to be resolved programmatically it can be done, it will just cost time and possibly performance and has no major impact





