// 云函数入口文件
const cloud = require('wx-server-sdk')
const got=require('got')
const tencentcloud = require("tencentcloud-sdk-nodejs");
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
const TaskId=event.TaskId
  


const VodClient = tencentcloud.vod.v20180717.Client;
const models = tencentcloud.vod.v20180717.Models;

const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

let cred = new Credential("AKID4tRkuw4DRVrytY596mTs41g7IFXpnhOV", "vWqaBXcXBoCKCmvjqiLp30OVJs76o1x6");
let httpProfile = new HttpProfile();
httpProfile.endpoint = "vod.tencentcloudapi.com";
let clientProfile = new ClientProfile();
clientProfile.httpProfile = httpProfile;
let client = new VodClient(cred, "ap-guangzhou", clientProfile);

let req = new models.DescribeTaskDetailRequest();

let params = `{"TaskId":"${TaskId}"}`
req.from_json_string(params);


 


let res={}
return new Promise(reslove => {
  client.DescribeTaskDetail(req, function(errMsg, response) {
    console.log("jinlaile")
    console.log(errMsg)
    if (errMsg) {
        console.log(errMsg);
        return;
    }
    console.log(response.to_json_string());
    
    reslove(response)
    // callback(response.to_json_string())
  }) 
})










   
}






