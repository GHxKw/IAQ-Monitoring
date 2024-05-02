import 'dart:convert';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class CustomWidget extends StatefulWidget {
  final String type;
  final String apiKey;
  final String channelId;
  final VoidCallback? onTap;

  CustomWidget({
    required this.type,
    required this.apiKey,
    required this.channelId,
    this.onTap,
  });

  @override
  _CustomWidgetState createState() => _CustomWidgetState();
}

class _CustomWidgetState extends State<CustomWidget> {
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    // Fetch data every 4 minutes
    _timer = Timer.periodic(Duration(minutes: 4), (Timer timer) {
      fetchData();
    });
  }

  @override
  void dispose() {
    _timer.cancel(); // Cancel the timer to avoid memory leaks
    super.dispose();
  }

  Future<Map<String, dynamic>> fetchData() async {
    int field;
    String unit;
    switch (widget.type.toLowerCase()) {
      case 'co':
        field = 4;
        unit = 'ppm';
        break;
      case 'co2':
        field = 3;
        unit = 'ppm';
        break;
      case 'pm2.5':
        field = 5;
        unit = 'mg/m³';
        break;
      case 'temperature':
        field = 1;
        unit = '°C';
        break;
      case 'humidity':
        field = 2;
        unit = '%';
        break;
      default:
        field = 1;
        unit = '';
    }

    try {
      final response = await http.get(Uri.parse(
          'https://api.thingspeak.com/channels/${widget.channelId}/fields/$field.json?api_key=${widget.apiKey}&results=1'));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final value = data['feeds'][0]['field$field'].toString();
        return {'value': value, 'unit': unit};
      } else {
        print("Failed to fetch data: ${response.statusCode}");
        return {'value': 'N/A', 'unit': unit};
      }
    } catch (e) {
      print("Error fetching data: $e");
      return {'value': 'N/A', 'unit': unit};
    }
  }

  @override
  Widget build(BuildContext context) {
    // Fetch data initially when the widget is built
    fetchData();

    return FutureBuilder<Map<String, dynamic>>(
      future: fetchData(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return CircularProgressIndicator();
        } else if (snapshot.hasError) {
          return Text('Error: ${snapshot.error}');
        } else {
          final value = snapshot.data?['value'] ?? 'N/A';
          final unit = snapshot.data?['unit'] ?? '';
          return InkWell(
            onTap: widget.onTap,
            child: Card(
              elevation: 4.0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10.0),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.type,
                      style: TextStyle(
                        fontSize: 20.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10.0),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          value,
                          style: TextStyle(
                            fontSize: 32.0,
                            fontWeight: FontWeight.bold,
                            color: Colors.green.shade400,
                          ),
                        ),
                        Text(
                          unit,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18.0,
                            color: Colors.green.shade400,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          );
        }
      },
    );
  }
}
