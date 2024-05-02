import 'package:flutter/material.dart';
import 'package:mobile_thesis/charts/co2_chart.dart';
import 'package:mobile_thesis/charts/co_chart.dart';
import 'package:mobile_thesis/charts/humidity_chart.dart';
import 'package:mobile_thesis/charts/pm25_chart.dart';
import 'package:mobile_thesis/charts/temp_chart.dart';
import 'package:mobile_thesis/provider/auth_provider.dart';
import 'package:mobile_thesis/screens/welcome_screen.dart';
import 'package:mobile_thesis/widgets/custom_widget.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    final ap = Provider.of<AuthProvider>(context, listen: false);
    return Scaffold(
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            UserAccountsDrawerHeader(
              currentAccountPicture: CircleAvatar(
                backgroundImage: NetworkImage(ap.userModel.profilePic),
              ),
              accountEmail: Text(ap.userModel.email), // Display user's email
              accountName: Text(ap.userModel.name),
              decoration: BoxDecoration(
                color: Colors.green.shade400,
              ),
            ),
            ListTile(
              leading: const Icon(Icons.home),
              title: const Text(
                'Home',
                style: TextStyle(fontSize: 24.0),
              ),
              onTap: () {
                MaterialPageRoute(
                  builder: (context) => const HomeScreen(),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.notifications),
              title: const Text(
                'Notifications',
                style: TextStyle(fontSize: 24.0),
              ),
              onTap: () {
                // Handle Notifications onTap
              },
            ),
            ListTile(
              leading: const Icon(Icons.logout),
              title: const Text(
                'Logout',
                style: TextStyle(fontSize: 24.0),
              ),
              onTap: () async {
                // Navigate to Welcome Screen
                ap.userSignOut().then(
                      (value) => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const WelcomeScreen(),
                        ),
                      ),
                    );
              },
            ),
          ],
        ),
      ),
      appBar: AppBar(
        backgroundColor: Colors.green.shade800,
        title: const Text("Indoor Air Quality Index"),
      ),
      body: Center(
          child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        //display the thingspeak data here
        children: [
          CustomWidget(
              type: "Temperature",
              apiKey: ap.userModel.apiKey,
              channelId: ap.userModel.channelID,
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => TemperatureChartPage(
                          apiKey: ap.userModel.apiKey,
                          channelId: ap.userModel.channelID,
                          type: "Temperature")))),
          CustomWidget(
              type: "Humidity",
              apiKey: ap.userModel.apiKey,
              channelId: ap.userModel.channelID,
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => HumidityChartPage(
                          apiKey: ap.userModel.apiKey,
                          channelId: ap.userModel.channelID,
                          type: "Humidity")))),
          CustomWidget(
              type: "CO",
              apiKey: ap.userModel.apiKey,
              channelId: ap.userModel.channelID,
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => COChartPage(
                          apiKey: ap.userModel.apiKey,
                          channelId: ap.userModel.channelID,
                          type: "CO")))),
          CustomWidget(
              type: "CO2",
              apiKey: ap.userModel.apiKey,
              channelId: ap.userModel.channelID,
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => CO2ChartPage(
                          apiKey: ap.userModel.apiKey,
                          channelId: ap.userModel.channelID,
                          type: "CO2")))),
          CustomWidget(
              type: "PM2.5",
              apiKey: ap.userModel.apiKey,
              channelId: ap.userModel.channelID,
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => PM25ChartPage(
                          apiKey: ap.userModel.apiKey,
                          channelId: ap.userModel.channelID,
                          type: "PM2.5")))),
        ],
      )),
    );
  }
}
