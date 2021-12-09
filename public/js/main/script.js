const handleMainPart = () => {
  const loadCatMeowSound = () => {
    const handleLoadCatMeowSound = () => {
      catMeowSound.removeEventListener("load", handleLoadCatMeowSound);
    };

    const catMeowSound = new Audio("./sounds/cute-cat-meow.mp3");
    catMeowSound.addEventListener("load", handleLoadCatMeowSound);
    return catMeowSound;
  };

  const addPlayCatMeowSoundEventListener = (catMeowSound) => {
    const handlePlayCatMeowSound = () => {
      catMeowSound.play();
    };

    const gitHubLinkElement = document.querySelector("#gitHubLink");
    gitHubLinkElement.addEventListener("click", handlePlayCatMeowSound); // Desktop
    gitHubLinkElement.addEventListener("touchstart", handlePlayCatMeowSound); // Tablet & Mobile phone
  };

  const catMeowSound = loadCatMeowSound();
  addPlayCatMeowSoundEventListener(catMeowSound);
};

const addHandleMainPart = (handleMainPart) => {
  document.addEventListener("DOMContentLoaded", handleMainPart, false);
};

addHandleMainPart(handleMainPart);
