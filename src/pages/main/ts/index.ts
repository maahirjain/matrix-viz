import "../styles/main.scss";
import { ValidatorMediator } from "./mediator/validator-mediator";
import { DisplayController } from "./display/display-controller";

DisplayController.toggleTheme();
DisplayController.addEventListeners();
ValidatorMediator.addEventListeners();
