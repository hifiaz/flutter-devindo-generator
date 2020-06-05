export class DevindoExistError extends Error {
  constructor(message: string = "Devindo already exists") {
    super(message);

    this.name = "DevindoExistError";
  }
}
