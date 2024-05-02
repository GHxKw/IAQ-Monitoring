import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:mobile_thesis/model/user_model.dart';
import 'package:mobile_thesis/provider/auth_provider.dart';
import 'package:mobile_thesis/screens/home_screen.dart';
import 'package:mobile_thesis/utils/utils.dart';
import 'package:mobile_thesis/widgets/custom_button.dart';
import 'package:provider/provider.dart';

class UserInformationScreen extends StatefulWidget {
  const UserInformationScreen({super.key});

  @override
  State<UserInformationScreen> createState() => _UserInformationScreenState();
}

class _UserInformationScreenState extends State<UserInformationScreen> {
  File? image;
  PlatformFile? file;
  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final apiKeyController = TextEditingController();
  final channelIDController = TextEditingController();
  final passwordController = TextEditingController();

  @override
  void dispose() {
    super.dispose();
    nameController.dispose();
    emailController.dispose();
    apiKeyController.dispose();
  }

  // //for getting the image
  // void selectImage() async {
  //   image = await pickImage(context);
  //   setState(() {});
  // }

  //for getting files
  void selectFile() async {
    final result = await FilePicker.platform.pickFiles();
    if (result == null) return;
    setState(() {
      file = result.files.first;
      image = File(file!.path!);
    });
  }

  @override
  Widget build(BuildContext context) {
    final isLoading =
        Provider.of<AuthProvider>(context, listen: true).isLoading;
    return Scaffold(
      body: SafeArea(
        child: isLoading == true
            ? const Center(
                child: CircularProgressIndicator(
                  color: Colors.green,
                ),
              )
            : SingleChildScrollView(
                padding:
                    const EdgeInsets.symmetric(vertical: 25, horizontal: 5),
                child: Center(
                  child: Column(
                    children: [
                      InkWell(
                        onTap: () => selectFile(),
                        child: image == null
                            ? const CircleAvatar(
                                backgroundColor: Colors.green,
                                radius: 50,
                                child: Icon(
                                  Icons.account_circle,
                                  size: 50,
                                  color: Colors.white,
                                ),
                              )
                            : CircleAvatar(
                                backgroundImage: FileImage(image!),
                                radius: 50,
                              ),
                      ),
                      Container(
                        width: MediaQuery.of(context).size.width,
                        padding: const EdgeInsets.symmetric(
                            vertical: 5, horizontal: 15),
                        margin: const EdgeInsets.only(top: 20),
                        child: Column(children: [
                          //name field
                          textField(
                            isPassword: false,
                            hintText: "UserName",
                            icon: Icons.account_circle,
                            inputType: TextInputType.name,
                            maxLines: 1,
                            controller: nameController,
                          ),
                          //email field
                          textField(
                            isPassword: false,
                            hintText: "youremail@example.com",
                            icon: Icons.email,
                            inputType: TextInputType.emailAddress,
                            maxLines: 1,
                            controller: emailController,
                          ),
                          //API
                          textField(
                            isPassword: false,
                            hintText: "Your API key",
                            icon: Icons.key,
                            inputType: TextInputType.name,
                            maxLines: 1,
                            controller: apiKeyController,
                          ),
                          //ChannelId
                          textField(
                            isPassword: false,
                            hintText: "Your ChannelID",
                            icon: Icons.wifi,
                            inputType: TextInputType.name,
                            maxLines: 1,
                            controller: channelIDController,
                          ),
                          // //Password
                          // textField(
                          //   isPassword: true,
                          //   hintText: "Your Password",
                          //   icon: Icons.lock,
                          //   inputType: TextInputType.name,
                          //   maxLines: 1,
                          //   controller: passwordController,
                          // ),
                        ]),
                      ),
                      const SizedBox(height: 20),
                      SizedBox(
                        height: 50,
                        width: MediaQuery.of(context).size.width * 0.9,
                        child: CustomButton(
                          text: "Continue",
                          onPressed: () => storeData(),
                        ),
                      )
                    ],
                  ),
                ),
              ),
      ),
    );
  }

  Widget textField(
      {required hintText,
      required IconData icon,
      required TextInputType inputType,
      required int maxLines,
      required bool isPassword,
      required TextEditingController controller}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: TextFormField(
        obscureText: isPassword,
        cursorColor: Colors.green.shade900,
        controller: controller,
        keyboardType: inputType,
        maxLines: maxLines,
        decoration: InputDecoration(
          prefixIcon: Container(
            margin: const EdgeInsets.all(9),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              color: Colors.green.shade600,
            ),
            child: Icon(
              icon,
              size: 20,
              color: Colors.white,
            ),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(
              color: Colors.transparent,
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(
              color: Colors.transparent,
            ),
          ),
          hintText: hintText,
          alignLabelWithHint: true,
          border: InputBorder.none,
          fillColor: Colors.green.shade200,
          filled: true,
        ),
      ),
    );
  }

  //Store user data to db
  void storeData() async {
    final ap = Provider.of<AuthProvider>(context, listen: false);
    UserModel userModel = UserModel(
      name: nameController.text.trim(),
      email: emailController.text.trim(),
      apiKey: apiKeyController.text.trim(),
      profilePic: "",
      createAt: "",
      phoneNumer: "",
      uid: "",
      channelID: channelIDController.text.trim(),
      // password: passwordController.text.trim(),
    );

    // ap.saveUserDataToFireBase(
    //   context: context,
    //   userModel: userModel,
    //   profilePic: image!,
    //   onSuccess: () {
    //     //once data is saved we need to store it locally
    //     ap.saveUserDataToSP().then(
    //           (value) => ap.setSignIn().then(
    //                 (value) => Navigator.pushAndRemoveUntil(
    //                     context,
    //                     MaterialPageRoute(
    //                         builder: (context) => const HomeScreen()),
    //                     (route) => false),
    //               ),
    //         );
    //   },
    // );

    if (image != null) {
      ap.saveUserDataToFireBase(
        context: context,
        userModel: userModel,
        profilePic: image!,
        onSuccess: () {
          //once data is saved we need to store it locally
          ap.saveUserDataToSP().then(
                (value) => ap.setSignIn().then(
                      (value) => Navigator.pushAndRemoveUntil(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const HomeScreen()),
                          (route) => false),
                    ),
              );
        },
      );
    } else {
      showSnackBar(context, "Please include a Profile Photo");
    }
  }
}
