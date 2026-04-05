import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/booking_provider.dart';
import 'package:intl/intl.dart';

class BookingScreen extends StatefulWidget {
  final Map<String, dynamic> service;

  const BookingScreen({super.key, required this.service});

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1));
  TimeOfDay _selectedTime = const TimeOfDay(hour: 10, minute: 0);

  Future<void> _handleBooking() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final booking = Provider.of<BookingProvider>(context, listen: false);

    final scheduledDate = DateTime(
      _selectedDate.year,
      _selectedDate.month,
      _selectedDate.day,
      _selectedTime.hour,
      _selectedTime.minute,
    );

    final success = await booking.createBooking(
      auth.token!,
      widget.service['_id'],
      scheduledDate,
    );

    if (mounted && success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Booking Successful!'),
            backgroundColor: Colors.green),
      );
      Navigator.of(context).pop();
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Failed to create booking.'),
            backgroundColor: Colors.red),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    bool isLoading = Provider.of<BookingProvider>(context).isLoading;

    return Scaffold(
      appBar: AppBar(
        title: Text('Book ${widget.service['name']}'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.blueAccent.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    Text(
                      '\$${widget.service['price']}',
                      style: const TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: Colors.blueAccent),
                    ),
                    const Text('Price per session',
                        style: TextStyle(color: Colors.grey)),
                    const SizedBox(height: 12),
                    const Divider(),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Column(
                          children: [
                            const Text('Duration',
                                style: TextStyle(
                                    color: Colors.grey, fontSize: 12)),
                            Text(widget.service['duration'].toString(),
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const Column(
                          children: [
                            Text('Specialist',
                                style: TextStyle(
                                    color: Colors.grey, fontSize: 12)),
                            Text('Expert Tech Lead',
                                style: TextStyle(fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              const Text('Pick a Date & Time',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              ListTile(
                title: const Text('Date'),
                subtitle:
                    Text(DateFormat('EEEE, MMM d, yyyy').format(_selectedDate)),
                trailing: const Icon(Icons.edit_calendar),
                tileColor: Colors.grey.withOpacity(0.05),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                onTap: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate: _selectedDate,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 90)),
                  );
                  if (date != null) setState(() => _selectedDate = date);
                },
              ),
              const SizedBox(height: 12),
              ListTile(
                title: const Text('Time'),
                subtitle: Text(_selectedTime.format(context)),
                trailing: const Icon(Icons.timer_outlined),
                tileColor: Colors.grey.withOpacity(0.05),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                onTap: () async {
                  final time = await showTimePicker(
                      context: context, initialTime: _selectedTime);
                  if (time != null) setState(() => _selectedTime = time);
                },
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: isLoading ? null : _handleBooking,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blueAccent,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16)),
                ),
                child: isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Confirm Booking',
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
