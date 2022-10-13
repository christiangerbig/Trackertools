const handleMainPart = () => {
  const loadSound = () => {
    const handleLoadSound = () => {
      catMeowSound.removeEventListener("load", handleSound);
    };

    const catMeowSound = new Audio("./sounds/cute-cat-meow.mp3");
    catMeowSound.addEventListener("load", handleLoadSound);
    return catMeowSound;
  };

  const addPlaySoundHandler = (soundElement) => {
    const handlePlaySound = () => {
      soundElement.play();
    };

    const gitHubLinkElement = document.querySelector("#github-link");
    gitHubLinkElement.addEventListener("click", handlePlaySound); // Desktop
    gitHubLinkElement.addEventListener("touchstart", handlePlaySound); // Tablet & Mobile phone
  };

  const catMeowSound = loadSound();
  addPlaySoundHandler(catMeowSound);
};

const addMainPartHandler = (handler) => {
  document.addEventListener("DOMContentLoaded", handler, false);
};

addMainPartHandler(handleMainPart);
