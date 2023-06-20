import Variables from '../utils/variables';


let myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('authentication-token', Variables.TOKEN);

export async function activeChats() {
  console.log('inner call');

  return new Promise((resolve, reject) => {
    var url = Variables.API_URL + Variables.ACTIVE_CHATS;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Api success', data.response);
        resolve(data.response);
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}



export async function suspendedChats() {
  console.log('inner call');

  return new Promise((resolve, reject) => {
    var url = Variables.API_URL + Variables.SUSPENDED_CHATS;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Api success', data.response);
        resolve(data.response);
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}

export async function closedChats() {
  console.log('inner call');

  return new Promise((resolve, reject) => {
    var url = Variables.API_URL + Variables.CLOSED_CHATS;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Api success', data.response);
        resolve(data.response);
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}

export async function getBroadCastList() {
  return new Promise((resolve, reject) => {
    var url =
      'https://a8e6-210-18-155-241.in.ngrok.io/MeOnCloud/chatbird/api/broadcast?name=&from=0&perPage=20&fromDate=2023-03-07T18:30:00.000Z&toDate=2023-03-15T18:29:00.000Z';
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Api success-->', JSON.stringify(data));
        console.log('Api success', data.data.broadcastList);
        resolve(data.data.broadcastList);
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}

function ApiRequest(url, method, header) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = e => {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200) {
      console.log('success', request.responseText);
      return request.responseText;
    } else {
      console.warn('error');
    }
  };

  request.open(method);
  request.setRequestHeader(header);
  request.send();
}

export async function getChannelList() {
  console.log('inner call');
  return new Promise((resolve, reject) => {
    var url =
      Variables.API_URL +
      '/e/enterprise/channels?name=&type=4&from=0&perPage=20';
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Api success');
        if (data.response.channelConfig) {
          resolve(data.response.channelConfig);
        } else {
          resolve([]);
        }
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}
export async function getTemplateList(channelId) {
  console.log('inner call');
  return new Promise((resolve, reject) => {
    var url =
      Variables.API_URL +
      '/chatbird/api/templates?channelId=' +
      channelId +
      '&status=APPROVED&page=0';
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('template Api success', data);
        if (data.data.templates) {
          resolve(data.data.templates);
        } else {
          resolve([]);
        }
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}

export async function sendTemplateApi(payloadData) {
  console.log('Send call');
  return new Promise((resolve, reject) => {
    var url = Variables.API_URL + '/chatbird/api/broadcast';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('template Api success', data);
        if (data) {
          resolve(data);
        } else {
          resolve([]);
        }
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    var testPayload = {
      channelId: '6152e73f516075157c2ee3f2',
      phoneNumber: ['918190083902'],
      message: {
        template: {
          templateId: 'karix_survey',
          templateUId: 2127923597404786,
          media: {
            type: 'IMAGE',
            url: 'https://a8e6-210-18-155-241.in.ngrok.io/MeOnCloud/drive/docs/641808be725d0417bb2315f5',
          },
        },
      },
    };
    var payload = {
      channelId: payloadData.channelValue,
      phoneNumber: payloadData.mobileNumbers,
      message: {
        template: {
          templateId: payloadData.templateValue.name,
          templateUId: payloadData.templateValue.templateId,
          // "media": {
          //     "type": "IMAGE",
          //     "url": "https://a8e6-210-18-155-241.in.ngrok.io/MeOnCloud/drive/docs/641808be725d0417bb2315f5"
          // }
        },
      },
    };
    console.log('Payload', JSON.stringify(payload));
    xhr.send(JSON.stringify(payload));
  });
}

export async function closeChat(chatId) {
  console.log('Close call-->', chatId);
  return new Promise((resolve, reject) => {
    var url = Variables.API_URL + '/e/enterprise/chat/' + chatId + '/close';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Api success');
        if (data) {
          resolve(data);
        } else {
          resolve([]);
        }
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}
