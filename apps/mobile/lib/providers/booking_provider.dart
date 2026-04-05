import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class BookingProvider with ChangeNotifier {
  List<dynamic> _services = [];
  List<dynamic> _bookings = [];
  bool _isLoading = false;

  List<dynamic> get services => _services;
  List<dynamic> get bookings => _bookings;
  bool get isLoading => _isLoading;

  final String _baseUrl = 'https://service-booking-api-nzje.onrender.com/api';

  Future<void> fetchServices() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await http.get(Uri.parse('$_baseUrl/services'));
      if (response.statusCode == 200) {
        _services = json.decode(response.body);
      }
    } catch (error) {
      print(error);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchMyBookings(String token) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/bookings/mybookings'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        _bookings = json.decode(response.body);
      }
    } catch (error) {
      print(error);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createBooking(
      String token, String serviceId, DateTime date) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/bookings'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'service': serviceId,
          'date': date.toIso8601String(),
        }),
      );

      if (response.statusCode == 201) {
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (error) {
      print(error);
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }
}
