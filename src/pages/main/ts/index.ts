import "../styles/main.scss";
import { ValidatorMediator } from "./mediator/validator-mediator";
import { DisplayController } from "./display/display-controller";
import { MatrixMediator } from "./mediator/matrix-mediator";
import { Animator } from "./display/animator";
import { Introduction } from "./display/introduction";
import { Examples } from "./display/examples";
import { ShareableLink } from "./display/shareable-link";

Introduction.initialize();
DisplayController.toggleTheme();
DisplayController.addEventListeners();
DisplayController.addInteractivity();
Animator.addSpeedBarListener();
ValidatorMediator.addEventListeners();
MatrixMediator.enterAndAnimate();
DisplayController.setScene();
Examples.initialize();
ShareableLink.initialize();
