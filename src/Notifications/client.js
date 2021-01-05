import * as firebase from 'firebase';
import db from '../database/db' ; 
import Axios from 'axios';




const messaging=firebase.messaging();


//messaging.getToken({vapidKey: "BPI4TcoeyYAB0d8whsM0PMJoAZFeVQeSNwBidPwIGMZnPh7IMuyPkXcsSHTRYATajoMnMF6uTaKimpMd04ElNX4"});
function IntitalizeFireBaseMessaging() {

    
    messaging.getToken({vapidKey: 'BPI4TcoeyYAB0d8whsM0PMJoAZFeVQeSNwBidPwIGMZnPh7IMuyPkXcsSHTRYATajoMnMF6uTaKimpMd04ElNX4'}).then((currentToken) => {
        if (currentToken) {
          sendTokenToServer(currentToken);
          //updateUIForPushEnabled(currentToken);
        } else {
          // Show permission request.
          console.log('No registration token available. Request permission to generate one.');
          // Show permission UI.
          //updateUIForPushPermissionRequired();
          setTokenSentToServer(false);
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        //showToken('Error retrieving registration token. ', err);
        setTokenSentToServer(false);
      });
}
function sendTokenToServer(token){ 
    if (!isTokensendTokenToServer()) {
        console.log("keep enought ") ; 
            const postObject={
               'title': 'here is karthis title' ,
               'body':"chumma Kizhi" , 
               'icon': '', 
               'token':token
            }
            Axios.post('https://fcm.googleapis.com/fcm/send', postObject).then(response=>{}).catch(err=>{
                console.log("Unable to send the request to firebase") ; 
            });
        
    }; 
}
    function isTokensendTokenToServer() {
    return window.localStorage.getItem('sendTokenToServer') === '1';
    }
    function setTokenSentToServer(sent) {
    window.localStorage.setItem('sendTokenToServer', sent ? '1' : '0');
    }
messaging.onMessage(function (payload) {
    console.log(payload);
    const notificationOption={
        body:payload.notification.body,
        icon:payload.notification.icon
    };

    if(Notification.permission==="granted"){
        var notification=new Notification(payload.notification.title,notificationOption);

        notification.onclick=function (ev) {
            ev.preventDefault();
            window.open(payload.notification.click_action,'_blank');
            notification.close();
        }
    }

});
messaging.onTokenRefresh(function () {
    messaging.getToken()
        .then(function (newtoken) {
            console.log("New Token : "+ newtoken);
        })
        .catch(function (reason) {
            console.log(reason);
        })
})

export default IntitalizeFireBaseMessaging ; 
