
import JsonFILe from './postman_collection.json'
import * as RNFS from 'react-native-fs';

var path = RNFS.ExternalDirectoryPath + '/homepage2.json';


const getValues = (parseRes, findingPath) => new Promise((resolve, rject) => {
  console.log("findingPathfindingPath+++",findingPath);
  let jsonArr = parseRes.item;
  var firstIndex = 0;
  var secondIndex = 0;
  var x;

  console.log(findingPath,"jsonArrjsonArrjsonArr",jsonArr)

  jsonArr.map(async function (entry, i) {

    secondIndex = entry.item.findIndex(x => x?.endpoint === findingPath);

    if (secondIndex != -1) {
      firstIndex = i;
      x = {
        first: firstIndex, second: secondIndex,
        status: true
      }
      resolve(x);
    } else {
      x = { status: false }
    }
    //console.log(x,xxxxxxxx)
    return x
  })
  rject(x)

})


const writeJsonFile = async(modifyJSON) => {
  const json = modifyJSON
  await RNFS.writeFile(path, json, 'utf8')
    .then((res) => console.log('FILE WRITTEN!'))
    .catch((err) => console.log(err.message));
  RNFS.readFile(path).then(res => {
    console.log("success read", JSON.parse(res))

  }).catch(err => {
    console.log("error in write file",err)
  })
}


const createJSONFile = (JsonFILe) => {
  writeJsonFile(JsonFILe)
}




console.log("file path+++",path)

export const readFileSchema = async (findingPath = '', data) => {
  try {
    RNFS.readFile(path).then(res => {
      let parseRes = JSON.parse(res)
      console.log("file path+++",parseRes)
      getValues(parseRes, findingPath).then((valRes)=>{
        if (!!valRes?.status) {
          console.log("parseRes", parseRes.item[valRes.first].item[valRes.second])
          console.log(`api___${findingPath}`,parseRes.item)

          let savedItem = {
              "name":parseRes.item[valRes.first].item[valRes.second]?.name,
              "respval":  data
          }
          
          //parseRes.item[valRes.first].item[valRes.second].response.splice(0, 0, savedItem)
          parseRes.item[valRes.first].item[valRes.second].response = [savedItem]
          console.log("isExistisExistisExistisExist", parseRes)
    
          console.log(`api___${findingPath}`,parseRes.item)
          writeJsonFile(JSON.stringify(parseRes))
        }
      }).catch((error)=>{
        console.log("values not found",error)
      })

    }).catch(err => {
      console.log("file path+++ not found",err)
      createJSONFile(JSON.stringify(JsonFILe))
    })
    return;

  } catch (error) {
    console.log("file not found", error)
    if(error?.status == false){
      return
    }
    // createJSONFile(JSON.stringify(JsonFILe))
  }

}