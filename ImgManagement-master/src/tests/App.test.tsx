import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders the app component', () => {
   // signature and signature pad component cant be tested due to signature pad not being plain javascript only component tested is SignatureImgSlot
  render(<App />);
});
