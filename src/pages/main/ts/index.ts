import "../styles/main.scss";
import { ValidatorMediator } from "./mediator/validator-mediator";
import { DisplayController } from "./display/display-controller";

ValidatorMediator.addEventListeners();
DisplayController.toggleTheme();
DisplayController.addTwoDBtnListener();
