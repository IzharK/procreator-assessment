import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/booking_provider.dart';
import 'package:intl/intl.dart';

class MyBookingsScreen extends StatefulWidget {
  const MyBookingsScreen({super.key});

  @override
  State<MyBookingsScreen> createState() => _MyBookingsScreenState();
}

class _MyBookingsScreenState extends State<MyBookingsScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      Provider.of<BookingProvider>(context, listen: false)
          .fetchMyBookings(auth.token!);
    });
  }

  @override
  Widget build(BuildContext context) {
    final bookingProvider = Provider.of<BookingProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Bookings',
            style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: bookingProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : bookingProvider.bookings.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.calendar_today_outlined,
                          size: 64, color: Colors.grey[300]),
                      const SizedBox(height: 16),
                      const Text('No bookings found',
                          style: TextStyle(color: Colors.grey)),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: bookingProvider.bookings.length,
                  itemBuilder: (context, index) {
                    final booking = bookingProvider.bookings[index];
                    final date = DateTime.parse(booking['date']);
                    final status = booking['status'] ?? 'pending';

                    return Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.blueAccent.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.event_available,
                                color: Colors.blueAccent),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  booking['service']['name'] ?? 'Service',
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16),
                                ),
                                Text(
                                  DateFormat('MMM d, yyyy • h:mm a')
                                      .format(date),
                                  style: const TextStyle(
                                      color: Colors.grey, fontSize: 13),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: status == 'confirmed'
                                  ? Colors.green[50]
                                  : Colors.orange[50],
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              status.toUpperCase(),
                              style: TextStyle(
                                color: status == 'confirmed'
                                    ? Colors.green
                                    : Colors.orange,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
    );
  }
}
