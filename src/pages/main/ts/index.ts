import "../styles/main.scss";
import { ValidatorMediator } from "./mediator/validator-mediator";
import { DisplayController } from "./display/display-controller";
import { MatrixMediator } from "./mediator/matrix-mediator";

if (window.localStorage) {
  if (!localStorage.getItem("firstLoad")) {
    localStorage["firstLoad"] = true;
    window.location.reload();
  } else localStorage.removeItem("firstLoad");
}

DisplayController.toggleTheme();
DisplayController.addEventListeners();
DisplayController.addInteractivity();
ValidatorMediator.addEventListeners();
MatrixMediator.enterAndAnimate();
