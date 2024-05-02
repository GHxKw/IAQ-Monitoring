class UserModel {
  String name;
  String email;
  String apiKey;
  String profilePic;
  String createAt;
  String phoneNumer;
  String uid;
  String channelID;
  // String password;

  UserModel({
    required this.name,
    required this.email,
    required this.apiKey,
    required this.profilePic,
    required this.createAt,
    required this.phoneNumer,
    required this.uid,
    required this.channelID,
    // required this.password,
  });
  //from map
  factory UserModel.fromMap(Map<String, dynamic> map) {
    return UserModel(
      name: map['name'] ?? '',
      email: map['email'] ?? '',
      apiKey: map['apiKey'] ?? '',
      profilePic: map['profilePic'] ?? '',
      createAt: map['createAt'] ?? '',
      phoneNumer: map['phoneNumer'] ?? '',
      uid: map['uid'] ?? '',
      channelID: map['channelID'],
      // password: map['password'],
    );
  }
  //to map
  Map<String, dynamic> toMap() {
    return {
      "name": name,
      "email": email,
      "apiKey": apiKey,
      "profilePic": profilePic,
      "createAt": createAt,
      "phoneNumer": phoneNumer,
      "uid": uid,
      "channelID": channelID,
      // "password": password,
    };
  }
}
