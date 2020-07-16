/*
if this code ever changes you need to also change the gameroom.js code in the backend.
this code only effects the messageList colors in chat.
**/

const COLORS2 = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  const COLORS = [
    '#1A1A1D', '#4E4E50', '#6F2232', '#950740', '#C3073F'
  ];

  //colors corelate to #4 in following link: https://digitalsynopsis.com/design/website-color-schemes-palettes-combinations/

// Gets the color of a username through our hash function
const getUsernameColor = (username) => {
  // Compute hash code
  var hash = 7;
  for (var i = 0; i < username.length; i++) {
     hash = username.charCodeAt(i) + (hash << 5) - hash;
  }
  // Calculate color
  var index = Math.abs(hash % COLORS.length);
  return COLORS[index];
}


export{
    getUsernameColor
}
