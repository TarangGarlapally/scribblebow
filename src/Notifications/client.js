import * as firebase from 'firebase';
import db from '../database/db' ; 
import Axios from 'axios';




const messaging=firebase.messaging();


function IntitalizeFireBaseMessaging() {

    
    messaging.getToken({vapidKey: 'BPI4TcoeyYAB0d8whsM0PMJoAZFeVQeSNwBidPwIGMZnPh7IMuyPkXcsSHTRYATajoMnMF6uTaKimpMd04ElNX4'}).then((currentToken) => {
        if (currentToken) {
          console.log(currentToken , "token")  ; 
          sendTokenToServer(currentToken);
        } else {
          console.log('No registration token available. Request permission to generate one.');

          setTokenSentToServer(false);
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        setTokenSentToServer(false);
      });
}
function sendTokenToServer(token){ 
    if (!isTokensendTokenToServer()) {
        console.log("keep enought ") ; 
            const postObject={
                "registration_ids" : ["d4_LsyR_KDpE3CU1nNQVlT:APA91bE8yYznmwgb1UFKhdc0IriAHh2tuVb5fbcgN9LQgse5Uz2NwmtXrzYrvfJC6wTkXMUHsGuBzmdJBGyK0iTwxrKNQFR1-1MSepWrv7rlLnWLrlxz9LyrvpT1BULw1AyJ3LVV3Rhw" , token ],
                "priority":"high",
               "notification": {
                   "title":"Liked Your Post",
                    "body": "the user "+  localStorage.getItem('username')+" liked your Post",
                    "sound": "default" ,
                    "icon": process.env.PUBLIC_URL + '/myimage.png' , 
                   "badge": "50"
                }
            }; 
            let config = {
                headers : {
                    "Authorization": 'key='+'AAAA1qyN3CQ:APA91bHoBSMgXvVF642CYjspEhWvj9pIxUTmxnRhE4k0T8psOURcKZk9m0JWoyzM1hYlR9RTLQkbDUscgmkwXXzaZB5Vb4FZbLB1QtEggxCnGfoc3XUlTCaMO3l4Hwa9nRnbKjE-prk1',
                    "Content-Type" :'application/json'
                }
              } ; 
            Axios.post('https://fcm.googleapis.com/fcm/send', postObject, config).then(response=>{ console.log("heven in the dogs man" , response)}).catch(err=>{
                console.log("Unable to send the request to firebase" , err) ; 
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
