const handleMainPart = () => {
  const loadCatMeowSound = () => {
    const handleLoadCatMeowSound = () => {
      catMeowSound.removeEventListener("load", handleLoadCatMeowSound);
    };

    const catMeowSound = new Audio("./sounds/cute-cat-meow.mp3");
    catMeowSound.addEventListener("load", handleLoadCatMeowSound);
    return catMeowSound;
  };

  const addPlayCatMeowSoundHandler = (catMeowSound) => {
    const handlePlayCatMeowSound = () => {
      catMeowSound.play();
    };

    const gitHubLinkElement = document.querySelector("#gitHubLink");
    gitHubLinkElement.addEventListener("click", handlePlayCatMeowSound); // Desktop
    gitHubLinkElement.addEventListener("touchstart", handlePlayCatMeowSound); // Tablet & Mobile phone
  };

  const catMeowSound = loadCatMeowSound();
  addPlayCatMeowSoundHandler(catMeowSound);
};

const addMainPartHandler = (handleMainPart) => {
  document.addEventListener("DOMContentLoaded", handleMainPart, false);
};

addMainPartHandler(handleMainPart);
