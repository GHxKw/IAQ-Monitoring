import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

void showSnackBar(BuildContext context, String content) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(content),
    ),
  );
}

Future<File?> pickImage(BuildContext context) async {
  File? image;
  try {
    final pickedImage = await FilePicker.platform.pickFiles();
    if (pickedImage != null) {
      image = pickedImage as File?;
    }
  } catch (e) {
    showSnackBar(context, e.toString());
  }
  return image;
}
