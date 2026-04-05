import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider with ChangeNotifier {
  String? _token;
  String? _userId;
  String? _userName;
  bool _isLoading = false;
  String? _errorMessage;

  bool get isAuth => _token != null;
  String? get token => _token;
  bool get isLoading => _isLoading;
  String? get userName => _userName;
  String? get errorMessage => _errorMessage;

  final String _baseUrl = 'https://service-booking-api-nzje.onrender.com/api/auth';

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email, 'password': password}),
      );

      final responseData = json.decode(response.body);
      if (response.statusCode == 200) {
        _token = responseData['token'];
        _userId = responseData['_id'];
        _userName = responseData['name'];
        _errorMessage = null;

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(
            'userData',
            json.encode({
              'token': _token,
              'userId': _userId,
              'name': _userName,
            }));

        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = responseData['message'] ?? 'Login failed';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (error) {
      _errorMessage = 'Connection error. Ensure backend is running.';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> signup(String name, String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/signup'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'name': name,
          'email': email,
          'password': password,
          'role': 'user'
        }),
      );

      final responseData = json.decode(response.body);
      log('response for signup: $responseData');
      if (response.statusCode == 201) {
        _token = responseData['token'];
        _userId = responseData['_id'];
        _userName = responseData['name'];

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(
            'userData',
            json.encode({
              'token': _token,
              'userId': _userId,
              'name': _userName,
            }));

        _errorMessage = null;
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = responseData['message'] ?? 'Signup failed';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (error) {
      _errorMessage = 'Connection error. Ensure backend is running.';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    _token = null;
    _userId = null;
    _userName = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    notifyListeners();
  }
}
