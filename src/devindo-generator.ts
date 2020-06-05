import * as path from "path";
import * as fs from "fs";

import { InputBoxOptions } from "vscode";
import { IDisposable } from "./disposable.interface";
import { DevindoExistError } from "./errors/devindo-exist.error";
import { VSCodeWindow } from "./vscode.interfaces";

export class DevindoGenerator implements IDisposable {
  private readonly extension = ".dart";
  private readonly devindoFolder = [
    "app",
    "assets",
    "screens",
    "services",
    "utils",
  ];

  // private readonly devindoFile = ["locator", "router", "thid_party_service"];
  private readonly locator = `
  import 'package:get_it/get_it.dart';
  import 'package:injectable/injectable.dart';
  
  import 'locator.iconfig.dart';
  
  final locator = GetIt.instance;
  
  @injectableInit
  void setupLocator() => $initGetIt(locator);;
  `;

  private readonly router = `
  import 'package:auto_route/auto_route_annotations.dart';

  @MaterialAutoRouter()
  class $Router {}
  `;

  private readonly third = `
  import 'package:injectable/injectable.dart';
  import 'package:stacked_services/stacked_services.dart';

  @module
  abstract class ThirdPartyServicesModule {
    @lazySingleton
    NavigationService get navigationService;
    @lazySingleton
    DialogService get dialogService;
    @lazySingleton
    SnackbarService get snackBarService;
  }
  `;
  private readonly depedency = `
  /*
  dependencies:
    flutter:
      sdk: flutter

    cupertino_icons: ^0.1.3
    stacked: ^1.5.5+1
    auto_route:
    stacked_services: ^0.3.2+1
    get_it:
    injectable:
    path_provider: ^1.6.9

  dev_dependencies:
    flutter_test:
      sdk: flutter
    build_runner:
    auto_route_generator:
    injectable_generator:
  */
  `;

  private readonly defaultPath = "lib";

  constructor(private workspaceRoot: string, private window: VSCodeWindow) {}

  async execute(): Promise<void> {
    // prompt for the name of the duck, or the path to create the duck in
    const devindoname: string | undefined = await this.prompt();

    if (!devindoname) {
      return;
    }

    const absoluteDevindoPath: string = this.toAbsolutePath(devindoname);

    try {
      this.create(absoluteDevindoPath);

      this.window.showInformationMessage(
        `Devindo: '${devindoname}' successfully created`
      );
    } catch (err) {
      // log?
      if (err instanceof DevindoExistError) {
        this.window.showErrorMessage(
          `Devindo: '${devindoname}' already exists`
        );
      } else {
        this.window.showErrorMessage(`Error: ${err.message}`);
      }
    }
  }

  async prompt(): Promise<string | undefined> {
    // this can be abstracted out as an argument for prompt
    const options: InputBoxOptions = {
      ignoreFocusOut: true,
      prompt: `Devindo name: 'some_devindo', or a relative path: 'lib/'`,
      placeHolder: "mvvm",
      validateInput: this.validate,
    };

    return await this.window.showInputBox(options);
  }

  create(absoluteDevindoPath: string) {
    if (fs.existsSync(absoluteDevindoPath)) {
      const devindo: string = path.basename(absoluteDevindoPath);

      throw new DevindoExistError(`'${devindo}' already exists`);
    }

    try {
      // create the directory
      fs.mkdirSync(absoluteDevindoPath);

      this.devindoFolder.forEach((file: string) => {
        const fullpath = path.join(absoluteDevindoPath, file);
        fs.mkdirSync(fullpath, `/* ${file} */`);
      });

      const pathlocator = path.join(`${absoluteDevindoPath}/services`, "locator.dart");
      fs.writeFileSync(pathlocator, this.locator, `/* ${pathlocator} */`);
      const pathrouter = path.join(`${absoluteDevindoPath}/services`, "router.dart");
      fs.writeFileSync(pathrouter, this.router, `/* ${pathrouter} */`);
      const paththird = path.join(`${absoluteDevindoPath}/services`, "thid_party_app.dart");
      fs.writeFileSync(paththird, this.third, `/* ${paththird} */`);
      const depedency = path.join(
        absoluteDevindoPath,
        "depedency_need_to_remove.dart"
      );
      fs.writeFileSync(depedency, this.depedency, `/* ${depedency} */`);
    } catch (err) {
      // log other than console?
      console.log("Error", err.message);

      throw err;
    }
  }

  validate(name: string): string | null {
    if (!name) {
      return "Name is required";
    }

    if (name.includes(" ")) {
      return "Spaces are not allowed";
    }

    // no errors
    return null;
  }

  toAbsolutePath(nameOrRelativePath: string): string {
    // simple test for slashes in string
    if (/\/|\\/.test(nameOrRelativePath)) {
      return path.resolve(this.workspaceRoot, nameOrRelativePath);
    }
    // if it's just the name of the duck, assume that it'll be in 'src/state/ducks/'
    return path.resolve(
      this.workspaceRoot,
      this.defaultPath,
      nameOrRelativePath
    );
  }

  dispose(): void {
    console.log("disposing...");
  }
}
