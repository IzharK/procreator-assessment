import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  Future<void> _submitLogin() async {
    if (!_formKey.currentState!.validate()) return;

    final success =
        await Provider.of<AuthProvider>(context, listen: false).login(
      _emailController.text,
      _passwordController.text,
    );

    if (mounted && success) {
      Navigator.of(context).pushReplacementNamed('/home');
    } else if (mounted) {
      final errorMsg = Provider.of<AuthProvider>(context, listen: false).errorMessage;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(errorMsg ?? 'Login Failed. Please try again.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    bool isLoading = Provider.of<AuthProvider>(context).isLoading;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Icon(Icons.calendar_month_rounded,
                    size: 80, color: Colors.blueAccent),
                const SizedBox(height: 16),
                const Text(
                  'Service Booking',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
                ),
                const Text(
                  'Sign in to your account',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey, fontSize: 16),
                ),
                const SizedBox(height: 48),
                TextFormField(
                  controller: _emailController,
                  decoration: const InputDecoration(
                    labelText: 'Email Address',
                    prefixIcon: Icon(Icons.email_outlined),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.all(Radius.circular(12))),
                  ),
                  validator: (value) =>
                      value!.isEmpty ? 'Enter valid email' : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Password',
                    prefixIcon: Icon(Icons.lock_outline),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.all(Radius.circular(12))),
                  ),
                  validator: (value) =>
                      value!.isEmpty ? 'Enter password' : null,
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: isLoading ? null : _submitLogin,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blueAccent,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Login',
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold)),
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => Navigator.of(context).pushNamed('/signup'),
                  child: const Text('New user? Create an account',
                      style: TextStyle(color: Colors.blueAccent)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
