
import react, { useState } from 'react';

export default () => {
  const [users, setUsers] = useState([]);
  // console.log("from state -->",users);
  return { users, setUsers };
}