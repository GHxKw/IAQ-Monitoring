import 'dart:async';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class TemperatureChartPage extends StatefulWidget {
  final String apiKey;
  final String channelId;
  final String type;

  TemperatureChartPage({
    required this.apiKey,
    required this.channelId,
    required this.type,
  });

  @override
  _TemperatureChartPageState createState() => _TemperatureChartPageState();
}

class _TemperatureChartPageState extends State<TemperatureChartPage> {
  List<FlSpot> _seriesData = [];

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final response = await http.get(Uri.parse(
        'https://api.thingspeak.com/channels/${widget.channelId}/fields/1.json?api_key=${widget.apiKey}&results=20'));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final feeds = data['feeds'] as List;

      setState(() {
        _seriesData = feeds
            .asMap()
            .entries
            .map((entry) => FlSpot(
                entry.key.toDouble(), double.parse(entry.value['field1'])))
            .toList();
      });
    } else {
      print("Failed to fetch data: ${response.statusCode}");
    }
  }

  String getHealthEffect(double temperature) {
    if (temperature <= 15) {
      return 'Low';
    } else if (temperature <= 25) {
      return 'Moderate';
    } else if (temperature <= 35) {
      return 'High';
    } else {
      return 'Very High';
    }
  }

  String getHealthEffectDescription(double temperature) {
    if (temperature <= 15) {
      return 'Too cold, risk of hypothermia';
    } else if (temperature <= 25) {
      return 'Comfortable range for most people';
    } else if (temperature <= 35) {
      return 'May feel warm, use caution';
    } else {
      return 'Too hot, risk of heat-related illness';
    }
  }

  @override
  Widget build(BuildContext context) {
    List<double> measureValues = _seriesData.map((spot) => spot.y).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.type} Chart'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsetsDirectional.only(
              start: 10, end: 10, top: 50, bottom: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                padding: const EdgeInsets.all(5),
                width: double.infinity,
                height: 300,
                child: LineChart(
                  LineChartData(
                    backgroundColor: Colors.blue[50],
                    borderData: FlBorderData(show: false),
                    lineBarsData: [
                      LineChartBarData(
                          color: Colors.green[400],
                          spots: _seriesData,
                          isCurved: false,
                          belowBarData: BarAreaData(
                            show: true,
                            color: Colors.green[200],
                          )),
                    ],
                    minY: 20,
                    maxY: 40,
                    titlesData: FlTitlesData(
                      show: true,
                      rightTitles:
                          AxisTitles(sideTitles: SideTitles(showTitles: false)),
                      topTitles:
                          AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    ),
                  ),
                ),
              ),
              Divider(
                color: Colors.blue,
                height: 30,
                thickness: 5,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (measureValues.isNotEmpty)
                    Text(
                      'Latest ${widget.type}: ${measureValues.last.toStringAsPrecision(3)}°C',
                      style: const TextStyle(
                        fontSize: 25.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.green,
                      ),
                    ),
                  const Text(
                    '°C',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18.0,
                      color: Colors.blue,
                    ),
                  ),
                ],
              ),
              Column(
                children: [
                  Divider(
                    color: Colors.blue,
                    height: 30,
                    thickness: 5,
                  ),
                  Text('Health Effects'),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: DataTable(
                      columns: [
                        DataColumn(label: Text('${widget.type} (°C)')),
                        DataColumn(label: Text('IAQI')),
                        DataColumn(label: Text('Classification')),
                      ],
                      rows: [
                        DataRow(
                          cells: [
                            DataCell(Text('24-26')),
                            DataCell(Text('A (0-20)')),
                            DataCell(Text('Good')),
                          ],
                          color: MaterialStateColor.resolveWith((states) =>
                              Colors.blue), // Set background color for row 1
                        ),
                        DataRow(
                          cells: [
                            DataCell(Text('22–24; 26–27')),
                            DataCell(Text('B (21–40)')),
                            DataCell(Text('Moderate')),
                          ],
                          color: MaterialStateColor.resolveWith((states) =>
                              Colors.green), // Set background color for row 2
                        ),
                        DataRow(
                          cells: [
                            DataCell(Text('21–22; 27–29')),
                            DataCell(Text('C (41–60)')),
                            DataCell(Text('Unhealthy for sensitive groups')),
                          ],
                          color: MaterialStateColor.resolveWith((states) =>
                              Colors.yellow), // Set background color for row 3
                        ),
                        DataRow(
                          cells: [
                            DataCell(Text('20–21; 29–30 ')),
                            DataCell(Text('D (61–80)')),
                            DataCell(Text('Bad ')),
                          ],
                          color: MaterialStateColor.resolveWith((states) =>
                              Colors.orange), // Set background color for row 4
                        ),
                        DataRow(
                          cells: [
                            DataCell(Text('<20; >30')),
                            DataCell(Text('E (81–100)')),
                            DataCell(Text('Hazardous')),
                          ],
                          color: MaterialStateColor.resolveWith((states) =>
                              Colors.red), // Set background color for row 4
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
