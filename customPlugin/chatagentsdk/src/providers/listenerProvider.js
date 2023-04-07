import states from './stateProvider'

export const userActionListener = (users) => {

    
    // This should be done
    states.setUsers(users);
    console.log("fromstates-->",states.users);
  } 