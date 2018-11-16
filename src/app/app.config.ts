let baseWebrtc = "https://video.futucare.com/";
export const Config = {
  url: "https://futucare.com/api", //52.224.110.147
  common_url: "https://futucare.com/api/",
  api_url: "https://futucare.com/api/api/",
  backend_url: "http://52.224.110.147:8081",
  imgBaseUrl: "https://futucare.com/demo/",
  avatar:
    "http://4.bp.blogspot.com/-ZzOpik5sFZg/UleI27zMJyI/AAAAAAAAHgs/nQEZnjiSn9M/s1600/profileicon.jpg",
  api: {
    messenger: {
      channel: "/api/channels/",
      message: "/api/messages/",
      readMessage: "/api/readMessage/",
      webrtc: "https://futucare.com/webrtc/api/webrtc",
      uploadImage: "/api/communication/uploadeImageForCommunication",
      detailChannel: "/api/detailChannel/",
      turn: "http://54.255.249.122/api/turn"
    },
    user: {
      update: "/api/users/"
    }
  },
  oneSignalAppId: "ea88ab2e-2454-41cc-8826-a2a193905061",
  webrtc: {
    turn: baseWebrtc + "api/turn",
    rtc: baseWebrtc
  }
};
