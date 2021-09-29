// Handler for main part
const handleMainPart = () => {
  // Load cat meow sound
  const loadCatMeowSound = () => {
    // Handler for load cat meow sound
    const handleLoadCatMeowSound = () =>
      catMeowSound.removeEventListener("load", handleLoadCatMeowSound);

    // Add handler for load cat meow sound
    const catMeowSound = new Audio("./sounds/cute-cat-meow.mp3");
    catMeowSound.addEventListener("load", handleLoadCatMeowSound);
    return catMeowSound;
  };
  const catMeowSound = loadCatMeowSound();

  // Handler for playing cat meow sound
  const handlePlayCatMeowSound = () => catMeowSound.play();

  // Add handler for playing cat meow sound
  const gitHubLinkElement = document.querySelector("#gitHubLink");
  gitHubLinkElement.addEventListener("click", handlePlayCatMeowSound);
  // Add handler for playing cat meow sound for mobile phone
  gitHubLinkElement.addEventListener("touchstart", handlePlayCatMeowSound);
};
// Add handler for main part
document.addEventListener("DOMContentLoaded", handleMainPart, false);
