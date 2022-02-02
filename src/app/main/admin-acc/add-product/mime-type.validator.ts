import {AbstractControl} from "@angular/forms";
import {Observable, Observer} from "rxjs";

export const mimeTypeValidator = (control: AbstractControl): Promise<{ [key: string]: any } | null> | Observable<{ [key: string]: any } | null> => {
  const file = control.value as File;
  const fileReader = new FileReader();
  return new Observable((observer: Observer<{ [key: string]: any } | null>) => {
    fileReader.addEventListener("loadend", () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4); // the part with MIME type
      let header = "";
      let isValid;
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      switch (header) {
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
        case "89504e47": {
          isValid = true;
          break;
        }
        default: {
          isValid = false;
        }
      }
      if (isValid) {
        observer.next(null);
      } else {
        observer.next({invalidMimeType: true});
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });
};
