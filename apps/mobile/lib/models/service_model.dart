class ServiceModel {
  final String id;
  final String name;
  final String description;
  final int duration;
  final double price;

  ServiceModel({
    required this.id,
    required this.name,
    required this.description,
    required this.duration,
    required this.price,
  });

  factory ServiceModel.fromJson(Map<String, dynamic> json) {
    return ServiceModel(
      id: json['_id'],
      name: json['name'],
      description: json['description'],
      duration: json['duration'],
      price: json['price'].toDouble(),
    );
  }
}
