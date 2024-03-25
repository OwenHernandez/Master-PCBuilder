export class Globals {
    static IP_CASA_OWEN: string = "192.168.1.93:8080";
    static IP_CLASE_OWEN: string = "172.26.15.0:8080";
    static IP_CASA_JULIO: string = "192.168.1.100:8080";
    static IP_PORTATIL_JULIO: string = "192.168.0.138:8080";
    static IP_PORTATIL_TRABAJO: string = "192.168.1.61:8080";
    static IP_DIGITAL_OCEAN: string = "146.190.12.221:8080";
    static IP_HTTP: string = "http://" + this.IP_DIGITAL_OCEAN;
    static IP_WEBSOCKET: string = "ws://" + this.IP_DIGITAL_OCEAN;
    static NOT_ACTIVE: string = "not active";
    static INC_PASS_USR: string = "User/Pass incorrect";
    static IMG_NOT_FOUND: string = "The file does not exist";
}