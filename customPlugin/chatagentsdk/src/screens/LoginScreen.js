// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
// } from 'react-native';

//   function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     // Handle login logic
//   };

//   const handleForgotPassword = () => {
//     // Handle forgot password logic
//   };

//   return (
//     <View style={styles.container}>
//       <Image source={require('../../assets/logo.png')} style={styles.logo} />
//       <View style={styles.form}>
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//           autoCapitalize="none"
//           keyboardType="email-address"
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />
//         <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
//           <Text style={styles.submitButtonText}>Login</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.forgotPasswordButton}
//           onPress={handleForgotPassword}>
//           <Text style={styles.forgotPasswordButtonText}>Forgot password?</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FFF',
//   },
//   logo: {
//     width: 200,
//     height: 200,
//     marginBottom: 40,
//   },
//   form: {
//     width: '80%',
//   },
//   input: {
//     backgroundColor: '#F2F2F2',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   submitButton: {
//     backgroundColor: '#217eac',
//     padding: 10,
//     borderRadius: 10,
//     marginTop: 10,
//   },
//   submitButtonText: {
//     color: '#FFF',
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   forgotPasswordButton: {
//     alignSelf: 'flex-end',
//     marginTop: 10,
//   },
//   forgotPasswordButtonText: {
//     color: '#007AFF',
//     fontSize: 14,
//     textDecorationLine: 'underline',
//   },
// });
