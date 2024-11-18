export class Regex {
  static readonly email =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  static readonly letterUpperCase = /[A-Z]/;

  static readonly number = /\d/;

  static readonly specialCharacter = /[!@#$%^&*(),.?":{}|<>]/;
}
