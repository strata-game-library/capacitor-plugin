# Installation

## Requirements

- Node.js 18+
- [Capacitor](https://capacitorjs.com/) 6+
- Strata 3D 1.4+

## Install from NPM

```bash
npm install @jbcom/strata-capacitor-plugin
npx cap sync
```

## Platform-Specific Setup

### iOS

1. Run `npx cap open ios`
2. Ensure the `StrataPlugin.swift` and `StrataPlugin.m` are included in your project.

### Android

1. Run `npx cap open android`
2. Register the plugin in your `MainActivity.java` if using Capacitor 2/3, otherwise it's auto-registered in Capacitor 4+.

```java
import com.jbcom.plugins.strata.StrataPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // ...
    }
}
```
