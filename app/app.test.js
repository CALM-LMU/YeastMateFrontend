import React from 'react';
import {shallow} from 'enzyme/build';
import App from './app';


it('mounts without crashing', () => {
  const wrapper = shallow(<App />);
  wrapper.unmount()
});
