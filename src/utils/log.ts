import colors from "colors/safe";
import { getCurrentTime } from "./getCurrentTime";

export function logInfo(subject: string, message: string) {
  console.log(
    colors.gray(`${getCurrentTime()} `) +
      colors.blue(`[${subject.toUpperCase()}] `) +
      `${message}`
  );
}

export function logSuccess(subject: string, message: string) {
  console.log(
    colors.gray(`${getCurrentTime()} `) +
      colors.green(`[${subject.toUpperCase()}] `) +
      `${message}`
  );
}

export function logWarn(subject: string, message: string) {
  console.log(
    colors.gray(`${getCurrentTime()} `) +
      colors.yellow(`[${subject.toUpperCase()}] `) +
      `${message}`
  );
}

export function logError(subject: string, message: string) {
  console.log(
    colors.gray(`${getCurrentTime()} `) +
      colors.red(`[${subject.toUpperCase()}] `) +
      `${message}`
  );
}
