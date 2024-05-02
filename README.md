# Guide to install and run the IAQ Monitoring system:
*Bellow will the guide on how to install, setup and run the IAQ system:*
## Setup:
###  Apps need to install:

+ CubeMX IDE
+ Arduino IDE
+ VS code IDE
+ Android Studio

###  Hardwares: 

+ **Sensors**: MQ135, MQ7, DHT11, GP2Y10
+ **Microcontrollers**: STM32F429I-DISC1, ESP8266 NodeMCU
+ **Raspberry Pi**
+ **Jumpwires, Breadboards, etc.**

###  Platform: 
+ **Thingspeak**
+ **Firebase**

### Assembling:
+ Assemble the hardwares like the schematic provided in the **thesis**
+ Open the project from the **STM32** folder into the STM32F429I-DISC1 using CubeMX IDE
+ Load code trom the **NodeMCU** folder into the ESP8266 NodeMCU using Arduino IDE
+ Install and setup the **Thingsboard** on to the **Raspberry Pi**
+ Create the **Firebase** and **Thingspeak** account.
+ Edit your **Firebase database sdk** and **your google-service.json** into the code
+ Edit into the code your Thingspeak **write/read API** and **channel ID**

## Running:

### How to run:
+ First let the microcontroller and the sensors run for some time
+ The setup of hardware will update the air quality once every **4 minute** you can validate if the hardware is running correctly via the Thingspeak or Thingsboard *telementary*
+ Webservice:

	+ Open the VS code, go to the project folder terminal and run `npm install` to download all the dependencies
	+ Run `yarn start` or `npm start`
	+ The local host is `http://localhost:8080/`

+ Mobile:

	 + On VS code, go to the project folder terminal and run `flutter run`

	+ Or on the Android Studio IDE, you can click the start button on the IDE

+ Raspberry Pi:

	+ Open terminal and run `sudo service thingsboard start`

	+ The Thingsboard is hosted on `http://localhost:8080/`

	+ You can access to 3 already made account from Thingsboard:

		`System Administrator: sysadmin@thingsboard.org / sysadmin`

		`Tenant Administrator: tenant@thingsboard.org / tenant`

		`Customer User: customer@thingsboard.org / customer`

***You should be good to go!***
