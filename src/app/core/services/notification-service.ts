import { LocalNotifications } from "@capacitor/local-notifications";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: 'root'})
export class NotificationService{
    private notificationsSubject = new BehaviorSubject<boolean>(false);
    notificationsEnabled$ = this.notificationsSubject.asObservable();
    private tips: string[] = [
        "Diversify your stocks to reduce risk.",
        "Long-term investing generally outperforms short-term trading.",
        "Always check company fundamentals before buying.",
        "Track your portfolio regularly to make informed decisions.",
      ];
    
      private intervalId: any;
    
      constructor() {}
    
      async requestPermission() {
        const perm = await LocalNotifications.requestPermissions();
        return perm.display === 'granted';
      }
    
      async startAlerts() {
        const granted = await this.requestPermission();
        if (granted) {
          this.notificationsSubject.next(true);
            this.showRandomTip();
            this.intervalId = setInterval(() => {
              this.showRandomTip();
            }, 5000 );
        } else {
          console.warn('Notifications permission not granted');
        }
      }
    
      stopAlerts() {
        clearInterval(this.intervalId);
      }
    
      private async showRandomTip() {
        const tip = this.tips[Math.floor(Math.random() * this.tips.length)];
    
        await LocalNotifications.schedule({
          notifications: [
            {
              title: 'Educational Tip',
              body: tip,
              id: new Date().getTime(),
              schedule: { at: new Date(new Date().getTime() + 1000) }
            },
          ],
        });

        // if ("Notification" in window) {
        //     if (Notification.permission === "granted") {
        //       new Notification("Educational Tip", { body: tip });
        //       console.log("Browser notification shown:", tip);
        //     } else if (Notification.permission !== "denied") {
        //       Notification.requestPermission().then((permission) => {
        //         if (permission === "granted") {
        //           new Notification("Educational Tip", { body: tip });
        //           console.log("Browser notification shown:", tip);
        //         }
        //       });
        //     }
        // }
      }
      
}