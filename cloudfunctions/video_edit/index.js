// 云函数入口文件
const cloud = require('wx-server-sdk')
const tencentcloud = require("tencentcloud-sdk-nodejs");
const got=require('got')
const fs = require('fs');
const AipSpeech = require("baidu-aip-sdk").speech;
cloud.init()



// 云函数入口函数
exports.main = async (event1, context,callback) =>  {
  const wxContext = cloud.getWXContext()

//baidusdk
const subject=event1.subject
const event=event1.event
const event2=event1.event2
const id=event1.id
  result = `　       　${subject}${event}是怎么回事呢？${subject}相信大家都很熟悉，但是${subject}${event}是怎么回事呢，下面就让小编带大家一起了解吧。\r\n　　${subject}${event}，其实就是${event2}，大家可能会很惊讶${subject}怎么会${event}呢？但事实就是这样，小编也感到非常惊讶。\r\n　　这就是关于${subject}${event}的事情了，大家有什么想法呢，欢迎在评论区告诉小编一起讨论哦！`


// 务必替换百度云控制台中新建百度语音应用的 Api Key 和 Secret Key
let client_baidu = new AipSpeech(0, 'hye8j6lriQyP0GG4jGKiTGc0', 'ZDbGoPqUYbCrt265m2rDI3IU9ua2Go7p');
// 语音合成，保存到本地文件
await client_baidu.text2audio(result, { spd: 5, per: 0 }).then(function (result) {
  if (result.data) {
    console.log('语音合成成功，文件保存到tts.mp3，打开听听吧222');
    fs.writeFileSync(`/tmp/${id}.mp3`, result.data);
    
   
  } else {
    // 合成服务发生错误
    console.log('语音合成失败: ' + JSON.stringify(result));
  }
}, function (err) {
  console.log(err);
});

const fileStream =  await fs.createReadStream(`/tmp/${id}.mp3`)
const fileid= await cloud.uploadFile({
  cloudPath: `${id}.mp3`,
  fileContent: fileStream,
})
//换取外网链接
const url= await cloud.getTempFileURL({
  fileList: [fileid.fileID]
})
//云存储外网链接
let audio_url= url.fileList["0"].tempFileURL
let bgm_url="https://7069-pinche-327a05-1258739777.tcb.qcloud.la/bgm.mp3?sign=9ccd1ee7bf9eac62b204fedc03537c86&t=1587822596"



//腾讯云云点播sdk,制作视频
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
  
  let req = new models.ComposeMediaRequest();
  
  let params = `{"Tracks":[{"Type":"Video","TrackItems":[{"Type":"Video","VideoItem":{"SourceMedia":"5285890801866756722","Duration":60}}]},{"Type":"Audio","TrackItems":[{"Type":"Audio","AudioItem":{"SourceMedia":"${audio_url}","Duration":60}}]},{"Type":"Audio","TrackItems":[{"Type":"Audio","AudioItem":{"SourceMedia":"${bgm_url}","Duration":60}}]} ],"Output":{"FileName":"hope","Container":"mp4"}}`
  
  req.from_json_string(params);
 

  let res={}
  //返回视频合成链接
  return new Promise(reslove => {
    client.ComposeMedia(req, function(errMsg, response) {
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









