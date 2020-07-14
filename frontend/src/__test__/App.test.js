import React, { createContext } from 'react';
import App from '../App';
import Login from '../components/login.js';
import { shallow, mount } from 'enzyme';

it('login renders without creashing', () => {
  const userContext = createContext();
  const wrapper = shallow(<App />);
  const nickname = <Login context={userContext} />
  expect(wrapper.contains(nickname)).toEqual(true);
});

// ***********testing to see if submit was called. not working yet
// it('submit sends as expected', () => {
//   const wrapper = mount(<App />);

//   wrapper.find('#loginForm').simulate('keypress', {key: 'Enter'});

//   const submit = jest.fn()

//   expect(submit).toBeCalled()
   
// });

//********also want to test if input was changed
//*********will lastly need to change state to see if player area shows up
// it('entering nickname works', () => {
//   const wrapper = mount(<App />);
//   wrapper.find('#nicknameInput').simulate('change', { target: { value: 'name' } })
//   wrapper.find('#gameInput').simulate('change', { target: { value: 'game' } })
//   wrapper.find('#passwordInput').simulate('change', { target: { value: 'password' } })

//   wrapper.find('#loginForm').simulate('keypress', {key: 'Enter'});

//   let player = <div className="nickname">name</div>

//   expect(wrapper.contains(player)).toEqual(true);
   
// });


