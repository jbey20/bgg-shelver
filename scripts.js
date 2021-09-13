
// const xmlResponse = fetch('https://boardgamegeek.com/xmlapi2/collection?username=jbey20&own=1&version=1', {mode: 'cors'})
//   .then(function(response) {
//     return (response.text());
//   })
//   . then(function(response) {
//     const xmlDoc = parser.parseFromString(response,"text/xml");
//     return xmlDoc;
//   });

//   console.log(xmlResponse);
//   const list = xmlResponse.getElementsByTagName('item');
//   console.log(xmlResponse);
//   list.forEach(game = () => {
//     console.log(game.getAttribute('objectid'));
// })

const getGameIDs = (username) => {
  
  return fetch(`https://boardgamegeek.com/xmlapi2/collection?username=${username}&own=1&version=1`)
  .then(response => response.text())
  .then(data => parseXML(data))
  .then((xmlDoc) => {
    let ids = [];
    const items = xmlDoc.getElementsByTagName('item');
  
    let arr = [...items];
    arr.forEach(element => {
      ids.push(parseInt(element.getAttribute('objectid')));
    });
    return ids;
  });
};

const getGameDetails = (ids) => {

  const idString = ids.toString();
  
  const url = `https://boardgamegeek.com/xmlapi2/thing?id=${idString}&versions=1`

  return fetch(url)
  .then(response => response.text())
  .then(data => parseXML(data))
  .then((xmlDoc) => {
    //create array of objects to stringify and export json file
    
    let games = [];

    x = xmlDoc.getElementsByTagName("items")[0];
    xlen = x.childNodes.length;
    y = x.firstChild;
    
    for (i = 0; i <xlen; i++) {
      // Process only element nodes (type 1)
      if (y.nodeType == 1 && (y.getAttribute('type') == 'boardgame')) {
        let gameNode = y.getElementsByTagName('name')[0];
        let versionNode = y.getElementsByTagName('versions')[0];
        const gameObj = {
          name: gameNode.getAttribute('value'),
          versions: {}        
        }

        const versionItems = [...versionNode.getElementsByTagName("item")];
        
        const versionArr = [];
        versionItems.forEach(element => {
          versionObj = {
            versionName : element.getElementsByTagName('name')[0].getAttribute('value'),
            length : element.getElementsByTagName('length')[0].getAttribute('value'),
            width : element.getElementsByTagName('width')[0].getAttribute('value'),
            depth : element.getElementsByTagName('depth')[0].getAttribute('value')
          }
          versionArr.push(versionObj);
        }); 

        gameObj.versions = versionArr;
        games.push(gameObj);
      }
      y = y.nextSibling;
    } 
    console.log(games);
    
    return games;
  });
};

const parseXML = (data) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, "text/xml");
  return xmlDoc;
};

function downloadObjectAsJson(exportObj, exportName){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};


getGameIDs('jbey20').then((ids) => {
  console.log(ids);
  console.log(getGameDetails(ids));
  return getGameDetails(ids);
})
.then((output) => {
  downloadObjectAsJson(output, 'output')  
});





