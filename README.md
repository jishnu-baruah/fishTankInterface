# React Native Arduino Connection App

This is a React Native project that allows you to connect to an ESP based smart automatic fish tank

## Getting Started

1. **Installation**: First, install project dependencies by running:
   ```bash
   npm install
   ```

2. **Update IP Address**: Open `App.tsx` in your text editor and replace `"esp IP address"` with the IP address of your Arduino device. You can find the IP address by uploading a sketch to your ESP32 that includes `Serial.println(WiFi.localIP());`. Refer to this [tutorial](https://randomnerdtutorials.com/esp32-useful-wi-fi-functions-arduino/#:~:text=Wi%2DFi%20connection.-,Get%20ESP32%20IP%20Address,a%20connection%20with%20your%20network.) for detailed instructions.

3. **Connect to Same Network**: Make sure both your ESP device and your mobile device are connected to the same Wi-Fi network.

4. **Start Metro Bundler**: Start the Metro Bundler by running:
   ```bash
   npm start
   ```

5. **Run on Android**: To run the app on an Android device or emulator, use:
   ```bash
   npm run android
   ```
   or

   use 'a' to start building on android


6. **Reload App**: For Android, press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> on Windows/Linux or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> on macOS) to see your changes.

   For iOS, hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes.

## Troubleshooting

If you encounter any issues, refer to the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page of the React Native documentation.

## Learn More

- [React Native Website](https://reactnative.dev): Learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup): Overview of React Native and how to set up your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started): Guided tour of React Native basics.
- [Blog](https://reactnative.dev/blog): Read the latest official React Native blog posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native): Open Source GitHub repository for React Native.

