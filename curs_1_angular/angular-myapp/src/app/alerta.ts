import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Alerta {
  public showAlert(message: string): void {
    alert(message);
  }
}
