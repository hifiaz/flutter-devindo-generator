# Devindo Generator

This package will generate folder and file

```bash
depedency_need_to_remove.dart
app
    - router.dart
    - locator.dart
    - thid_party_app
assets
screens
services
utils
```

## How to use

Open the command palette (macOS: Shift+Command+P, Windows: Ctrl+Shift+P) and type, "Generate Devindo."

```bash
flutter pub run build_runner build --delete-conflicting-outputs
``` 
in pubspec.yaml

```bash
dependencies:
  flutter:
    sdk: flutter

  cupertino_icons: ^0.1.3
  stacked: 
  auto_route:
  stacked_services: 
  get_it:
  injectable:
  path_provider: 

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner:
  auto_route_generator:
  injectable_generator:
```

Option when you getting message when do pub run build_runner add
```bash
dependency_overrides:
  analyzer: '0.39.14'
```



## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.


## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.5

Initial release of generator flutter devindo


-----------------------------------------------------------------------------------------------------------

### For more information or contact

* [Twitter](http://twitter.com/hifiaz)

**Enjoy!**
