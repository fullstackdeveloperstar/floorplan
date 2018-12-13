import {Injectable} from "@angular/core";
import { Wall } from "./wall";
import { Room } from "./room";

@Injectable()
export class Global {
    public rooms: Room[] = [];
    public selectedRoom: Room;
}