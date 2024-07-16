import "../styles/main.scss";
import { ValidatorMediator } from "./mediator/validator-mediator";
import { DisplayController } from "./display/display-controller";
import { MatrixMediator } from "./mediator/matrix-mediator";

DisplayController.toggleTheme();
DisplayController.addEventListeners();
DisplayController.addInteractivity();
ValidatorMediator.addEventListeners();
MatrixMediator.enterAndAnimate();
