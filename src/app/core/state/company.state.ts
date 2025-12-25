import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class CompanyState
{
    isProfileCompleted=signal<boolean>(false);
}
