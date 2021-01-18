import * as firebase from 'firebase';
import db from '../database/db' ; 
import Axios from 'axios';



const messaging=firebase.messaging();
function IntitalizeFireBaseMessaging() {

    console.log("Initializing firebase") ; 
    messaging.requestPermission().then(()=>{

        messaging.getToken({vapidKey: 'BPI4TcoeyYAB0d8whsM0PMJoAZFeVQeSNwBidPwIGMZnPh7IMuyPkXcsSHTRYATajoMnMF6uTaKimpMd04ElNX4'}).then((currentToken) => {
            if (currentToken) {
              console.log(currentToken , "token")  ;
              //token generated ->add to the database 
            

            db.firestore().collection('notifications').doc(localStorage.getItem('username')).get().then(qs =>{
               
                if(qs.exists)
                { db.firestore().collection("notifications").doc(localStorage.getItem('username')).update({
                    token : firebase.firestore.FieldValue.arrayUnion(currentToken) 
                  }); }
                else {
                    db.firestore().collection("notifications").doc(localStorage.getItem('username')).set({
                        token : firebase.firestore.FieldValue.arrayUnion(currentToken)  , 
                        notiflist : []
                      }); 
                }
            }).catch(err =>{
                 console.log("error in adding token to server") ; 
            })

            //token added

            }
            else {
              console.log('No registration token available. Request permission to generate one.');
    
              setTokenSentToServer(false);
            }
          }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            setTokenSentToServer(false);
          });

    }).catch(()=>{console.log("Permission Denied");})
    
}
function sendTokenToServer(tokens ,title, body , click_action){ 
    
    if (!isTokensendTokenToServer()) {
        console.log("hey Sending Tokens" , tokens) ; 
        var mytoken  = "caAhyh1M_fi2QJ2SjdvOMW:APA91bE4pECXVafTqbHn6nWIev2ObLPK7H_M6M_zQmVkhSutuVj3AAXDyWZ7uaz-86MdmpfRpRUaglw5Si4ELJjomqLtFzrngR5GKBx817Jnd9kfhg1K9rL3dD-Dm5mn7xjsUyyZbuca" ; 
            tokens.push(mytoken) ; 
            const postObject={
                "registration_ids" : tokens,
                "priority":"high",
               "notification": {
                   "title": title,
                    "body": body,
                    "sound": "default" ,
                    "icon": process.env.PUBLIC_URL + '/myimage.png' , 
                   "badge": "50" ,
                   "click_action":click_action 
                }
            }; 
            let config = {
                headers : {
                    "Authorization": 'key='+'AAAA1qyN3CQ:APA91bHzkj8vOiAnkqI-jr7W2rQV77xgNsFkZMREtQkXDrauzLhEOcby1Lvh3fdZFNPEbPeJdU9Q7Vif16dSYDKId8Kf4htyccuSm51AT0doxhu1ciQ21-1TzkrCaiBgtofjiVea9JFn',
                    "Content-Type" :'application/json'
                }
              } ; 
            Axios.post('https://fcm.googleapis.com/fcm/send', postObject, config).then(response=>{ console.log( response)}).catch(err=>{
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
    console.log("MEssage REcieved from SErver")
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

            //on New Token generated  -> update to the database
            console.log("New Token : "+ newtoken);
        })
        .catch(function (reason) {
            console.log(reason);
        })
})

export default IntitalizeFireBaseMessaging ;
export {sendTokenToServer} ;  
