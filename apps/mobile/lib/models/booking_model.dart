import 'service_model.dart';

class BookingModel {
  final String id;
  final String userId;
  final ServiceModel service;
  final DateTime date;
  final String status;

  BookingModel({
    required this.id,
    required this.userId,
    required this.service,
    required this.date,
    required this.status,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['_id'],
      userId: json['user'] is String ? json['user'] : json['user']['_id'],
      service: ServiceModel.fromJson(json['service']),
      date: DateTime.parse(json['date']),
      status: json['status'],
    );
  }
}
