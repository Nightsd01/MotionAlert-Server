# MotionAlert-Server
MotionAlert Server is a node.js based server that accepts HTTP requests from cameras using the MotionEye interface (usually Raspberry Pi’s) and sends push notifications to iOS devices using the [MotionAlert app](https://github.com/Nightsd01/MotionAlert).

First, follow [Apple’s APNS guide](https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1) and create a valid APNS certificate for the app. Once you have this APNS certificate in your keychain, follow [this guide](https://blog.krishan711.com/generating-ios-push-certificates) to extract cert.pem and key.pem files to allow this server to authenticate with the APNS system.  Place the .pem files in the certs/ directory of this project.

Finally, you can run the project using the command `node .` in the project folder.

To finish configuring push notifications, we need to configure your raspberry pi’s MotionEye software to send a GET request to this server. To do this, go to the MotionEye configuration page and log in with your admin credentials. In the “Motion Notifications” section, enable the ‘call a web hook’ option and set it to the address of this server.

<p align="center">
  <img src=motionEyeConfig.png width="350"/>
</p>

The specific path of the web hook should be http://thisserver:3001/motionDetected/someCameraNameHere

The last part of the web hook address will be some name you give your camera, like ‘LivingRoomCamera’.
